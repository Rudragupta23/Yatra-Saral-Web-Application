import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Train, 
  MessageSquare, 
  UtensilsCrossed, 
  Ticket,
  Clock,
  Shield,
  CreditCard,
  ShieldCheck,
  ArrowUpRightSquare,
  TicketPercent,
  Users,
  CloudSun,
  Map,
  Calculator,
  ListChecks,
  BellRing,
  Waypoints,
  Star, 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (section: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
const { user, t, setAuthModal } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('yatra-favorite-services') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('yatra-favorite-services', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (serviceId: string) => {
    setFavorites(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const checkAuth = (serviceId: string, requiresAuth: boolean) => {
    if (requiresAuth && !user) {
      toast({
        title: "Authentication Required",
        description: t('auth.notSignedIn'),
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleServiceClick = (serviceId: string, requiresAuth: boolean) => {
    if (checkAuth(serviceId, requiresAuth)) {
      onNavigate(serviceId);
    }
  };

  const services = useMemo(() => [
    {
      id: 'train-booking',
      icon: Train,
      title: t('service.trainBooking'),
      description: 'Complete train ticket booking with multiple coach options and real-time availability',
      features: ['Multiple classes', 'Various Payment Methods', 'E-ticket generation'],
      color: 'bg-primary',
      requiresAuth: true
    },
    {
      id: 'pantry-food',
      icon: UtensilsCrossed,
      title: t('service.pantryFood'),
      description: 'Order fresh meals delivered to your seat during the journey',
      features: ['Veg/Non-veg/Jain options', '30-min delivery', 'Quality assured'],
      color: 'bg-red-500',
      requiresAuth: true
    },
    {
      id: 'view-tickets',
      icon: Ticket,
      title: t('service.viewTickets'),
      description: 'View and manage all your booked train tickets in one place',
      features: ['Download tickets', 'Booking history', 'Cancel tickets'],
      color: 'bg-purple-500',
      requiresAuth: true
    },
    {
      id: 'live-train-tracking',
      icon: Waypoints,
      title: t('service.liveTrainTracking'),
      description: t('service.liveTrainTracking.desc'),
      features: ["Current Status", "Arrival/departure times", "Platform numbers"],
      color: 'bg-teal-500',
      requiresAuth: false
    },
    {
      id: 'travel-insurance',
      icon: ShieldCheck,
      title: t('service.travelInsurance'),
      description: t('service.travelInsurance.desc'),
      features: ["Comprehensive coverage", "Easy claims", "Affordable premium"],
      color: 'bg-cyan-500',
      requiresAuth: true
    },
    {
      id: 'travel-alerts',
      icon: BellRing,
      title: t('service.travelAlerts'),
      description: t('service.travelAlerts.desc'),
      features: ["Delay notifications", "Cancellation alerts", "Platform changes"],
      color: 'bg-amber-500',
      requiresAuth: true
    },
    {
      id: 'seat-upgrades',
      icon: ArrowUpRightSquare,
      title: t('service.seatUpgrades'),
      description: t('service.seatUpgrades.desc'),
      features: ["Upgrade class", "Request window seat", "Check availability"],
      color: 'bg-indigo-500',
      requiresAuth: true
    },
    {
      id: 'platform-tickets',
      icon: TicketPercent,
      title: t('service.platformTickets'),
      description: t('service.platformTickets.desc'),
      features: ["Instant digital ticket", "Valid for 2 hours", "For non-passengers"],
      color: 'bg-lime-500',
      requiresAuth: true
    },
    {
      id: 'group-booking',
      icon: Users,
      title: t('service.groupBooking'),
      description: t('Book tickets for large groups at once seamlessly'),
      features: ["For large groups", "E-ticket generation", "Dedicated support"],
      color: 'bg-pink-500',
      requiresAuth: true
    },
    {
      id: 'weather-forecast',
      icon: CloudSun,
      title: t('service.weatherForecast'),
      description: t('service.weatherForecast.desc'),
      features: ["Hourly updates", "5-day forecast", "For any station, city"],
      color: 'bg-sky-500',
      requiresAuth: false
    },
    {
      id: 'trip-planner',
      icon: Map,
      title: t('service.tripPlanner'),
      description: t('service.tripPlanner.desc'),
      features: ["Day-by-day plans", "Save itineraries", "Printable view"],
      color: 'bg-rose-500',
      requiresAuth: false
    },
    {
      id: 'budget-calculator',
      icon: Calculator,
      title: t('service.budgetCalculator'),
      description: t('service.budgetCalculator.desc'),
      features: ["Track expenses", "Set budget limits", "Export reports"],
      color: 'bg-fuchsia-500',
      requiresAuth: false
    },
    {
      id: 'travel-checklist',
      icon: ListChecks,
      title: t('service.travelChecklist'),
      description: t('service.travelChecklist.desc'),
      features: ["Pre-built checklist", "Add custom items", "Export the list"],
      color: 'bg-emerald-500',
      requiresAuth: false
    },
    {
      id: 'complaint',
      icon: MessageSquare,
      title: t('service.complaint'),
      description: 'File complaints about train services, cleanliness, or any travel-related issues',
      features: ['Quick resolution', 'Track status', 'RPF support'],
      color: 'bg-orange-500',
      requiresAuth: true
    },
     {
      id: 'booking-services',
      icon: Calendar,
      title: t('service.booking'),
      description: 'Book additional platform services like cloak room, coolie, wheelchair, and dormitory',
      features: ['Instant booking', 'Flexible timing', 'Secure payments'],
      color: 'bg-green-500',
      requiresAuth: true
    },
  ], [t]);

  const filteredServices = useMemo(() => {
    let servicesToFilter = services;

    if (showFavoritesOnly) {
      servicesToFilter = servicesToFilter.filter(service => favorites.includes(service.id));
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) return servicesToFilter;
    
    return servicesToFilter.filter(service =>
      service.title.toLowerCase().includes(lowercasedQuery) ||
      service.description.toLowerCase().includes(lowercasedQuery) ||
      service.features.some(feature => feature.toLowerCase().includes(lowercasedQuery))
    );
  }, [searchQuery, services, favorites, showFavoritesOnly]);

  const publicFeatures = [
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get live train status and delay information'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and payments are always protected'
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay using cards, UPI, or net banking'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Comprehensive railway services designed to make your journey comfortable and hassle-free
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Main Services</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for a perfect train journey
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-12">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={showFavoritesOnly ? 'default' : 'outline'}
              className="h-12 text-base"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className={`h-5 w-5 mr-2 transition-colors ${showFavoritesOnly ? 'text-yellow-300 fill-yellow-300' : ''}`} />
              Favorites
            </Button>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id); }}
                  >
                    <Star className={`transition-all duration-200 ${favorites.includes(service.id) ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-300 dark:text-gray-600 hover:scale-125'}`} />
                  </Button>
                  
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${service.color} rounded-full mb-6`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full h-12 text-center mt-auto"
                    onClick={() => handleServiceClick(service.id, service.requiresAuth)}
                  >
                    Access Service
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-primary mb-2">No Services Found</h3>
              <p className="text-muted-foreground">
                {showFavoritesOnly ? "You haven't favorited any services yet." : `Your search for "${searchQuery}" did not match any services.`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Why Our Services Stand Out</h2>
            <p className="text-xl text-muted-foreground">
              Built with cutting-edge technology for the best user experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publicFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-card rounded-lg shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-primary mb-4">
              Ready to Experience Better Train Travel?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {user 
                ? "Choose any service above to get started" 
                : "Sign up now to access all our premium services"
              }
            </p>
            {!user && (
<Button
  size="lg"
  className="gradient-primary text-white px-12 py-4 text-lg"
  onClick={() => onNavigate('profile')}
>
  Get Started Today
</Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};