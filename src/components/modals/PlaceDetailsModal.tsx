/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Star,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Accessibility,
  Clock,
  IndianRupee,
  Sparkles,
  Globe,
  CameraOff,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { Place } from '../../types';

interface PlaceDetailsModalProps {
  place: Place | null;
  isOpen: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (place: Place) => void;
  onAskTripMate?: (question: string) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  isOpen,
  isSaved,
  onClose,
  onToggleSave,
  onAskTripMate,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !place) return null;

  const directionsUrl = place.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + ', ' + place.location + ', ' + place.city)}&travelmode=driving`;

  const showVerifiedPhoto = Boolean(place.hasVerifiedPhoto && place.imageUrl && !imageError);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image banner or Honest Placeholder */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100 flex items-center justify-center">
          {showVerifiedPhoto ? (
            <>
              <img
                src={place.imageUrl}
                alt={place.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/25 to-transparent" />

              {/* Attribution / Credit notice */}
              {place.imageAttribution && (
                place.imageSourceUrl ? (
                  <a
                    href={place.imageSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 left-4 z-10 text-[10px] text-stone-200 bg-stone-900/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 max-w-[70%] truncate underline hover:text-white"
                  >
                    Attribution: {place.imageAttribution}
                  </a>
                ) : (
                  <div className="absolute top-4 left-4 z-10 text-[10px] text-stone-200 bg-stone-900/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 max-w-[70%] truncate">
                    Attribution: {place.imageAttribution}
                  </div>
                )
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 border-b border-stone-200">
              <CameraOff className="w-10 h-10 text-stone-400 mb-2 stroke-[1.5]" />
              <div className="text-sm font-semibold text-stone-800">Verified photo unavailable</div>
              <p className="text-xs text-stone-500 max-w-sm mt-1">
                TripMate strictly displays genuine photographs of attractions. An authentic verified image has not yet been cataloged for this attraction.
              </p>
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header on image / banner bottom */}
          <div
            className={`absolute bottom-4 left-6 right-6 ${
              showVerifiedPhoto ? 'text-white' : 'text-stone-900 bg-white/90 p-3 rounded-2xl border border-stone-200 shadow-xs'
            }`}
          >
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                showVerifiedPhoto ? 'text-amber-300' : 'text-amber-800'
              }`}
            >
              {place.category} · {place.city}
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold leading-tight">
              {place.name}
            </h2>
            <div
              className={`flex items-center gap-2 mt-2 text-xs ${
                showVerifiedPhoto ? 'text-stone-200' : 'text-stone-600'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {place.location.trim() && <span className="truncate">{place.location}</span>}
              {place.rating && (
                <>
                  <span aria-hidden="true" className="opacity-50">·</span>
                  <div className="flex items-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{place.rating.toFixed(1)}</span>
                    {place.reviewCount && (
                      <span className="opacity-80 font-normal">({place.reviewCount.toLocaleString()} reviews)</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold tracking-wide uppercase text-stone-400 mb-2">
              Overview
            </h4>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Official Information & Authority Section */}
          {place.officialUrl && place.officialSourceType !== 'unavailable' && place.officialAudit?.verified !== false && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wide">
                  Official Information & Authority
                </h4>
              </div>
              {(place.officialAuthority || place.officialSourceLabel) && (
                <span className="text-[11px] font-medium text-stone-600 truncate max-w-[260px]" title={place.officialAuthority || place.officialSourceLabel}>
                  {place.officialAuthority || place.officialSourceLabel}
                </span>
              )}
            </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs text-stone-600 space-y-0.5">
                  <p>Official website for visitor information.</p>
                  {place.officialAudit?.authority && (
                    <p className="text-[11px] text-stone-500 font-medium">
                      Authority: <span className="text-stone-700">{place.officialAudit.authority}</span>
                      {place.officialAudit.specificallyDiscusses && ' · Dedicated Attraction Coverage'}
                    </p>
                  )}
                </div>
                <a
                  href={place.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white transition-colors shrink-0 shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>
                    {place.officialAudit?.linkLabel
                      ? `Visit ${place.officialAudit.linkLabel}`
                      : place.officialSourceType === 'temple'
                      ? 'Visit Official Temple Portal'
                      : place.officialSourceType === 'heritage'
                      ? 'Visit Official Heritage Information'
                      : place.officialSourceType === 'government'
                      ? 'Visit Official Government Portal'
                      : place.officialSourceType === 'tourism'
                      ? 'Visit Official Tourism Information'
                      : 'Visit Official Website'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Key verified details grid */}
          {(place.openingHours?.trim() || place.budget?.trim()) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {place.openingHours?.trim() && (
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-stone-500">Operating Hours</div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">{place.openingHours}</div>
                </div>
              </div>
            )}

            {place.budget?.trim() && (
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-start gap-3">
                <IndianRupee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-stone-500">Verified Budget / Fees</div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">{place.budget}</div>
                </div>
              </div>
            )}
            </div>
          )}

          {/* Verified Accessibility Assessment */}
          {place.accessibility?.notes.trim() && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                <Accessibility className="w-4 h-4 text-amber-800" />
                <span>Accessibility & Physical Effort Assessment</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {place.accessibility.notes}
              </p>
              {place.accessibility.stairCount && (
                <div className="mt-2 text-xs font-medium text-amber-900">
                  Stairs / Incline: <span className="font-normal text-stone-700">{place.accessibility.stairCount}</span>
                </div>
              )}
            </div>
          )}

          {/* Highlights */}
          {place.highlights && place.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold tracking-wide uppercase text-stone-400 mb-2">
                Key Highlights
              </h4>
              <ul className="space-y-1.5">
                {place.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal footer actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleSave(place)}
            className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
              isSaved
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved to Collection' : 'Save Place'}</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Ask TripMate about this place */}
            {onAskTripMate && (
              <button
                type="button"
                onClick={() => {
                  onAskTripMate(`Tell me more about ${place.name}`);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors shadow-2xs"
                title={`Ask TripMate about ${place.name}`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask TripMate</span>
                <Sparkles className="w-3 h-3 opacity-70" />
              </button>
            )}

            {place.officialUrl && place.officialSourceType !== 'unavailable' && place.officialAudit?.verified !== false && (
              <a
                href={place.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-medium border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
