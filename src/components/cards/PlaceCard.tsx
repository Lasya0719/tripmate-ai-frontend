/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Info,
  MapPin,
  Scale,
  Star,
  Accessibility,
  Globe,
  Landmark,
  Sparkles,
} from 'lucide-react';
import { Place } from '../../types';

/**
 * NiVU AI deep-link for heritage / historical place exploration.
 *
 * Leave this constant as an empty string until the verified NiVU AI URL is
 * available.  When empty, the "Explore on NiVU AI" link is completely hidden —
 * no broken or dummy link is ever rendered.
 *
 * To enable: set this to the confirmed public URL, e.g.:
 *   const NIVU_AI_URL = 'https://nivu.ai';
 */
const NIVU_AI_URL = 'https://nivu.ai/';

interface PlaceCardProps {
  place: Place;
  isSaved?: boolean;
  isInCompare?: boolean;
  onViewDetails: (place: Place) => void;
  onToggleSave: (place: Place) => void;
  onToggleCompare: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isSaved,
  isInCompare,
  onViewDetails,
  onToggleSave,
  onToggleCompare,
}) => {
  const [imageError, setImageError] = useState(false);
  const showVerifiedPhoto = Boolean(place.hasVerifiedPhoto && place.imageUrl && !imageError);

  /**
   * True for places that are historical, heritage, cultural, temple, or museum in nature.
   * Supports categories: historic, historical, heritage, temple, cultural, and museum
   * (normalized using lowercase and trimming).
   * Also preserves the existing officialSourceType checks ('heritage' or 'temple').
   * Used to conditionally show the NiVU AI link.
   */
  const normalizedCategory = place.category ? place.category.trim().toLowerCase() : '';

  // Categories that are NOT eligible for NiVU (accommodation and food)
  const isAccommodationOrDining =
    place.officialSourceType === 'booking' ||
    normalizedCategory === 'hotel' ||
    normalizedCategory === 'hostel' ||
    normalizedCategory === 'restaurant';

  // Eligible categories for NiVU AI (all tourist attractions)
  const isEligibleForNivuCategory =
    normalizedCategory === 'historic' ||
    normalizedCategory === 'historical' ||
    normalizedCategory === 'heritage' ||
    normalizedCategory === 'temple' ||
    normalizedCategory === 'cultural' ||
    normalizedCategory === 'museum' ||
    normalizedCategory === 'nature' ||
    normalizedCategory === 'viewpoint' ||
    normalizedCategory === 'beach' ||
    normalizedCategory === 'adventure';

  // NiVU shows if the category is eligible AND the source type is not 'booking'
  const isEligibleForNivu = isEligibleForNivuCategory && !isAccommodationOrDining;

  const directionsUrl = place.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + ', ' + place.location + ', ' + place.city)}&travelmode=driving`;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden text-left">
      {/* Place Image Header — verified photo or fallback icon placeholder */}
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center border-b border-stone-100">
        {showVerifiedPhoto ? (
          <>
            <img
              src={place.imageUrl}
              alt={place.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay so category label stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent pointer-events-none" />
            {/* Attribution badge */}
            {place.imageAttribution && (
              <div className="absolute top-2 left-2 z-10 text-[9px] text-stone-200 bg-stone-900/55 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10 max-w-[80%] truncate leading-tight">
                {place.imageAttribution}
              </div>
            )}
          </>
        ) : (
          <Landmark className="w-8 h-8 text-stone-300" />
        )}

        {/* Category kicker — white on photo, grey on placeholder */}
        <div
          className={`absolute bottom-2 left-3 text-[11px] font-medium tracking-wide uppercase z-10 ${
            showVerifiedPhoto ? 'text-stone-200' : 'text-stone-500'
          }`}
        >
          {place.category}
        </div>

        {/* Quick Actions overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(place);
            }}
            title={isInCompare ? 'Remove from comparison' : 'Compare with another place'}
            className={`p-1.5 rounded-full transition-colors ${
              isInCompare
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900 shadow-2xs border border-stone-200'
            }`}
          >
            <Scale className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(place);
            }}
            title={isSaved ? 'Saved to collection' : 'Save place'}
            className={`p-1.5 rounded-full transition-colors ${
              isSaved
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900 shadow-2xs border border-stone-200'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="font-semibold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
            {place.name}
          </h4>
          {place.rating !== undefined && (
            <div className="flex items-center gap-1 text-xs font-semibold text-stone-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Location & Unboxed Metadata */}
        {(place.location.trim() || place.city.trim()) && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
            {place.location.trim() && <span className="truncate">{place.location}</span>}
            {place.location.trim() && place.city.trim() && <span aria-hidden="true" className="text-stone-300">·</span>}
            {place.city.trim() && <span className="shrink-0">{place.city}</span>}
          </div>
        )}

        {/* Short Description */}
        {place.description.trim() && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3 flex-1">
            {place.description}
          </p>
        )}

        {/* Verified Accessibility Indicator */}
        {place.accessibility && (place.accessibility.notes.trim() || place.accessibility.easyWalking !== undefined) && (
          <div className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg bg-stone-50 border border-stone-200/60 text-[11px] text-stone-700 mb-2.5">
            <Accessibility className="w-3.5 h-3.5 shrink-0 text-stone-500" />
            <span className="truncate font-medium">
              {place.accessibility.easyWalking !== undefined
                ? place.accessibility.easyWalking ? 'Easy walking / flat paths' : 'Elevated terrain or steps'
                : place.accessibility.notes}
            </span>
          </div>
        )}

        {/* Official Information / Useful Links — official website + NiVU AI (heritage only) */}
        {(
          (place.officialUrl && place.officialSourceType !== 'unavailable' && place.officialAudit?.verified !== false) ||
          (isEligibleForNivu && NIVU_AI_URL)
        ) && (
          <div className="py-2 px-2.5 rounded-lg bg-stone-50/80 border border-stone-200/60 flex flex-col gap-1.5 text-xs mb-3">
            {/* Official website link */}
            {place.officialUrl && place.officialSourceType !== 'unavailable' && place.officialAudit?.verified !== false && (
              <div className="flex items-center justify-between">
                <a
                  href={place.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-amber-900 hover:text-amber-700 transition-colors truncate max-w-[65%]"
                  title={`${place.officialAudit?.linkLabel || place.officialSourceLabel || 'Official Information'}: ${place.officialAuthority || place.officialSourceLabel || ''}`}
                >
                  <Globe className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="truncate">
                    {place.officialAudit?.linkLabel ||
                      (place.officialSourceType === 'temple'
                        ? 'Official Temple Information'
                        : place.officialSourceType === 'heritage'
                        ? 'Official Heritage Information'
                        : place.officialSourceType === 'government'
                        ? 'Official Government Information'
                        : place.officialSourceType === 'tourism'
                        ? 'Official Tourism Information'
                        : place.officialSourceType === 'booking'
                        ? 'Booking Website'
                        : place.category === 'temple'
                        ? 'Official Temple Information'
                        : place.category === 'historic'
                        ? 'Official Heritage Information'
                        : 'Official Website')}
                  </span>
                  <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                </a>
                {place.officialAuthority || place.officialSourceLabel ? (
                  <span
                    className="text-[10px] text-stone-400 truncate max-w-[130px] hidden sm:inline text-right"
                    title={place.officialAuthority || place.officialSourceLabel}
                  >
                    {(place.officialAuthority || place.officialSourceLabel || '').split('(')[0].trim()}
                  </span>
                ) : null}
              </div>
            )}

            {/* NiVU AI link — heritage/historical places only */}
            {isEligibleForNivu && NIVU_AI_URL && (
              <a
                href={NIVU_AI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-stone-600 hover:text-stone-900 transition-colors"
                title={`Explore ${place.name} on NiVU AI`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Explore on NiVU AI</span>
                <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
              </a>
            )}
          </div>
        )}

        {/* Budget & Hours inline */}
        {(place.budget?.trim() || place.openingHours?.trim()) && (
          <div className="flex items-center justify-between text-[11px] text-stone-500 pb-3 mb-3 border-b border-stone-100">
            {place.budget?.trim() && <span className="font-medium text-stone-700 truncate max-w-[130px]">{place.budget}</span>}
            {place.openingHours?.trim() && <span className="truncate max-w-[130px]">{place.openingHours}</span>}
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => onViewDetails(place)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
