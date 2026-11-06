/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Place {
  id: string;
  name: string;
  category: 'historic' | 'nature' | 'cultural' | 'viewpoint' | 'temple' | 'beach' | 'adventure';
  description: string;
  location: string;
  city: string;
  budget?: string;
  openingHours?: string;
  accessibility?: {
    wheelchairAccessible: boolean;
    elevatorAvailable?: boolean;
    stairCount?: string;
    easyWalking?: boolean;
    notes: string;
  };
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  imageAttribution?: string;
  imageSourceUrl?: string;
  hasVerifiedPhoto?: boolean;
  officialUrl?: string;
  officialSourceLabel?: string;
  officialSourceType?: 'official_website' | 'government' | 'tourism' | 'heritage' | 'temple' | 'booking' | 'unavailable';
  officialAuthority?: string;
  officialAudit?: {
    verified: boolean;
    status: 'verified_dedicated' | 'verified_government' | 'verified_tourism' | 'verified_heritage' | 'verified_temple' | 'unavailable';
    authority: string;
    linkLabel: string;
    specificallyDiscusses: boolean;
    reason: string;
    previousUrl?: string;
  };
  coordinates?: { lat: number; lng: number };
  highlights?: string[];
  bestTimeToVisit?: string;
  suitableFor?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  location: string;
  city: string;
  priceRange: string;
  openingHours?: string;
  rating?: number;
  imageUrl: string;
  hasVerifiedPhoto?: boolean;
  imageAttribution?: string;
  officialUrl?: string;
  officialSourceLabel?: string;
  officialSourceType?: 'official_website' | 'government' | 'tourism' | 'heritage' | 'temple' | 'booking' | 'unavailable';
  officialAuthority?: string;
  specialties?: string[];
  popularDishes?: string[];
  dietaryOptions?: string[];
  accessibility?: {
    wheelchairAccessible: boolean;
    groundFloor: boolean;
    notes?: string;
  };
}

export interface Hotel {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  city: string;
  pricePerNight: string;
  rating?: number;
  imageUrl: string;
  officialUrl?: string;
  officialSourceLabel?: string;
  officialSourceType?: 'booking' | 'official_website' | 'tourism' | 'unavailable';
  officialAuthority?: string;
  amenities: string[];
  accessibility?: {
    wheelchairAccessible: boolean;
    elevators: boolean;
    accessibleRooms: boolean;
    notes?: string;
  };
}

export interface ItinerarySlot {
  time: string;
  title: string;
  activityType: 'sightseeing' | 'meal' | 'relaxation' | 'travel';
  description: string;
  place?: Place;
  restaurant?: Restaurant;
  duration?: string;
  travelNote?: string;
  accessibilityNote?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme?: string;
  slots: ItinerarySlot[];
}

export interface Itinerary {
  id: string;
  destination: string;
  title: string;
  summary: string;
  durationDays: number;
  accessibilityFriendly?: boolean;
  budgetEstimated?: string;
  days: ItineraryDay[];
}

export interface RecommendationSet {
  places?: Place[];
  restaurants?: Restaurant[];
  hotels?: Hotel[];
}

export interface ConversationContext {
  activePlaceId?: string;
  activePlaceName?: string;
  activeRestaurantId?: string;
  activeRestaurantName?: string;
  lastCategory?: 'places' | 'restaurants' | 'hotels' | 'kids' | 'friends' | 'seniors' | 'evening' | 'museums' | 'itinerary' | string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendations?: RecommendationSet;
  itinerary?: Itinerary;
  suggestedActions?: string[];
  activeSubject?: {
    type?: 'place' | 'restaurant';
    id?: string;
    name?: string;
    placeId?: string;
    placeName?: string;
    restaurantId?: string;
    restaurantName?: string;
  };
  isPending?: boolean;
  error?: string;
  isBackendSource?: boolean;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  destinationContext?: string;
  context?: ConversationContext;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
}

export interface DestinationInspiration {
  id: string;
  name: string;
  tagline: string;
  state: string;
  description: string;
  imageUrl: string;
  bestSeason: string;
  travelStyle: string;
  suggestedPrompt: string;
}

export type AnsweringMethod =
  | 'simple_short'
  | 'detailed'
  | 'step_by_step'
  | 'formal'
  | 'friendly';

