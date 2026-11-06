export type AppLanguage = 'en' | 'te' | 'hi';

interface ChatTranslations {
  travelCompanion: string;
  collapseSidebar: string;
  expandSidebar: string;
  startNewChat: string;
  newConversation: string;
  searchConversations: string;
  savedPlaces: string;
  myTrips: string;
  myTripsTitle: string;
  recentChats: string;
  noMatchingConversations: string;
  noChats: string;
  deleteConversation: string;
  guestTraveler: string;
  guestSession: string;
  logOut: string;
  landingPage: string;
  viewLandingPage: string;
  viewSavedPlaces: string;
  compare: string;
  connectionChecking: string;
  backendLive: string;
  connectionRequired: string;
  connectionUnavailable: string;
  liveRecommendations: string;
  unavailableRecommendations: string;
  inputPlaceholder: string;
  sendMessage: string;
  listen: string;
  pause: string;
  resume: string;
  speaking: string;
  stopSpeaking: string;
  stopListening: string;
  listening: string;
  unsupportedSpeechRecognition: string;
  microphoneDenied: string;
  noSpeech: string;
  speechNetworkError: string;
  speechInputError: string;
  speechStartError: string;
  speechUnavailable: string;
  speechPlaybackError: string;
  voiceUnavailable: string;
  retry: string;
  checkBackend: string;
  checkingBackend: string;
  loading: string;
  emptyTitle: string;
  emptyDescription: string;
  suggestions: string;
  featuredInspirations: string;
  accessibility: string;
  descriptionNotRecorded: string;
  locationNotRecorded: string;
  cuisineNotRecorded: string;
  priceNotRecorded: string;
  apiNotConfigured: string;
  connectionError: string;
  invalidResponse: string;
  serverError: string;
}

