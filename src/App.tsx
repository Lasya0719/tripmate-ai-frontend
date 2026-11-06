/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { ChatLayout } from './components/chat/ChatLayout';
import { TripMateOpenChat } from './components/chat/TripMateOpenChat';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'chat' | 'open-chat'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('tripmate_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

  // Sync user profile to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('tripmate_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripmate_user_profile');
    }
  }, [user]);

  const handleStartPlanning = (prompt?: string, destinationId?: string) => {
    if (destinationId) {
      setSelectedDestinationId(destinationId);
      setInitialPrompt(null);
    } else if (prompt) {
      setInitialPrompt(prompt);
      setSelectedDestinationId(null);
    }
    // If already logged in, jump straight to chat
    if (user) {
      setCurrentView('chat');
    } else {
      setAuthMode('signup');
      setCurrentView('auth');
    }
  };

  const handleOpenAiChat = (prompt?: string) => {
    if (prompt) {
      setInitialPrompt(prompt);
    }
    setCurrentView('open-chat');
  };

  const handleNavigateLogin = () => {
    setAuthMode('login');
    setCurrentView('auth');
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900">
      {currentView === 'landing' && (
        <LandingPage
          onStartPlanning={handleStartPlanning}
          onOpenChat={() => handleOpenAiChat()}
          onNavigateLogin={handleNavigateLogin}
        />
      )}

      {currentView === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onAuthSuccess={handleAuthSuccess}
          onNavigateHome={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'chat' && (
        <ChatLayout
          user={user}
          initialPrompt={initialPrompt}
          selectedDestinationId={selectedDestinationId}
          onClearInitialPrompt={() => {
            setInitialPrompt(null);
            setSelectedDestinationId(null);
          }}
          onNavigateHome={() => setCurrentView('landing')}
          onOpenAiChat={() => handleOpenAiChat()}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'open-chat' && (
        <TripMateOpenChat
          onNavigatePlaceDiscovery={() => setCurrentView('chat')}
          onNavigateHome={() => setCurrentView('landing')}
          initialPrompt={initialPrompt}
        />
      )}
    </div>
  );
}
