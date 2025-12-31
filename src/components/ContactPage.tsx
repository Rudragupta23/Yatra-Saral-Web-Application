import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Building,
  Calendar,
   ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import myPhoto from '../assets/mine.jpg';

const getOpeningStatus = () => {
  const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const day = now.getDay(); 
  const hour = now.getHours();

  if (day >= 1 && day <= 5) {
    if (hour >= 9 && hour < 18) {
      return { text: 'Open Now', color: 'bg-green-500' };
    }
  }
  else if (day === 0 || day === 6) {
    if (hour >= 10 && hour < 16) {
      return { text: 'Open Now', color: 'bg-green-500' };
    }
  }
  
  return { text: 'Currently Closed', color: 'bg-red-500' };
};


export const ContactPage: React.FC = () => {
  const { t } = useApp();
  const [openingStatus, setOpeningStatus] = useState(getOpeningStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setOpeningStatus(getOpeningStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);


  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone Number',
      value: '+91 98968 00458',
      action: 'tel:+919896800458',
      color: 'bg-green-500',
      buttonText: 'Call Now'
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: '23rudragupta@gmail.com',
      action: 'mailto:23rudragupta@gmail.com',
      color: 'bg-blue-500',
      buttonText: 'Email Us'
    },
    {
      icon: MapPin,
      label: 'Office Address',
      value: 'VIT Bhopal University, Sehore - 466114, India',
      action: "https://www.google.com/maps/search/?api=1&query=VIT%20Bhopal%20University",
      color: 'bg-red-500',
      buttonText: 'Get Directions'
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Mon - Fri: 9 AM - 6 PM | Sat & Sun: 10 AM - 4 PM',
      action: null,
      color: 'bg-purple-500',
      buttonText: null
    }
  ];

  const teamInfo = {
    name: 'Rudra Gupta',
    position: 'Founder',
    experience: '2+ years in Web Development',
    education: 'B.Tech Computer Science, VIT Bhopal',
    photo: myPhoto
  };

  const handleContact = (action: string | null) => {
    if (action) {
      window.open(action, '_self');
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-blue-50 dark:bg-blue-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <MessageCircle className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-blue-700 dark:text-blue-400">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get in touch with us for any queries, support, or business inquiries. We're here to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground">
              Multiple ways to reach us for your convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-all flex flex-col"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${info.color} rounded-full mb-4`}>
                  <info.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {info.label}
                </h3>
                
                <p className="text-muted-foreground mb-4 flex-grow">
                  {info.value}
                </p>
                
                {info.action && info.buttonText ? (
                  <Button
                    className="w-full mt-auto"
                    onClick={() => handleContact(info.action)}
                  >
                    {info.buttonText}
                  </Button>
                ) : info.label === 'Working Hours' && (
<div className={`w-full mt-auto px-4 py-2 text-white text-sm font-semibold rounded-md text-center ${openingStatus.color}`}>
  {openingStatus.text}
</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Meet the Founder</h2>
            <p className="text-xl text-muted-foreground">
              The vision behind Yatra Saral
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card rounded-lg shadow-lg p-8 text-center">
              <img
                src={teamInfo.photo}
                alt={teamInfo.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
              />
              
              <h3 className="text-2xl font-bold text-primary mb-2">{teamInfo.name}</h3>
              <p className="text-lg text-secondary font-semibold mb-4">{teamInfo.position}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{teamInfo.experience}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{teamInfo.education}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-justify">
                "I founded Yatra Saral with a vision to revolutionize train travel in India. 
                With over 2+ years of experience in web development, I believe that 
                technology can make train journeys more comfortable, safe, and accessible for everyone."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Business Hours</h2>
            <p className="text-xl text-muted-foreground">
              When you can reach us for support
            </p>
          </motion.div>

          <div className="max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Monday - Friday</span>
                <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Saturday</span>
                <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Sunday</span>
                <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                <Clock className="h-4 w-4 inline mr-2" />
                All times are in Indian Standard Time (IST)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Need Immediate Assistance?</h2>
            <p className="text-xl text-white/90 mb-8">
              Call us directly for urgent queries or technical support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4"
                onClick={() => handleContact('tel:+919896800458')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now: +91 98968 00458
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4"
                onClick={() => handleContact('mailto:23rudragupta@gmail.com')}
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