const translations: Record<AppLanguage, ChatTranslations> = {
  en: {
    travelCompanion: 'Travel Companion',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    startNewChat: 'Start New Chat',
    newConversation: 'New Conversation',
    searchConversations: 'Search conversations...',
    savedPlaces: 'Saved Places',
    myTrips: 'My Trips',
    myTripsTitle: 'My Trips & Itineraries',
    recentChats: 'Recent Chats',
    noMatchingConversations: 'No matching conversations',
    noChats: 'No chats yet. Start one!',
    deleteConversation: 'Delete conversation',
    guestTraveler: 'Guest Traveler',
    guestSession: 'Guest Session',
    logOut: 'Log out',
    landingPage: 'Landing Page',
    viewLandingPage: 'View Landing Page',
    viewSavedPlaces: 'View Saved Places',
    compare: 'Compare',
    connectionChecking: 'Checking backend…',
    backendLive: 'Backend live',
    connectionRequired: 'Connection required',
    connectionUnavailable: 'Connection unavailable',
    liveRecommendations: 'Live verified travel recommendations',
    unavailableRecommendations: 'Backend response unavailable',
    inputPlaceholder: 'Where would you like to go in Andhra Pradesh?',
    sendMessage: 'Send message',
    listen: 'Listen',
    pause: 'Pause',
    resume: 'Resume',
    speaking: 'Speaking…',
    stopSpeaking: 'Stop speaking',
    stopListening: 'Stop listening',
    listening: 'Listening',
    unsupportedSpeechRecognition: 'Speech recognition is not supported in this browser. Please type your question.',
    microphoneDenied: 'Microphone permission was denied. Allow microphone access in browser settings or type your question.',
    noSpeech: 'No speech was detected. Please try again.',
    speechNetworkError: 'The browser speech service is unavailable. You can type your question instead.',
    speechInputError: 'Voice input could not start. You can type your question instead.',
    speechStartError: 'Could not start voice recognition. Check microphone permission and try again.',
    speechUnavailable: 'Speech playback is not supported in this browser.',
    speechPlaybackError: 'Speech playback could not start. Check that a compatible system voice is installed.',
    voiceUnavailable: 'No voice for the selected language is available on this device.',
    retry: 'Retry',
    checkBackend: 'Check backend connection',
    checkingBackend: 'Checking the Flask backend…',
    loading: 'Getting recommendations from your travel records…',
    emptyTitle: 'Where shall we go next?',
    emptyDescription: 'Ask about places, restaurants, hotels, accessibility, or an itinerary.',
    suggestions: 'Suggestions',
    featuredInspirations: 'Featured Regional Inspirations',
    accessibility: 'Minimal stairs / accessibility',
    descriptionNotRecorded: 'Description not recorded',
    locationNotRecorded: 'Location not recorded',
    cuisineNotRecorded: 'Cuisine not recorded',
    priceNotRecorded: 'Price not recorded',
    apiNotConfigured: 'The Flask API URL is not configured for this deployment.',
    connectionError: 'Could not connect to Flask. Confirm the backend is running and the API URL is correct; if it is reachable, check CORS for this frontend origin.',
    invalidResponse: 'The Flask API returned an invalid response. Please retry or check the backend logs.',
    serverError: 'The Flask API returned an error. Please retry or check the backend logs.',
  },
  te: {
    travelCompanion: 'ప్రయాణ సహచరి',
    collapseSidebar: 'పక్క పట్టీని కుదించండి',
    expandSidebar: 'పక్క పట్టీని విస్తరించండి',
    startNewChat: 'కొత్త సంభాషణ ప్రారంభించండి',
    newConversation: 'కొత్త సంభాషణ',
    searchConversations: 'సంభాషణలను వెతకండి...',
    savedPlaces: 'భద్రపరచిన ప్రదేశాలు',
    myTrips: 'నా ప్రయాణాలు',
    myTripsTitle: 'నా ప్రయాణాలు మరియు ప్రణాళికలు',
    recentChats: 'ఇటీవలి సంభాషణలు',
    noMatchingConversations: 'సరిపోలే సంభాషణలు లేవు',
    noChats: 'సంభాషణలు లేవు. కొత్తది ప్రారంభించండి!',
    deleteConversation: 'సంభాషణను తొలగించండి',
    guestTraveler: 'అతిథి ప్రయాణికుడు',
    guestSession: 'అతిథి సెషన్',
    logOut: 'లాగ్ అవుట్ చేయండి',
    landingPage: 'ప్రారంభ పేజీ',
    viewLandingPage: 'ప్రారంభ పేజీని చూడండి',
    viewSavedPlaces: 'భద్రపరచిన ప్రదేశాలను చూడండి',
    compare: 'పోల్చండి',
    connectionChecking: 'బ్యాకెండ్‌ను తనిఖీ చేస్తోంది…',
    backendLive: 'బ్యాకెండ్ కనెక్ట్ అయింది',
    connectionRequired: 'కనెక్షన్ అవసరం',
    connectionUnavailable: 'కనెక్షన్ అందుబాటులో లేదు',
    liveRecommendations: 'బ్యాకెండ్ రికార్డుల నుండి ప్రయాణ సూచనలు',
    unavailableRecommendations: 'బ్యాకెండ్ స్పందన అందుబాటులో లేదు',
    inputPlaceholder: 'ఆంధ్రప్రదేశ్‌లో ఎక్కడికి వెళ్లాలనుకుంటున్నారు?',
    sendMessage: 'సందేశం పంపండి',
    listen: 'వినండి',
    pause: 'నిలిపివేయండి',
    resume: 'కొనసాగించండి',
    speaking: 'చదువుతోంది…',
    stopSpeaking: 'చదవడం ఆపండి',
    stopListening: 'వినడం ఆపండి',
    listening: 'వింటోంది',
    unsupportedSpeechRecognition: 'ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు లేదు. దయచేసి ప్రశ్నను టైప్ చేయండి.',
    microphoneDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి లేదా ప్రశ్నను టైప్ చేయండి.',
    noSpeech: 'మాట్లాడినది గుర్తించబడలేదు. మళ్లీ ప్రయత్నించండి.',
    speechNetworkError: 'బ్రౌజర్ వాయిస్ సేవ అందుబాటులో లేదు. ప్రశ్నను టైప్ చేయవచ్చు.',
    speechInputError: 'వాయిస్ ఇన్‌పుట్ ప్రారంభం కాలేదు. ప్రశ్నను టైప్ చేయవచ్చు.',
    speechStartError: 'వాయిస్ గుర్తింపు ప్రారంభం కాలేదు. మైక్రోఫోన్ అనుమతిని తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    speechUnavailable: 'ఈ బ్రౌజర్‌లో వాయిస్ ప్లేబ్యాక్ అందుబాటులో లేదు.',
    speechPlaybackError: 'వాయిస్ ప్లేబ్యాక్ ప్రారంభం కాలేదు. ఈ భాషకు సరిపోయే సిస్టమ్ వాయిస్ ఉందో చూడండి.',
    voiceUnavailable: 'ఈ పరికరంలో ఎంచుకున్న భాషకు వాయిస్ అందుబాటులో లేదు.',
    retry: 'మళ్లీ ప్రయత్నించండి',
    checkBackend: 'బ్యాకెండ్ కనెక్షన్ తనిఖీ చేయండి',
    checkingBackend: 'Flask బ్యాకెండ్‌ను తనిఖీ చేస్తోంది…',
    loading: 'ప్రయాణ రికార్డుల నుండి సూచనలు పొందుతోంది…',
    emptyTitle: 'తర్వాత ఎక్కడికి వెళ్దాం?',
    emptyDescription: 'ప్రదేశాలు, రెస్టారెంట్లు, హోటళ్లు, సౌలభ్యం లేదా ప్రయాణ ప్రణాళిక గురించి అడగండి.',
    suggestions: 'సూచనలు',
    featuredInspirations: 'ప్రాంతీయ ప్రయాణ ప్రేరణలు',
    accessibility: 'తక్కువ మెట్లు / సౌలభ్యం',
    descriptionNotRecorded: 'వివరణ నమోదు కాలేదు',
    locationNotRecorded: 'ప్రదేశ వివరాలు నమోదు కాలేదు',
    cuisineNotRecorded: 'వంటకం నమోదు కాలేదు',
    priceNotRecorded: 'ధర నమోదు కాలేదు',
    apiNotConfigured: 'ఈ అమరిక కోసం Flask API చిరునామా సెట్ కాలేదు.',
    connectionError: 'Flask‌కు కనెక్ట్ కాలేదు. బ్యాకెండ్ నడుస్తోందో, API చిరునామా సరైనదో చూడండి; సర్వర్ అందుబాటులో ఉంటే ఈ ఫ్రంట్‌ఎండ్ మూలానికి CORS అనుమతి తనిఖీ చేయండి.',
    invalidResponse: 'Flask API నుండి సరైన స్పందన రాలేదు. మళ్లీ ప్రయత్నించండి లేదా బ్యాకెండ్ లాగ్‌లను చూడండి.',
    serverError: 'Flask API లోపాన్ని తెలిపింది. మళ్లీ ప్రయత్నించండి లేదా బ్యాకెండ్ లాగ్‌లను చూడండి.',
  },
  hi: {
    travelCompanion: 'यात्रा साथी',
    collapseSidebar: 'साइडबार समेटें',
    expandSidebar: 'साइडबार फैलाएँ',
    startNewChat: 'नई बातचीत शुरू करें',
    newConversation: 'नई बातचीत',
    searchConversations: 'बातचीत खोजें...',
    savedPlaces: 'सहेजे गए स्थान',
    myTrips: 'मेरी यात्राएँ',
    myTripsTitle: 'मेरी यात्राएँ और योजनाएँ',
    recentChats: 'हाल की बातचीत',
    noMatchingConversations: 'कोई मिलती-जुलती बातचीत नहीं',
    noChats: 'अभी कोई बातचीत नहीं। शुरू करें!',
    deleteConversation: 'बातचीत हटाएँ',
    guestTraveler: 'अतिथि यात्री',
    guestSession: 'अतिथि सत्र',
    logOut: 'लॉग आउट करें',
    landingPage: 'मुख्य पृष्ठ',
    viewLandingPage: 'मुख्य पृष्ठ देखें',
    viewSavedPlaces: 'सहेजे गए स्थान देखें',
    compare: 'तुलना करें',
    connectionChecking: 'बैकएंड की जाँच हो रही है…',
    backendLive: 'बैकएंड जुड़ा है',
    connectionRequired: 'कनेक्शन आवश्यक है',
    connectionUnavailable: 'कनेक्शन उपलब्ध नहीं है',
    liveRecommendations: 'बैकएंड रिकॉर्ड से यात्रा सुझाव',
    unavailableRecommendations: 'बैकएंड का उत्तर उपलब्ध नहीं है',
    inputPlaceholder: 'आंध्र प्रदेश में आप कहाँ जाना चाहेंगे?',
    sendMessage: 'संदेश भेजें',
    listen: 'सुनें',
    pause: 'रोकें',
    resume: 'जारी रखें',
    speaking: 'बोल रहा है…',
    stopSpeaking: 'बोलना बंद करें',
    stopListening: 'सुनना बंद करें',
    listening: 'सुन रहा है',
    unsupportedSpeechRecognition: 'इस ब्राउज़र में वाक् पहचान उपलब्ध नहीं है। कृपया अपना प्रश्न लिखें।',
    microphoneDenied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। ब्राउज़र सेटिंग में अनुमति दें या प्रश्न लिखें।',
    noSpeech: 'कोई आवाज़ नहीं पहचानी गई। फिर से प्रयास करें।',
    speechNetworkError: 'ब्राउज़र की वाक् सेवा उपलब्ध नहीं है। आप प्रश्न लिख सकते हैं।',
    speechInputError: 'वॉइस इनपुट शुरू नहीं हो सका। आप प्रश्न लिख सकते हैं।',
    speechStartError: 'वाक् पहचान शुरू नहीं हो सकी। माइक्रोफ़ोन अनुमति जाँचकर फिर प्रयास करें।',
    speechUnavailable: 'इस ब्राउज़र में वॉइस प्लेबैक उपलब्ध नहीं है।',
    speechPlaybackError: 'वॉइस प्लेबैक शुरू नहीं हो सका। जाँचें कि इस भाषा की सिस्टम वॉइस इंस्टॉल है।',
    voiceUnavailable: 'इस डिवाइस पर चुनी गई भाषा की वॉइस उपलब्ध नहीं है।',
    retry: 'फिर से प्रयास करें',
    checkBackend: 'बैकएंड कनेक्शन जाँचें',
    checkingBackend: 'Flask बैकएंड की जाँच हो रही है…',
    loading: 'यात्रा रिकॉर्ड से सुझाव खोजे जा रहे हैं…',
    emptyTitle: 'अब कहाँ चलें?',
    emptyDescription: 'जगहों, रेस्तरां, होटलों, पहुँच-सुविधा या यात्रा-योजना के बारे में पूछें।',
    suggestions: 'सुझाव',
    featuredInspirations: 'क्षेत्रीय यात्रा सुझाव',
    accessibility: 'कम सीढ़ियाँ / सुगम्यता',
    descriptionNotRecorded: 'विवरण दर्ज नहीं है',
    locationNotRecorded: 'स्थान दर्ज नहीं है',
    cuisineNotRecorded: 'व्यंजन दर्ज नहीं है',
    priceNotRecorded: 'कीमत दर्ज नहीं है',
    apiNotConfigured: 'इस डिप्लॉयमेंट के लिए Flask API का पता सेट नहीं है।',
    connectionError: 'Flask से कनेक्ट नहीं हो सका। जाँचें कि बैकएंड चल रहा है और API पता सही है; सर्वर उपलब्ध हो तो इस फ़्रंटएंड origin के लिए CORS जाँचें।',
    invalidResponse: 'Flask API का उत्तर मान्य नहीं है। फिर प्रयास करें या बैकएंड लॉग देखें।',
    serverError: 'Flask API ने त्रुटि दी। फिर प्रयास करें या बैकएंड लॉग देखें।',
  },
};

