import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AuthModalState {
  isOpen: boolean;
  view: 'login' | 'signup';
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

type FontSize = '16px' | '18px' | '20px';

interface AppContextType {
  user: User | null;
  login: (userObject: User) => boolean; 
  register: (userObject: User) => boolean; 
  logout: () => void;
  
  // Auth Modal
  authModal: AuthModalState;
  setAuthModal: React.Dispatch<React.SetStateAction<AuthModalState>>;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Language
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  
  // Font size
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;

  // Read Aloud
  isReadAloudEnabled: boolean;
  setIsReadAloudEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeaking: boolean;
  speak: (text: string, lang: 'en-US' | 'hi-IN') => void;
  cancelSpeak: () => void;
  
  t: (key: string) => string;

  resetSettings: () => void;

  remainingSessionTime: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SESSION_TIMEOUT_SECONDS = 600; 
const INACTIVITY_TIMEOUT_MS = SESSION_TIMEOUT_SECONDS * 1000;


const checkAndPurgeExpiredSession = () => {
  const savedUser = localStorage.getItem('yatra-user');
  const storedLastActivity = localStorage.getItem('yatra-last-activity');

  if (savedUser && storedLastActivity) {
    const lastActivityTime = Number(storedLastActivity);
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastActivityTime;
    
    if (timeElapsed > INACTIVITY_TIMEOUT_MS) {
      console.log("Pre-mount check: Session expired. Purging user data.");
      localStorage.removeItem('yatra-user');
      localStorage.removeItem('yatra-last-activity');
      return { user: null, expired: true };
    }
    
    localStorage.setItem('yatra-last-activity', String(currentTime));
    return { user: JSON.parse(savedUser) as User, expired: false };

  } else if (savedUser && !storedLastActivity) {
    localStorage.removeItem('yatra-user');
    return { user: null, expired: true };
  }

  return { user: null, expired: false };
};

const { user: initialUser, expired: initialSessionExpired } = checkAndPurgeExpiredSession();


const translations = {
  en: {
    'site.name': 'Yatra Saral',
    'site.name.hi': 'यात्रा सरल',
    'site.tagline': 'Your journey made simple',
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'session.time.label': 'Session:', 
    'nav.profile': 'Profile',
    'menu.darkMode': 'Dark Mode',
    'menu.lightMode': 'Light Mode',
    'menu.history': 'My Activity',
    'menu.emergency': 'Emergency',
    'menu.complaint': 'Complaint',
    'menu.feedback': 'Feedback',
    'menu.savedPassengers': 'Saved Passengers', 
    'menu.contact': 'Contact Us',
    'menu.settings': 'Settings',
    'menu.faq': 'FAQ',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.notSignedIn': 'You are not signed in. Please sign in to access this service.',
    'service.booking': 'Booking Services',
    'service.trainBooking': 'Train Booking',
    'service.complaint': 'File Complaint',
    'service.pantryFood': 'Pantry Food',
    'service.viewTickets': 'View Tickets',
    'service.travelInsurance': 'Travel Insurance',
    'service.travelInsurance.desc': 'Secure your journey with comprehensive travel insurance',
    'service.seatUpgrades': 'Seat Upgrades',
    'service.seatUpgrades.desc': 'Upgrade your seat class before or during travel',
    'service.platformTickets': 'Platform Tickets',
    'service.platformTickets.desc': 'Buy platform entry tickets for non-passengers',
    'service.groupBooking': 'Group Booking',
    'service.groupBooking.desc': 'Book tickets for large groups with special rates',
    'service.weatherForecast': 'Weather Forecast',
    'service.weatherForecast.desc': 'Get accurate weather updates for your destination',
    'service.tripPlanner': 'Trip Planner',
    'service.tripPlanner.desc': 'Create detailed day-by-day itineraries',
    'service.budgetCalculator': 'Budget Calculator',
    'service.budgetCalculator.desc': 'Plan your travel expenses with our smart budget tracking tool',
    'service.travelChecklist': 'Travel Checklist',
    'service.travelChecklist.desc': 'Never forget important items with our travel checklist',
    'service.travelAlerts': 'Travel Alerts',
    'service.travelAlerts.desc': 'Get notifications about delays, cancellations, and updates',
    'service.liveTrainTracking': 'Live Train Tracking',
    'service.liveTrainTracking.desc': "Track your train's real-time location and status",
    'footer.rights': '© 2025 Rudra Gupta. All rights reserved',
    'home.hero.title': 'Yatra Saral',
    'home.hero.subtitle': 'Your journey made simple',
    'home.hero.bookJourney': 'Book Your Journey',
    'home.hero.learnMore': 'Learn More',
    'home.features.title': 'Why Choose Yatra Saral?',
    'home.features.subtitle': 'Experience the future of train travel booking',
    'home.feature.booking.title': 'Easy Train Booking',
    'home.feature.booking.desc': 'Book train tickets with just a few clicks',
    'home.feature.groupBooking.title': 'Group Booking',
    'home.feature.groupBooking.desc': 'Book tickets for large groups at once seamlessly',
    'home.feature.smart.title': 'Trip Planner',
    'home.feature.smart.desc': 'Plan your journey with real-time updates',
    'home.feature.payments.title': 'Secure Payments',
    'home.feature.payments.desc': 'Safe and secure payment processing',
    'home.stats.title': 'Trusted by Millions',
    'home.stats.subtitle': 'Join the growing community of happy travelers',
    'home.stats.stations': 'Railway Stations',
    'home.stats.travelers': 'Happy Travelers',
    'home.stats.bookings': 'Daily Bookings',
    'home.stats.rating': 'User Rating',
    'home.cta.title': 'Ready to Start Your Journey?',
    'home.cta.subtitle': 'Book your train tickets now and experience hassle-free travel',
    'home.cta.button': 'Get Started Today',
    'popup.title': 'Join Yatra Saral Today!',
    'popup.subtitle': 'Sign up for exclusive offers and seamless booking experience',
    'popup.button': 'Sign Up Now',
    'popup.close': 'Close',
    // Settings Page
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account preferences, security settings, and personalization options',
    'settings.changePassword': 'Change Password',
    'settings.personalization': 'Personalization',
    'settings.accountManagement': 'Account Management',
    'settings.fontSize': 'Font Size',
    'settings.language': 'Language',
    'settings.accountInfo': 'Account Information',
    'settings.dangerZone': 'Danger Zone',
    'settings.deleteAccount': 'Delete Account',
    'settings.english': 'English',
    'settings.hindi': 'Hindi',
    'settings.readAloud': 'Read Aloud',
    'settings.readAloud.desc': 'Listen to the page content. This will continue on other pages.',
    'settings.beta': 'BETA',
    'settings.password.current': 'Current Password',
    'settings.password.new': 'New Password',
    'settings.password.confirm': 'Confirm New Password',
    'settings.password.save': 'Change Password',
    // About Page
    'about.title': 'About Yatra Saral',
    'about.subtitle': 'Simplifying train travel across the nation with innovative technology and user-centric design.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'My mission with Yatra Saral is to design a platform that makes train travel feel seamless and stress-free. By simplifying booking and journey management through thoughtful design, I aim to create an experience that prioritizes efficiency, accessibility, and ease of use for all travelers.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'The vision behind Yatra Saral is to set a benchmark for how train travel platforms can be designed—prorioritizing trust, innovation, and user satisfaction. I want it to represent not just a service, but a design approach that makes travel planning intuitive and enjoyable.',
    'about.story.title': 'Our Story',
    'about.story.desc': 'Yatra Saral began as a design project fueled by creativity and curiosity. As its creator, I wanted to craft a platform that reimagines the train travel experience—not just as a utility, but as something simple, user-friendly, and accessible. The idea behind Yatra Saral was to experiment with design thinking, problem-solving, and to showcase how technology can make journeys smoother, even in their simplest form.',
    'about.cta.title': 'Join Us on Our Journey',
    'about.cta.desc': 'We are constantly innovating and improving. Travel with us and be a part of the future of train travel.',
    // Services
    'booking.title': 'Booking Services',
    'booking.subtitle': 'Book additional services like cloak room, coolie, wheelchair assistance, and dormitory facilities',
    'pantry.title': 'Pantry Food',
    'pantry.subtitle': 'Order fresh, delicious meals delivered directly to your seat during the journey',
    'group.booking.title': 'Group Booking',
    'group.booking.subtitle': 'Easily book tickets for large groups and enjoy special discounts',
  },
  hi: {
    'site.name': 'Yatra Saral',
    'site.name.hi': 'यात्रा सरल',
    'site.tagline': 'आपकी यात्रा आसान बनाई गई',
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.services': 'सेवाएं',
    'session.time.label': 'सत्र:',
    'nav.profile': 'प्रोफाइल',
    'menu.darkMode': 'डार्क मोड',
    'menu.lightMode': 'लाइट मोड',
    'menu.history': 'मेरी गतिविधि',
    'menu.emergency': 'आपातकाल',
    'menu.complaint': 'शिकायत',
    'menu.feedback': 'फीडबैक',
    'menu.savedPassengers': 'सहेजे गए यात्री',
    'menu.contact': 'संपर्क करें',
    'menu.settings': 'सेटिंग्स',
    'menu.faq': 'सामान्य प्रश्न',
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.logout': 'लॉगआउट',
    'auth.notSignedIn': 'आप साइन इन नहीं हैं। कृपया इस सेवा तक पहुंचने के लिए साइन इन करें।',
    'service.booking': 'बुकिंग सेवाएं',
    'service.trainBooking': 'ट्रेन बुकिंग',
    'service.complaint': 'शिकायत दर्ज करें',
    'service.pantryFood': 'पैंट्री फूड',
    'service.viewTickets': 'टिकट देखें',
    'service.travelInsurance': 'यात्रा बीमा',
    'service.travelInsurance.desc': 'व्यापक यात्रा बीमा के साथ अपनी यात्रा सुरक्षित करें',
    'service.seatUpgrades': 'सीट अपग्रेड',
    'service.seatUpgrades.desc': 'यात्रा से पहले या दौरान अपनी सीट श्रेणी को अपग्रेड करें',
    'service.platformTickets': 'प्लेटफॉर्म टिकट',
    'service.platformTickets.desc': 'गैर-यात्रियों के लिए प्लेटफॉर्म प्रवेश टिकट खरीदें',
    'service.groupBooking': 'समूह बुकिंग',
    'service.groupBooking.desc': 'विशेष दरों के साथ बड़े समूहों के लिए टिकट बुक करें',
    'service.weatherForecast': 'मौसम पूर्वानुमान',
    'service.weatherForecast.desc': 'अपने गंतव्य के लिए सटीक मौसम अपडेट प्राप्त करें',
    'service.tripPlanner': 'यात्रा योजनाकार',
    'service.tripPlanner.desc': 'दिन-प्रतिदिन विस्तृत यात्रा कार्यक्रम बनाएं',
    'service.budgetCalculator': 'बजट कैलकुलेटर',
    'service.budgetCalculator.desc': 'हमारे स्मार्ट बजट ट्रैकिंग टूल के साथ अपने यात्रा खर्च की योजना बनाएं',
    'service.travelChecklist': 'यात्रा चेकलिस्ट',
    'service.travelChecklist.desc': 'हमारी यात्रा चेकलिस्ट के साथ महत्वपूर्ण वस्तुओं को कभी न भूलें',
    'service.travelAlerts': 'यात्रा अलर्ट',
    'service.travelAlerts.desc': 'देरी, रद्दीकरण और अपडेट के बारे में सूचनाएं प्राप्त करें',
    'service.liveTrainTracking': 'लाइव ट्रेन ट्रैकिंग',
    'service.liveTrainTracking.desc': 'अपनी ट्रेन की वास्तविक समय स्थिति और स्थान को ट्रैक करें',
    'footer.rights': '© 2025 रुद्र गुप्ता। सभी अधिकार सुरक्षित',
    'home.hero.title': 'यात्रा सरल',
    'home.hero.subtitle': 'आपकी यात्रा आसान बनाई गई',
    'home.hero.bookJourney': 'अपनी यात्रा बुक करें',
    'home.hero.learnMore': 'और जानें',
    'home.features.title': 'यात्रा सरल क्यों चुनें?',
    'home.features.subtitle': 'ट्रेन यात्रा बुकिंग के भविष्य का अनुभव करें',
    'home.feature.booking.title': 'आसान ट्रेन बुकिंग',
    'home.feature.booking.desc': 'बस कुछ ही क्लिक में ट्रेन टिकट बुक करें',
    'home.feature.groupBooking.title': 'समूह बुकिंग',
    'home.feature.groupBooking.desc': 'विशेष दरों के साथ बड़े समूहों के लिए टिकट बुक करें',
    'home.feature.smart.title': 'यात्रा योजनाकार',
    'home.feature.smart.desc': 'दिन-प्रतिदिन विस्तृत यात्रा कार्यक्रम बनाएं',
    'home.feature.payments.title': 'सुरक्षित भुगतान',
    'home.feature.payments.desc': 'सुरक्षित और संरक्षित भुगतान प्रसंस्करण',
    'home.stats.title': 'लाखों का विश्वास',
    'home.stats.subtitle': 'खुश यात्रियों के बढ़ते समुदाय में शामिल हों',
    'home.stats.stations': 'रेलवे स्टेशन',
    'home.stats.travelers': 'प्रसन्न यात्री',
    'home.stats.bookings': 'दैनिक बुकिंग',
    'home.stats.rating': 'उपयोगकर्ता रेटिंग',
    'home.cta.title': 'अपनी यात्रा शुरू करने के लिए तैयार हैं?',
    'home.cta.subtitle': 'अभी अपने ट्रेन टिकट बुक करें और परेशानी मुक्त यात्रा का अनुभव करें',
    'home.cta.button': 'आज ही शुरू करें',
    'popup.title': 'आज ही यात्रा सरल से जुड़ें!',
    'popup.subtitle': 'विशेष ऑफ़र और सहज बुकिंग अनुभव के लिए साइन अप करें',
    'popup.button': 'अभी साइन अप करें',
    'popup.close': 'बंद करें',
    // Settings Page
    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'अपने खाते की प्राथमिकताएं, सुरक्षा सेटिंग्स और व्यक्तिगतकरण विकल्प प्रबंधित करें',
    'settings.changePassword': 'पासवर्ड बदलें',
    'settings.personalization': 'वैयक्तिकरण',
    'settings.accountManagement': 'खाता प्रबंधन',
    'settings.fontSize': 'फ़ॉन्ट आकार',
    'settings.language': 'भाषा',
    'settings.accountInfo': 'खाता जानकारी',
    'settings.dangerZone': 'खतरनाक क्षेत्र',
    'settings.deleteAccount': 'खाता हटाएं',
    'settings.english': 'अंग्रेजी',
    'settings.hindi': 'हिंदी',
    'settings.readAloud': 'जोर से पढ़ें',
    'settings.readAloud.desc': 'पेज की सामग्री सुनें। यह अन्य पृष्ठों पर भी जारी रहेगा।',
    'settings.beta': 'बीटा',
    'settings.password.current': 'वर्तमान पासवर्ड',
    'settings.password.new': 'नया पासवर्ड',
    'settings.password.confirm': 'नए पासवर्ड की पुष्टि करें',
    'settings.password.save': 'पासवर्ड बदलें',
    // About Page
    'about.title': 'यात्रा सरल के बारे में',
    'about.subtitle': 'नवीन तकनीक और उपयोगकर्ता-केंद्रित डिजाइन के साथ देश भर में ट्रेन यात्रा को सरल बनाना।',
    'about.mission.title': 'हमारा लक्ष्य',
    'about.mission.desc': 'यात्रा सरल का मिशन है यात्रियों को एक ऐसा अनुभव प्रदान करना जो तनावमुक्त, सरल और कुशल हो। मैंने इस प्लेटफ़ॉर्म को इस तरह डिज़ाइन करने का प्रयास किया है जिससे टिकट बुकिंग और यात्रा प्रबंधन आसान और सुविधाजनक हो सके।',
    'about.vision.title': 'हमारा दृष्टिकोण',
    'about.vision.desc': 'यात्रा सरल का विज़न है कि यह ट्रेन यात्रा के क्षेत्र में भरोसे, नवाचार और उपयोगकर्ता संतुष्टि का प्रतीक बने। मेरा लक्ष्य है कि इसे यात्रा की योजना और प्रबंधन के लिए सबसे पसंदीदा और विश्वसनीय विकल्प के रूप में देखा जाए।',
    'about.story.title': 'हमारी कहानी',
    'about.story.desc': 'यात्रा सरल मेरी रचनात्मक सोच और डिजाइनिंग के प्रति जुनून का परिणाम है। इसे बनाते समय मेरा उद्देश्य एक ऐसा प्लेटफ़ॉर्म तैयार करना था जो ट्रेन यात्रा को आसान, सहज और सभी के लिए सुलभ बना सके। यह केवल एक प्रोजेक्ट नहीं, बल्कि यह डिज़ाइन थिंकिंग और यात्रियों की वास्तविक ज़रूरतों को समझने का एक प्रयास है।',
    'about.cta.title': 'हमारी यात्रा में शामिल हों',
    'about.cta.desc': 'हम लगातार नवीनता और सुधार कर रहे हैं। हमारे साथ यात्रा करें और ट्रेन यात्रा के भविष्य का हिस्सा बनें।',
    // Services
    'booking.title': 'बुकिंग सेवाएं',
    'booking.subtitle': 'क्लोक रूम, कुली, व्हीलचेयर सहायता और डॉर्मिटरी सुविधाओं जैसी अतिरिक्त सेवाएं बुक करें',
    'pantry.title': 'पैंट्री फूड',
    'pantry.subtitle': 'यात्रा के दौरान सीधे अपनी सीट पर ताजा, स्वादिष्ट भोजन ऑर्डर करें',
    'group.booking.title': 'समूह बुकिंग',
    'group.booking.subtitle': 'बड़े समूहों के लिए आसानी से टिकट बुक करें और विशेष छूट का आनंद लें',
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialUser); 
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');
  const [fontSize, setFontSize] = useState<FontSize>('16px');
  const [authModal, setAuthModal] = useState<AuthModalState>({ isOpen: initialSessionExpired, view: 'login' });
  const [isReadAloudEnabled, setIsReadAloudEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [remainingSessionTime, setRemainingSessionTime] = useState(SESSION_TIMEOUT_SECONDS);
  

  useEffect(() => {
    const savedTheme = localStorage.getItem('yatra-theme') as 'light' | 'dark';
    const savedLanguage = localStorage.getItem('yatra-language') as 'en' | 'hi';
    const savedFontSize = localStorage.getItem('yatra-fontSize') as FontSize;

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguageState(savedLanguage);
    if (savedFontSize) setFontSize(savedFontSize);

    const storedLastActivity = localStorage.getItem('yatra-last-activity');
    if (storedLastActivity && initialUser) {
        const lastActivityTime = Number(storedLastActivity);
        const timeSinceActivity = Date.now() - lastActivityTime;
        const remainingTime = Math.max(0, Math.floor((INACTIVITY_TIMEOUT_MS - timeSinceActivity) / 1000));
        setRemainingSessionTime(remainingTime);
    }
  }, []); 

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('yatra-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize;
    localStorage.setItem('yatra-fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('yatra-language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = (userObject: User): boolean => {
    if (userObject && userObject.email) {
      setUser(userObject);
      localStorage.setItem('yatra-user', JSON.stringify(userObject));
      localStorage.setItem('yatra-last-activity', String(Date.now()));
      return true; 
    }
    return false; 
  };

  const register = (userObject: User): boolean => {
    if (userObject && userObject.email) {
      setUser(userObject);
      localStorage.setItem('yatra-user', JSON.stringify(userObject));
      localStorage.setItem('yatra-last-activity', String(Date.now()));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yatra-user');
    localStorage.removeItem('yatra-last-activity'); 
    setAuthModal(prev => ({ ...prev, isOpen: true, view: 'login' })); 
  };
  
  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
  };
  
  useEffect(() => {
    const updateActivityTime = () => {
      if (user) { 
         localStorage.setItem('yatra-last-activity', String(Date.now()));
      }
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    let intervalId: number;

    if (user) {
      
      activityEvents.forEach(event => {
        window.addEventListener(event, updateActivityTime);
      });

      intervalId = setInterval(() => {
        const lastActivityTimeStored = localStorage.getItem('yatra-last-activity');
        
        if (!lastActivityTimeStored || !user) {
             clearInterval(intervalId);
             logout();
             return;
        }

        const lastActivityTime = Number(lastActivityTimeStored);
        const timeSinceActivity = Date.now() - lastActivityTime;
        const remainingTimeMS = INACTIVITY_TIMEOUT_MS - timeSinceActivity;

        if (remainingTimeMS <= 0) {
          clearInterval(intervalId);
          setRemainingSessionTime(0);
          logout();
          console.log("Auto-logout due to inactivity.");
        } else {
          setRemainingSessionTime(Math.max(0, Math.floor(remainingTimeMS / 1000)));
        }
      }, 1000) as any;

    } else {
      setRemainingSessionTime(SESSION_TIMEOUT_SECONDS);
      localStorage.removeItem('yatra-last-activity'); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivityTime);
      });
    };
  }, [user]); 

  const speak = (text: string, lang: 'en-US' | 'hi-IN') => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => {
        setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const cancelSpeak = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsReadAloudEnabled(false);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const resetSettings = () => {
    setTheme('light');
    setLanguageState('en');
    setFontSize('16px');

    localStorage.removeItem('yatra-theme');
    localStorage.removeItem('yatra-language');
    localStorage.removeItem('yatra-fontSize');
  };

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
      theme, toggleTheme,
      language, setLanguage,
      fontSize, setFontSize,
      isReadAloudEnabled, setIsReadAloudEnabled,
      isSpeaking, speak, cancelSpeak,
      t,
      authModal, setAuthModal,
      resetSettings,
      remainingSessionTime
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
