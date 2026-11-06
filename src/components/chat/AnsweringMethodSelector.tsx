/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  BookOpen,
  ListOrdered,
  Briefcase,
  Smile,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { AnsweringMethod } from '../../types';
import { AppLanguage } from '../../services/language';

export interface AnsweringMethodOption {
  id: AnsweringMethod;
  label: Record<AppLanguage, string>;
  description: Record<AppLanguage, string>;
  icon: React.ComponentType<{ className?: string }>;
}

export const ANSWERING_METHODS: AnsweringMethodOption[] = [
  {
    id: 'simple_short',
    label: {
      en: 'Simple & Short',
      te: 'సరళమైన & సంక్షిప్త',
      hi: 'सरल और संक्षिप्त',
    },
    description: {
      en: 'Direct answers, avoiding unnecessary details',
      te: 'అనవసర వివరాలు లేకుండా సూటిగా సమాధానం',
      hi: 'सीधे उत्तर, अनावश्यक विवरण के बिना',
    },
    icon: Zap,
  },
  {
    id: 'detailed',
    label: {
      en: 'Detailed Explanation',
      te: 'వివరణాత్మక వివరణ',
      hi: 'विस्तृत व्याख्या',
    },
    description: {
      en: 'Thorough coverage with headings & key points',
      te: 'శీర్షికలు, ఉదాహరణలతో సమగ్ర వివరణ',
      hi: 'शीर्षकों और मुख्य बिंदुओं के साथ पूर्ण विवरण',
    },
    icon: BookOpen,
  },
  {
    id: 'step_by_step',
    label: {
      en: 'Step-by-Step Guide',
      te: 'దశలవారీ మార్గదర్శి',
      hi: 'क्रमवार मार्गदर्शन',
    },
    description: {
      en: 'Numbered steps in correct chronological order',
      te: 'సరైన క్రమంలో సంఖ్యలతో కూడిన దశలు',
      hi: 'सही क्रम में क्रमांकित चरण',
    },
    icon: ListOrdered,
  },
  {
    id: 'formal',
    label: {
      en: 'Professional & Formal',
      te: 'వృత్తిపరమైన & అధికారిక',
      hi: 'पेशेवर और औपचारिक',
    },
    description: {
      en: 'Well-structured tone suitable for official purposes',
      te: 'అధికారిక మరియు విద్యార్థి ప్రయోజనాలకు తగిన శైలి',
      hi: 'आधिकारिक और व्यवस्थित औपचारिक शैली',
    },
    icon: Briefcase,
  },
  {
    id: 'friendly',
    label: {
      en: 'Friendly & Conversational',
      te: 'స్నేహపూర్వక & సహజమైన',
      hi: 'मित्रवत और संवादी',
    },
    description: {
      en: 'Warm, engaging tone like a local travel friend',
      te: 'స్థానిక స్నేహితుడిలా ఆప్యాయమైన సంభాషణ',
      hi: 'स्थानीय मित्र जैसा आत्मीय और जीवंत अंदाज',
    },
    icon: Smile,
  },
];

interface AnsweringMethodSelectorProps {
  selectedMethod: AnsweringMethod;
  onSelectMethod: (method: AnsweringMethod) => void;
  language: AppLanguage;
  compact?: boolean;
}

export const AnsweringMethodSelector: React.FC<AnsweringMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  language,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = ANSWERING_METHODS.find((m) => m.id === selectedMethod) || ANSWERING_METHODS[0];
  const Icon = current.icon;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const buttonTitle = {
    en: 'Change Answering Method / Style',
    te: 'సమాధాన శైలిని మార్చండి',
    hi: 'उत्तर देने का तरीका बदलें',
  }[language];

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
          isOpen
            ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 shadow-2xs'
        } ${compact ? 'px-2 py-1' : 'px-2.5 py-1 sm:px-3 sm:py-1.5'}`}
        title={buttonTitle}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-800 shrink-0">
          <Icon className="w-2.5 h-2.5" />
        </span>
        <span className="font-semibold text-stone-800 truncate max-w-[110px] sm:max-w-[150px]">
          {current.label[language]}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-stone-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-700' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute bottom-full mb-2 left-0 sm:left-auto sm:right-0 w-72 sm:w-80 rounded-2xl bg-white border border-stone-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-stone-900">
                {language === 'te'
                  ? 'సమాధాన శైలి (Answering Style)'
                  : language === 'hi'
                  ? 'उत्तर देने का तरीका (Answering Style)'
                  : 'Answering Style'}
              </span>
            </div>
            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              AI Style
            </span>
          </div>

          <div className="py-1 space-y-0.5 max-h-72 overflow-y-auto">
            {ANSWERING_METHODS.map((method) => {
              const MethodIcon = method.icon;
              const isSelected = method.id === selectedMethod;
              return (
                <button
                  key={method.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSelectMethod(method.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-amber-50/80 text-amber-950 border border-amber-200/70 font-medium'
                      : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <MethodIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-stone-900 truncate">
                        {method.label[language]}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight mt-0.5 line-clamp-2">
                      {method.description[language]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

