/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowUp,
  Mic,
  MicOff,
  Globe,
  Compass,
  ArrowLeft,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  Coffee
} from 'lucide-react';
import { sendChatMessage } from '../../services/api';
import { AppLanguage, getChatTranslations, speechLanguageCode } from '../../services/language';
import { StructuredResponseRenderer } from './StructuredResponseRenderer';
import { PlaceCard } from '../cards/PlaceCard';
import { RestaurantCard } from '../cards/RestaurantCard';
import { HotelCard } from '../cards/HotelCard';
import { PlaceDetailsModal } from '../modals/PlaceDetailsModal';
import { RecommendationSet, Place, Restaurant, Hotel, Itinerary, AnsweringMethod } from '../../types';
import { AnsweringMethodSelector } from './AnsweringMethodSelector';

interface OpenChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  language?: string;
  suggestedActions?: string[];
  recommendations?: RecommendationSet;
  itinerary?: Itinerary;
}

interface TripMateOpenChatProps {
  onNavigatePlaceDiscovery: () => void;
  onNavigateHome: () => void;
  initialPrompt?: string | null;
}

const INSPIRATION_QUESTIONS: Record<AppLanguage, string[]> = {
  en: [
    'What should I consider before planning a family trip?',
    'Suggest three famous tourist places in Vijayawada.',
    'Which of these places is suitable for elderly people?',
    'What if one person cannot walk for long distances?',
    'What restaurants are nearby the Kanaka Durga temple?',
    'Plan a one-day trip in Vijayawada within ₹2,000.',
  ],
  te: [
    'కుటుంబంతో ప్రయాణం ప్లాన్ చేయడానికి ఏం గుర్తుంచుకోవాలి?',
    'విజయవాడలో 3 ప్రసిద్ధ పర్యాటక ప్రదేశాలు చెప్పండి.',
    'వీటిలో వృద్ధులకు అనువైన ప్రదేశం ఏది?',
    'ఒకరికి ఎక్కువ నడవడం కష్టమైతే ఎలా ప్లాన్ చేయాలి?',
    'కనకదుర్గ గుడి సమీపంలో మంచి భోజనం ఎక్కడ దొరుకుతుంది?',
    'విజయవాడలో ఒక రోజు ప్రయాణ ప్రణాళిక ఇవ్వండి.',
  ],
  hi: [
    'पारिवारिक यात्रा की योजना बनाते समय क्या ध्यान रखें?',
    'विजयवाड़ा में 3 प्रसिद्ध पर्यटन स्थल बताइए।',
    'इनमें से बुजुर्गों के लिए कौन सी जगह सबसे अच्छी है?',
    'यदि किसी को ज्यादा चलने में परेशानी हो तो कैसे घूमें?',
    'कनक दुर्गा मंदिर के पास अच्छे रेस्तरां कौन से हैं?',
    'विजयवाड़ा में एक दिन की यात्रा योजना बनाएं।',
  ],
};

