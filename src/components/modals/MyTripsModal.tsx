/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Map, Calendar, Accessibility, ArrowRight } from 'lucide-react';
import { Itinerary } from '../../types';

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itineraries: Itinerary[];
  onSelectItinerary: (itin: Itinerary) => void;
}

export const MyTripsModal: React.FC<MyTripsModalProps> = ({
  isOpen,
  onClose,
  itineraries,
  onSelectItinerary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                My Trips & Itineraries
              </h3>
              <p className="text-xs text-stone-500">
                Saved schedules and tailored journey plans
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {itineraries.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Map className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-medium text-stone-600">No itineraries generated yet</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Ask TripMate to plan a 2-day or 3-day trip in the chat, and your structured schedules will appear here.
              </p>
            </div>
          ) : (
            itineraries.map((itin) => (
              <div
                key={itin.id}
                onClick={() => {
                  onSelectItinerary(itin);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/50 hover:bg-stone-50 transition-all cursor-pointer group flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{itin.durationDays} Days</span>
                    <span aria-hidden="true">·</span>
                    <span>{itin.destination}</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 text-base group-hover:text-amber-900">
                    {itin.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {itin.summary}
                  </p>
                  {itin.accessibilityFriendly && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 pt-1">
                      <Accessibility className="w-3.5 h-3.5" />
                      <span>Accessibility friendly (minimal stairs)</span>
                    </div>
                  )}
                </div>
                <div className="p-2 rounded-full bg-white border border-stone-200 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors mt-2">
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
