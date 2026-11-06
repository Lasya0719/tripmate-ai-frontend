/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Search,
  MessageSquare,
  Bookmark,
  Map,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { Conversation, UserProfile } from '../../types';
import { AppLanguage, getChatTranslations } from '../../services/language';

interface ChatSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string;
  savedCount: number;
  user: UserProfile | null;
  selectedLanguage: AppLanguage;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onOpenSavedDrawer: () => void;
  onOpenMyTrips: () => void;
  onLogout: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isCollapsed,
  isMobileOpen,
  conversations,
  activeConversationId,
  savedCount,
  user,
  selectedLanguage,
  onToggleCollapse,
  onCloseMobile,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onOpenSavedDrawer,
  onOpenMyTrips,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const strings = getChatTranslations(selectedLanguage);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some((message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-stone-900 text-stone-300 transition-all duration-300 ease-in-out border-r border-stone-800 ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        {/* Top Header: Brand & Collapse Toggle */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-800">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div className="leading-none">
                <span className="font-serif-display text-lg font-bold tracking-tight text-white block">
                  TripMate
                </span>
                <span className="text-[10px] tracking-wider text-amber-300 uppercase font-medium">
                  {strings.travelCompanion}
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title={isCollapsed ? strings.expandSidebar : strings.collapseSidebar}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Action: New Chat */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs sm:text-sm transition-all shadow-xs ${
              isCollapsed ? 'md:px-0' : ''
            }`}
            title={strings.startNewChat}
          >
            <Plus className="w-4 h-4 text-amber-700" />
            {!isCollapsed && <span>{strings.newConversation}</span>}
          </button>
        </div>

        {/* Search bar (when expanded) */}
        {!isCollapsed && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder={strings.searchConversations}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-800/80 text-stone-200 placeholder:text-stone-500 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
          </div>
        )}

        {/* Middle Navigation & Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 py-2">
          {/* Quick Shortcuts */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={onOpenSavedDrawer}
              className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
              title={strings.savedPlaces}
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-400" />
                {!isCollapsed && <span>{strings.savedPlaces}</span>}
              </div>
              {!isCollapsed && savedCount > 0 && (
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenMyTrips}
              className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={strings.myTripsTitle}
            >
              <Map className="w-4 h-4 text-emerald-400" />
              {!isCollapsed && <span>{strings.myTrips}</span>}
            </button>

          </div>

          {/* Recent Conversations */}
          {!isCollapsed && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                {strings.recentChats}
              </div>
              {filteredConversations.length === 0 ? (
                <div className="px-2 py-4 text-xs text-stone-500">
                  {searchQuery ? strings.noMatchingConversations : strings.noChats}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          onSelectConversation(conv.id);
                          onCloseMobile();
                        }}
                        className={`group relative flex items-center justify-between py-2 px-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-stone-800 text-white font-medium'
                            : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                          <span className="truncate">{conv.title}</span>
                        </div>
                        {conversations.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conv.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-rose-400 transition-opacity"
                            title={strings.deleteConversation}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile at Bottom */}
        <div className="p-3 border-t border-stone-800">
          <div
            className={`flex items-center justify-between p-2 rounded-xl bg-stone-800/60 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center shrink-0 text-stone-300">
                <UserIcon className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {user?.isGuest ? strings.guestTraveler : user?.name || strings.guestTraveler}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate">
                    {user?.isGuest ? strings.guestSession : user?.email}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-700 transition-colors"
                title={strings.logOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
