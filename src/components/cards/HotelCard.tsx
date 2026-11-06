/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Hotel as HotelIcon, MapPin, Star, Check } from 'lucide-react';
import { Hotel } from '../../types';

interface HotelCardProps {
  hotel: Hotel;
  isSaved?: boolean;
  onToggleSave: (hotel: Hotel) => void;
  onSelect?: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    hotel.name + ', ' + hotel.location + ', ' + hotel.city
  )}&travelmode=driving`;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden text-left">
      {/* Hotel Icon Header — no photos */}
      <div className="relative h-14 w-full bg-gradient-to-br from-stone-50 to-blue-50/30 flex items-center justify-between px-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <HotelIcon className="w-5 h-5 text-stone-400" />
          <span className="text-[11px] font-semibold tracking-wide uppercase text-stone-500">
            {hotel.category} stay
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(hotel);
          }}
          title={isSaved ? 'Saved to collection' : 'Save hotel'}
          className={`p-1.5 rounded-full transition-colors ${
            isSaved
              ? 'bg-amber-600 text-white'
              : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200'
          }`}
        >
          {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
            {hotel.name}
          </h4>
          {hotel.rating && (
            <div className="flex items-center gap-1 text-xs font-semibold text-stone-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{hotel.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {(hotel.location.trim() || hotel.city.trim()) && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
            <span className="truncate">{[hotel.location, hotel.city].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {hotel.description.trim() && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3 flex-1">
            {hotel.description}
          </p>
        )}

        {/* Price & Amenities preview */}
        {hotel.pricePerNight.trim() && (
          <div className="flex items-baseline justify-between mb-3 text-xs">
            <span className="font-semibold text-stone-900 text-sm">{hotel.pricePerNight}</span>
            <span className="text-stone-400 text-[11px]">per night</span>
          </div>
        )}

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-stone-500 mb-3 line-clamp-1">
            {hotel.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="inline-flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
          {hotel.officialUrl && hotel.officialSourceType !== 'unavailable' ? (
            <a
              href={hotel.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={hotel.officialAuthority || hotel.officialSourceLabel || 'Official Hotel Booking Website'}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
            >
              <HotelIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>{hotel.officialSourceLabel || 'Booking Website'}</span>
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </a>
          ) : onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(hotel)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
            >
              <HotelIcon className="w-3.5 h-3.5" />
              <span>View Rooms</span>
            </button>
          ) : hotel.accessibility?.notes?.trim() ? (
            <div className="text-[11px] text-stone-500 truncate max-w-[150px]">
              {hotel.accessibility.notes}
            </div>
          ) : <span />}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
