/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Star, Accessibility, Clock, IndianRupee, Trash2 } from 'lucide-react';
import { Place } from '../../types';

interface CompareModalProps {
  places: Place[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  places,
  isOpen,
  onClose,
  onRemove,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              Compare Destinations
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Evaluating accessibility, atmosphere, and practical details side-by-side.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {places.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-stone-500 hover:text-stone-900 font-medium px-2 py-1 rounded hover:bg-stone-200 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {places.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-stone-500 text-sm">
                No places added to comparison yet. Click the scale icon on any place card to compare.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="rounded-2xl border border-stone-200/90 bg-stone-50/50 p-4 flex flex-col space-y-4"
                >
                  {/* Photo & remove */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemove(place.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 transition-colors"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 text-[10px] uppercase font-semibold text-white/90 drop-shadow-xs">
                      {place.category}
                    </div>
                  </div>

                  {/* Title & rating */}
                  <div>
                    <h4 className="font-semibold text-stone-900 text-base leading-snug">
                      {place.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                      <span>{place.city}</span>
                      {place.rating && (
                        <>
                          <span aria-hidden="true">·</span>
                          <div className="flex items-center gap-0.5 text-stone-800 font-medium">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{place.rating}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Accessibility Comparison */}
                  {(place.accessibility?.notes.trim() || place.accessibility?.easyWalking !== undefined) && (
                    <div className="p-3 rounded-xl bg-white border border-stone-200/70 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                      <Accessibility className="w-3.5 h-3.5 text-amber-700" />
                      <span>Accessibility</span>
                    </div>
                    {place.accessibility?.notes.trim() && <p className="text-stone-600 text-[11px] leading-relaxed">{place.accessibility.notes}</p>}
                    {place.accessibility?.easyWalking !== undefined && (
                      <div className="text-[11px] text-stone-500">
                        Walking: <span className="font-medium text-stone-800">{place.accessibility.easyWalking ? 'Easy' : 'Moderate/Stairs'}</span>
                      </div>
                    )}
                    </div>
                  )}

                  {/* Budget & Timing */}
                  {(place.budget?.trim() || place.openingHours?.trim()) && (
                    <div className="text-xs space-y-2 text-stone-600">
                      {place.budget?.trim() && (
                        <div className="flex items-start gap-2">
                          <IndianRupee className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span>{place.budget}</span>
                        </div>
                      )}
                      {place.openingHours?.trim() && (
                        <div className="flex items-start gap-2">
                          <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span className="truncate">{place.openingHours}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
