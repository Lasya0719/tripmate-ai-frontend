/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Globe, MapPin, Star, Utensils } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSaved?: boolean;
  onToggleSave: (restaurant: Restaurant) => void;
  onSelect?: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    restaurant.name + ', ' + restaurant.location + ', ' + restaurant.city
  )}&travelmode=driving`;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden text-left">
      {/* Cuisine Icon Header — no photos */}
      <div className="relative h-14 w-full bg-gradient-to-br from-amber-50 to-stone-50 flex items-center justify-between px-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-amber-400" />
          {restaurant.cuisine.trim() && (
            <span className="text-[11px] font-semibold tracking-wide uppercase text-stone-500">
              {restaurant.cuisine}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(restaurant);
          }}
          title={isSaved ? 'Saved to collection' : 'Save restaurant'}
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
          <h4 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
            {restaurant.name}
          </h4>
          <div className="flex items-center gap-1.5 shrink-0">
            {restaurant.priceRange.trim() && <span className="text-xs font-semibold text-stone-700">{restaurant.priceRange}</span>}
            {restaurant.rating && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <div className="flex items-center gap-0.5 text-xs font-semibold text-stone-800">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {(restaurant.location.trim() || restaurant.city.trim()) && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
            <span className="truncate">{[restaurant.location, restaurant.city].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {restaurant.description.trim() && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3 flex-1">
            {restaurant.description}
          </p>
        )}

        {restaurant.specialties && restaurant.specialties.length > 0 && (
          <div className="text-[11px] text-stone-500 mb-3 truncate">
            <span className="font-medium text-stone-700">Specialties: </span>
            {restaurant.specialties.join(', ')}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(restaurant)}
              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>View Menu</span>
            </button>
          ) : restaurant.openingHours?.trim() ? (
            <div className="text-[11px] text-stone-500">{restaurant.openingHours}</div>
          ) : <span />}
          <div className="flex items-center gap-1.5 shrink-0">
            {restaurant.officialUrl && restaurant.officialSourceType !== 'unavailable' && (
              <a
                href={restaurant.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={restaurant.officialSourceLabel || 'Official Website'}
                className="inline-flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <Globe className="w-3 h-3" />
                <span>Official</span>
              </a>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
