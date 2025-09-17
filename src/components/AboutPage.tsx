import React from 'react';
import { motion } from 'framer-motion';
import { Train, Target, Eye, Users, MapPin, Calendar, Shield, Star, BookOpen, Rocket } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';

interface AboutPageProps {
  onNavigate: (section: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useApp();

  const stats = [
    { icon: Star, value: "4.6/5", label: "Customer Rating" },
    { icon: MapPin, value: "7,300+", label: "Railway Stations Connected" },
    { icon: Calendar, value: "30K+", label: "Monthly Bookings" },
    { icon: Users, value: "10K+", label: "Active Users" },
  ];

  const services = [
    { title: "Train Booking", description: "Seamless online train ticket booking with real-time availability" },
    { title: "Group Booking", description: "Book tickets for large groups at once seamlessly" },
    { title: "Platform Services", description: "Book additional services like cloak room, coolie, wheelchair" },
    { title: "Food Ordering", description: "Order fresh meals directly to your seat during journey" },
    { title: "Emergency Support", description: "24/7 emergency contacts and safety assistance" },
    { title: "Read Aloud & Multi Language", description: "Available in Hindi and English for better accessibility" },
  ];

  const whyChooseUs = [
    { title: "User-Friendly Interface", description: "Intuitive design that makes booking effortless" },
    { title: "Secure Payments", description: "Multiple payment options with bank-level security" },
    { title: "Real-time Updates", description: "Live train status and journey updates" },
    { title: "24/7 Support", description: "Round-the-clock customer service and assistance" },
    { title: "Mobile Optimized", description: "Responsive design that works on all devices" },
    { title: "Quick Booking", description: "Book tickets in less than 2 minutes" },
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
            <h1 className="text-5xl font-black mb-6 tracking-tight">{t('about.title')}</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-card rounded-lg shadow-lg p-8 border text-center"
            >
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-primary tracking-tight">{t('about.mission.title')}</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium text-justify">
                {t('about.mission.desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="bg-card rounded-lg shadow-lg p-8 border text-center"
            >
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="text-3xl font-black text-primary tracking-tight">{t('about.vision.title')}</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium text-justify">
                {t('about.vision.desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg border text-center"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-4xl font-black text-primary mb-4 tracking-tight">{t('about.story.title')}</h2>
                <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto text-justify">
                  {t('about.story.desc')}
                </p>
            </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-primary mb-4 tracking-tight">Our Impact</h2>
            <p className="text-xl text-muted-foreground font-medium">
              Numbers that speak for our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-card rounded-lg shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-primary mb-4 tracking-tight">What We Offer</h2>
            <p className="text-xl text-muted-foreground font-medium">
              Comprehensive solutions for all your train travel needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-muted-foreground font-medium">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-primary mb-4 tracking-tight">Why Choose Us?</h2>
            <p className="text-xl text-muted-foreground font-medium">
              Experience the difference with our premium features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-card rounded-lg shadow-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Train className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-medium">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 font-medium max-w-2xl mx-auto">
              {t('about.cta.desc')}
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-colors px-12 py-4 text-lg font-bold"
              onClick={() => onNavigate('services')}
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};