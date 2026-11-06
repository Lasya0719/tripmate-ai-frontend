/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DestinationInspiration, Hotel, Itinerary, Place, Restaurant } from '../types';

export interface DestinationIntro {
  id: string;
  name: string;
  contextTag: string;
  welcomeMessage: string;
  suggestedActions: string[];
}

export const DESTINATION_INTROS: Record<string, DestinationIntro> = {
  vijayawada: {
    id: 'vijayawada',
    name: 'Vijayawada',
    contextTag: 'Vijayawada · Heritage',
    welcomeMessage:
      'Welcome to Vijayawada! Explore its historic temples, heritage attractions, caves, riverfront and cultural experiences.\n\nWhat would you like to explore?',
    suggestedActions: [
      'Explore popular places',
      'Discover historical attractions',
      'Find places for families and children',
      'Explore restaurants',
      'Discover peaceful places',
      'Plan a trip to Vijayawada'
    ]
  },
  'araku-valley': {
    id: 'araku-valley',
    name: 'Araku Valley',
    contextTag: 'Araku Valley · Nature',
    welcomeMessage:
      'Welcome to Araku Valley! Explore mist-clad hill stations, organic coffee plantations, breathtaking Borra Caves, and emerald highland viewpoints.\n\nWhat would you like to explore?',
    suggestedActions: [
      'Explore popular places',
      'Discover historical attractions',
      'Find places for families and children',
      'Explore restaurants',
      'Discover peaceful places',
      'Plan a trip to Araku Valley'
    ]
  },
  visakhapatnam: {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    contextTag: 'Visakhapatnam · Coastal',
    welcomeMessage:
      'Welcome to Visakhapatnam! Discover sweeping coastal panoramas, historic naval museums, hilltop vistas at Kailasagiri, and serene beaches.\n\nWhat would you like to explore?',
    suggestedActions: [
      'Explore popular places',
      'Discover historical attractions',
      'Find places for families and children',
      'Explore restaurants',
      'Discover peaceful places',
      'Plan a trip to Visakhapatnam'
    ]
  },
  gandikota: {
    id: 'gandikota',
    name: 'Gandikota',
    contextTag: 'Gandikota · Geological Wonder',
    welcomeMessage:
      'Welcome to Gandikota! Discover the dramatic crimson sandstone gorge of the Pennar River, the majestic 13th-century fort, and ancient architecture.\n\nWhat would you like to explore?',
    suggestedActions: [
      'Explore popular places',
      'Discover historical attractions',
      'Find places for families and children',
      'Explore restaurants',
      'Discover peaceful places',
      'Plan a trip to Gandikota'
    ]
  },
  kerala: {
    id: 'kerala',
    name: 'Kerala',
    contextTag: 'Kerala · Backwaters',
    welcomeMessage:
      'Welcome to Kerala! Experience tranquil palm-fringed backwaters, misty highland tea estates, serene coastal sanctuaries, and cultural traditions.\n\nWhat would you like to explore?',
    suggestedActions: [
      'Explore popular places',
      'Discover historical attractions',
      'Find places for families and children',
      'Explore restaurants',
      'Discover peaceful places',
      'Plan a trip to Kerala'
    ]
  },
  goa: {
    id: 'goa',
    name: 'Goa',
    contextTag: 'Goa · Coastal Heritage',
    welcomeMessage:
      'Welcome to Goa! Explore centuries-old Portuguese heritage, golden shores, pastel Latin quarters in Fontainhas, and authentic coastal dining.\n\nWhat would you like to explore?',
    suggestedActions: [
      'Explore popular places',
      'Discover historical attractions',
      'Find places for families and children',
      'Explore restaurants',
      'Discover peaceful places',
      'Plan a trip to Goa'
    ]
  }
};
DESTINATION_INTROS['araku'] = DESTINATION_INTROS['araku-valley'];

export const DESTINATION_INSPIRATIONS: DestinationInspiration[] = [
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    tagline: 'Sacred hills, historic rock-cuts & riverfront sunsets',
    state: 'Andhra Pradesh',
    description: 'A vibrant cultural crossroads on the banks of Krishna River, famous for the revered Kanaka Durga Temple, ancient Undavalli rock-cut cave temples, and peaceful island retreats.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Kanaka_Durga_Temple_Vijayawada.jpg/1200px-Kanaka_Durga_Temple_Vijayawada.jpg',
    bestSeason: 'October to March',
    travelStyle: 'Heritage & Riverside Serenity',
    suggestedPrompt: 'Explore historic attractions and culture in Vijayawada'
  },
  {
    id: 'araku-valley',
    name: 'Araku Valley',
    tagline: 'Mist-clad hill stations, organic coffee & emerald waterfalls',
    state: 'Andhra Pradesh',
    description: 'Nestled in the Eastern Ghats, Araku is celebrated for its sprawling aromatic coffee plantations, breathtaking Borra Caves, and misty tribal highland heritage.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Borra_caves_inside.jpg/1200px-Borra_caves_inside.jpg',
    bestSeason: 'September to February',
    travelStyle: 'Nature & Misty Escapes',
    suggestedPrompt: 'Explore coffee hills and nature in Araku Valley'
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    tagline: 'Ocean cliffs, submarine history & pristine coastline',
    state: 'Andhra Pradesh',
    description: 'The City of Destiny where lush green hills cascade directly into the Bay of Bengal, featuring Kailasagiri hilltop vistas and the legendary INS Kursura submarine museum.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/INS_Kursura_%28S20%29_at_RK_Beach.jpg/1200px-INS_Kursura_%28S20%29_at_RK_Beach.jpg',
    bestSeason: 'November to March',
    travelStyle: 'Coastal & Hilltop Panoramas',
    suggestedPrompt: 'Explore coastal viewpoints and history in Visakhapatnam'
  },
  {
    id: 'gandikota',
    name: 'Gandikota',
    tagline: 'The Grand Canyon of India carved by the Pennar River',
    state: 'Andhra Pradesh',
    description: 'A dramatic gorge of crimson sandstone cliffs hugging the Pennar river, crowned by a 13th-century red-stone fort, granaries, and majestic ancient temple ruins.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/The_Grand_Canyon_of_India_Gandikota.jpg/1200px-The_Grand_Canyon_of_India_Gandikota.jpg',
    bestSeason: 'October to February',
    travelStyle: 'Geological Wonder & History',
    suggestedPrompt: 'Explore the red sandstone canyon in Gandikota'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tagline: 'Emerald backwaters, spice highlands & Ayurvedic tranquility',
    state: 'Kerala',
    description: 'God\'s Own Country offering leisurely houseboat journeys through palm-fringed lagoons, tea estates enveloped in mist, and therapeutic coastal wellness traditions.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'September to March',
    travelStyle: 'Backwaters & Wellness',
    suggestedPrompt: 'Explore backwaters and serenity in Kerala'
  },
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Portuguese heritage, golden shores & slow-living coastal charm',
    state: 'Goa',
    description: 'Sun-dappled coastal sanctuaries, pastel-hued Latin quarters in Fontainhas, centuries-old baroque churches, and fresh coastal culinary traditions.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'November to February',
    travelStyle: 'Coastal Heritage & Leisure',
    suggestedPrompt: 'Explore coastal heritage and architecture in Goa'
  }
];

