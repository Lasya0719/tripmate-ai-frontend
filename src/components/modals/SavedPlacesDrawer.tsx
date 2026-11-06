/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Bookmark, Trash2, ExternalLink, MapPin } from 'lucide-react';
import { Hotel, Place, Restaurant } from '../../types';

interface SavedPlacesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: Place[];
  savedRestaurants: Restaurant[];
  savedHotels: Hotel[];
  onRemovePlace: (id: string) => void;
  onRemoveRestaurant: (id: string) => void;
  onRemoveHotel: (id: string) => void;
  onSelectPlace: (place: Place) => void;
}

export const SavedPlacesDrawer: React.FC<SavedPlacesDrawerProps> = ({
  isOpen,
  onClose,
  savedPlaces,
  savedRestaurants,
  savedHotels,
  onRemovePlace,
  onRemoveRestaurant,
  onRemoveHotel,
  onSelectPlace,
}) => {
  if (!isOpen) return null;

  const totalSaved = savedPlaces.length + savedRestaurants.length + savedHotels.length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-700" />
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Saved Collection
              </h3>
              <p className="text-xs text-stone-500">
                {totalSaved} {totalSaved === 1 ? 'item' : 'items'} saved for your trips
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

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {totalSaved === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-medium text-stone-600">Your collection is empty</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Save places, dining spots, or hotels from your conversations to view them here anytime.
              </p>
            </div>
          ) : (
            <>
              {/* Places */}
              {savedPlaces.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Places & Attractions ({savedPlaces.length})
                  </h4>
                  <div className="space-y-2.5">
                    {savedPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200/80 hover:border-amber-300 transition-colors bg-white group cursor-pointer"
                        onClick={() => onSelectPlace(place)}
                      >
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 bg-stone-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-stone-900 truncate group-hover:text-amber-800">
                            {place.name}
                          </h5>
                          <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{place.city}</span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{place.category}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePlace(place.id);
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurants */}
              {savedRestaurants.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Dining ({savedRestaurants.length})
                  </h4>
                  <div className="space-y-2.5">
                    {savedRestaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200/80 bg-white"
                      >
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 bg-stone-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-stone-900 truncate">
                            {restaurant.name}
                          </h5>
                          <div className="text-xs text-stone-500 mt-0.5 truncate">
                            {restaurant.cuisine} · {restaurant.priceRange}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveRestaurant(restaurant.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels */}
              {savedHotels.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Hotels & Stays ({savedHotels.length})
                  </h4>
                  <div className="space-y-2.5">
                    {savedHotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200/80 bg-white"
                      >
                        <img
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 bg-stone-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-stone-900 truncate">
                            {hotel.name}
                          </h5>
                          <div className="text-xs text-stone-500 mt-0.5 truncate">
                            {hotel.pricePerNight} · {hotel.city}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveHotel(hotel.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
