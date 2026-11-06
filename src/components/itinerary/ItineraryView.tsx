/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Accessibility, Utensils, Compass, Printer, Share2, Check } from 'lucide-react';
import { Itinerary, ItinerarySlot } from '../../types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  language?: string;
  onModifyRequest?: (prompt: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  language = 'en',
  onModifyRequest,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const labels = language === 'te'
    ? {
      copied: 'కాపీ అయింది',
      share: 'పంచుకోండి',
      print: 'ముద్రించండి',
      duration: 'రోజుల ప్రయాణం',
      accessibility: 'తక్కువ మెట్లు మరియు సౌకర్యవంతమైన ప్రయాణం కోసం',
      budget: 'అంచనా బడ్జెట్',
      day: 'రోజు',
      overview: 'సారాంశం',
      modify: 'ఈ ప్రణాళికను మార్చండి:',
      later: 'ఉదయం ఆలస్యంగా ప్రారంభించండి',
      dinner: 'రాత్రి భోజన ప్రదేశాన్ని మార్చండి',
      boat: 'పడవ విహారాన్ని చేర్చండి',
      activity: { SIGHTSEEING: 'సందర్శన', RELAXATION: 'విశ్రాంతి', DINING: 'భోజనం' } as Record<string, string>,
    }
    : language === 'hi'
      ? {
        copied: 'कॉपी किया गया',
        share: 'साझा करें',
        print: 'प्रिंट करें',
        duration: 'दिन की यात्रा',
        accessibility: 'कम सीढ़ियों और आरामदायक गतिशीलता के लिए',
        budget: 'अनुमानित बजट',
        day: 'दिन',
        overview: 'अवलोकन',
        modify: 'इस योजना में बदलाव करें:',
        later: 'सुबह देर से शुरू करें',
        dinner: 'रात के खाने की जगह बदलें',
        boat: 'नाव की सवारी जोड़ें',
        activity: { SIGHTSEEING: 'दर्शनीय स्थल', RELAXATION: 'विश्राम', DINING: 'भोजन' } as Record<string, string>,
      }
      : {
        copied: 'Copied',
        share: 'Share',
        print: 'Print',
        duration: 'Day Curated Journey',
        accessibility: 'Tailored for minimal stairs & mobility comfort',
        budget: 'Estimated Budget',
        day: 'Day',
        overview: 'Overview',
        modify: 'Modify this schedule:',
        later: 'Start mornings later',
        dinner: 'Change dinner spot',
        boat: 'Add boat cruise',
        activity: {} as Record<string, string>,
      };

  const selectedDay = itinerary.days.find((d) => d.dayNumber === activeDay) || itinerary.days[0];

  const handleCopyShare = () => {
    const text = `TripMate: ${itinerary.title}\n${itinerary.summary}\n${itinerary.durationDays} ${labels.duration}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm overflow-hidden my-3 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {itinerary.durationDays}{language === 'en' ? '-' : ' '}{labels.duration}
              </span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span>{itinerary.destination}</span>
            </div>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {itinerary.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {itinerary.summary}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShare}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? labels.copied : labels.share}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{labels.print}</span>
            </button>
          </div>
        </div>

        {/* Accessibility & Budget strip */}
        <div className="mt-4 pt-4 border-t border-stone-700/60 flex flex-wrap items-center gap-4 text-xs text-stone-300">
          {itinerary.accessibilityFriendly && (
            <div className="flex items-center gap-1.5 text-amber-300">
              <Accessibility className="w-4 h-4" />
              <span>{labels.accessibility}</span>
            </div>
          )}
          {itinerary.budgetEstimated && (
            <div className="text-stone-400">
              {labels.budget}: <span className="text-stone-200 font-medium">{itinerary.budgetEstimated}</span>
            </div>
          )}
        </div>
      </div>

      {/* Day Selector Tabs (interactive buttons) */}
      <div className="bg-stone-100/80 px-4 py-2 border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
        {itinerary.days.map((day) => (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => setActiveDay(day.dayNumber)}
            className={`py-1.5 px-4 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeDay === day.dayNumber
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            {labels.day} {day.dayNumber}: {day.theme || labels.overview}
          </button>
        ))}
      </div>

      {/* Selected Day Timeline */}
      <div className="p-5 sm:p-6">
        <div className="mb-6">
          <h4 className="text-base font-semibold text-stone-900">
            {labels.day} {selectedDay.dayNumber} — {selectedDay.title}
          </h4>
        </div>

        {/* Timeline list */}
        <div className="relative border-l border-stone-200 ml-3 sm:ml-4 pl-5 sm:pl-6 space-y-6">
          {selectedDay.slots.map((slot: ItinerarySlot, idx: number) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-3 h-3 rounded-full bg-stone-300 border-2 border-white group-hover:bg-amber-600 transition-colors" />

              <div className="bg-stone-50/70 hover:bg-stone-50 border border-stone-200/70 rounded-xl p-4 transition-colors">
                {/* Time & Activity Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot.time}</span>
                    {slot.duration && (
                      <span className="text-stone-400 font-normal">({slot.duration})</span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium tracking-wide uppercase text-stone-500">
                    {labels.activity[slot.activityType.toUpperCase()] || slot.activityType}
                  </div>
                </div>

                {/* Slot Title */}
                <h5 className="font-semibold text-stone-900 text-sm sm:text-base mb-1.5">
                  {slot.title}
                </h5>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                  {slot.description}
                </p>

                {/* Place / Restaurant reference details */}
                {slot.place && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200/60 text-xs text-stone-700 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-medium text-stone-900">{slot.place.name}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="truncate text-stone-500">{slot.place.location}</span>
                  </div>
                )}

                {slot.restaurant && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200/60 text-xs text-stone-700 mb-2">
                    <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-medium text-stone-900">{slot.restaurant.name}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="truncate text-stone-500">{slot.restaurant.cuisine}</span>
                  </div>
                )}

                {/* Travel & Accessibility notes */}
                <div className="space-y-1 pt-1">
                  {slot.travelNote && (
                    <div className="text-xs text-stone-500 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-stone-400" />
                      <span>{slot.travelNote}</span>
                    </div>
                  )}
                  {slot.accessibilityNote && (
                    <div className="text-xs text-amber-800 bg-amber-50/70 py-1 px-2 rounded border border-amber-200/60 flex items-center gap-1.5">
                      <Accessibility className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                      <span>{slot.accessibilityNote}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion Prompts to Modify Itinerary */}
        {onModifyRequest && (
          <div className="mt-6 pt-4 border-t border-stone-200">
            <p className="text-xs text-stone-500 mb-2 font-medium">{labels.modify}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onModifyRequest('Make the schedule more relaxed with later morning starts')}
                className="py-1 px-2.5 rounded-lg text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                {labels.later}
              </button>
              <button
                type="button"
                onClick={() => onModifyRequest('Swap dinner with an authentic Andhra Thali place')}
                className="py-1 px-2.5 rounded-lg text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                {labels.dinner}
              </button>
              <button
                type="button"
                onClick={() => onModifyRequest('Add an afternoon boat cruise on Bhavani Island')}
                className="py-1 px-2.5 rounded-lg text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                {labels.boat}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