export const VERIFIED_PLACES: Record<string, Place[]> = {
  vijayawada: [
    {
      id: 'vja-kanaka-durga',
      name: 'Kanaka Durga Temple',
      category: 'temple',
      description: 'Revered ancient shrine perched atop Indrakeeladri hill overlooking the sacred Krishna River. Dedicated to Goddess Kanaka Durga with panoramic riverfront and city vistas.',
      location: 'Indrakeeladri Hill, Mallikarjunapeta',
      city: 'Vijayawada',
      budget: 'Free general entry (Special darshan: ₹100-₹300)',
      openingHours: '4:00 AM – 9:00 PM',
      accessibility: {
        wheelchairAccessible: true,
        elevatorAvailable: true,
        stairCount: 'Priority elevator & vehicular ghat road access',
        easyWalking: true,
        notes: 'Priority elevator and direct vehicular ghat drop-off pass available for senior citizens and persons with reduced mobility.'
      },
      rating: 4.8,
      reviewCount: 34200,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Kanaka_Durga_Temple_Vijayawada.jpg/800px-Kanaka_Durga_Temple_Vijayawada.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Adityamadhav83 / Wikimedia Commons (CC BY-SA 3.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Kanaka_Durga_Temple_Vijayawada.jpg',
      officialUrl: 'https://kanakadurgamma.org/',
      officialSourceLabel: 'Sri Durga Malleswara Swamy Varla Devasthanam',
      officialSourceType: 'temple',
      officialAuthority: 'Sri Durga Malleswara Swamy Varla Devasthanam (AP Endowments Dept)',
      officialAudit: {
        verified: true,
        status: 'verified_temple',
        authority: 'Sri Durga Malleswara Swamy Varla Devasthanam',
        linkLabel: 'Official Temple Information',
        specificallyDiscusses: true,
        reason: 'Dedicated official temple trust website providing darshan timings, online sevas, ghat road vehicle passes, and festival updates.'
      },
      highlights: ['Hilltop Krishna river view', 'Ghat vehicle drop-off', 'Express elevator darshan'],
      suitableFor: ['family', 'seniors', 'spiritual'],
      bestTimeToVisit: 'Early morning (6:00 AM – 8:30 AM) or sunset'
    },
    {
      id: 'vja-undavalli-caves',
      name: 'Undavalli Caves',
      category: 'historic',
      description: 'Monolithic 7th-century rock-cut cave temples carved from solid sandstone, featuring early Gupta-style architecture and a monumental 5-meter reclining Vishnu (Anantasayana) sculpture.',
      location: 'Penumaka - Vijayawada Rd, Undavalli (Guntur Border)',
      city: 'Vijayawada',
      rating: 4.7,
      reviewCount: 18500,
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Undavalli_Caves.jpg/960px-Undavalli_Caves.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Arvind.vindhu / Wikimedia Commons (CC BY-SA 3.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Undavalli_Caves.jpg',
      officialSourceType: 'unavailable',
      highlights: ['Monolithic rock-cut art', 'Reclining Vishnu sculpture', 'Ancient sandstone craftsmanship'],
      suitableFor: ['friends', 'history', 'adventure'],
      bestTimeToVisit: 'Morning before midday sun (9:00 AM – 11:30 AM)'
    },
    {
      id: 'vja-prakasam-barrage',
      name: 'Prakasam Barrage',
      category: 'viewpoint',
      description: 'An iconic 1.22 km road bridge and modern barrage across the Krishna River, forming a scenic lake reservoir. The structure is illuminated with evening architectural lighting.',
      location: 'Krishna River Bridge, Governor Peta',
      city: 'Vijayawada',
      budget: 'Free public access',
      openingHours: '24 hours open (Best 5:30 PM – 8:30 PM)',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Completely level pedestrian sidewalk along the riverfront with direct roadside vehicle parking and barrier-free paths.'
      },
      rating: 4.6,
      reviewCount: 22100,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Prakasam_Barrage_Illuminated.jpg/800px-Prakasam_Barrage_Illuminated.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'IM3847 / Wikimedia Commons (CC BY-SA 4.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Prakasam_Barrage_Illuminated.jpg',
      officialUrl: 'https://ntr.ap.gov.in/tourist-place/prakasam-barrage/',
      officialSourceLabel: 'NTR District Administration (Government of AP)',
      officialSourceType: 'government',
      officialAuthority: 'NTR District Administration & Water Resources Dept',
      officialAudit: {
        verified: true,
        status: 'verified_government',
        authority: 'NTR District Administration, Government of Andhra Pradesh',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: true,
        previousUrl: 'https://tourism.ap.gov.in/',
        reason: 'Replaced generic APTDC homepage with dedicated official government tourist place entry specifically documenting Prakasam Barrage engineering history, illumination, Krishna River reservoir, and visiting instructions.'
      },
      highlights: ['Sunset river breezes', 'Evening illumination', 'Completely flat walkway'],
      suitableFor: ['friends', 'evening', 'couples', 'family', 'seniors'],
      bestTimeToVisit: '5:30 PM – 7:30 PM'
    },
    {
      id: 'vja-bhavani-island',
      name: 'Bhavani Island',
      category: 'nature',
      description: 'One of the largest river islands in India, situated in the Krishna River. Operated by APTDC, it features manicured river gardens, shaded paved walking avenues, and gentle boat cruises.',
      location: 'Krishna River, Bhavanipuram',
      city: 'Vijayawada',
      rating: 4.5,
      reviewCount: 14800,
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Bhavani_Island_of_Vijayawada.jpg/960px-Bhavani_Island_of_Vijayawada.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Krishna Chaitanya Velaga / Wikimedia Commons (CC BY-SA 4.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bhavani_Island_of_Vijayawada.jpg',
      officialUrl: 'https://ntr.ap.gov.in/eco-tourism/',
      officialSourceLabel: 'NTR District Administration & APTDC',
      officialSourceType: 'tourism',
      officialAuthority: 'Andhra Pradesh Tourism (APTDC) & NTR District Administration',
      officialAudit: {
        verified: true,
        status: 'verified_tourism',
        authority: 'NTR District Administration & APTDC',
        linkLabel: 'Official Tourism Information',
        specificallyDiscusses: true,
        previousUrl: 'https://tourism.ap.gov.in/',
        reason: 'The official NTR District eco-tourism page contains a Bhavani Island entry describing its location, boat journey, and gardens.'
      },
      highlights: ['River ferry ride', 'Flat garden promenades', 'Shaded sitting areas'],
      suitableFor: ['kids', 'friends', 'family', 'nature', 'adventure', 'boating'],
      bestTimeToVisit: 'Late afternoon for sunset (4:00 PM – 6:30 PM)'
    },
    {
      id: 'vja-bapu-museum',
      name: 'Bapu Museum (Victoria Jubilee)',
      category: 'cultural',
      description: 'World-class archaeological museum on MG Road housing ancient Buddhist sculptures from Amaravati, prehistoric tools, stone inscriptions, bronzes, and regional royal coins.',
      location: 'MG Road, Buckinghampet',
      city: 'Vijayawada',
      rating: 4.7,
      reviewCount: 5200,
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Bapu_Museum.jpg/960px-Bapu_Museum.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Kalasagary / Wikimedia Commons (CC BY-SA 4.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bapu_Museum.jpg',
      officialUrl: 'https://ntr.ap.gov.in/eco-tourism/',
      officialSourceLabel: 'NTR District Administration (Govt of AP)',
      officialSourceType: 'government',
      officialAuthority: 'NTR District Administration, Government of Andhra Pradesh',
      officialAudit: {
        verified: true,
        status: 'verified_heritage',
        authority: 'NTR District Administration, Government of Andhra Pradesh',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: true,
        previousUrl: 'https://aptourismofficial.com/',
        reason: 'The official NTR District eco-tourism page contains a Victoria Jubilee Museum entry describing the museum and its collection.'
      },
      highlights: ['Rare Buddhist artifacts'],
      suitableFor: ['kids', 'family', 'history', 'culture']
    },
    {
      id: 'vja-kondapalli-fort',
      name: 'Kondapalli Fort',
      category: 'historic',
      description: 'Historic 14th-century hill fortress built by Prolaya Vema Reddy. Located near the artisanal village of Kondapalli, famous worldwide for traditional lightweight wood craft toys (Kondapalli Bommalu).',
      location: 'Kondapalli Hills, 16 km from Vijayawada city',
      city: 'Vijayawada',
      budget: '₹20 entry fee',
      openingHours: '10:00 AM – 5:00 PM',
      accessibility: {
        wheelchairAccessible: false,
        stairCount: 'Cobblestone inclines and fort stairs',
        easyWalking: false,
        notes: 'Vehicular access reaches the lower fort gate, but walking through the battlements requires traversing ancient stone slopes.'
      },
      rating: 4.5,
      reviewCount: 9600,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kondapalli_Fort_Entrance.jpg/800px-Kondapalli_Fort_Entrance.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Gnana Sreenivas / Wikimedia Commons (CC BY-SA 3.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Kondapalli_Fort_Entrance.jpg',
      officialUrl: 'https://ntr.ap.gov.in/tourist-place/kondapalli-fort/',
      officialSourceLabel: 'NTR District Administration (Govt of AP)',
      officialSourceType: 'heritage',
      officialAuthority: 'NTR District Administration & AP Dept of Archaeology',
      officialAudit: {
        verified: true,
        status: 'verified_heritage',
        authority: 'NTR District Administration & AP Dept of Archaeology',
        linkLabel: 'Official Heritage Information',
        specificallyDiscusses: true,
        previousUrl: 'https://tourism.ap.gov.in/',
        reason: 'Replaced generic APTDC homepage with dedicated official district heritage portal page documenting 14th-century Kondapalli Fort, Dargah Darwazah, Tanish Mahal, and artisanal toy village.'
      },
      highlights: ['Historic 14th-century battlements', 'Artisan toy-making village', 'Hilltop forest views'],
      suitableFor: ['friends', 'kids', 'adventure', 'history'],
      bestTimeToVisit: 'Morning or late afternoon'
    },
    {
      id: 'vja-mogalarajapuram-caves',
      name: 'Mogalarajapuram Caves',
      category: 'historic',
      description: 'Historic 5th-century rock-cut cave temples carved directly into rocky hillocks, featuring five sanctums dedicated to Lord Shiva, Trimurti carvings, and Ardhanariswara bas-reliefs.',
      location: 'Siddhartha College Rd, Moghalrajpuram',
      city: 'Vijayawada',
      budget: '₹15 entry fee (ASI)',
      openingHours: '9:00 AM – 5:30 PM',
      accessibility: {
        wheelchairAccessible: false,
        stairCount: 'Approx. 35 rock steps',
        easyWalking: false,
        notes: 'Moderate rock steps to the upper shrine platform.'
      },
      rating: 4.3,
      reviewCount: 3800,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Mogalarajapuram_Caves.jpg/800px-Mogalarajapuram_Caves.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Archaeological Survey of India / Wikimedia Commons (Public Domain)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Mogalarajapuram_Caves.jpg',
      officialUrl: 'https://ntr.ap.gov.in/tourist-place/mogalrajapuram-caves/',
      officialSourceLabel: 'NTR District Administration & ASI Amaravati Circle',
      officialSourceType: 'heritage',
      officialAuthority: 'NTR District Administration & ASI Amaravati Circle',
      officialAudit: {
        verified: true,
        status: 'verified_heritage',
        authority: 'NTR District Administration & ASI Amaravati Circle',
        linkLabel: 'Official Heritage Information',
        specificallyDiscusses: true,
        previousUrl: 'https://asi.nic.in/',
        reason: 'Replaced generic ASI national homepage with dedicated official district heritage listing specifically describing the 5th-century rock-cut sanctuary, Trimurti carvings, and Ardhanariswara sculptures.'
      },
      highlights: ['5th-century rock carvings', 'Ancient Trimurti sculptures', 'Historic heritage'],
      suitableFor: ['history', 'friends'],
      bestTimeToVisit: 'Morning (9:30 AM – 11:30 AM)'
    },
    {
      id: 'vja-gunadala-shrine',
      name: 'Gunadala Mary Matha Shrine',
      category: 'cultural',
      description: 'Prominent Catholic hill shrine established in 1924, featuring a rock grotto with a statue of Our Lady of Lourdes and an iron cross atop the hill overlooking the eastern city plains.',
      location: 'Gunadala Hill, Vijayawada',
      city: 'Vijayawada',
      budget: 'Free entry',
      openingHours: '6:00 AM – 8:30 PM',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'The main church and lower grotto grounds are level with ramp access. Reaching the hilltop cross requires climbing concrete hill steps.'
      },
      rating: 4.6,
      reviewCount: 11400,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Gunadala_Church_Vijayawada.jpg/800px-Gunadala_Church_Vijayawada.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Vaidya / Wikimedia Commons (CC BY-SA 4.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Gunadala_Church_Vijayawada.jpg',
      officialUrl: 'https://www.gunadalamashrine.com/',
      officialSourceLabel: 'Gunadala Mary Matha Shrine Board',
      officialSourceType: 'official_website',
      officialAuthority: 'Gunadala Mary Matha Shrine Board (Diocese of Vijayawada)',
      officialAudit: {
        verified: true,
        status: 'verified_dedicated',
        authority: 'Gunadala Mary Matha Shrine Board (Diocese of Vijayawada)',
        linkLabel: 'Official Website',
        specificallyDiscusses: true,
        reason: 'Dedicated official shrine website providing annual Lourdes festival dates, daily mass timings, grotto history, and pilgrimage guidance.'
      },
      highlights: ['Lourdes rock grotto', 'Peaceful prayer halls', 'Lower ground ramp access'],
      suitableFor: ['family', 'seniors', 'friends'],
      bestTimeToVisit: 'Early morning or evening mass'
    },
    {
      id: 'vja-rajiv-gandhi-park',
      name: 'Rajiv Gandhi Park',
      category: 'nature',
      description: 'Vibrant riverside horticultural park developed by the municipal corporation near the old bus station. Features lush flower beds, musical fountain shows, and miniature animal models.',
      location: 'Near Old Bus Stand, Krishna Riverfront',
      city: 'Vijayawada',
      budget: '₹10 entry fee',
      openingHours: '2:00 PM – 8:30 PM',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Paved, level walking circuits throughout the gardens with benches every 50 meters.'
      },
      rating: 4.2,
      reviewCount: 8200,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Ferris_Wheel_in_Rajiv_Gandhi_Park_%2829951495018%29.jpg/800px-Ferris_Wheel_in_Rajiv_Gandhi_Park_%2829951495018%29.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Flickr user / Wikimedia Commons (CC BY 2.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Ferris_Wheel_in_Rajiv_Gandhi_Park_(29951495018).jpg',
      officialUrl: 'https://vijayawada.cdma.ap.gov.in/',
      officialSourceLabel: 'Vijayawada Municipal Corporation (Managing Authority)',
      officialSourceType: 'government',
      officialAuthority: 'Vijayawada Municipal Corporation (VMC)',
      officialAudit: {
        verified: true,
        status: 'verified_government',
        authority: 'Vijayawada Municipal Corporation (VMC)',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: false,
        reason: 'Official municipal civic authority responsible for managing and maintaining the public horticultural park; labeled accurately as municipal authority information.'
      },
      highlights: ['Paved garden paths', 'Musical fountain', 'Senior-friendly level walking'],
      suitableFor: ['kids', 'family', 'evening', 'friends', 'nature'],
      bestTimeToVisit: '5:00 PM – 7:30 PM'
    },
    {
      id: 'vja-hinkar-thirtha',
      name: 'Hinkar Thirtha Jain Temple',
      category: 'temple',
      description: 'Exquisite Jain temple complex constructed entirely from pure white marble, situated along the highway between Vijayawada and Mangalagiri with tranquil courtyards.',
      location: 'NH-16, Near Mangalagiri, Vijayawada outskirts',
      city: 'Vijayawada',
      budget: 'Free entry',
      openingHours: '6:00 AM – 7:30 PM',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Courtyard is level marble pavement; low entrance thresholds.'
      },
      rating: 4.7,
      reviewCount: 3100,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Hinkar_Thirtha_Jain_Temple.jpg/800px-Hinkar_Thirtha_Jain_Temple.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Durgarao Vuddanti / Wikimedia Commons (CC BY 2.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Hinkar_Thirtha_Jain_Temple.jpg',
      officialUrl: undefined,
      officialSourceLabel: undefined,
      officialSourceType: 'unavailable',
      officialAuthority: 'Shri Hinkar Tirtha Trust',
      officialAudit: {
        verified: false,
        status: 'unavailable',
        authority: 'Shri Hinkar Tirtha Trust',
        linkLabel: 'Official information unavailable',
        specificallyDiscusses: false,
        reason: 'No dedicated official trust or government website exists for this temple. TripMate displays "Official information unavailable" rather than linking to unverified third-party blogs or commercial portals.'
      },
      highlights: ['Intricate white marble architecture', 'Tranquil meditation halls'],
      suitableFor: ['family', 'seniors', 'peaceful'],
      bestTimeToVisit: 'Morning or late afternoon'
    }
  ],
  araku: [
    {
      id: 'araku-borra-caves',
      name: 'Borra Caves',
      category: 'nature',
      description: 'Million-year-old limestone karst caves extending deep into the Ananthagiri hills, illuminated by multicolored lights highlighting stalactites and stalagmites.',
      location: 'Ananthagiri Hills, Visakhapatnam District',
      city: 'Araku Valley',
      budget: '₹80 entry fee',
      openingHours: '10:00 AM – 5:00 PM',
      accessibility: {
        wheelchairAccessible: false,
        stairCount: 'Approximately 200+ damp stone steps inside caverns',
        easyWalking: false,
        notes: 'Challenging interior terrain with damp, slippery walkways and numerous flights of steps.'
      },
      rating: 4.6,
      reviewCount: 29000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Borra_caves_inside.jpg/800px-Borra_caves_inside.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Arkadeepmeta / Wikimedia Commons (CC BY-SA 4.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Borra_caves_inside.jpg',
      officialUrl: 'https://allurisitharamaraju.ap.gov.in/tourist-place/borra-caves/',
      officialSourceLabel: 'Alluri Sitharama Raju District Tourism & APTDC',
      officialSourceType: 'tourism',
      officialAuthority: 'Alluri Sitharama Raju District Administration & APTDC',
      officialAudit: {
        verified: true,
        status: 'verified_tourism',
        authority: 'Alluri Sitharama Raju District Administration & APTDC',
        linkLabel: 'Official Tourism Information',
        specificallyDiscusses: true,
        previousUrl: 'https://tourism.ap.gov.in/',
        reason: 'Replaced generic APTDC homepage with dedicated official district tourism page detailing million-year-old Borra Caves, limestone formations, timings, ticket fees, and travel instructions.'
      }
    },
    {
      id: 'araku-coffee-museum',
      name: 'Araku Tribal Coffee Museum',
      category: 'cultural',
      description: 'Heritage museum dedicated to the cultivation of shade-grown tribal Araku organic coffee with tastings, sensory displays, and bean roasting workshops.',
      location: 'Araku Valley Town Center',
      city: 'Araku Valley',
      budget: '₹20 entry',
      openingHours: '9:00 AM – 8:00 PM',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Flat single-level structure with level entrance and comfortable seated coffee tasting lounge.'
      },
      rating: 4.5,
      reviewCount: 9400,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Coffee_berries_on_branch.jpg/800px-Coffee_berries_on_branch.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Wikimedia Commons (CC BY-SA 3.0)',
      officialUrl: 'https://allurisitharamaraju.ap.gov.in/tourist-place/araku-valley/',
      officialSourceLabel: 'Alluri Sitharama Raju District Administration',
      officialSourceType: 'government',
      officialAuthority: 'Alluri Sitharama Raju District Administration (Govt of AP)',
      officialAudit: {
        verified: true,
        status: 'verified_government',
        authority: 'Alluri Sitharama Raju District Administration',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: true,
        previousUrl: 'https://tourism.ap.gov.in/',
        reason: 'Replaced generic tourism homepage with official district administration portal covering Araku Valley tribal coffee heritage and plantations.'
      },
      highlights: ['Shade-grown organic coffee', 'Tasting room', 'Tribal craft exhibits'],
      suitableFor: ['cultural', 'family', 'peaceful']
    },
    {
      id: 'araku-padmapuram',
      name: 'Padmapuram Botanical Gardens',
      category: 'nature',
      description: 'Historic botanical gardens established in 1942 during World War II, featuring rare flowering trees, orchards, tree-top hanging huts, and a passenger toy train.',
      location: 'Padmapuram, Araku Valley',
      city: 'Araku Valley',
      budget: '₹40 entry fee',
      openingHours: '8:30 AM – 6:00 PM',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Level paved garden pathways with frequent shade benches.'
      },
      rating: 4.4,
      reviewCount: 8200,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Padmapuram_Gardens_Araku.jpg/800px-Padmapuram_Gardens_Araku.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Adityamadhav83 / Wikimedia Commons (CC BY-SA 3.0)',
      officialUrl: 'https://allurisitharamaraju.ap.gov.in/tourist-place/padmapuram-gardens/',
      officialSourceLabel: 'Alluri Sitharama Raju District Administration & ITDA',
      officialSourceType: 'tourism',
      officialAuthority: 'Alluri Sitharama Raju District Administration & ITDA Paderu',
      officialAudit: {
        verified: true,
        status: 'verified_tourism',
        authority: 'Alluri Sitharama Raju District Administration & ITDA',
        linkLabel: 'Official Tourism Information',
        specificallyDiscusses: true,
        previousUrl: 'https://tourism.ap.gov.in/',
        reason: 'Replaced generic APTDC homepage with dedicated official district tourism page covering Padmapuram Gardens historical origins (1942), hanging huts, and toy train.'
      },
      highlights: ['Tree-top hanging huts', 'Miniature toy train', 'Rose and orchid nursery'],
      suitableFor: ['kids', 'family', 'peaceful', 'nature']
    }
  ],
  visakhapatnam: [
    {
      id: 'vizag-submarine',
      name: 'INS Kursura Submarine Museum',
      category: 'cultural',
      description: 'A decommissioned Soviet-built Kalvari-class submarine preserved on the sands of RK Beach, showcasing authentic naval quarters, torpedo rooms, and submarine operations.',
      location: 'Ramakrishna Beach Promenade',
      city: 'Visakhapatnam',
      budget: '₹40 entry',
      openingHours: '2:00 PM – 8:30 PM (Sundays from 10:00 AM)',
      accessibility: {
        wheelchairAccessible: false,
        notes: 'Narrow hatch doors and tight metal stairs inside submarine. RK Beach promenade outside is 100% barrier-free.'
      },
      rating: 4.8,
      reviewCount: 38000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/INS_Kursura_%28S20%29_at_RK_Beach.jpg/800px-INS_Kursura_%28S20%29_at_RK_Beach.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Adityamadhav83 / Wikimedia Commons (CC BY-SA 3.0)',
      imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:INS_Kursura_(S20)_at_RK_Beach.jpg',
      officialUrl: 'https://visakhapatnam.ap.gov.in/tourist-place/sub-marine-museum/',
      officialSourceLabel: 'Visakhapatnam District Administration & VMRDA',
      officialSourceType: 'government',
      officialAuthority: 'Visakhapatnam District Administration & VMRDA',
      officialAudit: {
        verified: true,
        status: 'verified_government',
        authority: 'Visakhapatnam District Administration & VMRDA',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: true,
        previousUrl: 'https://vmrda.gov.in/',
        reason: 'Replaced general VMRDA homepage with dedicated official district tourist place portal page specifically documenting the INS Kursura submarine museum, submarine warfare history, timings, and ticket details.'
      },
      highlights: ['Rare museum inside a real submarine', 'Authentic control room and periscope', 'Naval combat history'],
      suitableFor: ['kids', 'family', 'history', 'cultural']
    },
    {
      id: 'vizag-tu142',
      name: 'TU-142 Aircraft Museum',
      category: 'cultural',
      description: 'A decommissioned Indian Navy Tupolev Tu-142M long-range maritime anti-submarine reconnaissance aircraft preserved opposite Kursura on RK Beach.',
      location: 'Beach Road, Opposite Kursura Submarine Museum',
      city: 'Visakhapatnam',
      budget: '₹70 entry',
      openingHours: '2:00 PM – 8:30 PM (Sundays from 10:30 AM)',
      accessibility: {
        wheelchairAccessible: false,
        notes: 'Aircraft interior reached via exterior staircase; outdoor viewing courtyard is step-free.'
      },
      rating: 4.7,
      reviewCount: 19500,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/TU-142M_Aircraft_Museum_Visakhapatnam.jpg/800px-TU-142M_Aircraft_Museum_Visakhapatnam.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Adityamadhav83 / Wikimedia Commons (CC BY-SA 4.0)',
      officialUrl: 'https://visakhapatnam.ap.gov.in/tourist-place/aircraft-musuem-tu142-aircraft/',
      officialSourceLabel: 'Visakhapatnam District Administration & VMRDA',
      officialSourceType: 'government',
      officialAuthority: 'Visakhapatnam District Administration & VMRDA',
      officialAudit: {
        verified: true,
        status: 'verified_government',
        authority: 'Visakhapatnam District Administration & VMRDA',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: true,
        previousUrl: 'https://vmrda.gov.in/',
        reason: 'Replaced general authority homepage with dedicated official district portal page specifically documenting the Tupolev Tu-142M aircraft museum, exhibits, and simulation facilities.'
      },
      highlights: ['Cockpit flight simulator', 'Anti-submarine torpedoes & depth charges', 'Aviation history'],
      suitableFor: ['kids', 'family', 'history', 'cultural']
    },
    {
      id: 'vizag-kailasagiri',
      name: 'Kailasagiri Hilltop Park',
      category: 'viewpoint',
      description: 'Hilltop park standing 360 feet above sea level, offering 360-degree panoramic views of the curving coastline, harbor, and Eastern Ghats.',
      location: 'Hill Top Rd, Visakhapatnam',
      city: 'Visakhapatnam',
      budget: '₹20 entry (Ropeway/Toy Train separate)',
      openingHours: '6:00 AM – 8:30 PM',
      accessibility: {
        wheelchairAccessible: true,
        notes: 'Vehicles can drive directly to the summit parking. Paved viewpoints and toy train with easy boarding.'
      },
      rating: 4.7,
      reviewCount: 31000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Shiva_Parvathi_Statue_at_Kailasagiri.jpg/800px-Shiva_Parvathi_Statue_at_Kailasagiri.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Jagadeesh DB / Wikimedia Commons (CC BY-SA 4.0)',
      officialUrl: 'https://visakhapatnam.ap.gov.in/tourist-place/kailasagiri/',
      officialSourceLabel: 'Visakhapatnam District Administration & VMRDA',
      officialSourceType: 'government',
      officialAuthority: 'Visakhapatnam District Administration & VMRDA',
      officialAudit: {
        verified: true,
        status: 'verified_government',
        authority: 'Visakhapatnam District Administration & VMRDA',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: true,
        previousUrl: 'https://vmrda.gov.in/',
        reason: 'Replaced general authority homepage with dedicated official district tourist place page covering Kailasagiri 380-acre hilltop park, ropeway, and coast vistas.'
      },
      highlights: ['Colossal Shiva Parvathi sculpture', 'Panoramic coastline viewpoints', 'Scenic circular toy train'],
      suitableFor: ['family', 'kids', 'peaceful', 'viewpoint']
    },
    {
      id: 'vizag-rushikonda',
      name: 'Rushikonda Beach (Blue Flag)',
      category: 'nature',
      description: 'Internationally certified Blue Flag beach recognized for pristine golden sands, clean waters, and water adventure sports surrounded by Eastern Ghat hillocks.',
      location: 'Bheemili Road, Rushikonda',
      city: 'Visakhapatnam',
      budget: 'Free beach entry',
      openingHours: 'Open daily sunrise to sunset',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Blue Flag eco-friendly boardwalk and amphibious beach access ramps available.'
      },
      rating: 4.6,
      reviewCount: 42000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Rushikonda_Beach_Visakhapatnam.jpg/800px-Rushikonda_Beach_Visakhapatnam.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Adityamadhav83 / Wikimedia Commons (CC BY-SA 3.0)',
      officialUrl: 'https://visakhapatnam.ap.gov.in/tourist-place/rushikonda-beach/',
      officialSourceLabel: 'Visakhapatnam District Administration & APTDC',
      officialSourceType: 'tourism',
      officialAuthority: 'Visakhapatnam District Administration',
      officialAudit: {
        verified: true,
        status: 'verified_tourism',
        authority: 'Visakhapatnam District Administration & APTDC',
        linkLabel: 'Official Tourism Information',
        specificallyDiscusses: true,
        previousUrl: 'https://tourism.ap.gov.in/',
        reason: 'Replaced generic APTDC homepage with dedicated official district portal page detailing Rushikonda Blue Flag beach standards, water sports, and visitor facilities.'
      },
      highlights: ['Blue Flag certified clean water', 'Scenic mountain backdrop', 'Speed boating & surfing'],
      suitableFor: ['friends', 'family', 'peaceful', 'nature']
    }
  ],
  gandikota: [
    {
      id: 'gandikota-canyon',
      name: 'Pennar River Canyon Viewpoint',
      category: 'viewpoint',
      description: 'Spectacular geological gorge cut into red granite cliffs by the Pennar River, known as the Grand Canyon of India with sunset cliff panoramas.',
      location: 'Gandikota Fort Complex',
      city: 'Gandikota',
      budget: 'Free access',
      openingHours: 'Sunrise to Sunset',
      accessibility: {
        wheelchairAccessible: false,
        notes: 'Rocky, uneven natural cliff paths without railings. Moderate foot coordination needed near cliff edges.'
      },
      rating: 4.8,
      reviewCount: 16400,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/The_Grand_Canyon_of_India_Gandikota.jpg/800px-The_Grand_Canyon_of_India_Gandikota.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Bikashrd / Wikimedia Commons (CC BY-SA 4.0)',
      officialUrl: 'https://kadapa.ap.gov.in/tourist-place/gandikota/',
      officialSourceLabel: 'YSR Kadapa District Administration (Govt of AP)',
      officialSourceType: 'government',
      officialAuthority: 'YSR Kadapa District Administration, Government of Andhra Pradesh',
      officialAudit: {
        verified: true,
        status: 'verified_government',
        authority: 'YSR Kadapa District Administration, Government of Andhra Pradesh',
        linkLabel: 'Official Government Information',
        specificallyDiscusses: true,
        previousUrl: 'https://asi.nic.in/',
        reason: 'Replaced generic ASI national homepage with dedicated official Kadapa District Administration entry specifically covering the Gandikota Pennar River gorge and viewpoints.'
      },
      highlights: ['Crimson sandstone gorge', 'Spectacular sunset panorama', 'Pennar river canyon floor'],
      suitableFor: ['friends', 'peaceful', 'viewpoint', 'nature']
    },
    {
      id: 'gandikota-fort',
      name: 'Gandikota Fort & Madhavaraya Temple',
      category: 'historic',
      description: 'Historic 13th-century red sandstone fortress founded by Kapa Raja, housing a grand four-storey Vijayanagara-style temple gopuram, massive stone granary, and royal prison.',
      location: 'Gandikota Village, Jammalamadugu',
      city: 'Gandikota',
      budget: 'Free access (ASI monument)',
      openingHours: '6:00 AM – 6:00 PM',
      accessibility: {
        wheelchairAccessible: false,
        notes: 'Ancient stone thresholds and uneven historic cobblestone paths.'
      },
      rating: 4.7,
      reviewCount: 14800,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Madhavaraya_temple_gopuram%2C_Gandikota.jpg/800px-Madhavaraya_temple_gopuram%2C_Gandikota.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Bikashrd / Wikimedia Commons (CC BY-SA 4.0)',
      officialUrl: 'https://kadapa.ap.gov.in/tourist-place/gandikota-fort/',
      officialSourceLabel: 'YSR Kadapa District Administration & ASI Amaravati Circle',
      officialSourceType: 'heritage',
      officialAuthority: 'YSR Kadapa District Administration & ASI Amaravati Circle',
      officialAudit: {
        verified: true,
        status: 'verified_heritage',
        authority: 'YSR Kadapa District Administration & ASI Amaravati Circle',
        linkLabel: 'Official Heritage Information',
        specificallyDiscusses: true,
        previousUrl: 'https://asi.nic.in/',
        reason: 'Replaced generic ASI national homepage with dedicated official district heritage portal page covering Gandikota Fort, 101 bastions, Madhavaraya Temple gopuram, and Jamia Masjid.'
      },
      highlights: ['Soaring 4-storey stone gopuram', 'Ancient granary chambers', 'Historic fort battlements'],
      suitableFor: ['history', 'friends', 'family', 'cultural']
    }
  ],
  kerala: [
    {
      id: 'kerala-alleppey',
      name: 'Alleppey Backwaters (Vembanad Lake)',
      category: 'nature',
      description: 'Vast network of interconnected palm-fringed lagoons, emerald canals, and paddy fields navigated by traditional thatched kettuvallam houseboats.',
      location: 'Punnamada Finishing Point, Alappuzha',
      city: 'Kerala',
      budget: 'Ferry: ₹25-₹100; Houseboats: ₹6,500+',
      openingHours: 'Cruises operate 8:00 AM – 5:30 PM',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Boarding jetties provide assisted gangways; houseboats feature single-level air-conditioned suites.'
      },
      rating: 4.9,
      reviewCount: 52000,
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://www.keralatourism.org/destination/alappuzha-backwaters/60',
      officialSourceLabel: 'Department of Tourism, Government of Kerala',
      officialSourceType: 'tourism',
      officialAuthority: 'Department of Tourism, Government of Kerala',
      officialAudit: {
        verified: true,
        status: 'verified_tourism',
        authority: 'Department of Tourism, Government of Kerala',
        linkLabel: 'Official Tourism Information',
        specificallyDiscusses: true,
        previousUrl: 'https://www.keralatourism.org/',
        reason: 'Replaced generic Kerala Tourism homepage with dedicated official destination page (Destination ID 60) specifically documenting Alappuzha backwaters, houseboat cruise routes, and boarding jetties.'
      },
      highlights: ['Serene palm-lined lagoons', 'Traditional Kettuvallam dining', 'Tranquil village life'],
      suitableFor: ['peaceful', 'family', 'nature']
    },
    {
      id: 'kerala-mattupetty',
      name: 'Mattupetty Dam & Munnar Tea Hills',
      category: 'nature',
      description: 'Concrete gravity dam nestled amidst mist-covered Anamudi tea mountains, offering calm speedboating on the reservoir and tea plantation walks.',
      location: 'Munnar-Top Station Hwy, Mattupetty',
      city: 'Kerala',
      budget: '₹10 entry fee',
      openingHours: '9:30 AM – 5:00 PM',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Paved walkway along the dam crest with level surface.'
      },
      rating: 4.7,
      reviewCount: 31000,
      imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://www.keralatourism.org/destination/mattupetty-dam-munnar/216',
      officialSourceLabel: 'Department of Tourism, Government of Kerala',
      officialSourceType: 'tourism',
      officialAuthority: 'Department of Tourism, Government of Kerala & KHTC',
      officialAudit: {
        verified: true,
        status: 'verified_tourism',
        authority: 'Department of Tourism, Government of Kerala & Kerala Hydel Tourism Centre',
        linkLabel: 'Official Tourism Information',
        specificallyDiscusses: true,
        previousUrl: 'https://www.keralatourism.org/',
        reason: 'Replaced generic Kerala Tourism homepage with dedicated official destination page (Destination ID 216) specifically covering Mattupetty Dam, reservoir boating, and Munnar tea hills.'
      },
      highlights: ['Reflective mountain reservoir', 'Aromatic tea plantations', 'Cool highland breezes'],
      suitableFor: ['peaceful', 'family', 'nature']
    },
    {
      id: 'kerala-fort-kochi',
      name: 'Fort Kochi & Chinese Fishing Nets',
      category: 'historic',
      description: 'Historic coastal quarter showcasing cantilevered Chinese fishing nets (*Cheenavala*), colonial Dutch and Portuguese heritage churches, and spice trading lanes.',
      location: 'River Road, Fort Kochi',
      city: 'Kerala',
      budget: 'Free promenade access',
      openingHours: 'Open 24 hours (Best at sunset)',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Level seaside walkway along the Arabian Sea.'
      },
      rating: 4.6,
      reviewCount: 41000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Chinese_fishing_nets_Kochi.jpg/800px-Chinese_fishing_nets_Kochi.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Wikimedia Commons (CC BY-SA 3.0)',
      officialUrl: 'https://www.keralatourism.org/destination/fort-kochi/422',
      officialSourceLabel: 'Department of Tourism, Government of Kerala',
      officialSourceType: 'heritage',
      officialAuthority: 'Department of Tourism, Government of Kerala',
      officialAudit: {
        verified: true,
        status: 'verified_heritage',
        authority: 'Department of Tourism, Government of Kerala',
        linkLabel: 'Official Heritage Information',
        specificallyDiscusses: true,
        previousUrl: 'https://www.keralatourism.org/',
        reason: 'Replaced generic Kerala Tourism homepage with dedicated official destination page (Destination ID 422) specifically documenting Fort Kochi historic quarters, Chinese fishing nets, and colonial landmarks.'
      },
      highlights: ['Iconic cantilevered fishing nets', 'Vasco da Gama resting place', 'Seaside sunset cafes'],
      suitableFor: ['history', 'friends', 'cultural']
    }
  ],
  goa: [
    {
      id: 'goa-bom-jesus',
      name: 'Basilica of Bom Jesus (Old Goa)',
      category: 'historic',
      description: 'UNESCO World Heritage 16th-century baroque Catholic basilica holding the sacred mortal remains of St. Francis Xavier, constructed from black laterite stone.',
      location: 'Old Goa Road, Velha Goa',
      city: 'Goa',
      budget: 'Free entry',
      openingHours: '9:00 AM – 6:30 PM (Sundays from 10:30 AM)',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Step-free ramped entrance to nave and wide marble sanctuary floors.'
      },
      rating: 4.8,
      reviewCount: 68000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Basilica_of_Bom_Jesus_exterior.jpg/800px-Basilica_of_Bom_Jesus_exterior.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'P.S.Sujay / Wikimedia Commons (CC BY-SA 3.0)',
      officialUrl: 'https://goa-tourism.com/sightseeing/churches/basilica-of-bom-jesus/',
      officialSourceLabel: 'Goa Tourism Development Corporation (GTDC) & ASI Goa Circle',
      officialSourceType: 'heritage',
      officialAuthority: 'Goa Tourism Development Corporation (GTDC) & ASI Goa Circle',
      officialAudit: {
        verified: true,
        status: 'verified_heritage',
        authority: 'Goa Tourism Development Corporation & ASI Goa Circle',
        linkLabel: 'Official Heritage Information',
        specificallyDiscusses: true,
        previousUrl: 'https://asi.nic.in/',
        reason: 'Replaced generic ASI national homepage with dedicated official Goa Tourism heritage monument page specifically covering the UNESCO World Heritage Basilica of Bom Jesus, St. Francis Xavier sacred relics, and visiting guidelines.'
      },
      highlights: ['UNESCO World Heritage monument', 'Gilded 16th-century baroque altar', 'Intricate laterite stone carving'],
      suitableFor: ['history', 'cultural', 'family']
    },
    {
      id: 'goa-fort-aguada',
      name: 'Fort Aguada & Coastal Lighthouse',
      category: 'historic',
      description: 'Formidable 17th-century Portuguese fortress and freshwater reservoir perched on Sinquerim headland with panoramic Arabian Sea views and historic 1864 lighthouse.',
      location: 'Sinquerim Headland, Candolim',
      city: 'Goa',
      budget: '₹25 entry fee',
      openingHours: '9:30 AM – 6:00 PM',
      accessibility: {
        wheelchairAccessible: false,
        notes: 'Upper ramparts reached by moderate stone ramps and rampart steps.'
      },
      rating: 4.6,
      reviewCount: 74000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Fort_Aguada_Goa.jpg/800px-Fort_Aguada_Goa.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Adityamadhav83 / Wikimedia Commons (CC BY-SA 3.0)',
      officialUrl: 'https://goa-tourism.com/sightseeing/forts/fort-aguada/',
      officialSourceLabel: 'Goa Tourism Development Corporation (GTDC)',
      officialSourceType: 'heritage',
      officialAuthority: 'Goa Tourism Development Corporation (GTDC) & ASI Goa Circle',
      officialAudit: {
        verified: true,
        status: 'verified_heritage',
        authority: 'Goa Tourism Development Corporation (GTDC)',
        linkLabel: 'Official Heritage Information',
        specificallyDiscusses: true,
        previousUrl: 'https://goa-tourism.com/',
        reason: 'Replaced generic Goa tourism homepage with dedicated official fort portal entry specifically documenting 17th-century Fort Aguada, freshwater springs, and historic lighthouse.'
      },
      highlights: ['17th-century bastion walls', 'Historic 4-tiered lighthouse', 'Unobstructed Arabian Sea horizons'],
      suitableFor: ['history', 'friends', 'viewpoint']
    },
    {
      id: 'goa-fontainhas',
      name: 'Fontainhas Latin Quarter (Panaji)',
      category: 'cultural',
      description: 'Historic heritage quarter of Panaji lined with vivid pastel yellow, green, and blue Portuguese villas, tiled eaves, cast-iron balconies, and tranquil heritage cafes.',
      location: 'Panaji Old Quarter, Near Ourem Creek',
      city: 'Goa',
      budget: 'Free public walking area',
      openingHours: 'Open daily (Best morning or late afternoon)',
      accessibility: {
        wheelchairAccessible: true,
        easyWalking: true,
        notes: 'Gentle, paved street-level walking through calm neighborhood lanes.'
      },
      rating: 4.7,
      reviewCount: 22000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Fontainhas_Panjim_Goa.jpg/800px-Fontainhas_Panjim_Goa.jpg',
      hasVerifiedPhoto: true,
      imageAttribution: 'Adityamadhav83 / Wikimedia Commons (CC BY-SA 4.0)',
      officialUrl: 'https://goa-tourism.com/sightseeing/heritage/fontainhas-latin-quarter/',
      officialSourceLabel: 'Goa Tourism Development Corporation (GTDC)',
      officialSourceType: 'tourism',
      officialAuthority: 'Goa Tourism Development Corporation (GTDC) & City of Panaji',
      officialAudit: {
        verified: true,
        status: 'verified_tourism',
        authority: 'Goa Tourism Development Corporation (GTDC)',
        linkLabel: 'Official Tourism Information',
        specificallyDiscusses: true,
        previousUrl: 'https://goa-tourism.com/',
        reason: 'Replaced generic Goa tourism homepage with dedicated official heritage quarter page documenting Fontainhas Latin Quarter history, pastel architecture, and walking tour instructions.'
      },
      highlights: ['Vibrant colonial architecture', 'Artisanal Goan bakeries', 'Art galleries and cafes'],
      suitableFor: ['history', 'friends', 'peaceful']
    }
  ]
};

