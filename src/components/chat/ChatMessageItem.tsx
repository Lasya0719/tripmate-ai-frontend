/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles, User, Database, Globe, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { ChatMessage, Hotel, Place, Restaurant } from '../../types';
import { PlaceCard } from '../cards/PlaceCard';
import { RestaurantCard } from '../cards/RestaurantCard';
import { HotelCard } from '../cards/HotelCard';
import { ItineraryView } from '../itinerary/ItineraryView';
import { getChatTranslations, speechLanguageCode } from '../../services/language';
import { StructuredResponseRenderer } from './StructuredResponseRenderer';

interface ChatMessageItemProps {
  message: ChatMessage;
  savedPlaceIds: Set<string>;
  savedRestaurantIds: Set<string>;
  savedHotelIds: Set<string>;
  comparePlaceIds: Set<string>;
  onViewPlaceDetails: (place: Place) => void;
  onToggleSavePlace: (place: Place) => void;
  onToggleSaveRestaurant: (restaurant: Restaurant) => void;
  onToggleSaveHotel: (hotel: Hotel) => void;
  onToggleComparePlace: (place: Place) => void;
  onSelectActionPrompt: (prompt: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  savedPlaceIds,
  savedRestaurantIds,
  savedHotelIds,
  comparePlaceIds,
  onViewPlaceDetails,
  onToggleSavePlace,
  onToggleSaveRestaurant,
  onToggleSaveHotel,
  onToggleComparePlace,
  onSelectActionPrompt,
}) => {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const strings = getChatTranslations(message.language);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanTextForAudio = (raw: string): string => {
    return raw
      .replace(/https?:\/\/[^\s)]+/g, '') // remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
      .replace(/[#*_~`>•·🏛️⭐]/g, ' ') // remove markdown markers
      .replace(/\n+/g, '. ') // newline to pause
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSpeechNotice(strings.speechUnavailable);
      setTimeout(() => setSpeechNotice(null), 4000);
      return;
    }

    const synth = window.speechSynthesis;

    // If currently paused, resume
    if (isSpeaking && isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    // If currently speaking, pause
    if (isSpeaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
      return;
    }

    // Otherwise, start new speech
    synth.cancel(); // Stop any other message speaking

    const spokenText = cleanTextForAudio(message.content);
    if (!spokenText) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utteranceRef.current = utterance;

    // Detect message language
    const msgLang = message.language || (
      /[\u0C00-\u0C7F]/.test(message.content) ? 'te' :
      /[\u0900-\u097F]/.test(message.content) ? 'hi' : 'en'
    );

    const voices = synth.getVoices();
    const selectedVoice = voices.find((voice) =>
      voice.lang.toLowerCase() === speechLanguageCode(msgLang).toLowerCase()
      || voice.lang.toLowerCase().startsWith(`${msgLang}-`)
    );
    if (!selectedVoice) {
      setSpeechNotice(strings.voiceUnavailable);
      return;
    }
    utterance.voice = selectedVoice;
    utterance.lang = speechLanguageCode(msgLang);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      setIsSpeaking(false);
      setIsPaused(false);
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        setSpeechNotice(strings.speechPlaybackError);
      }
    };

    synth.speak(utterance);
  };

  const handleStopSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-4 animate-in fade-in duration-200">
        <div className="max-w-xl sm:max-w-2xl flex items-start gap-3">
          <div className="bg-stone-900 text-stone-50 rounded-2xl rounded-tr-xs py-3 px-4 sm:px-5 shadow-xs text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0 text-stone-600 mt-0.5">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex justify-start my-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl flex items-start gap-3">
        {/* TripMate Avatar */}
        <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Compass className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {/* Main prose response */}
          <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-2xs text-stone-800 text-sm sm:text-base leading-relaxed text-left">
            {/* Header: Source indicator tag & Audio Voice Output Control */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1 border-b border-stone-100">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-400">
                {message.isBackendSource ? (
                  <>
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">{strings.liveRecommendations}</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3 text-amber-600" />
                    <span className="text-amber-800">{strings.connectionUnavailable}</span>
                  </>
                )}
                {message.language && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 uppercase border border-stone-200">
                    {message.language === 'te' ? 'తెలుగు' : message.language === 'hi' ? 'हिन्दी' : 'English'}
                  </span>
                )}
              </div>

              {/* Voice Output / Listen Control Button */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isSpeaking
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-transparent'
                  }`}
                  title={
                    isSpeaking
                      ? isPaused
                        ? strings.resume
                        : strings.pause
                      : strings.listen
                  }
                  aria-label={isSpeaking ? (isPaused ? strings.resume : strings.pause) : strings.listen}
                >
                  {isSpeaking ? (
                    isPaused ? (
                      <Play className="w-3.5 h-3.5 text-amber-800 fill-amber-800" />
                    ) : (
                      <Pause className="w-3.5 h-3.5 text-amber-800" />
                    )
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                  )}
                  <span>
                    {isSpeaking ? (isPaused ? strings.resume : strings.speaking) : strings.listen}
                  </span>
                </button>

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                    title={strings.stopSpeaking}
                    aria-label={strings.stopSpeaking}
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="sr-only">{strings.stopSpeaking}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Speech Notice banner if device lacks specific voice */}
            {speechNotice && (
              <div className="mb-2 p-2 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 text-xs">
                {speechNotice}
              </div>
            )}

            {/* Formatted body paragraphs */}
            <div className="tripmate-answer text-stone-800" dir="auto">
              <StructuredResponseRenderer content={message.content} language={message.language} />
            </div>
          </div>

          {/* Place Recommendations Grid */}
          {message.recommendations?.places && message.recommendations.places.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
                <span>{message.language === 'te' ? 'సూచించిన ప్రదేశాలు' : message.language === 'hi' ? 'सुझाई गई जगहें' : 'Recommended Places'} ({message.recommendations.places.length})</span>
                <span className="text-[11px] font-normal text-stone-400">{strings.liveRecommendations}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {message.recommendations.places.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    isSaved={savedPlaceIds.has(place.id)}
                    isInCompare={comparePlaceIds.has(place.id)}
                    onViewDetails={onViewPlaceDetails}
                    onToggleSave={onToggleSavePlace}
                    onToggleCompare={onToggleComparePlace}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Dining / Restaurant Recommendations */}
          {message.recommendations?.restaurants && message.recommendations.restaurants.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
                <span>{message.language === 'te' ? 'రెస్టారెంట్ సూచనలు' : message.language === 'hi' ? 'रेस्तरां सुझाव' : 'Dining & Culinary Recommendations'} ({message.recommendations.restaurants.length})</span>
                <span className="text-[11px] font-normal text-stone-400">{strings.liveRecommendations}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {message.recommendations.restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isSaved={savedRestaurantIds.has(restaurant.id)}
                    onToggleSave={onToggleSaveRestaurant}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Hotel Recommendations */}
          {message.recommendations?.hotels && message.recommendations.hotels.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
                <span>{message.language === 'te' ? 'హోటల్ మరియు వసతి సూచనలు' : message.language === 'hi' ? 'होटल और ठहरने के सुझाव' : 'Accommodations & Stays'} ({message.recommendations.hotels.length})</span>
                <span className="text-[11px] font-normal text-stone-400">{strings.liveRecommendations}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {message.recommendations.hotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    isSaved={savedHotelIds.has(hotel.id)}
                    onToggleSave={onToggleSaveHotel}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Embedded Itinerary Timeline */}
          {message.itinerary && (
            <div className="mt-2">
              <ItineraryView
                itinerary={message.itinerary}
                language={message.language}
                onModifyRequest={onSelectActionPrompt}
              />
            </div>
          )}

          {/* Follow-up Suggested Action Buttons */}
          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-stone-400 font-medium mr-1">{strings.suggestions}:</span>
              {message.suggestedActions.map((action, aIdx) => (
                <button
                  key={aIdx}
                  type="button"
                  onClick={() => onSelectActionPrompt(action)}
                  className="py-1 px-3 rounded-full bg-white hover:bg-stone-100 border border-stone-200/90 hover:border-amber-400 text-xs text-stone-700 hover:text-stone-900 transition-all shadow-2xs text-left"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const unavailableInformation = /(?:not\s+available|unavailable|not\s+recorded|unknown|check\s+locally|verify\s+before\s+visiting|information\s+unavailable|not\s+verified|అందుబాటులో\s+లేదు|లభ్యం\s+కాదు|తెలియదు|ఉన్నట్లు\s+నిర్ధారించబడలేదు|उपलब्ध\s+नहीं|जानकारी\s+उपलब्ध\s+नहीं|अज्ञात|पुष्टि\s+नहीं)/i;
const emptyVisitorField = /^\s*(?:[-*+•]\s*)?(?:\*\*)?(?:ticket|entry|price|cost|ferry|opening|operating|hours|timings?|contact|phone|address|location|accessibility|website|portal|official information|visitor information|టికెట్|ప్రవేశ\s*రుసుము|ధర|సమయం|ఫెర్రీ|చిరునామా|స్థానం|ఫోన్|సంప్రదింపు|అధికారిక\s*వెబ్‌సైట్|అందుబాటు|टिकट|प्रवेश\s*शुल्क|कीमत|मूल्य|समय|फेरी|पता|स्थान|फोन|संपर्क|आधिकारिक\s*वेबसाइट|सुगम्यता)[^:\n]*?(?:\*\*)?\s*:\s*(?:\*\*)?\s*$/i;
const escapeToken = /\uE000([0-9a-f]+)\uE001/g;

function normalizedVisitorValue(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}

function containsKnownVisitorValue(line: string, values: string[], kind: 'price' | 'hours' | 'text'): boolean {
  const normalizedLine = normalizedVisitorValue(line);
  return values.some((value) => {
    const normalizedValue = normalizedVisitorValue(value);
    if (normalizedValue && normalizedLine.includes(normalizedValue)) return true;
    if (kind === 'price') {
      const amounts = value.match(/\d[\d,]*(?:\.\d+)?/g) || [];
      return amounts.some((amount) => normalizedLine.includes(amount.replace(/[,.]/g, '')));
    }
    if (kind === 'hours') {
      const times = value.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi) || [];
      return times.some((time) => normalizedLine.includes(normalizedVisitorValue(time)));
    }
    return false;
  });
}

function isVerifiedVisitorLine(line: string, message: ChatMessage): boolean {
  const places = message.recommendations?.places || [];
  const restaurants = message.recommendations?.restaurants || [];
  const hotels = message.recommendations?.hotels || [];
  const fieldLabel = line.replace(/^\s*(?:[-*+•]|\d+[.)])\s*/, '').replace(/\*\*|__/g, '').toLowerCase();
  if (/\bferry\b.*\b(?:time|timing|schedule|hour)s?\b|\b(?:time|timing|schedule|hour)s?\b.*\bferry\b|ఫెర్రీ.*(?:సమయం|వేళ)|(?:समय|समय-सारणी).*फेरी|फेरी.*(?:समय|समय-सारणी)/i.test(line)) return false;

  if (/\b(?:ticket|admission|entry.*(?:fee|budget|price|cost)|price\s*range|price\s*per\s*night|room\s*rate|ferry.*(?:fee|price|cost|charge|entry)|fees?\s*(?:and|\/)?\s*charges?)\b|^(?:టికెట్|ప్రవేశ\s*రుసుము|ధర)\s*[:：]|^(?:टिकट|प्रवेश\s*शुल्क|कीमत|मूल्य)\s*[:：]/i.test(fieldLabel)) {
    return containsKnownVisitorValue(line, [
      ...places.map((place) => place.budget || ''),
      ...restaurants.map((restaurant) => restaurant.priceRange),
      ...hotels.map((hotel) => hotel.pricePerNight),
    ].filter(Boolean), 'price');
  }
  if (/\b(?:opening|operating)\s*hours?\b|\b(?:opening\s*)?timings?\b|^(?:సమయం|వేళలు|పని\s*వేళలు)\s*[:：]|^(?:समय|खुलने\s*का\s*समय|खुलने\s*का\s*समय)\s*[:：]/i.test(fieldLabel)) {
    return containsKnownVisitorValue(line, [
      ...places.map((place) => place.openingHours || ''),
      ...restaurants.map((restaurant) => restaurant.openingHours || ''),
    ].filter(Boolean), 'hours');
  }
  if (/\b(?:contact(?:\s*(?:number|details))?|phone(?:\s*number)?|address|location)\b|^(?:చిరునామా|స్థానం|ఫోన్|సంప్రదింపు)\s*[:：]|^(?:पता|स्थान|फोन|संपर्क)\s*[:：]/i.test(fieldLabel)) {
    return containsKnownVisitorValue(line, [
      ...places.flatMap((place) => [place.location, place.city]),
      ...restaurants.flatMap((restaurant) => [restaurant.location, restaurant.city]),
      ...hotels.flatMap((hotel) => [hotel.location, hotel.city]),
    ].filter(Boolean), 'text');
  }
  if (/\baccessibility\b|^అందుబాటు\s*[:：]|^सुगम्यता\s*[:：]/i.test(fieldLabel)) {
    return containsKnownVisitorValue(line, places.map((place) => place.accessibility?.notes || '').filter(Boolean), 'text');
  }
  if (/\bofficial\s*(?:website|information|portal)\b|^అధికారిక\s*వెబ్‌సైట్\s*[:：]|^आधिकारिक\s*वेबसाइट\s*[:：]/i.test(fieldLabel)) {
    return containsKnownVisitorValue(line, [
      ...places.map((place) => place.officialUrl || ''),
      ...restaurants.map((restaurant) => restaurant.officialUrl || ''),
      ...hotels.map((hotel) => hotel.officialUrl || ''),
    ].filter(Boolean), 'text');
  }
  return true;
}

function decodeMarkdownEscapes(text: string): string {
  return text.replace(escapeToken, (_, codePoint: string) => String.fromCodePoint(parseInt(codePoint, 16)));
}

function prepareMarkdown(content: string, message: ChatMessage): string {
  const lines = content
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .filter((line) => !unavailableInformation.test(line) && !emptyVisitorField.test(line) && isVerifiedVisitorLine(line, message))
    .map((line) => line.replace(/\\([\\`*_{}\[\]()#+.!|>~-])/g, (_, escaped: string) => `\uE000${escaped.codePointAt(0)?.toString(16)}\uE001`));

  return lines.filter((line, index) => {
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading || !/^(?:visitor information|visitor details|accessibility|సందర్శకుల సమాచారం|ప్రవేశ సమాచారం|सामान्य जानकारी|यात्री जानकारी|सुगम्यता)$/i.test(heading[1])) return true;
    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex++) {
      if (/^\s{0,3}#{1,6}\s+/.test(lines[nextIndex])) break;
      const candidate = lines[nextIndex].trim();
      if (!candidate || /^\|?[\s:|-]+\|?$/.test(candidate) || /^\|.*\|$/.test(candidate)) continue;
      return true;
    }
    return false;
  }).join('\n').trim();
}

function renderInlineMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  const tokenPattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|`([^`]+)`|~~(.+?)~~|(https?:\/\/[^\s<]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(decodeMarkdownEscapes(text.slice(lastIndex, match.index)));
    const key = `${keyPrefix}-${tokenIndex++}`;
    if (match[1] && match[2]) {
      let isSafeLink = false;
      try {
        const url = new URL(match[2]);
        isSafeLink = url.protocol === 'https:' || url.protocol === 'http:';
      } catch {
        isSafeLink = false;
      }
      nodes.push(isSafeLink ? (
        <a
          key={key}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
        >
          {renderInlineMarkdown(match[1], key)}
        </a>
      ) : decodeMarkdownEscapes(match[1]));
    } else if (match[3] || match[4]) {
      nodes.push(<strong key={key} className="font-semibold text-stone-900">{decodeMarkdownEscapes(match[3] || match[4])}</strong>);
    } else if (match[5] || match[6]) {
      nodes.push(<em key={key}>{decodeMarkdownEscapes(match[5] || match[6])}</em>);
    } else if (match[7]) {
      nodes.push(<code key={key} className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.9em] text-stone-800">{decodeMarkdownEscapes(match[7])}</code>);
    } else if (match[8]) {
      nodes.push(<del key={key}>{decodeMarkdownEscapes(match[8])}</del>);
    } else if (match[9]) {
      nodes.push(
        <a key={key} href={match[9]} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-950">
          {match[9]}
        </a>
      );
    }
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(decodeMarkdownEscapes(text.slice(lastIndex)));
  return nodes;
}

function isBlockStart(lines: string[], index: number): boolean {
  const line = lines[index];
  return /^\s{0,3}#{1,6}\s+/.test(line)
    || /^\s*```/.test(line)
    || /^\s*>/.test(line)
    || /^\s*(?:[-*+•]|\d+[.)])\s+/.test(line)
    || /^\s*(?:\*\s*){3,}$|^\s*(?:-\s*){3,}$|^\s*(?:_\s*){3,}$/.test(line)
    || (index + 1 < lines.length && line.includes('|') && /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1]));
}

function parseTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, '|'));
}

const MarkdownAnswer: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const lines = prepareMarkdown(message.content, message).split('\n');
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    if (!lines[index].trim()) {
      index++;
      continue;
    }

    const heading = lines[index].match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const level = heading[1].length;
      const classes = level === 1
        ? 'font-serif-display text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 mb-1'
        : level === 2
          ? 'font-serif-display text-lg sm:text-xl font-semibold text-stone-900 pt-3 mt-4 border-t border-stone-100'
          : 'text-base font-semibold text-stone-900 pt-2';
      blocks.push(React.createElement(`h${level}`, { key: `heading-${index}`, className: classes }, renderInlineMarkdown(heading[2], `heading-${index}`)));
      index++;
      continue;
    }

    if (/^\s*```/.test(lines[index])) {
      const codeLines: string[] = [];
      index++;
      while (index < lines.length && !/^\s*```/.test(lines[index])) codeLines.push(lines[index++]);
      if (index < lines.length) index++;
      blocks.push(<pre key={`code-${index}`} className="overflow-x-auto rounded-xl bg-stone-900 p-3 text-xs text-stone-100"><code>{codeLines.join('\n')}</code></pre>);
      continue;
    }

    if (lines[index].includes('|') && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])) {
      const headers = parseTableRow(lines[index]);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) rows.push(parseTableRow(lines[index++]));
      blocks.push(
        <div key={`table-${index}`} className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex} className="border-b border-stone-200 px-3 py-2 font-semibold text-stone-900">{renderInlineMarkdown(cell, `th-${index}-${cellIndex}`)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="even:bg-stone-50/70">{headers.map((_, cellIndex) => <td key={cellIndex} className="border-b border-stone-100 px-3 py-2 align-top text-stone-700">{renderInlineMarkdown(row[cellIndex] || '', `td-${index}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }

    const listMatch = lines[index].match(/^\s*(?:([-*+•])|(\d+)[.)])\s+(.*)$/);
    if (listMatch) {
      const ordered = Boolean(listMatch[2]);
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*(?:([-*+•])|(\d+)[.)])\s+(.*)$/);
        if (!item || Boolean(item[2]) !== ordered) break;
        items.push(item[3]);
        index++;
      }
      const ListTag = ordered ? 'ol' : 'ul';
      blocks.push(
        <ListTag key={`list-${index}`} className={`my-2 space-y-1.5 ${ordered ? 'list-decimal' : 'list-disc'} pl-6 marker:text-amber-700`}>
          {items.map((item, itemIndex) => <li key={itemIndex} className="pl-1 leading-relaxed text-stone-700">{renderInlineMarkdown(item, `list-${index}-${itemIndex}`)}</li>)}
        </ListTag>
      );
      continue;
    }

    if (/^\s*>/.test(lines[index])) {
      const quote: string[] = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ''));
      blocks.push(<blockquote key={`quote-${index}`} className="border-l-2 border-amber-500 pl-4 text-stone-600">{quote.map((line, lineIndex) => <p key={lineIndex}>{renderInlineMarkdown(line, `quote-${index}-${lineIndex}`)}</p>)}</blockquote>);
      continue;
    }

    if (/^\s*(?:\*\s*){3,}$|^\s*(?:-\s*){3,}$|^\s*(?:_\s*){3,}$/.test(lines[index])) {
      blocks.push(<hr key={`rule-${index}`} className="my-3 border-stone-200" />);
      index++;
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) paragraph.push(lines[index++]);
    if (paragraph.length === 0) paragraph.push(lines[index++]);
    blocks.push(<p key={`paragraph-${index}`} className="whitespace-pre-wrap leading-7 text-stone-700">{renderInlineMarkdown(paragraph.join('\n'), `paragraph-${index}`)}</p>);
  }

  return <div className="space-y-3">{blocks}</div>;
}
