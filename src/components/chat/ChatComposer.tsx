/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Accessibility, Sparkles, Mic, MicOff, Globe, AlertCircle } from 'lucide-react';
import { AppLanguage, getChatTranslations, speechLanguageCode } from '../../services/language';
import { AnsweringMethod } from '../../types';
import { AnsweringMethodSelector } from './AnsweringMethodSelector';

interface ChatComposerProps {
  onSendMessage: (
    text: string,
    options?: { accessibilityOnly?: boolean; language?: string; answeringMethod?: AnsweringMethod }
  ) => void;
  isLoading: boolean;
  selectedLanguage: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  selectedAnsweringMethod?: AnsweringMethod;
  onAnsweringMethodChange?: (method: AnsweringMethod) => void;
}

interface RecognitionResult {
  0: { transcript: string };
  isFinal: boolean;
}

interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}

interface RecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionLike;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  isLoading,
  selectedLanguage,
  onLanguageChange,
  selectedAnsweringMethod = 'detailed',
  onAnsweringMethodChange,
}) => {
  const [input, setInput] = useState<string>('');
  const [accessibilityFilter, setAccessibilityFilter] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const inputBeforeListeningRef = useRef('');
  const strings = getChatTranslations(selectedLanguage);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }, [selectedLanguage]);

  const startVoiceInput = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(strings.unsupportedSpeechRecognition);
      return;
    }

    // Clear any previous error
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

      recognition.onresult = (event: RecognitionEvent) => {
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

      recognition.onerror = (event: RecognitionErrorEvent) => {
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
    } catch (err) {
      setIsListening(false);
      const denied = err instanceof DOMException
        && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
      setVoiceError(denied ? strings.microphoneDenied : strings.speechStartError);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore — stop() can throw if recognition already ended
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isListening) {
      stopVoiceInput();
    }

    onSendMessage(input.trim(), {
      accessibilityOnly: accessibilityFilter,
      language: selectedLanguage,
      answeringMethod: selectedAnsweringMethod,
    });
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-20 w-full bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent pt-4 pb-4 sm:pb-6 px-4">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Voice error banner */}
        {voiceError && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
            <span className="flex-1">{voiceError}</span>
            <button
              type="button"
              onClick={() => setVoiceError(null)}
              className="text-stone-400 hover:text-stone-700 px-1 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Listening indicator badge */}
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

        <form
          onSubmit={handleSubmit}
          className={`relative bg-white rounded-3xl border transition-all p-2 sm:p-2.5 shadow-md ${
            isListening
              ? 'border-red-400 ring-2 ring-red-400/20'
              : 'border-stone-300 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/10'
          }`}
        >
          {/* Text input area */}
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

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between pt-1 px-1 border-t border-stone-100 gap-2">
            {/* Left Context toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Language Selector */}
              <div className="inline-flex items-center rounded-full bg-stone-100 p-0.5 border border-stone-200 text-xs">
                <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-stone-500" />
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                    selectedLanguage === 'en'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Switch to English"
                  aria-pressed={selectedLanguage === 'en'}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('te')}
                  className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                    selectedLanguage === 'te'
                      ? 'bg-white text-amber-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="తెలుగు భాషకు మారండి"
                  aria-pressed={selectedLanguage === 'te'}
                >
                  తెలుగు
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('hi')}
                  className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                    selectedLanguage === 'hi'
                      ? 'bg-white text-amber-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="हिन्दी भाषा चुनें"
                  aria-pressed={selectedLanguage === 'hi'}
                >
                  हिन्दी
                </button>
              </div>

              {/* Answering Style Selector */}
              {onAnsweringMethodChange && (
                <AnsweringMethodSelector
                  selectedMethod={selectedAnsweringMethod}
                  onSelectMethod={onAnsweringMethodChange}
                  language={selectedLanguage}
                />
              )}

              {/* Minimal Stairs / Accessibility toggle */}
              <button
                type="button"
                onClick={() => setAccessibilityFilter(!accessibilityFilter)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  accessibilityFilter
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
                title={selectedLanguage === 'te'
                  ? 'తక్కువ నడక మరియు మెట్లు ఉన్న మార్గాలకు ప్రాధాన్యత'
                  : selectedLanguage === 'hi'
                    ? 'कम चलने और कम सीढ़ियों वाले विकल्पों को प्राथमिकता दें'
                    : 'Prioritise accessible paths and minimal stairs'}
                aria-label={strings.accessibility}
              >
                <Accessibility className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{strings.accessibility}</span>
                <span className="sm:hidden">{strings.accessibility}</span>
              </button>
            </div>

            {/* Right side: Voice input mic and send button */}
            <div className="flex items-center gap-1.5">
              {/* Microphone Voice Input Button */}
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
                aria-label={isListening ? strings.stopListening : `${strings.listening} (${speechLanguageCode(selectedLanguage)})`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-stone-700" />
                )}
              </button>

              <span className="hidden sm:inline text-[11px] text-stone-400 font-mono">
                Enter ↵
              </span>

              {/* Send button */}
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
    </div>
  );
};
