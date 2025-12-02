import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Train, MapPin, Calendar, Shield, Star, Users, X, ExternalLink, Globe } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import heroBg1 from '../assets/p1.jpg';
import heroBg2 from '../assets/p2.jpg';
import heroBg3 from '../assets/p3.jpg';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog';

interface HomePageProps {
  onNavigate: (section: string) => void;
}

function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const numericValue = parseFloat(value.replace(/,/g, '').replace('k', '000').replace('+', ''));
      
      if (!isNaN(numericValue)) {
        const animation = animate(0, numericValue, {
          duration: 3, 
          onUpdate(latest) {
            const rounded = Math.round(latest);
            if (value.endsWith('+')) {
                if (value.includes('k')) {
                  setDisplayValue(`${Math.round(latest / 1000)}k+`);
                } else {
                  setDisplayValue(`${rounded}+`);
                }
            } else if (value.includes('/')) {
              const ratingAnimation = animate(0, numericValue, {
                duration: 2,
                onUpdate(latestRating) {
                  setDisplayValue(`${latestRating.toFixed(1)}/5`);
                }
              });
              return; 
            }
            else {
              setDisplayValue(`${rounded}`);
            }
          }
        });
        return () => animation.stop();
      } else {
        setDisplayValue(value);
      }
    }
  }, [isInView, value]);

  return <div ref={ref} className="text-3xl font-bold mb-2">{displayValue}</div>;
}


export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
const { user, t, setAuthModal } = useApp();
const { toast } = useToast();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isIrctcDialogOpen, setIsIrctcDialogOpen] = useState(false);
  
  const backgroundImages = [heroBg1, heroBg2, heroBg3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user && !localStorage.getItem('yatra-popup-dismissed')) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const features = [
    {
      icon: Train,
      title: t('home.feature.booking.title'),
      description: t('home.feature.booking.desc')
    },
    {
      icon: Users, 
      title: t('home.feature.groupBooking.title'), 
      description: t('home.feature.groupBooking.desc') 
    },
    {
      icon: Calendar,
      title: t('home.feature.smart.title'),
      description: t('home.feature.smart.desc')
    },
    {
      icon: Shield,
      title: t('home.feature.payments.title'),
      description: t('home.feature.payments.desc')
    }
  ];

  const stats = [
    { icon: MapPin, value: "7000+", label: t('home.stats.stations') },
    { icon: Users, value: "10k+", label: t('home.stats.travelers') },
    { icon: Train, value: "1000+", label: t('home.stats.bookings') },
    { icon: Star, value: "4.6/5", label: t('home.stats.rating') },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {backgroundImages.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentBgIndex === index ? 1 : 0,
              scale: currentBgIndex === index ? 1.05 : 1
            }}
            transition={{ duration: 1.5 }}
          />
        ))}
        
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
          >
            {t('home.hero.title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 text-white/90 font-medium"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
<Button
  size="lg"
  className="gradient-primary text-white px-8 py-4 text-lg"
  onClick={() => {
    if (user) {
      onNavigate('train-booking');
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign in or sign up to book a journey.",
      });
      setAuthModal({ isOpen: true, view: 'login' });
    }
  }}
>
  {t('home.hero.bookJourney')}
</Button>  <Button
              size="lg"
              variant="outline"
              className="bg-black/40 text-white border-white/50 hover:bg-black/60 hover:text-white transition-colors px-8 py-4 text-lg"
              onClick={() => onNavigate('about')}
            >
              {t('home.hero.learnMore')}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-primary mb-4 tracking-tight">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              {t('home.stats.title')}
            </h2>
            <p className="text-xl text-white/90 font-medium">
              {t('home.stats.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <AnimatedStat value={stat.value} />
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-black text-primary mb-4 tracking-tight">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-medium">
              {t('home.cta.subtitle')}
            </p>
            <Button
              size="lg"
              className="gradient-primary text-white px-12 py-4 text-lg"
              onClick={() => {
                onNavigate('services');
                window.scrollTo(0, 0);
              }}
            >
              {t('home.cta.button')}
            </Button>
          </motion.div>
        </div>
      </section>
      
      <div className="py-16 bg-gray-100 dark:bg-gray-900 relative">
        <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
                className="bg-card rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-300/40 dark:shadow-black/50"
            >
                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
                    
                    <div className="text-left flex-1 space-y-2">
                        <div className="flex items-center space-x-3 mb-2">
                            <Shield className="h-6 w-6 text-primary" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Book Smarter with Yatra Saral
                            </h3>
                        </div>
                        <p className="text-md text-muted-foreground italic max-w-lg">
                            **Yatra Saral offers a seamless, feature-rich experience.** While Yatra Saral offers premium features, you can always go directly to the source for official Indian Railway Catering and Tourism Corporation (IRCTC) services.
                        </p>
                    </div>
                    
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <Dialog open={isIrctcDialogOpen} onOpenChange={setIsIrctcDialogOpen}>
                            <DialogTrigger asChild>
                                <button
                                    className="inline-flex items-center justify-center w-full 
                                               gradient-primary text-white px-8 py-3 rounded-xl 
                                               font-bold text-lg shadow-xl transition-all duration-300
                                               hover:shadow-primary/50 transform hover:scale-[1.03]"
                                >
                                    <Train className="h-5 w-5 mr-3" />
                                    Use Direct IRCTC Link
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg p-0 overflow-hidden"> 
                                <DialogHeader className="p-6 bg-yellow-50 dark:bg-gray-800 border-b border-yellow-200 dark:border-gray-700">
                                    <DialogTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 flex items-center">
                                        <Globe className="w-6 h-6 mr-3 flex-shrink-0" /> 
                                        External Site Warning
                                    </DialogTitle>
                                    <DialogDescription className="mt-1 text-sm text-yellow-700 dark:text-gray-400">
                                        You are leaving Yatra Saral and navigating to an independent, third-party website.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="p-6 space-y-4">
                                    <div className="bg-white dark:bg-background border rounded-lg p-4 shadow-sm">
                                        <p className="flex items-start text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            <Shield className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-primary" />
                                            Security & Privacy Notice
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 ml-4 text-sm text-muted-foreground">
                                            <li>Yatra Saral is **not responsible** for the content, security, or privacy practices on external sites.</li>
                                            <li>The destination link is for the official IRCTC portal. All bookings and transactions happen there.</li>
                                            <li>We recommend confirming the website's URL and security before entering sensitive information.</li>
                                        </ul>
                                    </div>
                                </div>
                                <DialogFooter className="p-6 pt-0">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setIsIrctcDialogOpen(false)} 
                                        className="w-full sm:w-auto"
                                    >
                                        Stay on Yatra Saral
                                    </Button>
                                    <a
                                        href="https://www.irctc.co.in/nget/train-search"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsIrctcDialogOpen(false)}
                                        className="w-full sm:w-auto"
                                    >
                                        <Button className="gradient-primary w-full">
                                            Confirm & Proceed
                                        </Button>
                                    </a>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            (Alternative link, opens in a new tab)
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