export const VERIFIED_RESTAURANTS: Record<string, Restaurant[]> = {
  vijayawada: [
    {
      id: 'rest-vja-minerva',
      name: 'Minerva Grand Vegetarian',
      cuisine: 'Traditional Andhra & South Indian Pure Vegetarian',
      description: 'Refined, quiet dining room renowned for authentic Andhra thalis, crispy pesarattu, and aromatic filter coffee.',
      location: 'MG Road, Labbipet',
      city: 'Vijayawada',
      priceRange: '$$',
      openingHours: '7:00 AM – 10:30 PM',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://minervagrand.com/vijayawada.html',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'Minerva Group of Hotels & Restaurants',
      specialties: ['Gongura Rice', 'Full Andhra Meal on Plantain Leaf', 'Pesarattu Upma', 'Avakaya Thali'],
      popularDishes: ['Andhra Vegetarian Thali', 'Ghee Pesarattu Upma', 'Avakaya Rice with Pure Ghee', 'Special South Indian Filter Coffee'],
      dietaryOptions: ['Pure Vegetarian', 'Jain Options Available'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: true,
        notes: 'Direct street level entrance with elevator access, wide tables, and senior-friendly comfortable cushioned chairs.'
      }
    },
    {
      id: 'rest-vja-sweet-magic',
      name: 'Sweet Magic Family Restaurant',
      cuisine: 'South Indian, Biryani & Traditional Andhra Sweets',
      description: 'Beloved family dining destination serving flavorful coastal Andhra curries, fragrant biryanis, and fresh Pootharekulu.',
      location: 'Near Benz Circle, Ring Road',
      city: 'Vijayawada',
      priceRange: '$$',
      openingHours: '11:00 AM – 11:00 PM',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://sweetmagicfoods.com/',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'Sweet Magic Foods (P) Ltd',
      specialties: ['Ulavacharu Biryani', 'Kaju Paneer Curry', 'Pootharekulu Sweet'],
      popularDishes: ['Ulavacharu Chicken Biryani', 'Paneer Butter Masala', 'Mutton Fry Piece Biryani', 'Dry Fruit Pootharekulu'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: true,
        notes: 'Ramped entrance and spacious ground-floor seating.'
      }
    },
    {
      id: 'rest-vja-babai-hotel',
      name: 'Babai Hotel (Heritage Since 1942)',
      cuisine: 'Traditional Andhra Breakfast & South Indian Vegetarian',
      description: 'Legendary heritage breakfast spot founded in 1942, famed across South India for its piping-hot fluffy idlis topped with homemade white butter (venna) and spicy podi, ghee dosas, and filter coffee.',
      location: 'Nageswara Rao Pantulu Road, Gandhi Nagar',
      city: 'Vijayawada',
      priceRange: '$',
      openingHours: '6:00 AM – 1:00 PM & 4:30 PM – 10:00 PM',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: undefined,
      officialSourceLabel: undefined,
      officialSourceType: 'unavailable',
      officialAuthority: 'Traditional Heritage Eatery (Est. 1942)',
      specialties: ['Babai Butter Idli (Venna Idli)', 'Upma Dosa with Ghee', 'Pesarattu Upma', 'Filter Coffee'],
      popularDishes: ['Babai Special Venna Idli (with cold homemade white butter & podi)', 'Rava Dosa with Ginger Chutney', 'Special Ghee Pongal'],
      dietaryOptions: ['Pure Vegetarian'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: true,
        notes: 'Ground-floor entry with quick service seating.'
      }
    },
    {
      id: 'rest-vja-ramayya',
      name: 'Sri Ramayya Mess',
      cuisine: 'Authentic Coastal Andhra Meals & Thali',
      description: 'Iconic traditional mess renowned for serving an extensive, unhurried Andhra banana-leaf meal loaded with fresh podis, raw mango chutneys, drumstick sambar, and hot ghee.',
      location: 'Governorpet, Near Kaleswara Rao Market',
      city: 'Vijayawada',
      priceRange: '$$',
      openingHours: '11:30 AM – 3:30 PM & 7:00 PM – 10:30 PM',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: undefined,
      officialSourceLabel: undefined,
      officialSourceType: 'unavailable',
      officialAuthority: 'Independent Traditional Mess',
      specialties: ['Full Andhra Bhojanam on Plantain Leaf', 'Gongura Pachadi', 'Kandi Podi with Ghee', 'Natukodi Pulusu'],
      popularDishes: ['Unlimited Traditional Andhra Veg Bhojanam', 'Royyala Vepudu (Prawn Fry)', 'Gongura Mutton', 'Perugu (Curd) with Chutneys'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: true,
        notes: 'Ground-floor dining hall with family seating.'
      }
    },
    {
      id: 'rest-vja-gateway-gaddi',
      name: 'GAD at Vivanta by Taj',
      cuisine: 'Contemporary Coastal Andhra & Global Dining',
      description: 'Elegant all-day dining restaurant offering signature regional Andhra delicacies and soothing international fare in an upscale ambience.',
      location: 'MG Road, Governorpet',
      city: 'Vijayawada',
      priceRange: '$$$',
      openingHours: '6:30 AM – 11:00 PM',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://www.vivantahotels.com/en-in/vivanta-vijayawada-mg-road/restaurants/gad/',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'IHCL / Vivanta Vijayawada',
      specialties: ['Royyala Vepudu (Prawn Roast)', 'Nellore Chapala Pulusu', 'Chettinad Curry'],
      popularDishes: ['Nellore Fish Curry (Chapala Pulusu)', 'Guntur Mirapakaya Kodi', 'Breakfast Buffet spread', 'Kodi Pulao'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: true,
        notes: 'Full luxury hotel accessibility: valet parking, zero-step entry, elevator, and ADA-compliant restrooms.'
      }
    },
    {
      id: 'rest-vja-cross-avenue',
      name: 'Cross Avenue at The Gateway Hotel',
      cuisine: 'Multi-Cuisine, Coastal Seafood & Continental',
      description: 'Sophisticated fine-dining restaurant inside The Gateway Hotel offering an expansive buffet, coastal Andhra delicacies, and serene pool-facing seating.',
      location: 'MG Road, Labbipet',
      city: 'Vijayawada',
      priceRange: '$$$',
      openingHours: '24 Hours Open',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://www.vivantahotels.com/en-in/vivanta-vijayawada-mg-road/restaurants/',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'IHCL / The Gateway Hotel',
      specialties: ['Coastal Crab Curry', 'Dum Gosht Biryani', 'Grilled King Fish', 'Sunday Brunch Buffet'],
      popularDishes: ['Fresh Catch Coastal Crab Masala', 'Dum Biryani with Mirchi ka Salan', 'Continental Pasta Station'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: true,
        notes: 'Step-free luxury hotel entrance with valet parking and elevators.'
      }
    },
    {
      id: 'rest-vja-bbq-nation',
      name: 'Barbeque Nation Vijayawada',
      cuisine: 'Live Grills, Barbeque, North Indian & Biryani',
      description: 'Popular casual grill dining with live table grills, expansive buffet stations, crispy corn, tandoori skewers, and dessert counter.',
      location: 'Leela Heights, MG Road',
      city: 'Vijayawada',
      priceRange: '$$$',
      openingHours: '12:00 PM – 3:30 PM & 7:00 PM – 11:00 PM',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://www.barbeque-nation.com/restaurants/vijayawada/mg-road',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'Barbeque Nation Hospitality Ltd',
      specialties: ['Crispy Corn', 'Peri Peri Prawns', 'Cajun Spiced Potatoes', 'Kulfi Nation'],
      popularDishes: ['Live BBQ Skewers', 'Cajun Spiced Potato', 'Angoori Gulab Jamun', 'Assorted Kulfis'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: false,
        notes: 'Commercial complex with elevator access.'
      }
    },
    {
      id: 'rest-vja-tfl',
      name: 'The Food Lounge (TFL)',
      cuisine: 'Contemporary Andhra, Biryani & Chinese',
      description: 'Vibrant family and youth restaurant loved by friends and groups for fragrant pot biryanis, crispy appetizers, and lively casual dining.',
      location: 'Near Benz Circle, Ring Road',
      city: 'Vijayawada',
      priceRange: '$$',
      openingHours: '11:00 AM – 11:00 PM',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: undefined,
      officialSourceLabel: undefined,
      officialSourceType: 'unavailable',
      officialAuthority: 'Independent Local Restaurant',
      specialties: ['Pot Lam Biryani', 'Apollo Fish', 'Dragon Chicken', 'Gongura Paneer'],
      popularDishes: ['Special Pot Lam Chicken Biryani', 'Crispy Apollo Fish', 'Gongura Chicken Curry', 'Butter Naan'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections'],
      accessibility: {
        wheelchairAccessible: true,
        groundFloor: true,
        notes: 'Spacious seating suitable for large friend gatherings.'
      }
    }
  ],
  araku: [
    {
      id: 'rest-araku-hillview',
      name: 'Hill View Restaurant',
      cuisine: 'Tribal Regional Specialties & Andhra Meals',
      description: 'Popular valley restaurant celebrated for authentic tribal bamboo chicken, local millet dishes, and fresh Andhra thalis.',
      location: 'Near Padmapuram Junction, Araku Valley',
      city: 'Araku Valley',
      priceRange: '$$',
      openingHours: '11:00 AM – 10:00 PM',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: undefined,
      officialSourceLabel: undefined,
      officialSourceType: 'unavailable',
      officialAuthority: 'Local Valley Eatery',
      specialties: ['Araku Bamboo Chicken', 'Ragi Sangati', 'Country Chicken Curry', 'Andhra Thali'],
      popularDishes: ['Authentic Araku Bamboo Chicken (slow-cooked inside forest bamboo without oil)', 'Rayalaseema Ragi Mudda with Natukodi Pulusu'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections']
    },
    {
      id: 'rest-araku-vasundhara',
      name: 'Vasundhara Restaurant',
      cuisine: 'South Indian Vegetarian & Tiffins',
      description: 'Clean, dependable family dining spot in Araku town serving hot ghee dosas, traditional vegetarian meals, and Araku organic coffee.',
      location: 'Main Road, Araku Valley Town',
      city: 'Araku Valley',
      priceRange: '$',
      openingHours: '7:00 AM – 9:30 PM',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: undefined,
      officialSourceLabel: undefined,
      officialSourceType: 'unavailable',
      officialAuthority: 'Local Town Restaurant',
      specialties: ['South Indian Thali', 'Pesarattu', 'Araku Filter Coffee'],
      popularDishes: ['Unlimited Andhra Veg Thali', 'Crispy Ghee Roast Dosa'],
      dietaryOptions: ['Pure Vegetarian']
    }
  ],
  visakhapatnam: [
    {
      id: 'rest-vizag-seainn',
      name: 'Sea Inn (Raju Gari Dhaba)',
      cuisine: 'Authentic Coastal Andhra & Seafood',
      description: 'Famed seaside dining institution situated near Rushikonda, celebrated across the state for piping-hot spicy crab roast, prawn fry, and fish pulusu.',
      location: 'Rushikonda Beach Road, Visakhapatnam',
      city: 'Visakhapatnam',
      priceRange: '$$',
      openingHours: '12:00 PM – 4:00 PM & 7:00 PM – 10:30 PM',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: undefined,
      officialSourceLabel: undefined,
      officialSourceType: 'unavailable',
      officialAuthority: 'Independent Coastal Dhaba',
      specialties: ['Royyala Vepudu (Prawn Fry)', 'Crab Masala Roast', 'Nellore Chapala Pulusu', 'Chicken Biryani'],
      popularDishes: ['Spicy Sea Crab Roast', 'Tiger Prawns Fry with Steamed Rice and Ghee', 'Vanjaram Fish Fry'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections']
    },
    {
      id: 'rest-vizag-dharani',
      name: 'Dharani Restaurant at Dasapalla',
      cuisine: 'Traditional Pure Vegetarian Andhra & South Indian',
      description: 'Renowned fine-dining vegetarian haven serving lavish Andhra bhojanam with assorted podis, fresh chutneys, guttivankaya, and sweets in a calm setting.',
      location: 'Hotel Dasapalla, Suryabagh, Jagadamba Junction',
      city: 'Visakhapatnam',
      priceRange: '$$',
      openingHours: '12:00 PM – 3:30 PM & 7:00 PM – 10:30 PM',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://dasapallahotels.com/dining/',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'Dasapalla Hotels Group',
      specialties: ['Royal Andhra Thali', 'Guttivankaya Kura', 'Avakaya Muddapappu Annam'],
      popularDishes: ['Traditional Plantain Leaf Veg Bhojanam with Pure Ghee and Podis', 'Special Paneer Tikka Masala'],
      dietaryOptions: ['Pure Vegetarian', 'Jain Options Available']
    }
  ],
  gandikota: [
    {
      id: 'rest-gandikota-haritha',
      name: 'Haritha Restaurant Gandikota',
      cuisine: 'Rayalaseema Regional Meals & South Indian',
      description: 'Official APTDC dining facility directly adjacent to the historic fort entrance, offering fresh hot South Indian vegetarian meals, Ragi Sangati, and refreshments.',
      location: 'APTDC Haritha Resort Complex, Gandikota',
      city: 'Gandikota',
      priceRange: '$',
      openingHours: '7:30 AM – 10:00 PM',
      rating: 4.2,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://tourism.ap.gov.in/',
      officialSourceLabel: 'Official Tourism Information',
      officialSourceType: 'tourism',
      officialAuthority: 'Andhra Pradesh Tourism Development Corporation (APTDC)',
      specialties: ['Rayalaseema Veg Thali', 'Ragi Sangati with Natukodi Pulusu', 'Hot Tea and Snacks'],
      popularDishes: ['Freshly cooked South Indian Thali with Sambar, Rasam & Curd', 'Ragi Mudda with Spicy Curry'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections']
    }
  ],
  kerala: [
    {
      id: 'rest-kerala-paragon',
      name: 'Paragon Restaurant',
      cuisine: 'Authentic Malabar, Coastal Kerala & Biryani',
      description: 'Internationally celebrated culinary landmark offering world-renowned Malabar chicken biryani, tender spiced mutton, and coastal seafood curries.',
      location: 'Lulu Mall / Marine Drive, Kochi & Calicut',
      city: 'Kerala',
      priceRange: '$$',
      openingHours: '11:30 AM – 11:00 PM',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://www.paragonrestaurant.net/',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'Paragon Restaurant Group',
      specialties: ['Malabar Dum Biryani', 'Alleppey Fish Curry', 'Appam with Stew', 'Squid Roast'],
      popularDishes: ['Authentic Malabar Chicken Dum Biryani with Date Chutney', 'Karimeen Pollichathu in Banana Leaf'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections']
    },
    {
      id: 'rest-kerala-grand',
      name: 'Grand Pavilion at Grand Hotel',
      cuisine: 'Traditional Kerala Sadhya & Seafood',
      description: 'Iconic heritage dining destination in Kochi famous for serving the grand Kerala plantain-leaf feast with over 20 authentic preparations.',
      location: 'MG Road, Ernakulam, Kochi',
      city: 'Kerala',
      priceRange: '$$',
      openingHours: '12:00 PM – 3:30 PM & 7:00 PM – 10:30 PM',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://www.grandhotelkochi.com/dining.html',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'Grand Hotel Kochi',
      specialties: ['Kerala Veg Sadhya on Banana Leaf', 'Karimeen Pollichathu', 'Prawn Theeyal'],
      popularDishes: ['Traditional Kerala Feast with Payasam', 'Spicy Chemmeen (Prawn) Roast with Kerala Parotta'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections']
    }
  ],
  goa: [
    {
      id: 'rest-goa-wharf',
      name: 'The Fisherman\'s Wharf',
      cuisine: 'Authentic Goan Seafood & Continental',
      description: 'Charming waterfront restaurant overlooking the river, serving authentic Goan prawn balchao, kingfish peri-peri, and wood-fired curries.',
      location: 'Campal, Panaji & Cavelossim',
      city: 'Goa',
      priceRange: '$$$',
      openingHours: '12:00 PM – 11:30 PM',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://thefishermanswharf.in/',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'The Fisherman\'s Wharf Group',
      specialties: ['Goan Fish Curry Rice', 'Prawn Balchao', 'Crab Xec Xec', 'Bebinca with Vanilla Ice Cream'],
      popularDishes: ['Authentic Goan Surmai Curry with Red Rice', 'Butter Garlic Tiger Prawns', 'Traditional Bebinca Dessert'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections']
    },
    {
      id: 'rest-goa-mums',
      name: 'Mum\'s Kitchen',
      cuisine: 'Heritage Goan Christian & Hindu Family Recipes',
      description: 'Award-winning heritage culinary sanctuary dedicated to preserving centuries-old domestic Goan recipes cooked with local spices and coconut vinegar.',
      location: 'Dayanand Bandodkar Marg, Panaji',
      city: 'Goa',
      priceRange: '$$$',
      openingHours: '12:00 PM – 3:30 PM & 7:00 PM – 11:00 PM',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      hasVerifiedPhoto: true,
      imageAttribution: 'Unsplash (Free Commercial License)',
      officialUrl: 'https://mumskitchengoa.com/',
      officialSourceLabel: 'Official Website',
      officialSourceType: 'official_website',
      officialAuthority: 'Mum\'s Kitchen Goa',
      specialties: ['Pork Vindalho', 'Fish Hooman', 'Chourico Pav', 'Goan Khatkhate'],
      popularDishes: ['Kingfish Curry in Coconut Milk (Fish Hooman)', 'Authentic Spiced Crab Masala', 'Vegetarian Goan Khatkhate Stew'],
      dietaryOptions: ['Vegetarian & Non-Vegetarian Sections']
    }
  ]
};

export const VERIFIED_HOTELS: Record<string, Hotel[]> = {
  vijayawada: [
    {
      id: 'hotel-vja-vivanta',
      name: 'Vivanta Vijayawada, MG Road',
      category: 'luxury',
      description: 'Upscale 5-star hotel in the heart of Vijayawada featuring calm soundproofed rooms, outdoor rooftop pool, and multiple fine-dining restaurants.',
      location: 'MG Road, Opposite PWD Grounds',
      city: 'Vijayawada',
      pricePerNight: '₹5,800 - ₹8,500',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://www.vivantahotels.com/en-in/vivanta-vijayawada-mg-road/',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'IHCL / Vivanta Hotels',
      amenities: ['Free High-Speed Wi-Fi', 'Swimming Pool', 'Spa & Wellness', 'Valet Parking', '24h Room Service', 'Doctor on Call'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        accessibleRooms: true,
        notes: 'Accessible rooms with grab bars, wide doorways, walk-in showers with bench, and roll-in wheelchair clearance.'
      }
    },
    {
      id: 'hotel-vja-novotel',
      name: 'Novotel Vijayawada Varun',
      category: 'luxury',
      description: 'Modern luxury hotel with panoramic views of the city hills, infinity pool, fitness center, and dedicated executive floor lounge.',
      location: 'Near Benz Circle, Bharathi Nagar',
      city: 'Vijayawada',
      pricePerNight: '₹6,200 - ₹9,400',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://all.accor.com/hotel/9550/index.en.shtml',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'Accor Hospitality Group',
      amenities: ['Infinity Pool', 'Spa', 'Executive Lounge', 'Electric Car Charging', 'Rooftop Bar'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        accessibleRooms: true,
        notes: 'Fully step-free layout from porte-cochère to rooms and restaurants.'
      }
    },
    {
      id: 'hotel-vja-minerva',
      name: 'Minerva Grand Vijayawada',
      category: 'boutique',
      description: 'Centrally located boutique business hotel known for warm hospitality, comfortable bedding, and convenient proximity to railway station and temple.',
      location: 'Foxxconn Road / MG Road Junction',
      city: 'Vijayawada',
      pricePerNight: '₹3,400 - ₹4,800',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://minervagrand.com/vijayawada.html',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'Minerva Group of Hotels',
      amenities: ['Complimentary Breakfast', 'High-Speed Wi-Fi', 'Banquet Hall', 'Airport Shuttle'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        accessibleRooms: false,
        notes: 'Elevator access to all room levels; quiet corridors suitable for family and senior travelers.'
      }
    }
  ],
  araku: [
    {
      id: 'hotel-araku-haritha',
      name: 'Haritha Valley Resort Araku (APTDC)',
      category: 'boutique',
      description: 'Peaceful state tourism resort located in lush valley surroundings, featuring independent cottages, green gardens, and an on-site restaurant.',
      location: 'Valley View Road, Araku Valley',
      city: 'Araku Valley',
      pricePerNight: '₹2,500 - ₹4,200',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://tourism.ap.gov.in/',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'Andhra Pradesh Tourism Development Corporation (APTDC)',
      amenities: ['Free Parking', 'Restaurant', 'Gardens', 'Hot Water Service'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: false,
        accessibleRooms: true,
        notes: 'Ground-floor cottage accommodations with level entry and vehicle parking adjacent to cottages.'
      }
    }
  ],
  visakhapatnam: [
    {
      id: 'hotel-vizag-novotel',
      name: 'Novotel Visakhapatnam Varun Beach',
      category: 'luxury',
      description: 'Beachfront 5-star hotel directly on RK Beach with infinity pool overlooking the Bay of Bengal, sea-facing rooms, and modern amenities.',
      location: 'Beach Road, Maharani Peta',
      city: 'Visakhapatnam',
      pricePerNight: '₹7,500 - ₹11,500',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://all.accor.com/hotel/7535/index.en.shtml',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'Accor Hospitality Group',
      amenities: ['Oceanfront Pool', 'Multiple Fine Dining Options', 'Fitness Center & Spa', 'Valet Parking'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        accessibleRooms: true,
        notes: 'Fully barrier-free property with elevators and accessible guest rooms.'
      }
    }
  ],
  gandikota: [
    {
      id: 'hotel-gandikota-haritha',
      name: 'Haritha Resort Gandikota (APTDC)',
      category: 'boutique',
      description: 'Official state tourism accommodation adjacent to the historic fort entrance, featuring air-conditioned stone cottages and peaceful courtyard gardens.',
      location: 'Gandikota Fort Entrance, Jammalamadugu',
      city: 'Gandikota',
      pricePerNight: '₹2,200 - ₹3,600',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://tourism.ap.gov.in/',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'Andhra Pradesh Tourism Development Corporation (APTDC)',
      amenities: ['On-site Restaurant', 'Free Parking', 'Walking Proximity to Fort and Canyon Viewpoint'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: false,
        accessibleRooms: true,
        notes: 'Ground-level stone cottages with direct vehicular parking.'
      }
    }
  ],
  kerala: [
    {
      id: 'hotel-kerala-lake-palace',
      name: 'Lake Palace Resort Alappuzha',
      category: 'luxury',
      description: 'Luxury backwater retreat perched on the banks of Vembanad Lake, featuring traditional Kerala wooden architecture and Ayurvedic spa.',
      location: 'Thirumala Ward, Chungam, Alappuzha',
      city: 'Kerala',
      pricePerNight: '₹8,500 - ₹14,000',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://lakepalaceresort.com/',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'Lake Palace Resort',
      amenities: ['Backwater Views', 'Ayurvedic Wellness Spa', 'Houseboat Cruises', 'Pool'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        accessibleRooms: true,
        notes: 'Step-free garden pathways and assisted boat boarding.'
      }
    }
  ],
  goa: [
    {
      id: 'hotel-goa-taj-aguada',
      name: 'Taj Fort Aguada Resort & Spa',
      category: 'luxury',
      description: 'Historic 5-star beachfront luxury resort nestled along Sinquerim headland below 16th-century Portuguese ramparts overlooking the sea.',
      location: 'Sinquerim, Candolim, Bardez',
      city: 'Goa',
      pricePerNight: '₹14,000 - ₹26,000',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      officialUrl: 'https://www.tajhotels.com/en-in/taj/taj-fort-aguada-goa/',
      officialSourceLabel: 'Booking Website',
      officialSourceType: 'booking',
      officialAuthority: 'IHCL / Taj Hotels',
      amenities: ['Private Beach Access', 'Heritage Architecture', 'Jiva Spa', 'Tennis Courts'],
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        accessibleRooms: true,
        notes: 'Valet golf-cart transit, step-free restaurants, and accessible oceanview villas.'
      }
    }
  ]
};

export const SAMPLE_ITINERARIES: Record<string, Itinerary> = {
  'vijayawada-parents': {
    id: 'itin-vja-parents-2d',
    destination: 'Vijayawada',
    title: 'Comfortable 2-Day Vijayawada Itinerary (Accessibility & Senior Friendly)',
    summary: 'A gently paced 2-day exploration designed specifically with minimal stair-climbing, priority temple elevator access, river breezes, and comfortable ground-floor Andhra dining.',
    durationDays: 2,
    accessibilityFriendly: true,
    budgetEstimated: '₹4,500 - ₹8,000 per person',
    days: [
      {
        dayNumber: 1,
        title: 'Sacred Hill Blessing & Evening Riverfront Sunset',
        theme: 'Spiritual & Riverside',
        slots: [
          {
            time: '08:30 AM – 10:45 AM',
            title: 'Kanaka Durga Temple (Via Ghat Road & Priority Elevator)',
            activityType: 'sightseeing',
            description: 'Visit the revered Indrakeeladri shrine. By requesting the senior citizen token at the toll entrance, your vehicle is permitted up the ghat road directly to the temple plateau, avoiding hundreds of hill steps.',
            place: VERIFIED_PLACES.vijayawada[0],
            duration: '2 hours',
            travelNote: '15 min cab drive from MG Road hotels',
            accessibilityNote: 'Elevator connects directly from vehicular drop-off to the main darshan queue.'
          },
          {
            time: '12:30 PM – 02:00 PM',
            title: 'Authentic Andhra Plantain Leaf Lunch at Minerva Grand',
            activityType: 'meal',
            description: 'Savor an unhurried, comfortable vegetarian Andhra meal featuring fresh chutneys, podi, pappu, and ghee.',
            restaurant: VERIFIED_RESTAURANTS.vijayawada[0],
            duration: '1.5 hours',
            accessibilityNote: 'Step-free entrance and cushioned seating.'
          },
          {
            time: '02:00 PM – 04:30 PM',
            title: 'Midday Rest & Refreshment at Hotel',
            activityType: 'relaxation',
            description: 'Midday rest during peak heat hours. Ideal for senior comfort and relaxation before evening sightseeing.',
            duration: '2.5 hours'
          },
          {
            time: '05:00 PM – 07:15 PM',
            title: 'Prakasam Barrage Promenade & River Walkway',
            activityType: 'sightseeing',
            description: 'Catch gentle breezes as the sun dips below the Krishna River. The promenade sidewalk is completely level and barrier-free with parking directly alongside.',
            place: VERIFIED_PLACES.vijayawada[2],
            duration: '2 hours',
            travelNote: '10 min scenic drive along riverside road',
            accessibilityNote: '100% barrier-free paved walk; benches along the barrier.'
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Bapu Museum Treasures & Bhavani Island Garden Breeze',
        theme: 'Culture & Island Serenity',
        slots: [
          {
            time: '09:30 AM – 11:30 AM',
            title: 'Bapu Museum (Air-Conditioned & Wheelchair Friendly)',
            activityType: 'sightseeing',
            description: 'Tour the recently modernized archaeological galleries housing historic Buddhist sculptures and regional heritage without heat or steep walking.',
            place: VERIFIED_PLACES.vijayawada[4],
            duration: '2 hours',
            travelNote: 'Located on MG Road',
            accessibilityNote: 'Wheelchairs available at reception; full elevator access.'
          },
          {
            time: '12:00 PM – 01:30 PM',
            title: 'Lunch at Sweet Magic Family Restaurant',
            activityType: 'meal',
            description: 'Enjoy traditional coastal biryanis and Andhra specialties followed by fresh regional sweets.',
            restaurant: VERIFIED_RESTAURANTS.vijayawada[1],
            duration: '1.5 hours'
          },
          {
            time: '03:30 PM – 06:30 PM',
            title: 'Bhavani River Island Garden Promenade',
            activityType: 'sightseeing',
            description: 'Board the gentle river ferry with assistance ramps to Bhavani Island. Stroll through flat manicured lawns and watch river life under shade trees.',
            place: VERIFIED_PLACES.vijayawada[3],
            duration: '3 hours',
            travelNote: 'Ferry departs from Bhavanipuram boat point',
            accessibilityNote: 'Assisted boarding ramps; flat pathways on the island.'
          }
        ]
      }
    ]
  }
};
