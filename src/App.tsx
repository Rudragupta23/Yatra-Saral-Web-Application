import React, { useState, useRef, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from './contexts/AppContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { EmergencyPage } from './components/EmergencyPage';
import { ComplaintPage } from './components/ComplaintPage';
import { FeedbackPage } from './components/FeedbackPage';
import { SavedPassengersPage } from './components/SavedPassengersPage';
import { ContactPage } from './components/ContactPage';
import { SettingsPage } from './components/SettingsPage';
import { FAQPage } from './components/FAQPage';
import { HistoryPage } from './components/HistoryPage';
import { BookingServicesPage } from './components/BookingServicesPage';
import { TrainBookingPage } from './components/TrainBookingPage';
import { PantryFoodPage } from './components/PantryFoodPage';
import { ViewTicketsPage } from './components/ViewTicketsPage';
import { Instagram, Linkedin, Github, Youtube, MapPin, Phone, Mail, Train, ArrowUp } from 'lucide-react';
import { BudgetCalculatorPage } from './components/services/BudgetCalculatorPage';
import { GroupBookingPage } from './components/services/GroupBookingPage';
import { LiveTrainTrackingPage } from './components/services/LiveTrainTrackingPage';
import { PlatformTicketsPage } from './components/services/PlatformTicketsPage';
import { SeatUpgradesPage } from './components/services/SeatUpgradesPage';
import { TravelAlertsPage } from './components/services/TravelAlertsPage';
import { TravelChecklistPage } from './components/services/TravelChecklistPage';
import { TravelInsurancePage } from './components/services/TravelInsurancePage';
import { TripPlannerPage } from './components/services/TripPlannerPage';
import { WeatherForecastPage } from './components/services/WeatherForecastPage';
import { Button } from './components/ui/button';
import { useToast } from './hooks/use-toast';
import { Preloader } from './components/Preloader'; 


const queryClient = new QueryClient();

const FooterComponent = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t, setAuthModal } = useApp();
  const { toast } = useToast();

  const handleLinkClick = (e: React.MouseEvent, section: string, requiresAuth: boolean = false) => {
    e.preventDefault();
    if (requiresAuth && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or sign up to access this service.",
        variant: "destructive",
      });
      setAuthModal({ isOpen: true, view: 'login' });
    } else {
      onNavigate(section);
    }
  };

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Train className="h-10 w-10 text-primary" />
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-cyan-400 to-secondary bg-clip-text text-transparent">
                  {t('site.name')}
                </h3>
                <p className="text-lg text-muted-foreground -mt-1">{t('site.name.hi')}</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-xs">{t('site.tagline')}</p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/Rudragupta23" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-transform duration-200"><Github size={24}/></a>
              <a href="https://www.youtube.com/@rudrag05" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-transform duration-200"><Youtube size={24}/></a>
              <a href="https://www.instagram.com/rud.ra_23/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-transform duration-200"><Instagram size={24}/></a>
              <a href="https://linkedin.com/in/rudrag23" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-transform duration-200"><Linkedin size={24}/></a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
  <div className="mb-4">
    <h4 className="font-semibold text-lg inline-block">Quick Links</h4>
    <div className="h-0.5 w-1/2 bg-primary mt-1"></div>
  </div>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'home')} className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'about')} className="text-muted-foreground hover:text-primary">About Us</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'services')} className="text-muted-foreground hover:text-primary">Services</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'contact')} className="text-muted-foreground hover:text-primary">Contact Us</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'faq')} className="text-muted-foreground hover:text-primary">FAQ</a></li>
            </ul>
          </div>

          {/* Our Services Section */}
<div>
  <div className="mb-4">
    <h4 className="font-semibold text-lg inline-block">Our Services</h4>
    <div className="h-0.5 w-1/2 bg-primary mt-1"></div>
  </div>
  <ul className="space-y-2">
    <li><a href="#" onClick={(e) => handleLinkClick(e, 'train-booking', true)} className="text-muted-foreground hover:text-primary hover:underline">Train Booking</a></li>
    <li><a href="#" onClick={(e) => handleLinkClick(e, 'group-booking', true)} className="text-muted-foreground hover:text-primary hover:underline">Group Booking</a></li>
    <li><a href="#" onClick={(e) => handleLinkClick(e, 'booking-services', true)} className="text-muted-foreground hover:text-primary hover:underline">Booking Services</a></li>
    <li><a href="#" onClick={(e) => handleLinkClick(e, 'complaint', true)} className="text-muted-foreground hover:text-primary hover:underline">File a Complaint</a></li>
    <li><a href="#" onClick={(e) => handleLinkClick(e, 'pantry-food', true)} className="text-muted-foreground hover:text-primary hover:underline">Pantry Food</a></li>
  </ul>
