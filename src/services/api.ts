/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SAMPLE_ITINERARIES, VERIFIED_HOTELS, VERIFIED_PLACES, VERIFIED_RESTAURANTS } from '../data/destinations';
import { AnsweringMethod, ConversationContext, Hotel, Itinerary, Place, RecommendationSet, Restaurant } from '../types';

export interface BackendChatPayload {
  message: string;
  conversation_id?: string;
  history?: Array<{ role: string; content: string }>;
  destination?: string;
  destination_context?: string;
  active_place_id?: string;
  active_place_name?: string;
  active_restaurant_id?: string;
  active_restaurant_name?: string;
  last_category?: string;
  excluded_place_ids?: string[];
  excluded_place_names?: string[];
  excluded_restaurant_ids?: string[];
  excluded_restaurant_names?: string[];
  excluded_hotel_ids?: string[];
  already_shown_place_ids?: string[];
  language?: string;
  answering_method?: AnsweringMethod;
  user_preferences?: {
    accessibilityRequired?: boolean;
    budget?: string;
    durationDays?: number;
    language?: string;
    answering_method?: AnsweringMethod;
  };
}

export interface BackendChatResponse {
  [key: string]: unknown;
  reply?: unknown;
  message?: unknown;
  response?: unknown;
  recommendations?: unknown;
  source?: string;
  places?: unknown;
  restaurants?: unknown;
  hotels?: unknown;
  itinerary?: unknown;
  suggested_actions?: unknown;
  active_subject?: unknown;
  last_category?: string;
  conversation_id?: string;
  language?: string;
}

type BackendRecommendation = Record<string, unknown>;

type RecommendationKind = 'place' | 'restaurant' | 'hotel';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const backendText = (value: unknown): string =>
  typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';

const unavailableBackendValue = /^(?:unknown|unavailable|not available|not recorded|not verified|check locally|verify before visiting|information unavailable|hotel type:\s*hotel[.!]?|n\/a|none|null|-+|అందుబాటులో లేదు|లభ్యం కాదు|उपलब्ध नहीं|जानकारी उपलब्ध नहीं)$/i;

const availableBackendText = (value: unknown): string => {
  const text = backendText(value);
  return text && !unavailableBackendValue.test(text) ? text : '';
};

const officialHttpUrl = (value: unknown): string | undefined => {
  const text = availableBackendText(value);
  if (!text) return undefined;
  try {
    const url = new URL(text);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

const backendNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined;
  if (typeof value === 'string' && !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const backendStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const normalizeRecommendationField = (value: string): string =>
  value.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');

function recommendationKind(
  recommendation: BackendRecommendation,
  fallback?: RecommendationKind
): RecommendationKind {
  if (fallback) return fallback;

  const sourceType = backendText(recommendation.source_type).toLowerCase();
  if (sourceType === 'restaurant' || sourceType === 'hotel' || sourceType === 'place') {
    return sourceType;
  }
  if (recommendation.restaurant_id != null || backendText(recommendation.cuisine)) {
    return 'restaurant';
  }
  if (
    recommendation.hotel_id != null
    || recommendation.price_per_night != null
    || /hotel|accommodation|stay/i.test(backendText(recommendation.category))
  ) {
    return 'hotel';
  }
  return 'place';
}

function officialSourceType(
  value: unknown,
  kind: 'hotel',
  hasUrl: boolean
): Hotel['officialSourceType'];
function officialSourceType(
  value: unknown,
  kind: 'place' | 'restaurant',
  hasUrl: boolean
): Place['officialSourceType'];
function officialSourceType(
  value: unknown,
  kind: RecommendationKind,
  hasUrl: boolean
): Place['officialSourceType'] | Hotel['officialSourceType'] | undefined {
  const sourceType = backendText(value).toLowerCase();
  const placeTypes: Place['officialSourceType'][] = [
    'official_website', 'government', 'tourism', 'heritage', 'temple', 'booking', 'unavailable'
  ];
  const hotelTypes: Hotel['officialSourceType'][] = [
    'booking', 'official_website', 'tourism', 'unavailable'
  ];

  if (kind === 'hotel') {
    return hotelTypes.find((type) => type === sourceType) || (hasUrl ? 'official_website' : undefined);
  }
  return placeTypes.find((type) => type === sourceType) || (hasUrl ? 'tourism' : undefined);
}

function mapBackendRecommendations(data: BackendChatResponse): RecommendationSet {
  const mapped: RecommendationSet = { places: [], restaurants: [], hotels: [] };
  const catalogPlaces = Object.values(VERIFIED_PLACES).flat();
  const catalogRestaurants = Object.values(VERIFIED_RESTAURANTS).flat();
  const catalogHotels = Object.values(VERIFIED_HOTELS).flat();
  const seenIds: Record<RecommendationKind, Set<string>> = {
    place: new Set(),
    restaurant: new Set(),
    hotel: new Set(),
  };
  const seenNames: Record<RecommendationKind, Set<string>> = {
    place: new Set(),
    restaurant: new Set(),
    hotel: new Set(),
  };

  const addRecommendation = (
    value: unknown,
    index: number,
    fallbackKind?: RecommendationKind
  ) => {
    if (!isRecord(value)) return;
    const recommendation = value;
    const kind = recommendationKind(recommendation, fallbackKind);
    const name = backendText(recommendation.name ?? recommendation.title);
    if (!name) return;

    const rawId = recommendation.place_id
      ?? recommendation.restaurant_id
      ?? recommendation.hotel_id
      ?? recommendation.id;
    const id = backendText(rawId) || `${kind}-${index}`;
    const responseCity = availableBackendText(recommendation.city);
    const catalogMatch = <T extends { name: string; city: string }>(records: T[]): T | undefined =>
      records.find((record) =>
        normalizeRecommendationField(record.name) === normalizeRecommendationField(name)
        && (!responseCity || normalizeRecommendationField(record.city) === normalizeRecommendationField(responseCity))
      );
    const exactCatalogPlace = kind === 'place' ? catalogMatch(catalogPlaces) : undefined;
    const aliasCatalogPlace = kind === 'place' && !exactCatalogPlace
      ? findPlaceDynamically(name, catalogPlaces)
      : undefined;
    const catalogPlace = exactCatalogPlace || (aliasCatalogPlace && (
      !responseCity || normalizeRecommendationField(aliasCatalogPlace.city) === normalizeRecommendationField(responseCity)
    ) ? aliasCatalogPlace : undefined);
    const catalogRestaurant = kind === 'restaurant'
      ? catalogMatch(catalogRestaurants)
      : undefined;
    const catalogHotel = kind === 'hotel'
      ? catalogMatch(catalogHotels)
      : undefined;
    const location = availableBackendText(recommendation.location)
      || catalogPlace?.location || catalogRestaurant?.location || catalogHotel?.location || '';
    const city = responseCity || catalogPlace?.city || catalogRestaurant?.city || catalogHotel?.city || location;
    const description = availableBackendText(recommendation.short_description ?? recommendation.description)
      || catalogPlace?.description || catalogRestaurant?.description || catalogHotel?.description || '';
    const rating = backendNumber(recommendation.rating)
      ?? catalogPlace?.rating ?? catalogRestaurant?.rating ?? catalogHotel?.rating;
    const officialTypeValue = recommendation.official_source_type ?? recommendation.officialSourceType;
    const officialAudit = isRecord(recommendation.official_audit) ? recommendation.official_audit : undefined;
    const backendOfficialUrl = backendText(officialTypeValue).toLowerCase() === 'unavailable' || officialAudit?.verified === false
      ? undefined
      : officialHttpUrl(recommendation.official_info_url ?? recommendation.official_url);
    const catalogRecord = catalogPlace || catalogRestaurant || catalogHotel;
    const officialUrl = catalogRecord
      ? (catalogRecord.officialSourceType !== 'unavailable'
        && (!('officialAudit' in catalogRecord) || catalogRecord.officialAudit?.verified !== false)
        ? catalogRecord.officialUrl
        : undefined)
      : backendOfficialUrl;
    const officialSourceLabel = catalogRecord?.officialSourceLabel
      || availableBackendText(recommendation.official_source_label ?? recommendation.officialSourceLabel);
    const officialAuthority = ('officialAuthority' in (catalogRecord || {}) ? catalogRecord?.officialAuthority : undefined)
      || availableBackendText(recommendation.official_authority ?? recommendation.officialAuthority);
    const duplicateName = [
      normalizeRecommendationField(name),
      normalizeRecommendationField(location),
      normalizeRecommendationField(city),
    ].join(':');

    if (seenIds[kind].has(id) || seenNames[kind].has(duplicateName)) return;
    seenIds[kind].add(id);
    seenNames[kind].add(duplicateName);

    if (kind === 'restaurant') {
      // Filter out irrelevant non-dining retail/service businesses (petrol bunks, stationery, hardware, etc.)
      const checkText = `${name} ${location} ${backendText(recommendation.cuisine)}`.toLowerCase();
      if (
        /\b(petrol\s*bunk|fuel|oil\s*bunk|stationery|book\s*depot|xerox|hardware|medical|pharmacy|opticals|tailor|timber|plywood|traders|agency|agencies|auto\s*consultant|general\s*store|kirana)\b|bunk\s*road/i.test(
          checkText
        )
      ) {
        return;
      }

      const backendImageUrl = recommendation.image_license_verified === true
        ? backendText(recommendation.image_url ?? recommendation.imageUrl)
        : '';
      const imageUrl = backendImageUrl || (catalogRestaurant?.hasVerifiedPhoto ? catalogRestaurant.imageUrl : '');
      mapped.restaurants?.push({
        id,
        name,
        cuisine: availableBackendText(recommendation.cuisine) || catalogRestaurant?.cuisine || '',
        description,
        location,
        city,
        priceRange: catalogRestaurant?.priceRange || '',
        openingHours: catalogRestaurant?.openingHours || undefined,
        rating,
        imageUrl,
        hasVerifiedPhoto: Boolean(imageUrl && (backendImageUrl || catalogRestaurant?.hasVerifiedPhoto)),
        imageAttribution: backendImageUrl
          ? availableBackendText(recommendation.image_attribution ?? recommendation.imageAttribution) || undefined
          : catalogRestaurant?.imageAttribution,
        officialUrl,
        officialSourceLabel: officialSourceLabel || undefined,
        officialSourceType: catalogRestaurant
          ? catalogRestaurant.officialSourceType
          : officialSourceType(
          officialTypeValue,
          kind,
          Boolean(officialUrl)
        ),
        officialAuthority: officialAuthority || undefined,
        specialties: backendStringArray(recommendation.specialties),
        popularDishes: backendStringArray(recommendation.popular_dishes ?? recommendation.popularDishes),
        dietaryOptions: backendStringArray(recommendation.dietary_options ?? recommendation.dietaryOptions),
      });
      return true;
    }

    if (kind === 'hotel') {
      const imageUrl = recommendation.image_license_verified === true
        ? backendText(recommendation.image_url ?? recommendation.imageUrl)
        : catalogHotel?.imageUrl || '';
      mapped.hotels?.push({
        id,
        name,
        category: backendText(recommendation.category) || 'Hotel & Accommodation',
        description,
        location,
        city,
        pricePerNight: catalogHotel?.pricePerNight || '',
        rating,
        imageUrl,
        amenities: backendStringArray(recommendation.amenities).length
          ? backendStringArray(recommendation.amenities)
          : catalogHotel?.amenities || [],
        officialUrl,
        officialSourceLabel: officialSourceLabel || undefined,
        officialSourceType: catalogHotel
          ? catalogHotel.officialSourceType
          : officialSourceType(
          officialTypeValue,
          kind,
          Boolean(officialUrl)
        ),
        officialAuthority: officialAuthority || undefined,
        accessibility: catalogHotel?.accessibility,
      });
      return true;
    }

    const rawCategory = backendText(recommendation.category).toLowerCase();
    const category: Place['category'] =
      catalogPlace?.category || (/temple|religious/.test(rawCategory) ? 'temple'
        : /beach/.test(rawCategory) ? 'beach'
          : /viewpoint|view point|hilltop|scenic/.test(rawCategory) ? 'viewpoint'
            : /nature|park|garden|lake|waterfall/.test(rawCategory) ? 'nature'
              : /adventure|sport/.test(rawCategory) ? 'adventure'
                : /historic|heritage|fort|monument/.test(rawCategory) ? 'historic'
                  : 'cultural');

    const place: Place = {
      id,
      name,
      category,
      description,
      location,
      city,
      budget: catalogPlace?.budget,
      openingHours: catalogPlace?.openingHours,
      rating,
      bestTimeToVisit:
        backendText(recommendation.best_time_to_visit ?? recommendation.bestTimeToVisit)
        || undefined,
      officialUrl,
      officialSourceType: catalogPlace
        ? catalogPlace.officialSourceType
        : officialSourceType(officialTypeValue, kind, Boolean(officialUrl)),
      officialSourceLabel: officialSourceLabel || (officialUrl ? 'Official information' : undefined),
      officialAuthority: officialAuthority || undefined,
      officialAudit: catalogPlace?.officialAudit,
      accessibility: catalogPlace?.accessibility,
      highlights: catalogPlace?.highlights,
      imageUrl: (recommendation.image_license_verified === true
        ? backendText(recommendation.image_url ?? recommendation.imageUrl)
        : '') || (catalogPlace?.hasVerifiedPhoto ? catalogPlace.imageUrl : undefined),
      imageAttribution: (recommendation.image_license_verified === true
        ? availableBackendText(recommendation.image_attribution ?? recommendation.imageAttribution)
        : undefined) || (catalogPlace?.hasVerifiedPhoto ? catalogPlace.imageAttribution : undefined),
      imageSourceUrl: catalogPlace?.hasVerifiedPhoto ? catalogPlace.imageSourceUrl : undefined,
      hasVerifiedPhoto: recommendation.image_license_verified === true || Boolean(catalogPlace?.hasVerifiedPhoto),
    };

    const latitude = backendNumber(recommendation.latitude);
    const longitude = backendNumber(recommendation.longitude);
    if (latitude !== undefined && longitude !== undefined) {
      place.coordinates = { lat: latitude, lng: longitude };
    }

    mapped.places?.push(place);
    return true;
  };

  let index = 0;
  if (Array.isArray(data.recommendations)) {
    data.recommendations.forEach((recommendation) => {
      addRecommendation(recommendation, index++);
    });
  }

  const categoryArrays: Array<[RecommendationKind, unknown]> = [
    ['place', data.places],
    ['restaurant', data.restaurants],
    ['hotel', data.hotels],
  ];
  categoryArrays.forEach(([kind, records]) => {
    if (!Array.isArray(records)) return;
    records.forEach((recommendation) => {
      addRecommendation(recommendation, index++, kind);
    });
  });

  return mapped;
}

// Configurable API base URL, defaults to environment variable or localStorage setting
export function getApiBaseUrl(): string {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('tripmate_custom_api_url');
    if (customUrl) return customUrl.trim().replace(/\/+$/, '');
  }
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/+$/, '');
  return 'http://127.0.0.1:5000';
}

export function setCustomApiUrl(url: string): void {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem('tripmate_custom_api_url', url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem('tripmate_custom_api_url');
    }
  }
}

