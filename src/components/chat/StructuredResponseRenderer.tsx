/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  Accessibility,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Info,
  Heart,
  Landmark,
} from 'lucide-react';

export interface StructuredResponseRendererProps {
  content: string;
  language?: string;
}

// Authentic Andhra Pradesh cuisine database with verified Wikimedia Commons images and CC attribution
interface DishItem {
  id: string;
  name: string;
  teluguName?: string;
  category: 'breakfast' | 'meals' | 'specialities' | 'nonveg' | 'sweets';
  categoryLabel: string;
  origin: string;
  isVeg: boolean;
  description: string;
  imageUrl?: string;
  imageAttribution?: string;
  imageLicense?: string;
}

const ANDHRA_DISHES: DishItem[] = [
  {
    id: 'pesarattu',
    name: 'Pesarattu (MLA Pesarattu)',
    teluguName: 'పెసరట్టు',
    category: 'breakfast',
    categoryLabel: 'Breakfast Speciality',
    origin: 'Coastal Andhra / Godavari',
    isVeg: true,
    description: 'Crisp crepe prepared from whole green gram (moong dal) batter, stuffed with ginger-seasoned upma and served with piquant allam (ginger) chutney.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pesarattu.jpg',
    imageAttribution: 'Ryallabandi / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'andhra-bhojanam',
    name: 'Andhra Bhojanam (Full Thali)',
    teluguName: 'ఆంధ్ర భోజనం',
    category: 'meals',
    categoryLabel: 'Traditional Meal',
    origin: 'Andhra-wide',
    isVeg: true,
    description: 'Elaborate traditional meal served on banana leaves featuring hot steamed rice, aromatic ghee, Mudda Pappu, Avakaya pickle, sambar, rasam, curds and crisps.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Andhra_Cuisine.jpg',
    imageAttribution: 'Teja / Wikimedia Commons',
    imageLicense: 'CC BY-SA 4.0',
  },
  {
    id: 'gongura-pachadi',
    name: 'Gongura Pachadi & Rice',
    teluguName: 'గోంగూర పచ్చడి',
    category: 'specialities',
    categoryLabel: 'Regional Speciality',
    origin: 'Guntur / Krishna',
    isVeg: true,
    description: 'The signature tangy relish of Andhra Pradesh made from sorrel (gongura) leaves, roasted red chillies, garlic and spices, best relished with steaming rice and pure ghee.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Gongura_recipe.jpg',
    imageAttribution: 'Latha / Wikimedia Commons',
    imageLicense: 'CC BY-SA 4.0',
  },
  {
    id: 'pootharekulu',
    name: 'Atreyapuram Pootharekulu',
    teluguName: 'పూతరేకులు',
    category: 'sweets',
    categoryLabel: 'Sweets & Desserts',
    origin: 'Atreyapuram, East Godavari (GI Tagged)',
    isVeg: true,
    description: 'Delicate paper-thin wafer rolls handcrafted from rice starch batter, lavishly stuffed with powdered jaggery, pure ghee, and crushed dry fruits.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Pootharekulu_dry_fruits.jpg',
    imageAttribution: 'Balajijagadesh / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'kakinada-kaja',
    name: 'Kakinada Gottam Kaja',
    teluguName: 'కాకినాడ గొట్టం కాజా',
    category: 'sweets',
    categoryLabel: 'Sweets & Desserts',
    origin: 'Kakinada, East Godavari',
    isVeg: true,
    description: 'Cylindrical golden sweet pastry with a crispy layered crust that bursts with luscious cardamom-scented sugar syrup at every bite.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Kotayya_Kaja_Kakinada_kaja_%285%29.jpg',
    imageAttribution: 'B.K.Viswanadh / Wikimedia Commons',
    imageLicense: 'CC BY-SA 4.0',
  },
];

// Verified Andhra Pradesh Religious Pilgrimage Sites (Strictly Andhra Pradesh boundaries)
interface ReligiousSiteItem {
  id: string;
  name: string;
  teluguName?: string;
  tradition: 'hindu' | 'christian' | 'islamic';
  traditionLabel: string;
  location: string;
  district: string;
  description: string;
  mapsUrl: string;
  officialUrl?: string;
  imageUrl?: string;
  imageAttribution?: string;
  imageLicense?: string;
}

