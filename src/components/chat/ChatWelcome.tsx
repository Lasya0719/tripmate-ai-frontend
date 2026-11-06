/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Users, Sparkles, HeartHandshake, Wallet, Mountain, ArrowRight } from 'lucide-react';
import { DESTINATION_INSPIRATIONS } from '../../data/destinations';
import { AppLanguage, getChatTranslations } from '../../services/language';

interface ChatWelcomeProps {
  onSelectPrompt: (prompt: string) => void;
  onSelectDestination?: (destId: string) => void;
  selectedLanguage: AppLanguage;
}

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onSelectPrompt, onSelectDestination, selectedLanguage }) => {
  const strings = getChatTranslations(selectedLanguage);
  const suggestions = [
    {
      title: 'Plan a weekend getaway',
      icon: Compass,
      prompt: 'Plan a weekend getaway to a scenic destination with relaxed pacing and good food.'
    },
    {
      title: 'Explore places near me',
      icon: Mountain,
      prompt: 'Explore scenic cultural and nature places near Andhra Pradesh for a short break.'
    },
    {
      title: 'Plan a family vacation',
      icon: Users,
      prompt: 'Plan a family vacation with activities suitable for both kids and adults.'
    },
    {
      title: 'Find peaceful destinations',
      icon: Sparkles,
      prompt: 'Recommend tranquil, peaceful hill stations with mist, coffee plantations, and calm stays.'
    },
    {
      title: 'Create a budget-friendly trip',
      icon: Wallet,
      prompt: 'Create a budget-friendly 3-day itinerary with affordable stays and scenic public viewpoints.'
    },
    {
      title: 'Plan a trip for senior citizens',
      icon: HeartHandshake,
      prompt: 'Plan a comfortable temple and cultural trip for senior citizens with priority elevators and minimal stair climbing.'
    }
  ];
  const localizedSuggestions = selectedLanguage === 'te'
    ? [
      ['వారాంతపు విహారయాత్రను ప్లాన్ చేయండి', 'ఆహ్లాదకరమైన ప్రదేశంలో విశ్రాంతిగా, మంచి భోజనంతో వారాంతపు యాత్రను ప్లాన్ చేయండి.'],
      ['సందర్శించడానికి ప్రదేశాలు', 'విజయవాడలో సందర్శించడానికి ప్రదేశాలను సూచించండి.'],
      ['కుటుంబ విహారం', 'పిల్లలు మరియు పెద్దలకు సరిపోయే కుటుంబ యాత్రను ప్లాన్ చేయండి.'],
      ['ప్రశాంతమైన ప్రదేశాలు', 'విజయవాడలో ప్రశాంతమైన ప్రదేశాలను సూచించండి.'],
      ['బడ్జెట్ యాత్ర', 'ధరల వివరాలు నమోదు చేసిన బడ్జెట్‌కు సరిపోయే ప్రదేశాలను సూచించండి.'],
      ['వృద్ధులకు అనుకూలమైన యాత్ర', 'వృద్ధులకు తక్కువ నడక, తక్కువ మెట్లు ఉండే ప్రదేశాలను సూచించండి.'],
    ]
    : selectedLanguage === 'hi'
      ? [
        ['सप्ताहांत की यात्रा', 'आरामदायक गति और अच्छे भोजन के साथ सप्ताहांत की यात्रा सुझाएँ।'],
        ['घूमने की जगहें', 'विजयवाड़ा में घूमने की जगहें सुझाएँ।'],
        ['परिवार की छुट्टी', 'बच्चों और वयस्कों के लिए उपयुक्त पारिवारिक यात्रा सुझाएँ।'],
        ['शांत जगहें', 'विजयवाड़ा में शांत जगहें सुझाएँ।'],
        ['बजट यात्रा', 'दर्ज कीमतों के आधार पर बजट के अनुकूल जगहें सुझाएँ।'],
        ['वरिष्ठ नागरिकों की यात्रा', 'वरिष्ठ नागरिकों के लिए कम चलने और कम सीढ़ियों वाली जगहें सुझाएँ।'],
      ]
      : suggestions.map(({ title, prompt }) => [title, prompt]);

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 text-center">
      {/* Brand Kicker */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium mb-4">
        <span>TripMate</span>
        <span aria-hidden="true">·</span>
        <span className="text-amber-800">{selectedLanguage === 'te' ? 'వ్యక్తిగత ప్రయాణ ప్రణాళిక' : selectedLanguage === 'hi' ? 'व्यक्तिगत यात्रा योजना' : 'Personalised Travel Planning'}</span>
      </div>

      {/* Main Heading */}
      <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
        {strings.emptyTitle}
      </h2>

      {/* Supporting Text */}
      <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
        {strings.emptyDescription}
      </p>

      {/* 6 Clickable Prompt Suggestions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
        {localizedSuggestions.map(([title, prompt], idx) => {
          const item = suggestions[idx];
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="group p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-stone-100 text-stone-700 group-hover:bg-amber-100/70 group-hover:text-amber-800 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="font-semibold text-stone-800 text-sm group-hover:text-amber-900 transition-colors">
                {title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Destination Inspiration Links */}
      <div className="mt-10 pt-8 border-t border-stone-200/80 text-left">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
          {strings.featuredInspirations}
        </h4>
        <div className="flex flex-wrap gap-2">
          {DESTINATION_INSPIRATIONS.map((dest) => (
            <button
              key={dest.id}
              type="button"
              onClick={() => {
                if (onSelectDestination) {
                  onSelectDestination(dest.id);
                } else {
                  onSelectPrompt(dest.suggestedPrompt || `Explore ${dest.name}`);
                }
              }}
              className="py-1.5 px-3 rounded-xl bg-stone-100/80 hover:bg-white border border-stone-200 hover:border-amber-300 text-xs font-medium text-stone-700 hover:text-stone-900 transition-all shadow-2xs"
            >
              {dest.name} ({dest.travelStyle.split('&')[0].trim()})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