/**
 * Health check to verify if the Python Flask backend is reachable
 */
export async function checkBackendConnection(): Promise<{ isConnected: boolean; message: string; url: string }> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return {
      isConnected: false,
      message: 'VITE_API_BASE_URL is not configured. Connect the Flask backend to use live travel recommendations.',
      url: 'Not configured'
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return {
      isConnected: false,
      message: timedOut
        ? 'The Flask health check timed out. Check that the server is running and reachable from this browser.'
        : 'Could not reach the Flask health endpoint. Check the URL, server status, and browser CORS settings.',
      url: baseUrl
    };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    return {
      isConnected: false,
      message: `The Flask health endpoint returned HTTP ${response.status}. Check the backend URL and server logs.`,
      url: baseUrl
    };
  }

  let health: unknown;
  try {
    health = await response.json();
  } catch {
    return {
      isConnected: false,
      message: 'The Flask health endpoint returned invalid JSON.',
      url: baseUrl
    };
  }

  if (!isRecord(health) || health.status !== 'ok') {
    return {
      isConnected: false,
      message: 'The Flask health endpoint returned an unexpected response.',
      url: baseUrl
    };
  }

  return { isConnected: true, message: 'Flask backend connected successfully.', url: baseUrl };
}

function responseErrorMessage(response: Response, body: string): string {
  let details = '';
  if (body) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (isRecord(parsed)) details = backendText(parsed.error);
    } catch {
      details = '';
    }
  }
  const suffix = details ? `: ${details.slice(0, 250)}` : '';
  return `Flask /api/chat returned HTTP ${response.status}${suffix}`;
}

function mapActiveSubject(value: unknown): {
  type?: 'place' | 'restaurant';
  id?: string;
  name?: string;
  placeId?: string;
  placeName?: string;
  restaurantId?: string;
  restaurantName?: string;
} | undefined {
  if (!isRecord(value)) return undefined;
  const type = value.type === 'place' || value.type === 'restaurant' ? value.type : undefined;
  const id = backendText(value.id) || undefined;
  const name = backendText(value.name) || undefined;
  return {
    type,
    id,
    name,
    ...(type === 'place' ? { placeId: id, placeName: name } : {}),
    ...(type === 'restaurant' ? { restaurantId: id, restaurantName: name } : {}),
  };
}