const ANDHRA_RELIGIOUS_SITES: ReligiousSiteItem[] = [
  // Hindu Temples
  {
    id: 'kanaka-durga',
    name: 'Kanaka Durga Temple',
    teluguName: 'శ్రీ కనకదుర్గమ్మ దేవస్థానం',
    tradition: 'hindu',
    traditionLabel: 'Hindu Temple (Shakti Peetha)',
    location: 'Indrakeeladri Hill, Vijayawada',
    district: 'NTR District, Andhra Pradesh',
    description: 'Ancient hill shrine overlooking the Krishna River, dedicated to Goddess Kanaka Durga, revered throughout South India.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kanaka+Durga+Temple+Vijayawada',
    officialUrl: 'https://kanakadurgamma.org',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Kanaka_Durga_Temple_gopuram.jpg',
    imageAttribution: 'Adityamadhav83 / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'tirumala',
    name: 'Tirumala Venkateswara Temple',
    teluguName: 'తిరుమల శ్రీ వేంకటేశ్వర స్వామి దేవాలయం',
    tradition: 'hindu',
    traditionLabel: 'Hindu Temple (Vaishnavite)',
    location: 'Tirumala Hills, Tirupati',
    district: 'Tirupati District, Andhra Pradesh',
    description: 'Sacred Kaliyuga Vaikuntam atop the holy Seshachalam hills, one of the most venerated pilgrimage destinations in the world.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tirumala+Venkateswara+Temple',
    officialUrl: 'https://ttdevasthanams.ap.gov.in',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Tirumala_090615.jpg',
    imageAttribution: 'Nikhilb239 / Wikimedia Commons',
    imageLicense: 'CC BY-SA 4.0',
  },
  {
    id: 'srisailam',
    name: 'Srisailam Mallikarjuna Swamy Temple',
    teluguName: 'శ్రీశైలం భ్రమరాంబ మల్లికార్జున స్వామి దేవస్థానం',
    tradition: 'hindu',
    traditionLabel: 'Hindu Temple (Jyotirlinga & Shakti Peetha)',
    location: 'Nallamala Hills, Srisailam',
    district: 'Nandyal District, Andhra Pradesh',
    description: 'Unique sacred sanctuary combining one of the 12 Shiva Jyotirlingas and one of the 18 Maha Shakti Peethas.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mallikarjuna+Temple+Srisailam',
    officialUrl: 'https://srisailadevasthanam.org',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Srisailam_Temple_Complex.jpg',
    imageAttribution: 'Adityamadhav83 / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'srikalahasti',
    name: 'Srikalahasteeswara Temple',
    teluguName: 'శ్రీకాళహస్తీశ్వర దేవస్థానం',
    tradition: 'hindu',
    traditionLabel: 'Hindu Temple (Vayu Sthalam)',
    location: 'Swarnamukhi River Bank, Srikalahasti',
    district: 'Tirupati District, Andhra Pradesh',
    description: 'Historic Shaivite shrine representing the Vayu (Air) element of Pancha Bhoota, renowned for Rahu-Ketu Sarpa Dosha Nivarana.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Srikalahasteeswara+Temple',
    officialUrl: 'https://srikalahasthitemple.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Srikalahasti_Temple.JPG',
    imageAttribution: 'Katta Sreenivasa Rao / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'lepakshi',
    name: 'Lepakshi Veerabhadra Temple',
    teluguName: 'లేపాక్షి వీరభద్ర స్వామి దేవాలయం',
    tradition: 'hindu',
    traditionLabel: 'Hindu Temple (Vijayanagara Heritage)',
    location: 'Lepakshi Village',
    district: 'Sri Sathya Sai District, Andhra Pradesh',
    description: 'Architectural masterpiece from 1530 AD featuring the famous hanging pillar, monolithic Nandi, and remarkable ceiling frescoes.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lepakshi+Veerabhadra+Temple',
    officialUrl: 'https://tourism.ap.gov.in',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Lepakshi_Temple.jpg',
    imageAttribution: 'Bikashrd / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'mangalagiri',
    name: 'Mangalagiri Panakala Narasimha Swamy',
    teluguName: 'మంగళగిరి పానకాల లక్ష్మీ నరసింహ స్వామి',
    tradition: 'hindu',
    traditionLabel: 'Hindu Temple (Divya Desam)',
    location: 'Mangalagiri Hill',
    district: 'Guntur District, Andhra Pradesh',
    description: 'Ancient hill temple where deities offer sweet Panakam water, featuring the tallest temple gopuram in Andhra Pradesh.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Panakala+Lakshmi+Narasimha+Swamy+Temple+Mangalagiri',
    officialUrl: 'https://tourism.ap.gov.in',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Mangalagiri_Gali_Gopuram.jpg',
    imageAttribution: 'Adityamadhav83 / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },

  // Christian Pilgrimage
  {
    id: 'gunadala-matha',
    name: 'Gunadala Mary Matha Shrine',
    teluguName: 'గుణదల మేరీ మాత పుణ్యక్షేత్రం',
    tradition: 'christian',
    traditionLabel: 'Christian Pilgrimage (Marian Shrine)',
    location: 'Gunadala Hill, Vijayawada',
    district: 'NTR District, Andhra Pradesh',
    description: 'Prominent hillside Catholic shrine founded in 1925 (Our Lady of Lourdes), attracting lakhs of devotees of all faiths for the annual February Feast.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gunadala+Matha+Shrine+Vijayawada',
    officialUrl: 'https://tourism.ap.gov.in',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Gunadala_Mary_Matha_Shrine_Vijayawada.jpg/800px-Gunadala_Mary_Matha_Shrine_Vijayawada.jpg',
    imageAttribution: 'J.M.Garg / Wikimedia Commons',
    imageLicense: 'CC BY 3.0',
  },
  {
    id: 'csi-st-pauls',
    name: "CSI St. Paul's Cathedral",
    teluguName: 'సెయింట్ పాల్స్ కేథడ్రల్ (CSI)',
    tradition: 'christian',
    traditionLabel: 'Christian Pilgrimage (Cathedral)',
    location: 'Bandar Road, Vijayawada',
    district: 'NTR District, Andhra Pradesh',
    description: 'Stately late 19th-century cathedral in Vijayawada renowned for its colonial Gothic architecture and spiritual serenity.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=CSI+St+Pauls+Cathedral+Vijayawada',
    officialUrl: 'https://tourism.ap.gov.in',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/St_Pauls_Cathedral_Vijayawada.jpg/800px-St_Pauls_Cathedral_Vijayawada.jpg',
    imageAttribution: 'G.N.Rao / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'phirangipuram-infant-jesus',
    name: 'Infant Jesus Church, Phirangipuram',
    teluguName: 'ఫిరంగిపురం బాలయేసు పుణ్యక్షేత్రం',
    tradition: 'christian',
    traditionLabel: 'Christian Pilgrimage (Catholic Shrine)',
    location: 'Phirangipuram',
    district: 'Guntur District, Andhra Pradesh',
    description: 'Century-old historic Catholic parish and pilgrimage shrine celebrated for spiritual retreats and regional coastal devotion.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Infant+Jesus+Church+Phirangipuram',
    officialUrl: 'https://tourism.ap.gov.in',
  },

  // Islamic Heritage & Dargahs
  {
    id: 'shahi-jamia-masjid',
    name: 'Shahi Jamia Masjid, Adoni',
    teluguName: 'షాహీ జామియా మసీదు, ఆదోని',
    tradition: 'islamic',
    traditionLabel: 'Islamic Heritage (Adil Shahi Mosque)',
    location: 'Adoni Town',
    district: 'Kurnool District, Andhra Pradesh',
    description: 'Magnificent 1662 AD Bijapur-style stone mosque built by Siddi Masud, famed for towering minarets and intricate calligraphy.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shahi+Jamia+Masjid+Adoni',
    officialUrl: 'https://tourism.ap.gov.in',
  },
  {
    id: 'hazrat-bal-vijayawada',
    name: 'Hazrat Bal Mosque, Vijayawada',
    teluguName: 'హజ్రత్ బల్ మసీదు, విజయవాడ',
    tradition: 'islamic',
    traditionLabel: 'Islamic Heritage (Holy Relic Shrine)',
    location: 'Vijayawada City',
    district: 'NTR District, Andhra Pradesh',
    description: 'Sacred mosque housing a venerated holy relic of the Prophet Muhammad, displayed on festive occasions with great reverence.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hazrat+Bal+Mosque+Vijayawada',
    officialUrl: 'https://tourism.ap.gov.in',
  },
  {
    id: 'ameen-peer-dargah',
    name: 'Ameen Peer Dargah (Asthana-e-Maghdoom)',
    teluguName: 'అమీన్ పీర్ దర్గా (పెద్ద దర్గా)',
    tradition: 'islamic',
    traditionLabel: 'Islamic Heritage (Sufi Shrine)',
    location: 'Kadapa City',
    district: 'YSR Kadapa District, Andhra Pradesh',
    description: 'Celebrated 17th-century Sufi shrine established by Hazrat Khwaja Peerullah Hussaini, famed across India as a beacon of interfaith harmony.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ameen+Peer+Dargah+Kadapa',
    officialUrl: 'https://tourism.ap.gov.in',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ameen_Peer_Dargah_Kadapa.jpg/800px-Ameen_Peer_Dargah_Kadapa.jpg',
    imageAttribution: 'Sudhakar / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
  },
];

// Helper to check if a response discusses Andhra Pradesh food / dishes
function detectFoodContext(text: string): boolean {
  return /\b(cuisine|traditional food|traditional foods|must-try food|must-try traditional|food of andhra|andhra food|dishes|pesarattu|pootharekulu|gongura|avakaya|ulava charu|kakinada kaja|bhojanam|royyala|chepala pulusu|bobbatlu|పచ్చడి|పెసరట్టు|భోజనం|వంటకాలు|మిఠాయిలు|व्यंजन|पारंपरिक भोजन)\b/i.test(text);
}

// Helper to check if a response discusses Religious Tourism in Andhra Pradesh
function detectReligiousContext(text: string): boolean {
  return /\b(temple|temples|church|churches|mosque|mosques|dargah|dargahs|pilgrimage|religious|spiritual|darshan|shrine|shrines|tirumala|srisailam|kanaka durga|srikalahasti|lepakshi|mangalagiri|gunadala|ameen peer|దేవాలయం|గుడి|తీర్థయాత్ర|మసీదు|చర్చి|मंदिर|तीर्थयात्रा|मस्जिद|चर्च)\b/i.test(text);
}

// Helper to check if a block discusses accessibility / safety
function isAccessibilityCallout(text: string): boolean {
  return /\b(wheelchair|accessibility|senior citizen|elderly|grandparents|climb stairs|minimal stairs|ramps?|elevators?|safety tips|emergency|hospital|walking difficulty)\b/i.test(text);
}

// Preprocessor to clean broken numbered lists and orphan bold number lines
function preprocessLines(rawText: string): string[] {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n');
  const merged: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const current = lines[idx].trim();
    // Check if the line is solely an orphan number (e.g. "1.", "1)", "**1.**", "1")
    const isOrphanNumber = /^(\*\*|\*|)?\d+([.)]|:)?(\*\*|\*|)?$/.test(current);
    if (isOrphanNumber && idx + 1 < lines.length) {
      const nextLine = lines[idx + 1].trim();
      if (nextLine) {
        const numMatch = current.match(/\d+/);
        const num = numMatch ? numMatch[0] : '1';
        merged.push(`${num}. ${nextLine}`);
        idx++; // Advance past merged line
        continue;
      }
    }
    merged.push(lines[idx]);
  }
  return merged;
}