export function getChatTranslations(language: string | undefined): ChatTranslations {
  return translations[language === 'te' || language === 'hi' ? language : 'en'];
}

export function speechLanguageCode(language: string | undefined): string {
  return language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
}

export function localizeBackendError(error: unknown, language: string | undefined): string {
  const strings = getChatTranslations(language);
  const message = error instanceof Error ? error.message : '';
  if (/not configured|VITE_API_BASE_URL/i.test(message)) return strings.apiNotConfigured;
  if (/invalid json|unexpected response|unsupported format|missing a reply|itinerary in an unsupported/i.test(message)) {
    return strings.invalidResponse;
  }
  if (/could not reach|fetch failed|networkerror|failed to fetch|cors|connection refused|timed out/i.test(message)) {
    return strings.connectionError;
  }
  if (/HTTP \d{3}/i.test(message)) return strings.serverError;
  return language === 'te'
    ? 'ప్రయాణ సూచనలు పొందలేకపోయాం. మళ్లీ ప్రయత్నించండి లేదా బ్యాకెండ్ కనెక్షన్ తనిఖీ చేయండి.'
    : language === 'hi'
      ? 'यात्रा सुझाव नहीं मिल सके। फिर प्रयास करें या बैकएंड कनेक्शन जाँचें।'
      : 'Could not retrieve travel recommendations. Please retry or check the backend connection.';
}