function isItinerary(value: unknown): value is Itinerary {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.destination === 'string'
    && typeof value.title === 'string'
    && typeof value.summary === 'string'
    && typeof value.durationDays === 'number'
    && Array.isArray(value.days)
    && value.days.length > 0
    && value.days.every((day) =>
      isRecord(day)
      && typeof day.dayNumber === 'number'
      && typeof day.title === 'string'
      && Array.isArray(day.slots)
      && day.slots.every((slot) =>
        isRecord(slot)
        && typeof slot.time === 'string'
        && typeof slot.title === 'string'
        && typeof slot.description === 'string'
        && ['sightseeing', 'meal', 'relaxation', 'travel'].includes(String(slot.activityType))
      )
    );
}

/**
 * Normalization helper for names
 */
export const normalizeName = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Sends a message to the backend Flask API or falls back to local verified intent engine.
 * Maintains independent tracking for places and restaurants without cross-category pollution.
 */
export async function sendChatMessage(
  payload: BackendChatPayload,
  alreadyShownPlaceIds: Set<string> = new Set(),
  alreadyShownPlaceNames: Set<string> = new Set(),
  alreadyShownRestaurantIds: Set<string> = new Set(),
  alreadyShownRestaurantNames: Set<string> = new Set(),
  conversationContext?: ConversationContext
): Promise<{
  content: string;
  recommendations?: RecommendationSet;
  itinerary?: Itinerary;
  suggestedActions: string[];
  activeSubject?: {
    type?: 'place' | 'restaurant';
    id?: string;
    name?: string;
    placeId?: string;
    placeName?: string;
    restaurantId?: string;
    restaurantName?: string;
  };
  lastCategory?: string;
  isBackendSource: boolean;
  exhausted?: boolean;
  language?: string;
}> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.');
  }

  const excludedPlaceIds = Array.from(
    new Set([...Array.from(alreadyShownPlaceIds), ...(payload.excluded_place_ids || [])])
  );
  const excludedPlaceNames = Array.from(
    new Set([...Array.from(alreadyShownPlaceNames), ...(payload.excluded_place_names || [])])
  );
  const excludedRestaurantIds = Array.from(
    new Set([...Array.from(alreadyShownRestaurantIds), ...(payload.excluded_restaurant_ids || [])])
  );
  const excludedRestaurantNames = Array.from(
    new Set([...Array.from(alreadyShownRestaurantNames), ...(payload.excluded_restaurant_names || [])])
  );

  const fullPayload: BackendChatPayload = {
    ...payload,
    excluded_place_ids: excludedPlaceIds,
    already_shown_place_ids: excludedPlaceIds,
    excluded_place_names: excludedPlaceNames,
    excluded_restaurant_ids: excludedRestaurantIds,
    excluded_restaurant_names: excludedRestaurantNames,
    active_place_id: conversationContext?.activePlaceId,
    active_place_name: conversationContext?.activePlaceName,
    active_restaurant_id: conversationContext?.activeRestaurantId,
    active_restaurant_name: conversationContext?.activeRestaurantName,
    last_category: conversationContext?.lastCategory,
  };

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fullPayload)
    });
  } catch {
    throw new Error(
      'Could not reach Flask /api/chat. Check that the server is running, the base URL is correct, and CORS allows this frontend origin.'
    );
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(responseErrorMessage(response, body));
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new Error('Flask /api/chat returned invalid JSON.');
  }

  if (!isRecord(responseBody)) {
    throw new Error('Flask /api/chat returned an unexpected response shape.');
  }

  const data = responseBody as BackendChatResponse;
  const responseText = backendText(data.reply ?? data.response ?? data.message);
  if (!responseText) {
    throw new Error('Flask /api/chat response is missing a reply string.');
  }
  const responseArrays = [data.recommendations, data.places, data.restaurants, data.hotels];
  if (responseArrays.some((records) => records != null && !Array.isArray(records))) {
    throw new Error('Flask /api/chat returned recommendations in an unsupported format.');
  }
  let itinerary: Itinerary | undefined;
  if (data.itinerary != null) {
    if (!isItinerary(data.itinerary)) {
      throw new Error('Flask /api/chat returned an itinerary in an unsupported format.');
    }
    itinerary = data.itinerary;
  }

  const responseLanguage = typeof data.language === 'string' ? data.language : fullPayload.language;
  const localizedDefaults: Record<string, string[]> = {
    te: ['మరిన్ని ప్రదేశాలు చూపించండి', 'సమీపంలోని రెస్టారెంట్లు సూచించండి', 'రెండు రోజుల ప్రయాణ ప్రణాళిక రూపొందించండి'],
    hi: ['और जगहें दिखाएँ', 'आस-पास के रेस्तरां सुझाएँ', 'दो दिन की यात्रा योजना बनाएँ'],
    en: ['Show me more places', 'Find nearby dining', 'Generate a day-by-day itinerary'],
  };
  const mappedRecs = mapBackendRecommendations(data);

  // Requirement: When the user simply greets ("Hi", "Hello"), do NOT show place recommendations.
  const isSimpleGreeting = /^\s*(hi|hello|hey|namaste|namaskaram|greetings)\s*([!.,?]\s*)?$/i.test(fullPayload.message.trim());
  if (isSimpleGreeting) {
    mappedRecs.places = [];
  }

  const catalogPlaces = Object.values(VERIFIED_PLACES).flat();

  // Show place cards only when the user clearly asks to discover or find places.
  // Questions asking for explanations/history remain conversational and card-free.
  const isTheoryQuestion =
    /\b(tell me about|explain|describe|history of|why is|who was|meaning of)\b/i.test(fullPayload.message);

  const isExplicitPlaceRequest =
    !isSimpleGreeting &&
    !isTheoryQuestion &&
    /\b(show|suggest|recommend|find|list|discover|explore)\b|\b(places?|attractions?|temples?|caves?|forts?|museums?|parks?|islands?)\s+(to\s+visit|near|around|in)\b|\b(top|best)\s+(places?|attractions?|temples?|forts?|museums?)\b|\b(more|other)\s+(places?|recommendations?)\b/i.test(fullPayload.message);

  const mentionedPlaces = isExplicitPlaceRequest
    ? findMentionedCatalogPlaces(fullPayload.message, catalogPlaces)
    : [];

  // Do not display backend place records for ordinary theory questions.
  // Hide place cards for theory questions and simple greetings only.
  if (isTheoryQuestion || isSimpleGreeting) {
   mappedRecs.places = [];
  }

  if (mentionedPlaces.length > 0) {
    if (!mappedRecs.places) mappedRecs.places = [];
    for (const mp of mentionedPlaces) {
      if (!mappedRecs.places.some(p => normalizeRecommendationField(p.name) === normalizeRecommendationField(mp.name))) {
        mappedRecs.places.push(mp);
      }
    }
  }

  let finalContent = responseText;
  if (
    mentionedPlaces.length > 0 &&
    (responseText.includes("couldn't verify that earlier option") ||
      responseText.includes("Try asking for recommendations again") ||
      (mappedRecs.places && mappedRecs.places.length === mentionedPlaces.length))
  ) {
    const names = mentionedPlaces.map(p => p.name).join(', ');
    finalContent = responseLanguage === 'te'
      ? `ఇక్కడ మీరు అడిగిన ${names} వివరాలు మరియు ధృవీకరించిన ఛాయాచిత్రాలు ఉన్నాయి:`
      : responseLanguage === 'hi'
      ? `यहाँ आपके द्वारा पूछे गए ${names} के विवरण और सत्यापित तस्वीरें हैं:`
      : `Here are the verified photographs, locations, and visitor details for ${names}:`;
  }

  // Restaurant handling: deduplication, max 4-6 batching, comma-separated text dump cleanup, exhaustion handling
  const isRestaurantQuery = /\b(restaurant|restaurants|food|dining|eat|eatery|eateries|cuisine|bhojanam|biryani|mess|cafe|tiffin)\b/i.test(fullPayload.message);

  const rawActions = Array.isArray(data.suggested_actions) && data.suggested_actions.length > 0
    ? data.suggested_actions.filter((action): action is string => typeof action === 'string' && action.trim().length > 0)
    : localizedDefaults[responseLanguage || fullPayload.language || 'en'] || localizedDefaults.en;

  // Ensure each suggestion is a distinct, separate item (split any concatenated strings)
  const separateActions: string[] = [];
  for (const act of rawActions) {
    if (act.includes('?') && act.trim().split(/\?\s+/).length > 1) {
      for (const part of act.split(/\?\s+/)) {
        const cleaned = part.trim();
        if (cleaned) separateActions.push(cleaned.endsWith('?') ? cleaned : `${cleaned}?`);
      }
    } else if (act.includes(';') || act.includes(' | ')) {
      for (const part of act.split(/[;|]/)) {
        const cleaned = part.trim();
        if (cleaned) separateActions.push(cleaned);
      }
    } else {
      separateActions.push(act.trim());
    }
  }
  let suggestedActions = separateActions.filter(Boolean).slice(0, 4);

  if (mappedRecs.restaurants && mappedRecs.restaurants.length > 0) {
    const unshown = mappedRecs.restaurants.filter((r) => {
      const normName = normalizeRecommendationField(r.name);
      return !alreadyShownRestaurantIds.has(r.id) &&
             !alreadyShownRestaurantNames.has(normName) &&
             !excludedRestaurantIds.includes(r.id) &&
             !excludedRestaurantNames.includes(normName);
    });

    if (unshown.length === 0 && isRestaurantQuery) {
      finalContent = responseLanguage === 'te'
        ? "మీరు ఈ గమ్యస్థానానికి సంబంధించిన అన్ని ధృవీకరించిన రెస్టారెంట్లను అన్వేషించారు. నిర్దిష్ట వంటకాలు లేదా ప్రాంతీయ ప్రత్యేకతల కోసం అడగండి!"
        : responseLanguage === 'hi'
        ? "आपने इस गंतव्य के सभी सत्यापित रेस्तरां देख लिए हैं। विशिष्ट व्यंजनों या क्षेत्रीय विशेषताओं के बारे में पूछें!"
        : "You've explored all currently verified restaurants for this destination. Try asking for specific cuisines or regional specialities!";
      mappedRecs.restaurants = [];
      suggestedActions = [
        responseLanguage === 'te' ? 'ప్రముఖ ఆకర్షణలు చూపించండి' : responseLanguage === 'hi' ? 'प्रमुख आकर्षण दिखाएँ' : 'Show top attractions',
        responseLanguage === 'te' ? 'ప్రయాణ ప్రణాళిక రూపొందించండి' : responseLanguage === 'hi' ? 'यात्रा योजना बनाएँ' : 'Plan my itinerary',
        responseLanguage === 'te' ? 'స్థానిక వీధి ఆహార గైడ్' : responseLanguage === 'hi' ? 'स्थानीय स्ट्रीट फूड गाइड' : 'Local street food guide',
      ];
    } else {
      mappedRecs.restaurants = unshown.length > 0 ? unshown.slice(0, 6) : mappedRecs.restaurants.slice(0, 6);

      // Clean up comma-separated text dumps from backend
      if (
        /Here are \d+ restaurants to explore in/i.test(finalContent) ||
        /restaurants to explore in [^:]+:/i.test(finalContent) ||
        /Here are some restaurants/i.test(finalContent) ||
        (isRestaurantQuery && /: [A-Z][a-zA-Z\s&]+, [A-Z]/i.test(finalContent))
      ) {
        finalContent = responseLanguage === 'te'
          ? "ఇక్కడ విజయవాడలోని సిఫార్సు చేయబడిన భోజన శాలలు మరియు రెస్టారెంట్లు ఉన్నాయి:"
          : responseLanguage === 'hi'
          ? "यहाँ विजयवाड़ा में अनुशंसित भोजन विकल्प और रेस्तरां हैं:"
          : "Here are recommended dining options and restaurants in Vijayawada:";
      }

      const showMoreText = responseLanguage === 'te' ? 'మరిన్ని రెస్టారెంట్లు చూపించండి' : responseLanguage === 'hi' ? 'और रेस्तरां दिखाएँ' : 'Show more restaurants';
      if (!suggestedActions.includes(showMoreText)) {
        suggestedActions = [showMoreText, ...suggestedActions.filter(a => a !== showMoreText)];
      }
    }
  } else if (isRestaurantQuery && (fullPayload.message.toLowerCase().includes('more') || alreadyShownRestaurantIds.size > 0)) {
    // If user asked for more restaurants but none returned
    finalContent = responseLanguage === 'te'
      ? "మీరు ఈ గమ్యస్థానానికి సంబంధించిన అన్ని ధృవీకరించిన రెస్టారెంట్లను అన్వేషించారు. నిర్దిష్ట వంటకాలు లేదా ప్రాంతీయ ప్రత్యేకతల కోసం అడగండి!"
      : responseLanguage === 'hi'
      ? "आपने इस गंतव्य के सभी सत्यापित रेस्तरां देख लिए हैं। विशिष्ट व्यंजनों या क्षेत्रीय विशेषताओं के बारे में पूछें!"
      : "You've explored all currently verified restaurants for this destination. Try asking for specific cuisines or regional specialities!";
    suggestedActions = [
      responseLanguage === 'te' ? 'ప్రముఖ ఆకర్షణలు చూపించండి' : responseLanguage === 'hi' ? 'प्रमुख आकर्षण दिखाएँ' : 'Show top attractions',
      responseLanguage === 'te' ? 'ప్రయాణ ప్రణాళిక రూపొందించండి' : responseLanguage === 'hi' ? 'यात्रा योजना बनाएँ' : 'Plan my itinerary',
      responseLanguage === 'te' ? 'స్థానిక వీధి ఆహార గైడ్' : responseLanguage === 'hi' ? 'स्थानीय स्ट्रीट फूड गाइड' : 'Local street food guide',
    ];
  }

  return {
    content: finalContent,
    recommendations: mappedRecs,
    itinerary,
    suggestedActions,
    activeSubject: mapActiveSubject(data.active_subject),
    lastCategory: typeof data.last_category === 'string' ? data.last_category : undefined,
    isBackendSource: true,
    language: responseLanguage
  };
}