export const TripMateOpenChat: React.FC<TripMateOpenChatProps> = ({
  onNavigatePlaceDiscovery,
  onNavigateHome,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<OpenChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<Place | null>(null);
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set());
  const [savedRestaurantIds, setSavedRestaurantIds] = useState<Set<string>>(new Set());
  const [comparePlaceIds, setComparePlaceIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tripmate_language');
      if (saved === 'te' || saved === 'hi' || saved === 'en') return saved;
    }
    return 'en';
  });
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputBeforeListeningRef = useRef<string>('');

  const strings = getChatTranslations(selectedLanguage);

  // Auto-scroll on new message
  useEffect(() => {
    chatScrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Clean up Speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        recognitionRef.current?.abort();
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  // Handle initial prompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      void handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleLanguageChange = (lang: AppLanguage) => {
    setSelectedLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tripmate_language', lang);
    }
    if (isListening) {
      stopVoiceInput();
    }
  };

  const startVoiceInput = () => {
    const speechWindow = window as any;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(strings.unsupportedSpeechRecognition);
      return;
    }

    setVoiceError(null);
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      inputBeforeListeningRef.current = input;
      recognition.lang = speechLanguageCode(selectedLanguage);
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item && item[0] && item[0].transcript) {
            fullTranscript += item[0].transcript;
          }
        }
        if (fullTranscript.trim()) {
          const previous = inputBeforeListeningRef.current ? inputBeforeListeningRef.current.trimEnd() + ' ' : '';
          setInput(previous + fullTranscript.trimStart());
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setVoiceError(strings.microphoneDenied);
        } else if (event.error === 'no-speech') {
          setVoiceError(strings.noSpeech);
        } else if (event.error === 'network') {
          setVoiceError(strings.speechNetworkError);
        } else {
          setVoiceError(strings.speechInputError);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError(strings.speechStartError);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleToggleSpeech = (id: string, text: string, lang?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;

    if (speakingId === id) {
      synth.cancel();
      setSpeakingId(null);
      return;
    }

    synth.cancel();
    const cleanText = text
      .replace(/https?:\/\/[^\s)]+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*_~`>]/g, ' ')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechLanguageCode(lang || selectedLanguage);
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    synth.speak(utterance);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    if (isListening) {
      stopVoiceInput();
    }

    const userMsgId = `user-${Date.now()}`;
    const userMsg: OpenChatMessage = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsLoading(true);

    try {
      // Build conversation history for follow-ups and track shown items
      const shownPlaceIds = new Set<string>();
      const shownPlaceNames = new Set<string>();
      const shownRestaurantIds = new Set<string>();
      const shownRestaurantNames = new Set<string>();

      const historyPayload = newMessages.map((m) => {
        const recs: Array<{ name: string; source_type?: string; place_id?: number }> = [];
        if (m.recommendations?.places) {
          m.recommendations.places.forEach((p) => {
            shownPlaceIds.add(p.id);
            shownPlaceNames.add(p.name);
            recs.push({ name: p.name, source_type: 'place', place_id: typeof p.id === 'number' ? p.id : parseInt(String(p.id), 10) || undefined });
          });
        }
        if (m.recommendations?.restaurants) {
          m.recommendations.restaurants.forEach((r) => {
            shownRestaurantIds.add(r.id);
            shownRestaurantNames.add(r.name);
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
      });

      const res = await sendChatMessage(
        {
          message: trimmed,
          language: selectedLanguage,
          answering_method: selectedAnsweringMethod,
          history: historyPayload as any,
        },
        shownPlaceIds,
        shownPlaceNames,
        shownRestaurantIds,
        shownRestaurantNames
      );

      const assistantMsg: OpenChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.isBackendSource ? 'Verified Records' : 'Gemini AI',
        language: res.language || selectedLanguage,
        suggestedActions: res.suggestedActions || [],
        recommendations: res.recommendations,
        itinerary: res.itinerary,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: OpenChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          selectedLanguage === 'te'
            ? 'క్షమించండి, అభ్యర్థనను పూర్తి చేయడంలో లోపం ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
            : selectedLanguage === 'hi'
            ? 'क्षमा करें, अनुरोध पूरा करने में समस्या आई। कृपया पुनः प्रयास करें।'
            : 'I could not complete your travel request right now. Please check the backend connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage(input);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-stone-50 text-stone-900 overflow-hidden font-sans">
      {/* Top Header Navigation */}
      <header className="h-16 px-4 sm:px-6 bg-white border-b border-stone-200/90 flex items-center justify-between shrink-0 z-20 shadow-2xs">
        {/* Left: Branding & Feature Identification */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-stone-900 text-base sm:text-lg leading-none">
                Chat with TripMate
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                AI Assistant
              </span>
            </div>
            <span className="text-[11px] text-stone-500 hidden sm:block">
              Conversational travel planning & advice • Andhra Pradesh
            </span>
          </div>
        </div>

        {/* Right Navigation & Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="inline-flex items-center rounded-full bg-stone-100 p-0.5 border border-stone-200 text-xs">
            <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-stone-500" />
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                selectedLanguage === 'en'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('te')}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                selectedLanguage === 'te'
                  ? 'bg-white text-amber-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                selectedLanguage === 'hi'
                  ? 'bg-white text-amber-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              हिन्दी
            </button>
          </div>


          {/* Clear chat button */}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearConversation}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              title="Start a fresh conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          {/* Prominent Button to Return to Place Discovery */}
          <button
            type="button"
            onClick={onNavigatePlaceDiscovery}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-stone-900 text-white hover:bg-amber-600 transition-colors shadow-2xs"
            title="Switch back to Place Discovery & Cards view"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Place Discovery</span>
          </button>

          {/* Return Home */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            /* Empty State / Welcome Screen */
            <div className="text-center py-8 sm:py-14 max-w-xl mx-auto animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center mx-auto shadow-md mb-5">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {selectedLanguage === 'te'
                  ? 'ట్రిప్‌మేట్ AI చాట్‌కు స్వాగతం'
                  : selectedLanguage === 'hi'
                  ? 'ट्रीपमेट AI चैट में आपका स्वागत है'
                  : 'Chat freely with TripMate'}
              </h2>
              <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
                {selectedLanguage === 'te'
                  ? 'కుటుంబ ప్రయాణం, బడ్జెట్, నడక కష్టాలు, ప్రదేశాల పోలిక లేదా విజయవాడ ఆకర్షణల గురించి మీ ప్రశ్నలను అడగండి.'
                  : selectedLanguage === 'hi'
                  ? 'पारिवारिक यात्रा, बजट, सीढ़ियों की सुगमता, स्थानों की तुलना या विजयवाड़ा के बारे में कोई भी प्रश्न पूछें।'
                  : 'Ask open-ended travel questions, get packing and family advice, compare attractions, or plan multi-day itineraries.'}
              </p>

              {/* Inspiration questions */}
              <div className="mt-8 text-left space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 block px-1">
                  {selectedLanguage === 'te'
                    ? 'ఉదాహరణ ప్రశ్నలు:'
                    : selectedLanguage === 'hi'
                    ? 'उदाहरण प्रश्न:'
                    : 'Example questions to get started:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INSPIRATION_QUESTIONS[selectedLanguage].map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => void handleSendMessage(q)}
                      className="text-left p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-xs transition-all text-xs sm:text-sm text-stone-700 hover:text-stone-950 flex items-start gap-2 group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Message List */
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5`}>
                    <div
                      className={`rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed ${
                        isUser
                          ? 'bg-stone-900 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-stone-200/90 text-stone-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {/* Message Content */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <StructuredResponseRenderer content={msg.content} language={msg.language} />
                      )}

                      {/* Assistant footer with Source & Audio/Copy tools */}
                      {!isUser && (
                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                          <div className="flex items-center gap-2">
                            {msg.source && (
                              <span className="inline-flex items-center gap-1 font-medium text-stone-600">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                {msg.source}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Read Aloud button */}
                            <button
                              type="button"
                              onClick={() => handleToggleSpeech(msg.id, msg.content, msg.language)}
                              className="p-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title={speakingId === msg.id ? 'Stop speaking' : 'Read aloud'}
                              aria-label={speakingId === msg.id ? 'Stop speaking' : 'Read aloud'}
                            >
                              {speakingId === msg.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Copy button */}
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="p-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="Copy response"
                              aria-label="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Place Recommendations Grid */}
                    {!isUser && msg.recommendations?.places && msg.recommendations.places.length > 0 && (
                      <div className="space-y-2 pt-2 text-left">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 px-1">
                          <span>
                            {selectedLanguage === 'te'
                              ? 'సూచించిన ప్రదేశాలు'
                              : selectedLanguage === 'hi'
                              ? 'सुझाई गई जगहें'
                              : 'Recommended Places'}{' '}
                            ({msg.recommendations.places.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {msg.recommendations.places.map((place) => (
                            <PlaceCard
                              key={place.id}
                              place={place}
                              isSaved={savedPlaceIds.has(place.id)}
                              isInCompare={comparePlaceIds.has(place.id)}
                              onViewDetails={(p) => setSelectedPlaceForModal(p)}
                              onToggleSave={(p) => {
                                setSavedPlaceIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(p.id)) next.delete(p.id);
                                  else next.add(p.id);
                                  return next;
                                });
                              }}
                              onToggleCompare={(p) => {
                                setComparePlaceIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(p.id)) next.delete(p.id);
                                  else next.add(p.id);
                                  return next;
                                });
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dining / Restaurant Recommendations */}
                    {!isUser && msg.recommendations?.restaurants && msg.recommendations.restaurants.length > 0 && (
                      <div className="space-y-2 pt-2 text-left">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 px-1">
                          <span>
                            {selectedLanguage === 'te'
                              ? 'రెస్టారెంట్ సూచనలు'
                              : selectedLanguage === 'hi'
                              ? 'रेस्तरां सुझाव'
                              : 'Dining & Restaurants'}{' '}
                            ({msg.recommendations.restaurants.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {msg.recommendations.restaurants.map((restaurant) => (
                            <RestaurantCard
                              key={restaurant.id}
                              restaurant={restaurant}
                              isSaved={savedRestaurantIds.has(restaurant.id)}
                              onToggleSave={(r) => {
                                setSavedRestaurantIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(r.id)) next.delete(r.id);
                                  else next.add(r.id);
                                  return next;
                                });
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hotel Recommendations */}
                    {!isUser && msg.recommendations?.hotels && msg.recommendations.hotels.length > 0 && (
                      <div className="space-y-2 pt-2 text-left">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 px-1">
                          <span>
                            {selectedLanguage === 'te'
                              ? 'హోటల్ సూచనలు'
                              : selectedLanguage === 'hi'
                              ? 'होटल सुझाव'
                              : 'Accommodations & Stays'}{' '}
                            ({msg.recommendations.hotels.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {msg.recommendations.hotels.map((hotel) => (
                            <HotelCard
                              key={hotel.id}
                              hotel={hotel}
                              isSaved={false}
                              onToggleSave={() => {}}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Suggested Action Pills */}
                    {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => void handleSendMessage(action)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors"
                          >
                            <span>{action}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 my-4 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs text-xs text-stone-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-stone-700 font-medium">
                  {selectedLanguage === 'te'
                    ? 'ట్రిప్‌మేట్ AI సమాధానం సిద్ధం చేస్తోంది...'
                    : selectedLanguage === 'hi'
                    ? 'ट्रीपमेट AI उत्तर तैयार कर रहा है...'
                    : 'TripMate is thinking...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatScrollEndRef} />
        </div>
      </main>

      {/* Bottom Pinned Input Bar */}
      <footer className="sticky bottom-0 z-20 w-full bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent pt-3 pb-4 sm:pb-6 px-4">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Voice error banner */}
          {voiceError && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span className="flex-1">{voiceError}</span>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-stone-400 hover:text-stone-700 font-bold px-1"
              >
                ×
              </button>
            </div>
          )}

          {/* Listening Indicator Badge */}
          {isListening && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs animate-pulse shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="font-medium">
                  {strings.listening} ({speechLanguageCode(selectedLanguage)})…
                </span>
              </div>
              <button
                type="button"
                onClick={stopVoiceInput}
                className="text-xs font-semibold text-red-800 underline hover:text-red-950"
              >
                {strings.stopListening}
              </button>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage(input);
            }}
            className={`relative bg-white rounded-3xl border transition-all p-2 sm:p-2.5 shadow-md ${
              isListening
                ? 'border-red-400 ring-2 ring-red-400/20'
                : 'border-stone-300 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/10'
            }`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={strings.inputPlaceholder}
              aria-label={strings.inputPlaceholder}
              className="w-full resize-none bg-transparent px-3 py-2 text-stone-900 placeholder:text-stone-400 text-sm sm:text-base focus:outline-none max-h-40 min-h-[44px]"
            />

            {/* Bottom Controls Bar */}
            <div className="flex flex-wrap items-center justify-between pt-1 px-1 border-t border-stone-100 gap-2">
              <div className="flex items-center gap-2">
                <AnsweringMethodSelector
                  selectedMethod={selectedAnsweringMethod}
                  onSelectMethod={handleAnsweringMethodChange}
                  language={selectedLanguage}
                  compact
                />
              </div>

              <div className="flex items-center gap-1.5">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`p-2 rounded-full transition-all flex items-center justify-center ${
                    isListening
                      ? 'bg-red-600 text-white shadow-md animate-pulse'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                  title={
                    isListening
                      ? strings.stopListening
                      : `${strings.listening} (${speechLanguageCode(selectedLanguage)})`
                  }
                  aria-label={
                    isListening
                      ? strings.stopListening
                      : `${strings.listening} (${speechLanguageCode(selectedLanguage)})`
                  }
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-white" />
                  ) : (
                    <Mic className="w-4 h-4 text-stone-700" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                    input.trim() && !isLoading
                      ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs'
                      : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  }`}
                  title={strings.sendMessage}
                  aria-label={strings.sendMessage}
                >
                  {isLoading ? (
                    <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                  ) : (
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </footer>

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlaceForModal}
        isOpen={Boolean(selectedPlaceForModal)}
        isSaved={selectedPlaceForModal ? savedPlaceIds.has(selectedPlaceForModal.id) : false}
        onClose={() => setSelectedPlaceForModal(null)}
        onToggleSave={(place) => {
          setSavedPlaceIds((prev) => {
            const next = new Set(prev);
            if (next.has(place.id)) next.delete(place.id);
            else next.add(place.id);
            return next;
          });
        }}
        onAskTripMate={(question) => {
          setSelectedPlaceForModal(null);
          void handleSendMessage(question);
        }}
      />
    </div>
  );
};

