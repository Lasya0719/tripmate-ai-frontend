/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Map,
  ShieldCheck,
  HeartHandshake,
  Sliders,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { DESTINATION_INSPIRATIONS } from '../../data/destinations';
import { DestinationInspiration } from '../../types';

interface LandingPageProps {
  onStartPlanning: (initialPrompt?: string, selectedDestinationId?: string) => void;
  onOpenChat: () => void;
  onNavigateLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onOpenChat,
  onNavigateLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDestinationClick = (dest: DestinationInspiration) => {
    onStartPlanning(undefined, dest.id);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-white block leading-none">
                TripMate
              </span>
              <span className="text-[10px] tracking-widest text-amber-300 uppercase font-medium">
                Intelligent Travel
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
            <a href="#destinations" className="hover:text-white transition-colors">
              Explore
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#why-tripmate" className="hover:text-white transition-colors">
              Why TripMate
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
          </div>

          {/* Auth & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full text-sm font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Chat with TripMate</span>
            </button>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-sm font-medium text-stone-300 hover:text-white px-3 py-2 transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => onStartPlanning()}
              className="py-2.5 px-5 rounded-full text-sm font-semibold bg-white text-stone-900 hover:bg-amber-500 hover:text-stone-950 transition-all shadow-sm"
            >
              Start Planning
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900 px-4 pt-2 pb-6 space-y-3 border-b border-stone-800">
            <a
              href="#destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-stone-300 hover:text-white"
            >
              Explore Destinations
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-stone-300 hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#why-tripmate"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-stone-300 hover:text-white"
            >
              Why TripMate
            </a>
            <div className="pt-4 border-t border-stone-800 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Chat with TripMate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateLogin();
                }}
                className="w-full py-2.5 rounded-xl border border-stone-700 text-stone-200 text-sm font-medium"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartPlanning();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold"
              >
                Start Planning
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Full-width scenic background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85"
            alt="Breathtaking mountain valley"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-stone-950/50 backdrop-brightness-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/60 backdrop-blur-md text-amber-300 text-xs font-medium tracking-wide mb-6 border border-stone-700/60">
            <span>Intelligent Companion</span>
            <span aria-hidden="true">·</span>
            <span>Tailored Journeys</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto">
            Your next journey, thoughtfully planned.
          </h1>

          <p className="mt-6 text-base sm:text-xl text-stone-200 max-w-2xl mx-auto font-normal leading-relaxed">
            Tell us what you love, where you want to go and how you want to travel. TripMate helps turn your ideas into personalised travel experiences.
          </p>

          {/* Dual CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenChat}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-base font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              <span>Chat with TripMate</span>
            </button>
            <button
              type="button"
              onClick={() => onStartPlanning()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-base font-semibold bg-white text-stone-950 hover:bg-amber-400 hover:text-stone-950 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#destinations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-base font-semibold bg-stone-900/60 hover:bg-stone-900/90 text-stone-100 backdrop-blur-md border border-white/20 transition-all"
            >
              <span>Explore Destinations</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Destination Discovery Section */}
      <section id="destinations" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-800">
            Inspiration & Escapes
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight mt-2">
            Find inspiration for your next escape.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Visual inspiration examples from mist-veiled mountain valleys to grand sandstone canyons and sacred riverbanks. Click any destination to begin planning with TripMate.
          </p>
        </div>

        {/* Editorial Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATION_INSPIRATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleDestinationClick(dest)}
              className="group relative flex flex-col rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Photo */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />

                {/* State Tag */}
                <div className="absolute top-4 left-4 text-xs font-medium text-white/90 drop-shadow-xs">
                  {dest.state}
                </div>

                {/* Bottom title on photo */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                    {dest.travelStyle}
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold leading-tight">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-800 mb-1.5">
                    {dest.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">
                    Best Season: <span className="text-stone-800">{dest.bestSeason}</span>
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                    <span>Plan this</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How TripMate Works Section */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">
              Effortless Planning
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white">
              How TripMate works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
              Three seamless steps from initial curiosity to your fully coordinated itinerary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-stone-800/60 border border-stone-700/80 flex flex-col items-start relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-2">
                Step 01
              </div>
              <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white mb-3">
                Tell us about your trip
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Chat naturally about who is traveling, dates, pacing preferences, and accessibility constraints like avoiding steep stairs or requiring elevators.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-stone-800/60 border border-stone-700/80 flex flex-col items-start relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-2">
                Step 02
              </div>
              <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white mb-3">
                Discover personalised recommendations
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Receive interactive cards for attractions, dining, and boutique stays vetted for verified budget, opening hours, and real accessibility ratings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-stone-800/60 border border-stone-700/80 flex flex-col items-start relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6">
                <Map className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-2">
                Step 03
              </div>
              <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white mb-3">
                Build your perfect itinerary
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Experience an interactive chronological timeline with morning, afternoon, and evening recommendations that you can adjust conversationally anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why TripMate Section */}
      <section id="why-tripmate" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-800">
              Thoughtful Travel Tech
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Why TripMate makes travel planning effortless.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              We replace cookie-cutter travel blogs and overwhelmed search queries with a calm, discerning conversation tailored precisely to your family's needs.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-800 w-fit">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Personalised Travel Planning</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Tailored for families, couples, solo wanderers, and seniors with specific accessibility considerations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-800 w-fit">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">AI-Powered Conversations</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Ask follow-up questions, adjust paces, swap dining spots, and refine details in natural, everyday language.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-800 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Place Recommendations</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Verified opening hours, ticket budgets, and wheelchair/elevator assessments for each location.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-800 w-fit">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Flexible Itineraries</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Dynamic day-by-day timelines that you can modify, print, or share with fellow travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-stone-900 to-stone-950 text-white text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">
            Begin Your Story
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Your journey begins with a conversation.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Whether you are organizing a tranquil family escape in Vijayawada or a scenic weekend along the coast, let's craft something memorable.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => onStartPlanning()}
              className="inline-flex items-center gap-2 py-4 px-9 rounded-full text-base font-semibold bg-white text-stone-950 hover:bg-amber-400 transition-all shadow-xl hover:-translate-y-0.5"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-stone-950 text-stone-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-serif-display text-xl font-bold text-white">
              TripMate
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <a href="#about" className="hover:text-stone-200 transition-colors">About</a>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => onStartPlanning()} className="hover:text-stone-200 transition-colors">Start Planning</button>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-200 cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-200 cursor-pointer">Terms and Conditions</span>
          </div>

          <div className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} TripMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