/**
 * Searches for all places from catalog mentioned in a user message.
 */
function findMentionedCatalogPlaces(message: string, catalogPlaces: Place[]): Place[] {
  const lower = message.toLowerCase();
  const matched: Place[] = [];
  const seenIds = new Set<string>();

  const checkAndAdd = (place: Place | null | undefined) => {
    if (place && !seenIds.has(place.id)) {
      seenIds.add(place.id);
      matched.push(place);
    }
  };

  if (lower.includes('prakasam') || lower.includes('barrage')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-prakasam-barrage'));
  }
  if (lower.includes('undavalli') || lower.includes('udavalli')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-undavalli-caves'));
  }
  if (lower.includes('bapu') || lower.includes('victoria jubilee') || (lower.includes('museum') && !lower.includes('coffee') && !lower.includes('submarine'))) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-bapu-museum'));
  }
  if (lower.includes('durga') || lower.includes('kanaka') || lower.includes('indrakeeladri')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-kanaka-durga'));
  }
  if (lower.includes('bhavani') || lower.includes('bhavani island')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-bhavani-island'));
  }
  if (lower.includes('kondapalli')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-kondapalli-fort'));
  }
  if (lower.includes('rajiv gandhi') || lower.includes('gandhi park')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-rajiv-gandhi-park'));
  }
  if (lower.includes('mogalarajapuram') || lower.includes('mogalrajapuram')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-mogalarajapuram-caves'));
  }
  if (lower.includes('gunadala') || lower.includes('mary matha')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-gunadala-shrine'));
  }
  if (lower.includes('hinkar') || (lower.includes('jain') && lower.includes('temple'))) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vja-hinkar-thirtha'));
  }
  if (lower.includes('borra')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'araku-borra-caves'));
  }
  if (lower.includes('kursura') || lower.includes('submarine')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vizag-submarine'));
  }
  if (lower.includes('kailasagiri')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'vizag-kailasagiri'));
  }
  if (lower.includes('gandikota') || lower.includes('canyon')) {
    checkAndAdd(catalogPlaces.find(p => p.id === 'gandikota-canyon'));
  }

  return matched;
}

/**
 * Searches for a place by name, substring, or alias dynamically across all cataloged places.
 */
function findPlaceDynamically(query: string, places: Place[]): Place | null {
  const q = query.toLowerCase();

  // 1. Direct ID match
  const byId = places.find(p => p.id === q);
  if (byId) return byId;

  // 2. Full name substring match
  for (const p of places) {
    const pName = p.name.toLowerCase();
    if (q.includes(pName) || pName.includes(q)) {
      return p;
    }
  }

  // 3. Dynamic token keywords match
  for (const p of places) {
    const tokens = p.name.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    const matchesAll = tokens.some(t => q.includes(t));
    if (matchesAll) {
      // Avoid matching generic words
      if (q.includes('temple') && !q.includes('durga') && !q.includes('kanaka') && !q.includes('jain') && !q.includes('hinkar')) {
        continue;
      }
      return p;
    }
  }

  // 4. Aliases
  if (q.includes('durga') || q.includes('kanaka') || q.includes('indrakeeladri')) {
    return places.find(p => p.id === 'vja-kanaka-durga') || null;
  }
  if (q.includes('undavalli') || q.includes('reclining vishnu')) {
    return places.find(p => p.id === 'vja-undavalli-caves') || null;
  }
  if (q.includes('prakasam') || q.includes('barrage')) {
    return places.find(p => p.id === 'vja-prakasam-barrage') || null;
  }
  if (q.includes('bhavani') || q.includes('bhavani island')) {
    return places.find(p => p.id === 'vja-bhavani-island') || null;
  }
  if (q.includes('bapu') || q.includes('victoria jubilee') || (q.includes('museum') && !q.includes('coffee') && !q.includes('submarine'))) {
    return places.find(p => p.id === 'vja-bapu-museum') || null;
  }
  if (q.includes('kondapalli')) {
    return places.find(p => p.id === 'vja-kondapalli-fort') || null;
  }
  if (q.includes('rajiv gandhi') || q.includes('gandhi park')) {
    return places.find(p => p.id === 'vja-rajiv-gandhi-park') || null;
  }
  if (q.includes('mogalarajapuram')) {
    return places.find(p => p.id === 'vja-mogalarajapuram-caves') || null;
  }
  if (q.includes('gunadala') || q.includes('mary matha')) {
    return places.find(p => p.id === 'vja-gunadala-shrine') || null;
  }
  if (q.includes('hinkar') || (q.includes('jain') && q.includes('temple'))) {
    return places.find(p => p.id === 'vja-hinkar-thirtha') || null;
  }
  if (q.includes('borra')) {
    return places.find(p => p.id === 'araku-borra-caves') || null;
  }
  if (q.includes('kursura') || q.includes('submarine')) {
    return places.find(p => p.id === 'vizag-submarine') || null;
  }
  if (q.includes('kailasagiri')) {
    return places.find(p => p.id === 'vizag-kailasagiri') || null;
  }
  if (q.includes('gandikota') || q.includes('canyon')) {
    return places.find(p => p.id === 'gandikota-canyon') || null;
  }

  return null;
}

