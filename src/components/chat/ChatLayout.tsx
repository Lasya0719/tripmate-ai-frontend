/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sparkles, Bookmark, Scale, Plus, ArrowLeft } from 'lucide-react';
import { ChatMessage, Conversation, ConversationContext, Hotel, Itinerary, Place, Restaurant, UserProfile, AnsweringMethod } from '../../types';
import { sendChatMessage, checkBackendConnection } from '../../services/api';
import { ChatSidebar } from './ChatSidebar';
import { ChatWelcome } from './ChatWelcome';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatComposer } from './ChatComposer';
import { PlaceDetailsModal } from '../modals/PlaceDetailsModal';
import { CompareModal } from '../modals/CompareModal';
import { SavedPlacesDrawer } from '../modals/SavedPlacesDrawer';
import { MyTripsModal } from '../modals/MyTripsModal';
import { DESTINATION_INTROS } from '../../data/destinations';
import { AppLanguage, getChatTranslations, localizeBackendError } from '../../services/language';

interface ChatLayoutProps {
  user: UserProfile | null;
  onNavigateHome: () => void;
  onOpenAiChat?: () => void;
  onLogout: () => void;
  initialPrompt?: string | null;
  selectedDestinationId?: string | null;
  onClearInitialPrompt?: () => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  user,
  onNavigateHome,
  onOpenAiChat,
  onLogout,
  initialPrompt,
  selectedDestinationId,
  onClearInitialPrompt,
}) => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-default-1',
      title: 'New Trip',
      destinationContext: 'Travel Discovery',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-default-1');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals state
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isMyTripsModalOpen, setIsMyTripsModalOpen] = useState<boolean>(false);

  // Saved entities
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);
  const [savedHotels, setSavedHotels] = useState<Hotel[]>([]);

  // Comparison tray
  const [comparePlaces, setComparePlaces] = useState<Place[]>([]);

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState<{ isConnected: boolean; message: string }>({
    isConnected: false,
    message: 'Checking...'
  });

  // Multilingual preference (English, Telugu, Hindi)
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tripmate_language');
      if (saved === 'te' || saved === 'hi' || saved === 'en') return saved;
    }
    return 'en';
  });

  const handleLanguageChange = (lang: AppLanguage) => {
    setSelectedLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tripmate_language', lang);
    }
  };

  // Answering method / style state (persisted per session)
  const [selectedAnsweringMethod, setSelectedAnsweringMethod] = useState<AnsweringMethod>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tripmate_answering_method');
      if (
        saved === 'simple_short' ||
        saved === 'detailed' ||
        saved === 'step_by_step' ||
        saved === 'formal' ||
        saved === 'friendly'
      ) {
        return saved;
      }
    }
    return 'detailed';
  });

  const handleAnsweringMethodChange = (method: AnsweringMethod) => {
    setSelectedAnsweringMethod(method);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tripmate_answering_method', method);
    }
  };

  const chatScrollEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const chatStrings = getChatTranslations(selectedLanguage);

  // Auto-scroll when messages update
  useEffect(() => {
    chatScrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading]);

  // Keep the connection indicator in sync when Flask is restarted.
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const result = await checkBackendConnection();
      if (active) setBackendStatus(result);
    };
    void refresh();
    const intervalId = window.setInterval(() => void refresh(), 10000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  // Sets of shown IDs and names to prevent repeats during "Show me more"
  const alreadyShownPlaceIds = new Set<string>();
  const alreadyShownPlaceNames = new Set<string>();
  const alreadyShownRestaurantIds = new Set<string>();
  const alreadyShownRestaurantNames = new Set<string>();

  activeConversation?.messages.forEach((msg) => {
    msg.recommendations?.places?.forEach((p) => {
      alreadyShownPlaceIds.add(p.id);
      alreadyShownPlaceNames.add(p.name);
    });
    msg.recommendations?.restaurants?.forEach((r) => {
      alreadyShownRestaurantIds.add(r.id);
      alreadyShownRestaurantNames.add(r.name);
    });
  });

  // Handle sending a message
  const handleSendMessage = async (text: string, options?: {
    accessibilityOnly?: boolean;
    language?: string;
    answeringMethod?: AnsweringMethod;
    retryPrevious?: boolean;
  }) => {
    if (!text.trim() || isLoading) return;

    const currentLang = options?.language || selectedLanguage;
    const currentMethod = options?.answeringMethod || selectedAnsweringMethod;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: currentLang
    };

    // Update conversation with user message immediately
    let retryUserIndex = -1;
    if (options?.retryPrevious) {
      for (let i = activeConversation.messages.length - 1; i >= 0; i--) {
        if (activeConversation.messages[i].role === 'user') {
          retryUserIndex = i;
          break;
        }
      }
    }
    const messageHistory = retryUserIndex >= 0
      ? activeConversation.messages.slice(0, retryUserIndex)
      : activeConversation.messages;
    const updatedMessages = [...messageHistory, userMsg];

    // Determine smart title if first message
    let newTitle = activeConversation.title;
    let newContext = activeConversation.destinationContext;
    if (activeConversation.messages.length === 0) {
      const lower = text.toLowerCase();
      if (lower.includes('kid') || lower.includes('children')) {
        newTitle = 'Places for Kids';
        newContext = 'Vijayawada · Child-Friendly';
      } else if (lower.includes('friend') || lower.includes('hangout')) {
        newTitle = 'Spots with Friends';
        newContext = 'Vijayawada · Hangouts & Outings';
      } else if (lower.includes('restaurant') || lower.includes('food') || lower.includes('eat') || lower.includes('dining')) {
        newTitle = 'Dining & Food';
        newContext = 'Vijayawada · Food & Dining';
      } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort')) {
        newTitle = 'Places to Stay';
        newContext = 'Vijayawada · Accommodations';
      } else if (lower.includes('vijayawada')) {
        newTitle = 'Vijayawada Trip';
        newContext = 'Vijayawada · Family & Accessible';
      } else if (lower.includes('araku')) {
        newTitle = 'Araku Valley Retreat';
        newContext = 'Araku Valley · Coffee Hills';
      } else if (lower.includes('vizag') || lower.includes('visakhapatnam')) {
        newTitle = 'Visakhapatnam Coastal Escape';
        newContext = 'Visakhapatnam · Ocean & Hills';
      } else if (lower.includes('gandikota')) {
        newTitle = 'Gandikota Canyon Trip';
        newContext = 'Gandikota · River Gorge';
      } else {
        newTitle = text.slice(0, 32) + (text.length > 32 ? '...' : '');
        newContext = 'Vijayawada · Travel Discovery';
      }
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              title: newTitle,
              destinationContext: newContext,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages
            }
          : c
      )
    );

    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        {
          message: text,
          conversation_id: activeConversationId,
          destination_context: newContext,
          language: currentLang,
          answering_method: currentMethod,
          history: updatedMessages.map((m) => {
            const recs: Array<{ name: string; source_type?: string; place_id?: number }> = [];
            if (m.recommendations?.places) {
              m.recommendations.places.forEach((p) => {
                recs.push({ name: p.name, source_type: 'place', place_id: typeof p.id === 'number' ? p.id : parseInt(String(p.id), 10) || undefined });
              });
            }
            if (m.recommendations?.restaurants) {
              m.recommendations.restaurants.forEach((r) => {
                recs.push({ name: r.name, source_type: 'restaurant', place_id: typeof r.id === 'number' ? r.id : parseInt(String(r.id), 10) || undefined });
              });
            }
            if (m.recommendations?.hotels) {
              m.recommendations.hotels.forEach((h) => {
                recs.push({ name: h.name, source_type: 'hotel', place_id: typeof h.id === 'number' ? h.id : parseInt(String(h.id), 10) || undefined });
              });
            }
            return {
              role: m.role,
              content: m.content,
              ...(recs.length > 0 ? { recommendations: recs } : {})
            };
          }),
          user_preferences: {
            accessibilityRequired: options?.accessibilityOnly,
            language: currentLang,
            answering_method: currentMethod,
          }
        },
        alreadyShownPlaceIds,
        alreadyShownPlaceNames,
        alreadyShownRestaurantIds,
        alreadyShownRestaurantNames,
        activeConversation?.context
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: response.recommendations,
        itinerary: response.itinerary,
        suggestedActions: response.suggestedActions,
        isBackendSource: response.isBackendSource,
        activeSubject: response.activeSubject,
        language: response.language || currentLang
      };

      // Update conversational context with active subjects and category
      const nextContext: ConversationContext = {
        ...(activeConversation?.context || {}),
        ...(response.activeSubject?.placeId
          ? {
              activePlaceId: response.activeSubject.placeId,
              activePlaceName: response.activeSubject.placeName
            }
          : {}),
        ...(response.activeSubject?.restaurantId
          ? {
              activeRestaurantId: response.activeSubject.restaurantId,
              activeRestaurantName: response.activeSubject.restaurantName
            }
          : {}),
        ...(response.lastCategory ? { lastCategory: response.lastCategory } : {})
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: [...c.messages, aiMsg],
                context: nextContext,
                updatedAt: new Date().toISOString()
              }
            : c
        )
      );
    } catch (err) {
      const errorText = localizeBackendError(err, currentLang);
      const status = await checkBackendConnection();
      setBackendStatus(status);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [chatStrings.retry, chatStrings.checkBackend],
        error: err instanceof Error ? err.message : 'Request failed',
        language: currentLang,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages: [...c.messages, errorMsg] }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastRequest = async (checkFirst = false) => {
    const lastUserMessage = [...activeConversation.messages]
      .reverse()
      .find((message) => message.role === 'user');
    if (!lastUserMessage) return;

    if (checkFirst) {
      const status = await checkBackendConnection();
      setBackendStatus(status);
      if (!status.isConnected) return;
    }

    await handleSendMessage(lastUserMessage.content, {
      language: lastUserMessage.language || selectedLanguage,
      retryPrevious: true,
    });
  };

  // Handle destination selection from inspirations
  const handleSelectDestination = (destId: string) => {
    const key = destId.toLowerCase().trim();
    const intro = DESTINATION_INTROS[key] || DESTINATION_INTROS[key.replace('-valley', '')] || DESTINATION_INTROS.vijayawada;

    const convId = `conv-${destId}-${Date.now()}`;
    const welcomeMsg: ChatMessage = {
      id: `intro-${destId}-${Date.now()}`,
      role: 'assistant',
      content: intro.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: intro.suggestedActions
    };

    const newConv: Conversation = {
      id: convId,
      title: intro.name,
      destinationContext: intro.contextTag,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [welcomeMsg],
      context: { lastCategory: 'destination_intro' }
    };

    setConversations((prev) => {
      if (prev.length === 1 && prev[0].messages.length === 0) {
        return [newConv];
      }
      return [newConv, ...prev];
    });
    setActiveConversationId(convId);
  };

  // If arriving with a selected destination or initial prompt from landing page
  useEffect(() => {
    if (selectedDestinationId) {
      handleSelectDestination(selectedDestinationId);
      onClearInitialPrompt?.();
    } else if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [selectedDestinationId, initialPrompt]);

  // Create new conversation
  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Journey',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
  };

  // Delete conversation
  const handleDeleteConversation = (id: string) => {
    if (conversations.length <= 1) return;
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeConversationId === id) {
      setActiveConversationId(remaining[0].id);
    }
  };

  // Place Details Modal
  const handleViewPlaceDetails = (place: Place) => {
    setSelectedPlace(place);
    setIsPlaceModalOpen(true);
  };

  // Toggle Save Place
  const handleToggleSavePlace = (place: Place) => {
    setSavedPlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) return prev.filter((p) => p.id !== place.id);
      return [...prev, place];
    });
  };

  // Toggle Save Restaurant
  const handleToggleSaveRestaurant = (restaurant: Restaurant) => {
    setSavedRestaurants((prev) => {
      const exists = prev.some((r) => r.id === restaurant.id);
      if (exists) return prev.filter((r) => r.id !== restaurant.id);
      return [...prev, restaurant];
    });
  };

  // Toggle Save Hotel
  const handleToggleSaveHotel = (hotel: Hotel) => {
    setSavedHotels((prev) => {
      const exists = prev.some((h) => h.id === hotel.id);
      if (exists) return prev.filter((h) => h.id !== hotel.id);
      return [...prev, hotel];
    });
  };

  // Toggle Compare
  const handleToggleComparePlace = (place: Place) => {
    setComparePlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) return prev.filter((p) => p.id !== place.id);
      if (prev.length >= 3) {
        // limit comparison to 3
        return [...prev.slice(1), place];
      }
      return [...prev, place];
    });
    setIsCompareModalOpen(true);
  };

  // Sets for quick lookup
  const savedPlaceIds = new Set(savedPlaces.map((p) => p.id));
  const savedRestaurantIds = new Set(savedRestaurants.map((r) => r.id));
  const savedHotelIds = new Set(savedHotels.map((h) => h.id));
  const comparePlaceIds = new Set(comparePlaces.map((p) => p.id));

  // Extract all generated itineraries across chats
  const allItineraries: Itinerary[] = [];
  conversations.forEach((conv) => {
    conv.messages.forEach((msg) => {
      if (msg.itinerary && !allItineraries.some((it) => it.id === msg.itinerary?.id)) {
        allItineraries.push(msg.itinerary);
      }
    });
  });

  return (
    <div className="flex h-screen w-full bg-stone-50 overflow-hidden text-stone-900">
      {/* Sidebar */}
      <ChatSidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        savedCount={savedPlaces.length + savedRestaurants.length + savedHotels.length}
        user={user}
        selectedLanguage={selectedLanguage}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSelectConversation={(id) => setActiveConversationId(id)}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenMyTrips={() => setIsMyTripsModalOpen(true)}
        onLogout={onLogout}
      />

      {/* Main Chat Workspace */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-6 bg-white border-b border-stone-200/80 flex items-center justify-between shrink-0 z-10 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 md:hidden"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Conversation Title and Context */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-stone-900 text-sm sm:text-base truncate">
                  {activeConversation.title}
                </h1>
                {activeConversation.destinationContext && (
                  <span className="hidden sm:inline-block text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 truncate">
                    {activeConversation.destinationContext}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            {/* Prominent Chat with TripMate button */}
            {onOpenAiChat && (
              <button
                type="button"
                onClick={onOpenAiChat}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors shadow-2xs"
                title="Switch to conversational AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chat with TripMate</span>
              </button>
            )}

            {/* Return to Landing Page */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title={chatStrings.viewLandingPage}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{chatStrings.landingPage}</span>
            </button>

            {/* Compare tray button */}
            {comparePlaces.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{chatStrings.compare} ({comparePlaces.length})</span>
              </button>
            )}

            {/* Saved quick trigger */}
            <button
              type="button"
              onClick={() => setIsSavedDrawerOpen(true)}
              className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title={chatStrings.viewSavedPlaces}
            >
              <Bookmark className="w-4 h-4" />
              {savedPlaces.length + savedRestaurants.length + savedHotels.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-600" />
              )}
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {activeConversation.messages.length === 0 ? (
            <ChatWelcome
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              onSelectDestination={handleSelectDestination}
              selectedLanguage={selectedLanguage}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {activeConversation.messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  savedPlaceIds={savedPlaceIds}
                  savedRestaurantIds={savedRestaurantIds}
                  savedHotelIds={savedHotelIds}
                  comparePlaceIds={comparePlaceIds}
                  onViewPlaceDetails={handleViewPlaceDetails}
                  onToggleSavePlace={handleToggleSavePlace}
                  onToggleSaveRestaurant={handleToggleSaveRestaurant}
                  onToggleSaveHotel={handleToggleSaveHotel}
                  onToggleComparePlace={handleToggleComparePlace}
                  onSelectActionPrompt={(prompt) => {
                    const messageStrings = getChatTranslations(msg.language);
                    if (msg.error) {
                      if (prompt === messageStrings.retry) {
                        void retryLastRequest();
                      } else if (prompt === messageStrings.checkBackend) {
                        void retryLastRequest(true);
                      }
                      return;
                    }
                    void handleSendMessage(prompt, { language: selectedLanguage });
                  }}
                />
              ))}

              {/* Typing / Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 my-4 animate-in fade-in duration-200 text-left">
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs text-xs text-stone-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-stone-600 font-medium">{chatStrings.loading}</span>
                  </div>
                </div>
              )}

              <div ref={chatScrollEndRef} />
            </div>
          )}
        </div>

        {/* Pinned Message Composer */}
        <ChatComposer
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedAnsweringMethod={selectedAnsweringMethod}
          onAnsweringMethodChange={handleAnsweringMethodChange}
        />
      </div>

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlace}
        isOpen={isPlaceModalOpen}
        isSaved={selectedPlace ? savedPlaceIds.has(selectedPlace.id) : false}
        onClose={() => setIsPlaceModalOpen(false)}
        onToggleSave={handleToggleSavePlace}
        onAskTripMate={(question) => {
          setIsPlaceModalOpen(false);
          void handleSendMessage(question, { language: selectedLanguage });
        }}
      />

      {/* Compare Modal */}
      <CompareModal
        places={comparePlaces}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={(id) => setComparePlaces((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setComparePlaces([])}
      />

      {/* Saved Places Drawer */}
      <SavedPlacesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlaces={savedPlaces}
        savedRestaurants={savedRestaurants}
        savedHotels={savedHotels}
        onRemovePlace={(id) => setSavedPlaces((prev) => prev.filter((p) => p.id !== id))}
        onRemoveRestaurant={(id) => setSavedRestaurants((prev) => prev.filter((r) => r.id !== id))}
        onRemoveHotel={(id) => setSavedHotels((prev) => prev.filter((h) => h.id !== id))}
        onSelectPlace={(p) => {
          setSelectedPlace(p);
          setIsPlaceModalOpen(true);
        }}
      />

      {/* My Trips Modal */}
      <MyTripsModal
        isOpen={isMyTripsModalOpen}
        onClose={() => setIsMyTripsModalOpen(false)}
        itineraries={allItineraries}
        onSelectItinerary={(itin) => {
          // Send request into chat to focus on this itinerary
          handleSendMessage(`Show me the full breakdown of ${itin.title}`);
        }}
      />
    </div>
  );
};