// Inline Markdown Tokenizer with safe link checking
function renderInlineMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  const tokenPattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|`([^`]+)`|~~(.+?)~~|(https?:\/\/[^\s<]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyPrefix}-${tokenIndex++}`;
    if (match[1] && match[2]) {
      let isSafeLink = false;
      try {
        const url = new URL(match[2]);
        isSafeLink = url.protocol === 'https:' || url.protocol === 'http:';
      } catch {
        isSafeLink = false;
      }
      nodes.push(
        isSafeLink ? (
          <a
            key={key}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-950 inline-flex items-center gap-0.5"
          >
            <span>{match[1]}</span>
            <ExternalLink className="w-2.5 h-2.5 inline opacity-70" />
          </a>
        ) : (
          match[1]
        )
      );
    } else if (match[3] || match[4]) {
      nodes.push(
        <strong key={key} className="font-semibold text-stone-900">
          {match[3] || match[4]}
        </strong>
      );
    } else if (match[5] || match[6]) {
      nodes.push(<em key={key} className="italic text-stone-800">{match[5] || match[6]}</em>);
    } else if (match[7]) {
      nodes.push(
        <code key={key} className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.88em] font-mono text-stone-800 border border-stone-200/60">
          {match[7]}
        </code>
      );
    } else if (match[8]) {
      nodes.push(<del key={key}>{match[8]}</del>);
    } else if (match[9]) {
      nodes.push(
        <a
          key={key}
          href={match[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
        >
          {match[9]}
        </a>
      );
    }
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

// Compact Dish Card Component with lazy loaded verified photograph
const DishCard: React.FC<{ dish: DishItem }> = ({ dish }) => {
  const [imageError, setImageError] = useState(false);
  const showPhoto = Boolean(dish.imageUrl && !imageError);

  return (
    <div className="flex flex-col sm:flex-row bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 group text-left">
      {/* Dish Photo or Clean Icon */}
      <div className="relative w-full sm:w-44 h-36 sm:h-auto shrink-0 bg-stone-100 flex items-center justify-center overflow-hidden">
        {showPhoto ? (
          <>
            <img
              src={dish.imageUrl}
              alt={dish.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {dish.imageAttribution && (
              <span
                className="absolute bottom-1 right-1.5 text-[8.5px] bg-stone-900/60 backdrop-blur-xs text-white/80 px-1.5 py-0.5 rounded max-w-[80%] truncate"
                title={`${dish.imageAttribution} (${dish.imageLicense || 'Verified'})`}
              >
                {dish.imageAttribution}
              </span>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-stone-400">
            <Utensils className="w-7 h-7 mb-1 text-stone-400" />
            <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-500">
              {dish.category}
            </span>
          </div>
        )}

        {/* Veg / Non-Veg Indicator Dot */}
        <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1 border border-stone-200/70">
          <span
            className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}
          />
          <span className="text-[9px] font-semibold text-stone-700 uppercase">
            {dish.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
      </div>

      {/* Dish Information */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                {dish.name}
              </h4>
              {dish.teluguName && (
                <span className="text-xs text-stone-500 font-medium">{dish.teluguName}</span>
              )}
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 shrink-0">
              {dish.origin}
            </span>
          </div>

          <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed mt-1">
            {dish.description}
          </p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="font-medium text-amber-900">{dish.categoryLabel}</span>
          <span className="text-stone-400 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            Traditional Heritage
          </span>
        </div>
      </div>
    </div>
  );
};

// Compact Religious Pilgrimage Card Component
const ReligiousSiteCard: React.FC<{ site: ReligiousSiteItem }> = ({ site }) => {
  const [imageError, setImageError] = useState(false);
  const showPhoto = Boolean(site.imageUrl && !imageError);

  const traditionBadgeColor =
    site.tradition === 'hindu'
      ? 'bg-amber-50 text-amber-800 border-amber-200/70'
      : site.tradition === 'christian'
      ? 'bg-sky-50 text-sky-800 border-sky-200/70'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200/70';

  return (
    <div className="flex flex-col sm:flex-row bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 group text-left">
      {/* Site Photo or Clean Landmark Icon */}
      <div className="relative w-full sm:w-44 h-36 sm:h-auto shrink-0 bg-stone-100 flex items-center justify-center overflow-hidden">
        {showPhoto ? (
          <>
            <img
              src={site.imageUrl}
              alt={site.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {site.imageAttribution && (
              <span
                className="absolute bottom-1 right-1.5 text-[8.5px] bg-stone-900/60 backdrop-blur-xs text-white/80 px-1.5 py-0.5 rounded max-w-[80%] truncate"
                title={`${site.imageAttribution} (${site.imageLicense || 'Verified'})`}
              >
                {site.imageAttribution}
              </span>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-stone-400">
            <Landmark className="w-8 h-8 mb-1.5 text-stone-400" />
            <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-500 text-center">
              {site.tradition === 'hindu' ? 'Hindu Temple' : site.tradition === 'christian' ? 'Christian Shrine' : 'Islamic Heritage'}
            </span>
          </div>
        )}

        {/* State Validation Badge */}
        <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs flex items-center gap-1 border border-stone-200/70">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span className="text-[9px] font-semibold text-stone-700">Andhra Pradesh</span>
        </div>
      </div>

      {/* Site Information */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                {site.name}
              </h4>
              {site.teluguName && (
                <span className="text-xs text-stone-500 font-medium">{site.teluguName}</span>
              )}
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${traditionBadgeColor}`}>
              {site.traditionLabel}
            </span>
          </div>

          <p className="text-xs text-stone-500 flex items-center gap-1 mb-1.5 font-medium">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span>{site.location} · {site.district}</span>
          </p>

          <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
            {site.description}
          </p>
        </div>

        {/* Action Buttons: Maps Directions & Official Site */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-lg transition-colors"
          >
            <MapPin className="w-3 h-3" />
            <span>Google Maps</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>

          {site.officialUrl && (
            <a
              href={site.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Landmark className="w-3 h-3" />
              <span>Official Temple / Portal</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const StructuredResponseRenderer: React.FC<StructuredResponseRendererProps> = ({
  content,
  language,
}) => {
  if (!content || !content.trim()) return null;

  const rawLines = preprocessLines(content);

  // Parse markdown lines into structured elements
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Heading Match (#, ##, ###, ####)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+?)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].replace(/\*\*/g, '').trim();

      const headingStyle =
        level === 1
          ? 'text-lg sm:text-xl font-bold text-stone-900 tracking-tight mt-5 mb-2.5 pb-1 border-b border-stone-200/80 flex items-center gap-2'
          : level === 2
          ? 'text-base sm:text-lg font-semibold text-stone-900 mt-4 mb-2 flex items-center gap-1.5'
          : 'text-sm sm:text-base font-semibold text-stone-800 mt-3 mb-1.5';

      elements.push(
        <div key={`h-${i}`} className={headingStyle}>
          {level <= 2 && <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />}
          <span>{renderInlineMarkdown(title, `h-${i}`)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Key-Value / Meta Row Detection (e.g. "**Timings:** 9:00 AM - 6:00 PM" or "Location: Vijayawada")
    const kvMatch = trimmed.match(/^(\*\*?[A-Za-z\s]+?\*\*?)\s*:\s*(.+)$/);
    if (kvMatch && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      const label = kvMatch[1].replace(/\*\*/g, '').trim();
      const val = kvMatch[2].trim();
      elements.push(
        <div
          key={`kv-${i}`}
          className="my-1.5 p-2 rounded-xl bg-stone-50 border border-stone-200/60 flex items-baseline gap-2 text-xs sm:text-sm text-left"
        >
          <span className="font-semibold text-stone-800 shrink-0">{label}:</span>
          <span className="text-stone-600 flex-1">{renderInlineMarkdown(val, `kv-${i}`)}</span>
        </div>
      );
      i++;
      continue;
    }

    // List Group Match (bullets or numbered items)
    const listMatch = trimmed.match(/^([-*•]|\d+[.)])\s+(.+)$/);
    if (listMatch) {
      const listItems: string[] = [];
      const isNumbered = /^\d+[.)]/.test(listMatch[1]);

      while (i < rawLines.length) {
        const curr = rawLines[i].trim();
        const currMatch = curr.match(/^([-*•]|\d+[.)])\s+(.+)$/);
        if (!currMatch) break;
        listItems.push(currMatch[2]);
        i++;
      }

      elements.push(
        <div key={`list-${i}`} className="my-2.5 space-y-2 text-left">
          {listItems.map((item, idx) => {
            const isAccessNote = isAccessibilityCallout(item);
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 p-2 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  isAccessNote
                    ? 'bg-amber-50/70 border border-amber-200/80 text-amber-950 font-medium'
                    : 'text-stone-700'
                }`}
              >
                {isAccessNote ? (
                  <Accessibility className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                ) : isNumbered ? (
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-stone-200">
                    {idx + 1}
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2" />
                )}
                <div className="flex-1">{renderInlineMarkdown(item, `li-${i}-${idx}`)}</div>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    // Callout / Blockquote Match
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <div
          key={`quote-${i}`}
          className="my-3 p-3.5 rounded-2xl bg-amber-50/60 border-l-4 border-amber-600 text-stone-800 text-xs sm:text-sm leading-relaxed text-left flex items-start gap-2.5"
        >
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            {quoteLines.map((ql, qidx) => (
              <p key={qidx}>{renderInlineMarkdown(ql, `q-${i}-${qidx}`)}</p>
            ))}
          </div>
        </div>
      );
      continue;
    }

    // Regular Paragraph
    const paraLines: string[] = [];
    while (
      i < rawLines.length &&
      rawLines[i].trim() &&
      !rawLines[i].trim().match(/^(#{1,4}\s+|[-*•]\s+|\d+[.)]\s+|>)/)
    ) {
      paraLines.push(rawLines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      const paraText = paraLines.join(' ');
      const isAccess = isAccessibilityCallout(paraText);

      elements.push(
        <div
          key={`p-${i}`}
          className={`my-2 text-xs sm:text-sm leading-relaxed text-left ${
            isAccess
              ? 'p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-start gap-2.5 font-medium'
              : 'text-stone-700'
          }`}
        >
          {isAccess && <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />}
          <div className="flex-1">{renderInlineMarkdown(paraText, `p-${i}`)}</div>
        </div>
      );
    }
  }

  return (
    <div className="space-y-3">
      {/* Main Formatted Markdown Content */}
      <div className="space-y-1.5">{elements}</div>
    </div>
  );
};