/**
 * Searches for a restaurant by name or keyword dynamically.
 */
function findRestaurantDynamically(query: string, restaurants: Restaurant[]): Restaurant | null {
  const q = query.toLowerCase();

  for (const r of restaurants) {
    const rName = r.name.toLowerCase();
    if (q.includes(rName) || rName.includes(q)) {
      return r;
    }
  }

  if (q.includes('babai')) {
    return restaurants.find(r => r.id === 'rest-vja-babai-hotel') || null;
  }
  if (q.includes('minerva')) {
    return restaurants.find(r => r.id === 'rest-vja-minerva') || null;
  }
  if (q.includes('sweet magic')) {
    return restaurants.find(r => r.id === 'rest-vja-sweet-magic') || null;
  }
  if (q.includes('ramayya')) {
    return restaurants.find(r => r.id === 'rest-vja-ramayya') || null;
  }
  if (q.includes('cross avenue') || q.includes('gateway')) {
    return restaurants.find(r => r.id === 'rest-vja-cross-avenue') || null;
  }
  if (q.includes('barbeque') || q.includes('bbq')) {
    return restaurants.find(r => r.id === 'rest-vja-bbq-nation') || null;
  }
  if (q.includes('tfl') || q.includes('food lounge')) {
    return restaurants.find(r => r.id === 'rest-vja-tfl') || null;
  }
  if (q.includes('gad') || (q.includes('vivanta') && q.includes('dine'))) {
    return restaurants.find(r => r.id === 'rest-vja-gateway-gaddi') || null;
  }

  return null;
}

/**
 * High-fidelity preview conversational engine adhering to all strict separation rules:
 * 1. Independent category responses (places, restaurants, hotels never mixed unless itinerary requested).
 * 2. Dynamic place info generation for EVERY place.
 * 3. Follow-up pronoun and subject resolution using conversation context.
 * 4. Separate deduplication tracking for places vs restaurants vs hotels across multiple requests.
 * 5. Honest exhaustion reporting without fabricating records.
 */
