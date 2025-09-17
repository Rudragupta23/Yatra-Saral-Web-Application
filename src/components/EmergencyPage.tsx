import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Shield, 
  Truck, 
  Heart, 
  Users, 
  Baby,
  AlertTriangle,
   ArrowLeft,
  CheckCircle,
  Eye,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';

export const EmergencyPage: React.FC = () => {
  const { t } = useApp();

  const emergencyContacts = [
    {
      icon: Shield,
      name: 'Police',
      number: '100',
      description: 'For any criminal activity or security threats',
      color: 'bg-blue-600'
    },
    {
      icon: Truck,
      name: 'Fire Brigade',
      number: '101',
      description: 'Fire emergencies and rescue operations',
      color: 'bg-red-600'
    },
    {
      icon: Heart,
      name: 'Ambulance',
      number: '108',
      description: 'Medical emergencies and health issues',
      color: 'bg-green-600'
    },
    {
      icon: Phone,
      name: 'Railway Helpline',
      number: '139',
      description: 'General railway inquiries and assistance',
      color: 'bg-primary'
    },
    {
      icon: Shield,
      name: 'RPF (Railway Protection Force)',
      number: '182',
      description: 'Railway security and passenger safety',
      color: 'bg-orange-600'
    },
    {
      icon: Users,
      name: 'Women Helpline',
      number: '1091',
      description: 'Support for women in distress',
      color: 'bg-pink-600'
    },
    {
      icon: Baby,
      name: 'Child Protection',
      number: '1098',
      description: 'Child safety and protection services',
      color: 'bg-purple-600'
    },
        {
      icon: Phone,
      name: 'Railway Helpline',
      number: '139',
      description: 'For general railway inquiries and travel assistance',
      color: 'bg-red-600'
    },    {
      icon: Shield,
      name: 'Railway Accident Helpline',
      number: '1072',
      description: 'For reporting railway accidents or getting immediate help',
      color: 'bg-blue-600'
    },
  ];

  const safetyTips = [
    {
      icon: Eye,
      title: 'Stay Alert',
      tips: [
        'Keep your belongings close at all times',
        'Be aware of your surroundings',
        'Avoid isolated areas of the station',
        'Report suspicious activities immediately'
      ]
    },
    {
      icon: MapPin,
      title: 'Platform Safety',
      tips: [
        'Stand behind the yellow line',
        'Board/alight only after train stops',
        'Use foot-over bridges for crossing',
        'Keep emergency contact numbers handy'
      ]
    },
    {
      icon: CheckCircle,
      title: 'General Tips',
      tips: [
        'Carry valid ID and tickets',
        'Keep emergency medicines if needed',
        'Inform family about your travel plans',
        'Use official railway services only'
      ]
    },
    {
      icon: Clock,
      title: 'Emergency Response',
      tips: [
        'Call appropriate emergency number',
        'Provide clear location details',
        'Stay calm and follow instructions',
        'Help others if safe to do so'
      ]
    }
  ];

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-red-50 dark:bg-red-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-red-700 dark:text-red-400">Emergency Contacts</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Quick access to emergency services and safety information for railway travelers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Emergency Helplines</h2>
            <p className="text-xl text-muted-foreground">
              Save these numbers and call immediately in case of emergency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${contact.color} rounded-full mb-4`}>
                  <contact.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {contact.name}
                </h3>
                
                <div className="text-3xl font-bold text-red-600 mb-3">
                  {contact.number}
                </div>
                
                <p className="text-muted-foreground mb-4 text-sm">
                  {contact.description}
                </p>
                
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleCall(contact.number)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Railway Station Safety Tips</h2>
            <p className="text-xl text-muted-foreground">
              Follow these guidelines to ensure a safe and comfortable journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyTips.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{section.title}</h3>
                </div>
                
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="py-12 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Remember: Stay Calm in Emergencies</h2>
            <p className="text-xl text-red-100 mb-6">
              Quick action can save lives. Keep these numbers accessible and help others when safe to do so.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 rounded-lg px-6 py-3">
                <span className="text-sm font-medium">Police: 100</span>
              </div>
              <div className="bg-white/20 rounded-lg px-6 py-3">
                <span className="text-sm font-medium">Fire: 101</span>
              </div>
              <div className="bg-white/20 rounded-lg px-6 py-3">
                <span className="text-sm font-medium">Ambulance: 108</span>
              </div>
              <div className="bg-white/20 rounded-lg px-6 py-3">
                <span className="text-sm font-medium">Railway: 139</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};