</div>

{/* Contact Us Section */}
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-lg inline-block">Contact Us</h4>
              <div className="h-0.5 w-1/2 bg-primary mt-1"></div>
            </div>
            <address className="not-italic text-muted-foreground space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=VIT%20Bhopal%20University"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  VIT Bhopal University, Bhopal, India
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="tel:+919896800458" className="hover:text-primary hover:underline">+91-98968 00458</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="mailto:23rudragupta@gmail.com" className="hover:text-primary hover:underline">23rudragupta@gmail.com</a>
              </div>
            </address>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-muted-foreground text-sm">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

function AppContent() {
  const { fontSize, isReadAloudEnabled, speak, language } = useApp();
  const [currentSection, setCurrentSection] = useState('home');
  const mainContentRef = useRef<HTMLElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollToTop && window.scrollY > 300) {
        setShowScrollToTop(true);
      } else if (showScrollToTop && window.scrollY <= 300) {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollToTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (isReadAloudEnabled && mainContentRef.current) {
      const text = mainContentRef.current.innerText;
      const lang = language === 'en' ? 'en-US' : 'hi-IN';
      speak(text, lang);
    }
  }, [currentSection, isReadAloudEnabled, speak, language]);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    window.scrollTo(0, 0); 
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'emergency':
        return <EmergencyPage />;
      case 'complaint':
        return <ComplaintPage onNavigate={handleNavigate} />;
      case 'feedback':
        return <FeedbackPage onNavigate={handleNavigate} />;
      case 'saved-passengers':
        return <SavedPassengersPage/>;
      case 'contact':
        return <ContactPage />;
      case 'settings':
        return <SettingsPage />;
      case 'faq':
        return <FAQPage />;
      case 'history':
      return <HistoryPage onNavigate={handleNavigate}/>;
      case 'profile':
        return <HomePage onNavigate={handleNavigate} />;
      case 'booking-services':
        return <BookingServicesPage onNavigate={handleNavigate} />;
      case 'train-booking':
        return <TrainBookingPage onNavigate={handleNavigate}/>;
      case 'pantry-food':
        return <PantryFoodPage onNavigate={handleNavigate}/>;
      case 'view-tickets':
        return <ViewTicketsPage onNavigate={handleNavigate}/>;
      
case 'budget-calculator':
        return <BudgetCalculatorPage onNavigate={handleNavigate} />;
      case 'group-booking':
        return <GroupBookingPage onNavigate={handleNavigate} />;
      case 'live-train-tracking':
        return <LiveTrainTrackingPage onNavigate={handleNavigate} />;
      case 'platform-tickets':
        return <PlatformTicketsPage onNavigate={handleNavigate} />;
      case 'seat-upgrades':
        return <SeatUpgradesPage onNavigate={handleNavigate} />;
      case 'travel-alerts':
        return <TravelAlertsPage onNavigate={handleNavigate}/>;
      case 'travel-checklist':
        return <TravelChecklistPage onNavigate={handleNavigate} />;
      case 'travel-insurance':
        return <TravelInsurancePage onNavigate={handleNavigate}/>;
      case 'trip-planner':
        return <TripPlannerPage onNavigate={handleNavigate} />;
      case 'weather-forecast':
        return <WeatherForecastPage onNavigate={handleNavigate}/>;
        
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} activeSection={currentSection} />
      <main className="pt-16" ref={mainContentRef}>
        {renderContent()}
      </main>
      <FooterComponent onNavigate={handleNavigate} />
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 h-12 w-12 rounded-full shadow-lg z-50"
          size="icon"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isLoading ? <Preloader /> : <AppContent />}
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