function generatePreviewResponse(
  payload: BackendChatPayload,
  alreadyShownPlaceIds: Set<string>,
  alreadyShownPlaceNames: Set<string>,
  alreadyShownRestaurantIds: Set<string>,
  alreadyShownRestaurantNames: Set<string>,
  conversationContext?: ConversationContext
): {
  content: string;
  recommendations?: RecommendationSet;
  itinerary?: Itinerary;
  suggestedActions: string[];
  activeSubject?: {
    type?: 'place' | 'restaurant';
    id?: string;
    name?: string;
    placeId?: string;
    placeName?: string;
    restaurantId?: string;
    restaurantName?: string;
  };
  lastCategory?: string;
  isBackendSource: boolean;
  exhausted?: boolean;
} {
  const msg = payload.message.toLowerCase().trim();

  // Determine active destination from message or history context (Default: Vijayawada)
  let destination = 'vijayawada';
  const combinedText = `${payload.destination_context || ''} ${payload.history?.map(h => h.content).join(' ') || ''} ${msg}`.toLowerCase();

  if (combinedText.includes('araku')) {
    destination = 'araku';
  } else if (combinedText.includes('visakhapatnam') || combinedText.includes('vizag')) {
    destination = 'visakhapatnam';
  } else if (combinedText.includes('gandikota')) {
    destination = 'gandikota';
  } else if (combinedText.includes('kerala')) {
    destination = 'kerala';
  } else if (combinedText.includes('goa')) {
    destination = 'goa';
  }

  const destinationTitle = destination === 'vijayawada'
    ? 'Vijayawada'
    : destination.charAt(0).toUpperCase() + destination.slice(1);

  const allDestPlaces = VERIFIED_PLACES[destination] || VERIFIED_PLACES.vijayawada;
  const allDestRestaurants = VERIFIED_RESTAURANTS[destination] || VERIFIED_RESTAURANTS.vijayawada;
  const allDestHotels = VERIFIED_HOTELS[destination] || VERIFIED_HOTELS.vijayawada;

  // Normalized Sets for places
  const normShownPlaceNames = new Set<string>();
  alreadyShownPlaceNames.forEach(n => normShownPlaceNames.add(normalizeName(n)));
  allDestPlaces.forEach(p => {
    if (alreadyShownPlaceIds.has(p.id)) normShownPlaceNames.add(normalizeName(p.name));
  });

  // Normalized Sets for restaurants
  const normShownRestNames = new Set<string>();
  alreadyShownRestaurantNames.forEach(n => normShownRestNames.add(normalizeName(n)));
  allDestRestaurants.forEach(r => {
    if (alreadyShownRestaurantIds.has(r.id)) normShownRestNames.add(normalizeName(r.name));
  });

  // Candidate unshown items
  const unshownPlaces = allDestPlaces.filter(
    p => !alreadyShownPlaceIds.has(p.id) && !normShownPlaceNames.has(normalizeName(p.name))
  );
  const unshownRestaurants = allDestRestaurants.filter(
    r => !alreadyShownRestaurantIds.has(r.id) && !normShownRestNames.has(normalizeName(r.name))
  );

  // Active Subject resolution from conversation context
  const activePlaceId = conversationContext?.activePlaceId || payload.active_place_id;
  const activeRestaurantId = conversationContext?.activeRestaurantId || payload.active_restaurant_id;
  const lastActivePlace = activePlaceId ? allDestPlaces.find(p => p.id === activePlaceId) || Object.values(VERIFIED_PLACES).flat().find(p => p.id === activePlaceId) : null;
  const lastActiveRestaurant = activeRestaurantId ? allDestRestaurants.find(r => r.id === activeRestaurantId) : null;

  // Check if user is referencing a new place or pronoun ("it", "there", "this place", etc.)
  const explicitlyMentionedPlace = findPlaceDynamically(msg, Object.values(VERIFIED_PLACES).flat());
  const explicitlyMentionedRestaurant = findRestaurantDynamically(msg, allDestRestaurants);

  const hasPronounRef =
    /\b(it|there|this place|the place|that place|the temple|the caves|the fort|the island|the park|the museum|the barrage)\b/i.test(msg) ||
    /(why is it famous|what is its history|what is special about it|what can visitors see there|what can we see there|is it suitable|how much time|what facilities|where is it located|is there an official website|what activities are available there)/i.test(msg);

  // Target place for place inquiry
  const targetPlaceForInfo = explicitlyMentionedPlace || (hasPronounRef ? lastActivePlace : null);
  // Target restaurant for restaurant inquiry
  const targetRestaurantForInfo = explicitlyMentionedRestaurant || (hasPronounRef && !explicitlyMentionedPlace ? lastActiveRestaurant : null);

  // =========================================================================
  // 1. SPECIFIC PLACE INFORMATION (Works Dynamically for ANY Place)
  // =========================================================================
  const isPlaceInfoQuery = Boolean(
    targetPlaceForInfo &&
    (
      explicitlyMentionedPlace ||
      hasPronounRef ||
      msg.includes('tell me about') ||
      msg.includes('why is') ||
      msg.includes('what is special') ||
      msg.includes('history') ||
      msg.includes('famous') ||
      msg.includes('explain') ||
      msg.includes('what can we see') ||
      msg.includes('suitable for') ||
      msg.includes('timings') ||
      msg.includes('ticket') ||
      msg.includes('hours') ||
      msg.includes('facilities') ||
      msg.includes('official website')
    )
  );

  if (isPlaceInfoQuery && targetPlaceForInfo) {
    const p = targetPlaceForInfo;
    const isHistoryQuestion = msg.includes('history') || msg.includes('ancient') || msg.includes('who built');
    const asksSpecial = msg.includes('famous') || msg.includes('special');
    const asksLocation = msg.includes('where') || msg.includes('location') || msg.includes('address');
    const asksOpeningHours = msg.includes('hour') || msg.includes('opening') || msg.includes('timing');
    const asksFerryTimings = msg.includes('ferry');
    const asksPrice = msg.includes('ticket') || msg.includes('entry fee') || msg.includes('price') || msg.includes('cost');
    const asksOfficial = msg.includes('website') || msg.includes('official') || msg.includes('portal') || msg.includes('link');
    const asksAccessibility = msg.includes('kid') || msg.includes('child') || msg.includes('senior')
      || msg.includes('elder') || msg.includes('accessibility') || msg.includes('wheelchair')
      || msg.includes('stair') || msg.includes('parent');
    const isBroadPlaceQuestion = !(
      isHistoryQuestion || asksSpecial || asksLocation || asksOpeningHours || asksFerryTimings
      || asksPrice || asksOfficial || asksAccessibility
    );
    const sections = [`## ${isHistoryQuestion ? 'Historical and cultural background' : 'Overview'}\n${p.description}`];
    if (p.highlights?.length && (isBroadPlaceQuestion || asksSpecial)) {
      sections.push(`## What makes this place special\n${p.highlights.map((highlight) => `- ${highlight}`).join('\n')}`);
    }

    const visitorDetails: string[] = [];
    if ((isBroadPlaceQuestion || asksLocation || asksOpeningHours || asksPrice) && p.location.trim()) {
      visitorDetails.push(`- **Location:** ${p.location}${p.city ? `, ${p.city}` : ''}`);
    }
    if ((isBroadPlaceQuestion || asksOpeningHours) && !asksFerryTimings && p.openingHours?.trim()) {
      visitorDetails.push(`- **Opening hours:** ${p.openingHours}`);
    }
    if ((isBroadPlaceQuestion || asksPrice) && p.budget?.trim()) {
      visitorDetails.push(`- **Entry fee:** ${p.budget}`);
    }
    if (visitorDetails.length) sections.push(`## Visitor information\n${visitorDetails.join('\n')}`);

    if (asksAccessibility && p.accessibility?.notes.trim()) {
      sections.push(`## Accessibility\n${p.accessibility.notes}`);
    }
    if ((isBroadPlaceQuestion || asksOfficial) && p.officialUrl && p.officialSourceType !== 'unavailable' && p.officialAudit?.verified !== false) {
      const officialLabel = p.officialAudit?.linkLabel || 'Official website';
      const authority = p.officialAuthority || p.officialSourceLabel || officialLabel;
      sections.push(`## Official information\n[${authority}](${p.officialUrl})`);
    }

    if (asksAccessibility && p.suitableFor?.length) {
      const suitableForFamily = p.suitableFor.includes('kids') || p.suitableFor.includes('family');
      const suitableForSeniors = p.suitableFor.includes('seniors');
      const suitability = [
        suitableForFamily && (msg.includes('kid') || msg.includes('child') || msg.includes('family')) ? 'Suitable for families and children.' : '',
        suitableForSeniors && (msg.includes('senior') || msg.includes('elder') || msg.includes('parent')) ? 'Suitable for senior visitors.' : '',
      ].filter(Boolean);
      if (suitability.length) sections.push(`## Visitor suitability\n${suitability.join(' ')}`);
    }

    return {
      content: `# ${p.name}\n*${[p.location, p.city].filter(Boolean).join(' · ')}*\n\n${sections.join('\n\n')}`,
      recommendations: {
        places: [p] // ONLY this place
      },
      suggestedActions: [
        `Is ${p.name} suitable for children?`,
        `What are the opening hours of ${p.name}?`,
        `Suggest spots to spend time with friends`,
        `Suggest restaurants in ${p.city}`
      ],
      activeSubject: {
        type: 'place',
        id: p.id,
        name: p.name,
        placeId: p.id,
        placeName: p.name
      },
      lastCategory: 'places',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 2. SPECIFIC RESTAURANT INFORMATION (Works Dynamically for ANY Restaurant)
  // =========================================================================
  const isRestaurantInfoQuery = Boolean(
    targetRestaurantForInfo &&
    (
      explicitlyMentionedRestaurant ||
      (hasPronounRef && conversationContext?.lastCategory === 'restaurants') ||
      msg.includes('menu') ||
      msg.includes('dishes') ||
      msg.includes('cuisine') ||
      msg.includes('food')
    )
  );

  if (isRestaurantInfoQuery && targetRestaurantForInfo) {
    const r = targetRestaurantForInfo;
    const details = [
      `## Overview\n${r.description}`,
      r.cuisine.trim() ? `- **Cuisine:** ${r.cuisine}` : '',
      r.location.trim() ? `- **Location:** ${r.location}${r.city ? `, ${r.city}` : ''}` : '',
      r.priceRange.trim() ? `- **Price range:** ${r.priceRange}` : '',
      r.openingHours?.trim() ? `- **Opening hours:** ${r.openingHours}` : '',
      r.rating ? `- **Rating:** ${r.rating.toFixed(1)} / 5.0` : '',
      r.popularDishes?.length ? `- **Popular dishes:** ${r.popularDishes.join(', ')}` : '',
      r.dietaryOptions?.length ? `- **Dietary options:** ${r.dietaryOptions.join(', ')}` : '',
      r.accessibility?.notes?.trim() ? `- **Accessibility:** ${r.accessibility.notes}` : '',
      r.officialUrl ? `- **Official website:** [${r.officialSourceLabel || 'Visit website'}](${r.officialUrl})` : '',
    ].filter(Boolean);
    return {
      content: `# ${r.name}\n*${[r.location, r.city].filter(Boolean).join(' · ')}*\n\n${details.join('\n')}`,
      recommendations: {
        restaurants: [r] // ONLY this restaurant
      },
      suggestedActions: [
        'Suggest different restaurants',
        'Find pure vegetarian dining',
        'Show places for kids in Vijayawada',
        'Show spots to spend time with friends'
      ],
      activeSubject: {
        type: 'restaurant',
        id: r.id,
        name: r.name,
        restaurantId: r.id,
        restaurantName: r.name
      },
      lastCategory: 'restaurants',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 3. RESTAURANT & FOOD DISCOVERY (ONLY RESTAURANTS, NO OTHER CATEGORIES)
  // =========================================================================
  const isRestaurantQuery =
    msg.includes('restaurant') ||
    msg.includes('food') ||
    msg.includes('where to eat') ||
    msg.includes('dining') ||
    msg.includes('lunch') ||
    msg.includes('dinner') ||
    msg.includes('breakfast') ||
    msg.includes('cafe') ||
    msg.includes('mess') ||
    msg.includes('biryani') ||
    msg.includes('thali') ||
    (
      (msg.includes('more') || msg.includes('different') || msg.includes('other') || msg.includes('next')) &&
      conversationContext?.lastCategory === 'restaurants'
    );

  if (isRestaurantQuery) {
    // Exclude previously shown restaurants
    const available = unshownRestaurants.length > 0 ? unshownRestaurants : allDestRestaurants;
    const isShowMore = msg.includes('more') || msg.includes('different') || msg.includes('other') || msg.includes('next');

    // Filter by preferences if stated
    let filtered = available;
    if (msg.includes('veg') || msg.includes('vegetarian')) {
      filtered = available.filter(r => r.dietaryOptions?.some(d => d.toLowerCase().includes('veg')));
    }

    if (unshownRestaurants.length > 0) {
      const batch = filtered.slice(0, 3);
      return {
        content: isShowMore
          ? `Here are ${batch.length} additional verified dining recommendations in ${destinationTitle}. None of these have been shown previously in our chat:`
          : `Here are popular, verified restaurants in ${destinationTitle}:`,
        recommendations: {
          restaurants: batch // STRICTLY RESTAURANTS ONLY!
        },
        suggestedActions: [
          'Suggest different restaurants',
          'Find pure vegetarian dining',
          'Show places to visit in Vijayawada',
          'Show spots to spend time with friends'
        ],
        lastCategory: 'restaurants',
        isBackendSource: false
      };
    } else {
      return {
        content: `You have viewed all ${allDestRestaurants.length} verified restaurants for ${destinationTitle} cataloged in our database. I have avoided repeating previous suggestions.\n\nWould you like me to:\n• Revisit details about any specific restaurant (e.g. Babai Hotel, Minerva Grand)?\n• Or switch back to exploring attractions and places to visit?`,
        suggestedActions: [
          'Tell me about Babai Hotel',
          'Show places for kids',
          'Show spots to spend time with friends',
          'Plan a 2-day trip'
        ],
        lastCategory: 'restaurants',
        isBackendSource: false,
        exhausted: true
      };
    }
  }

  // =========================================================================
  // 4. HOTEL & ACCOMMODATION DISCOVERY (ONLY HOTELS, NO OTHER CATEGORIES)
  // =========================================================================
  const isHotelQuery =
    msg.includes('hotel') ||
    msg.includes('stay') ||
    msg.includes('accommodation') ||
    msg.includes('resort') ||
    msg.includes('room') ||
    (
      (msg.includes('more') || msg.includes('different') || msg.includes('other')) &&
      conversationContext?.lastCategory === 'hotels'
    );

  if (isHotelQuery) {
    return {
      content: `Here are verified hotels and accommodations in ${destinationTitle}:`,
      recommendations: {
        hotels: allDestHotels.slice(0, 3) // STRICTLY HOTELS ONLY!
      },
      suggestedActions: [
        'Find accessible hotels with elevators',
        'Show places for kids',
        'Suggest spots to spend time with friends',
        'Suggest restaurants'
      ],
      lastCategory: 'hotels',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 5. TRIP PLANNING / MULTI-DAY ITINERARY
  // =========================================================================
  const hasDuration =
    /\b(\d+|one|two|three|four|five)\s*(day|days)\b/i.test(msg) ||
    /\b(2-day|3-day|1-day|4-day|5-day|weekend)\b/i.test(msg);

  const isTripPlanningRequest =
    /\bplan\s+(a\s+)?([a-z0-9-]+\s+)*trip\b/i.test(msg) ||
    /\b(itinerary|day-by-day|day by day)\b/i.test(msg) ||
    msg.includes('plan a') ||
    msg.includes('plan trip') ||
    msg.includes('create an itinerary') ||
    msg.includes('build an itinerary') ||
    msg.includes('plan an itinerary') ||
    msg.includes('plan my trip');

  if (isTripPlanningRequest && !hasDuration) {
    return {
      content: `I would be delighted to help you plan your trip to **${destinationTitle}**!\n\nTo build the most thoughtful, realistic day-by-day itinerary, could you let me know:\n• **How many days** are you planning to visit? (e.g., a 1-day highlight tour, a 2-day weekend trip, or 3+ days?)\n• **Who is traveling** with you? (e.g., solo, with friends, or with family?)\n\nOnce you share these essential details, I will organize a customized day-by-day schedule with verified timings and activities.`,
      suggestedActions: [
        `Plan a 1-day trip to ${destinationTitle}`,
        `Plan a 2-day trip to ${destinationTitle}`,
        `Plan a 2-day family trip to ${destinationTitle}`,
        `Explore popular places in ${destinationTitle}`
      ],
      lastCategory: 'itinerary',
      isBackendSource: false
    };
  }

  if (isTripPlanningRequest && hasDuration) {
    const isFamily = msg.includes('family') || msg.includes('kid') || msg.includes('children');
    const itinPlaces = allDestPlaces.slice(0, 4);
    const itinRestaurants = allDestRestaurants.slice(0, 2);

    const generatedItinerary: Itinerary = {
      id: `itin-${destination.toLowerCase()}-2d`,
      destination: destinationTitle,
      title: isFamily ? `2-Day Family Itinerary for ${destinationTitle}` : `2-Day Highlights Itinerary for ${destinationTitle}`,
      summary: isFamily
        ? `A balanced 2-day family itinerary in ${destinationTitle}, featuring engaging attractions, comfortable pacing, and authentic dining.`
        : `A balanced 2-day itinerary exploring key attractions, scenic highlights, and authentic dining in ${destinationTitle}.`,
      durationDays: 2,
      days: [
        {
          dayNumber: 1,
          title: `Day 1: Iconic Landmarks & Scenic Highlights in ${destinationTitle}`,
          slots: [
            {
              time: '09:00 AM – 11:30 AM',
              title: itinPlaces[0] ? itinPlaces[0].name : `Morning Landmark Exploration`,
              activityType: 'sightseeing',
              description: itinPlaces[0] ? itinPlaces[0].description : `Visit top morning attraction.`,
              place: itinPlaces[0],
              duration: '2.5 hours'
            },
            {
              time: '12:30 PM – 02:00 PM',
              title: itinRestaurants[0] ? `Lunch at ${itinRestaurants[0].name}` : `Regional Midday Dining`,
              activityType: 'meal',
              description: itinRestaurants[0] ? `Enjoy ${itinRestaurants[0].cuisine} specialties.` : `Savor authentic regional dishes.`,
              restaurant: itinRestaurants[0],
              duration: '1.5 hours'
            },
            {
              time: '04:30 PM – 07:00 PM',
              title: itinPlaces[1] ? itinPlaces[1].name : `Evening Scenic Viewpoint`,
              activityType: 'sightseeing',
              description: itinPlaces[1] ? itinPlaces[1].description : `Enjoy evening viewpoints and sunset breezes.`,
              place: itinPlaces[1],
              duration: '2.5 hours'
            }
          ]
        },
        {
          dayNumber: 2,
          title: `Day 2: Heritage, Culture & Nature in ${destinationTitle}`,
          slots: [
            {
              time: '09:30 AM – 12:00 PM',
              title: itinPlaces[2] ? itinPlaces[2].name : `Morning Cultural Exploration`,
              activityType: 'sightseeing',
              description: itinPlaces[2] ? itinPlaces[2].description : `Explore regional heritage and exhibitions.`,
              place: itinPlaces[2],
              duration: '2.5 hours'
            },
            {
              time: '12:30 PM – 02:00 PM',
              title: itinRestaurants[1] ? `Lunch at ${itinRestaurants[1].name}` : `Midday Dining`,
              activityType: 'meal',
              description: itinRestaurants[1] ? `Dine at ${itinRestaurants[1].name} featuring ${itinRestaurants[1].cuisine}.` : `Local dining experience.`,
              restaurant: itinRestaurants[1],
              duration: '1.5 hours'
            },
            {
              time: '03:30 PM – 06:30 PM',
              title: itinPlaces[3] ? itinPlaces[3].name : (itinPlaces[1] ? itinPlaces[1].name : `Afternoon Promenade`),
              activityType: 'sightseeing',
              description: itinPlaces[3] ? itinPlaces[3].description : `Relax and explore scenic grounds.`,
              place: itinPlaces[3] || itinPlaces[1],
              duration: '3 hours'
            }
          ]
        }
      ]
    };

    return {
      content: isFamily
        ? `Here is a 2-day family trip plan for **${destinationTitle}**, featuring engaging attractions and relaxed pacing:`
        : `Here is a thoughtfully organized 2-day itinerary for **${destinationTitle}**, balancing morning visits, scenic highlights, and authentic regional dining:`,
      itinerary: generatedItinerary,
      recommendations: {
        places: itinPlaces.slice(0, 2),
        restaurants: itinRestaurants.slice(0, 2)
      },
      suggestedActions: [
        'Explore popular places',
        'Suggest restaurants',
        'Show places for children',
        'Find hotels'
      ],
      lastCategory: 'itinerary',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 6. PLACE DISCOVERY: HISTORICAL & HERITAGE ATTRACTIONS (STRICTLY PLACES ONLY)
  // =========================================================================
  const isHistoricalQuery =
    msg.includes('historical') ||
    msg.includes('historic') ||
    msg.includes('heritage') ||
    msg.includes('ancient') ||
    msg.includes('monument');

  if (isHistoricalQuery) {
    const historicalSpots = unshownPlaces.filter(
      p => p.category === 'historic' || p.category === 'temple' || p.category === 'cultural' || p.suitableFor?.includes('history')
    );
    const selected = historicalSpots.length > 0 ? historicalSpots.slice(0, 3) : allDestPlaces.filter(p => p.category === 'historic' || p.category === 'temple' || p.category === 'cultural').slice(0, 3);

    return {
      content: `Here are historic and heritage attractions in **${destinationTitle}** from our verified database:`,
      recommendations: {
        places: selected // STRICTLY PLACES ONLY!
      },
      suggestedActions: [
        'Explore popular places',
        'Discover peaceful places',
        'Suggest restaurants',
        `Plan a trip to ${destinationTitle}`
      ],
      lastCategory: 'places',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 7. PLACE DISCOVERY: PEACEFUL / SERENE / TRANQUIL PLACES (STRICTLY PLACES ONLY)
  // =========================================================================
  const isPeacefulQuery =
    msg.includes('peaceful') ||
    msg.includes('tranquil') ||
    msg.includes('serene') ||
    msg.includes('calm') ||
    msg.includes('quiet') ||
    msg.includes('relaxing');

  if (isPeacefulQuery) {
    const peacefulSpots = unshownPlaces.filter(
      p => p.suitableFor?.includes('peaceful') || p.category === 'nature' || p.category === 'viewpoint'
    );
    const selected = peacefulSpots.length > 0 ? peacefulSpots.slice(0, 3) : allDestPlaces.filter(p => p.suitableFor?.includes('peaceful') || p.category === 'nature').slice(0, 3);

    return {
      content: `Here are peaceful, tranquil destinations in **${destinationTitle}** ideal for relaxation:`,
      recommendations: {
        places: selected // STRICTLY PLACES ONLY!
      },
      suggestedActions: [
        'Explore popular places',
        'Discover historical attractions',
        'Suggest restaurants',
        `Plan a trip to ${destinationTitle}`
      ],
      lastCategory: 'places',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 8. PLACE DISCOVERY: POPULAR ATTRACTIONS (STRICTLY PLACES ONLY)
  // =========================================================================
  const isPopularQuery =
    msg.includes('popular') ||
    msg.includes('top places') ||
    msg.includes('main attractions') ||
    msg.includes('must visit') ||
    msg.includes('explore popular') ||
    msg.includes('show popular');

  if (isPopularQuery) {
    const selected = unshownPlaces.length > 0 ? unshownPlaces.slice(0, 3) : allDestPlaces.slice(0, 3);
    return {
      content: `Here are popular attractions to explore in **${destinationTitle}** from our verified database:`,
      recommendations: {
        places: selected // STRICTLY PLACES ONLY!
      },
      suggestedActions: [
        'Discover historical attractions',
        'Find places for families and children',
        'Explore restaurants',
        'Discover peaceful places',
        `Plan a trip to ${destinationTitle}`
      ],
      lastCategory: 'places',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 9. PLACE DISCOVERY: KIDS / CHILD-FRIENDLY & FAMILY (STRICTLY PLACES ONLY)
  // =========================================================================
  const isKidsQuery =
    msg.includes('kid') ||
    msg.includes('child') ||
    msg.includes('children') ||
    msg.includes('toddler') ||
    msg.includes('family') ||
    msg.includes('families and children') ||
    msg.includes('play area') ||
    msg.includes('for kids');

  if (isKidsQuery) {
    const kidSpots = unshownPlaces.filter(
      p => p.suitableFor?.includes('kids') || p.suitableFor?.includes('family') || p.category === 'nature' || p.category === 'cultural'
    );
    const selected = kidSpots.length > 0 ? kidSpots.slice(0, 3) : allDestPlaces.filter(p => p.suitableFor?.includes('kids') || p.suitableFor?.includes('family')).slice(0, 3);

    return {
      content: `Here are great attractions in **${destinationTitle}** suitable for children and families from our verified database:`,
      recommendations: {
        places: selected // STRICTLY PLACES ONLY! NO RESTAURANTS/HOTELS
      },
      suggestedActions: [
        'Suggest some new places for children',
        'Discover historical attractions',
        'Explore restaurants',
        `Plan a trip to ${destinationTitle}`
      ],
      lastCategory: 'kids',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 10. PLACE DISCOVERY: FRIENDS / HANGOUT SPOTS (STRICTLY PLACES ONLY)
  // =========================================================================
  const isFriendsQuery =
    msg.includes('friend') ||
    msg.includes('hangout') ||
    msg.includes('chill') ||
    msg.includes('buddies') ||
    msg.includes('gang') ||
    msg.includes('with friends') ||
    msg.includes('for friends') ||
    msg.includes('group of friends');

  if (isFriendsQuery) {
    const friendSpots = unshownPlaces.filter(
      p => p.suitableFor?.includes('friends') || p.category === 'viewpoint' || p.category === 'nature' || p.category === 'adventure'
    );
    const selected = friendSpots.length > 0 ? friendSpots.slice(0, 3) : allDestPlaces.filter(p => p.suitableFor?.includes('friends')).slice(0, 3);

    return {
      content: `Here are popular spots in **${destinationTitle}** to hang out and spend memorable time with friends:`,
      recommendations: {
        places: selected // STRICTLY PLACES ONLY!
      },
      suggestedActions: [
        'Show different places to visit with friends',
        'Explore restaurants',
        'Discover peaceful places',
        `Plan a trip to ${destinationTitle}`
      ],
      lastCategory: 'friends',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 8. PLACE DISCOVERY: SENIORS / PARENTS / ACCESSIBLE (STRICTLY PLACES ONLY)
  // =========================================================================
  const isSeniorsQuery =
    msg.includes('parent') ||
    msg.includes('senior') ||
    msg.includes('elder') ||
    msg.includes('cannot climb') ||
    msg.includes('stair') ||
    msg.includes('wheelchair');

  if (isSeniorsQuery) {
    const accessible = unshownPlaces.filter(
      p => p.accessibility?.wheelchairAccessible || p.accessibility?.easyWalking
    );
    const selected = accessible.length > 0 ? accessible.slice(0, 3) : allDestPlaces.filter(p => p.accessibility?.easyWalking).slice(0, 3);

    return {
      content: `Here are comfortable, senior-friendly places in ${destinationTitle} with minimal stairs and verified accessibility:\n\n` +
        `• **Kanaka Durga Temple**: Vehicles can obtain an Indrakeeladri ghat-road permit to drive directly up to the upper plateau, followed by priority elevator access to the shrine.\n` +
        `• **Bapu Museum**: Fully barrier-free with ramps at entrance, air-conditioned galleries, elevators to all exhibition floors, and complimentary wheelchairs at reception.\n` +
        `• **Prakasam Barrage**: Completely level pedestrian sidewalk along the riverfront with direct roadside vehicle parking and barrier-free paths.\n\n` +
        `⚠️ *Note on Undavalli Caves*: Excluded from this recommendation because reaching the upper sanctums requires climbing over 80 steep rock-hewn steps.`,
      recommendations: {
        places: selected // STRICTLY PLACES ONLY!
      },
      suggestedActions: [
        'Show more places for parents',
        'Tell me about Kanaka Durga Temple',
        'Find accessible hotels with elevators',
        'Suggest pure vegetarian restaurants'
      ],
      lastCategory: 'seniors',
      isBackendSource: false
    };
  }

  // =========================================================================
  // 9. MORE PLACES / REPETITION AVOIDANCE (ACROSS CONSECUTIVE REQUESTS)
  // =========================================================================
  const isShowMorePlaces =
    msg.includes('show me more') ||
    msg.includes('more places') ||
    msg.includes('different places') ||
    msg.includes('other places') ||
    msg.includes('any other') ||
    msg.includes('give me more attractions') ||
    msg.includes('what else can we visit') ||
    msg.includes('new places');

  if (isShowMorePlaces) {
    // Check if user was previously looking for kids, friends, or general places
    let candidatePool = unshownPlaces;
    if (conversationContext?.lastCategory === 'kids') {
      candidatePool = unshownPlaces.filter(p => p.suitableFor?.includes('kids') || p.category === 'nature');
    } else if (conversationContext?.lastCategory === 'friends') {
      candidatePool = unshownPlaces.filter(p => p.suitableFor?.includes('friends') || p.category === 'viewpoint');
    }

    if (candidatePool.length > 0) {
      const nextBatch = candidatePool.slice(0, 3);
      return {
        content: `Here are ${nextBatch.length} additional verified places in ${destinationTitle}. None of these places have been shown previously in our conversation:`,
        recommendations: {
          places: nextBatch // STRICTLY PLACES ONLY!
        },
        suggestedActions: [
          'Show me more places',
          'Suggest spots to spend time with friends',
          'Suggest restaurants',
          'Plan a 2-day trip'
        ],
        lastCategory: conversationContext?.lastCategory || 'places',
        isBackendSource: false
      };
    } else {
      return {
        content: `You have viewed all ${allDestPlaces.length} verified attractions for ${destinationTitle} currently cataloged in our database. I have avoided repeating any previously shown places.\n\nWould you like me to:\n• Suggest authentic local restaurants and dining spots?\n• Recommend hotels and accommodations?\n• Build a structured day-by-day itinerary with your saved places?\n• Or explore a neighboring destination (such as Araku Valley or Visakhapatnam)?`,
        suggestedActions: [
          'Suggest restaurants in Vijayawada',
          'Find hotels in Vijayawada',
          'Plan a 2-day trip',
          'Explore Araku Valley'
        ],
        lastCategory: 'places',
        isBackendSource: false,
        exhausted: true
      };
    }
  }

  // =========================================================================
  // 10. SIMPLE GREETINGS (NO QUESTIONNAIRES)
  // =========================================================================
  if (/^(hi|hello|hey|greetings|good morning|good evening)$/i.test(msg.replace(/[!.?]/g, '').trim())) {
    return {
      content: "Hello! I'm TripMate, your intelligent companion for personalized travel planning. What would you like to explore today?",
      suggestedActions: [
        'Show places for kids',
        'Suggest spots to spend time with friends',
        'Show some places for parents',
        'Suggest restaurants',
        'Find hotels'
      ],
      isBackendSource: false
    };
  }

  // =========================================================================
  // 11. GENERAL PLACE DISCOVERY (DEFAULT)
  // =========================================================================
  // Responds directly with places only, never bundles hotels or restaurants
  const batch = unshownPlaces.length > 0 ? unshownPlaces.slice(0, 3) : allDestPlaces.slice(0, 3);
  return {
    content: `Here are top attractions in ${destinationTitle} from our verified database:`,
    recommendations: {
      places: batch // STRICTLY PLACES ONLY!
    },
    suggestedActions: [
      'Show places for kids',
      'Suggest spots to spend time with friends',
      'Show me more places',
      'Suggest restaurants'
    ],
    lastCategory: 'places',
    isBackendSource: false
  };
}
