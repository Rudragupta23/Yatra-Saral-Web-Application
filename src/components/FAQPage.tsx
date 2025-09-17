import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ArrowLeft, ChevronUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const FAQPage: React.FC = () => {
  const { t } = useApp();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI  . All transactions are secured with bank-level encryption."
    },
    {
      question: "How do I book a train ticket?",
      answer: "To book a train ticket: 1) Sign up/login to your account, 2) Go to Services > Train Booking, 3) Enter source and destination stations, 4) Select your preferred train and class, 5) Fill passenger details, 6) Make payment. Your e-ticket will be generated instantly."
    },
    {
      question: "How can I book additional services like cloak room?",
      answer: "After logging in, go to Services > Booking Services. Select the service you need (cloak room, coolie, wheelchair, dormitory), choose your station, select date and time, fill required details, and make payment. You'll receive a booking confirmation."
    },
    {
      question: "How do I register a complaint?",
      answer: "Go to the hamburger menu (☰) and select 'Complaint'. Fill out the complaint form with details about your issue, train number (if applicable), and journey date. Submit the form and you'll receive a reference ID. RPF will contact you within 24-48 hours."
    },
    {
        "question": "How can I buy a platform ticket?",
        "answer": "You can instantly buy a digital platform ticket through our 'Platform Tickets' service. The ticket is valid for 2 hours and is meant for non-passengers to enter the platform."
    },
    {
      question: "How can I give feedback?",
      answer: "You can provide feedback through: 1) Hamburger menu > Feedback, 2) Fill out the feedback form with your rating and comments, 3) Submit the form. We value your input and use it to improve our services."
    },
    {
      question: "How do I contact customer support?",
      answer: "Contact us via: Phone: +91 98968 00458, Email: 23rudragupta@gmail.com, or use the Contact Us page in the hamburger menu for complete contact information including office address and working hours."
    },
    {
      question: "How can I delete my account?",
      answer: "To delete your account: 1) Login to your account, 2) Go to hamburger menu > Settings, 3) Scroll to 'Danger Zone', 4) Click 'Delete Account', 5) Confirm deletion. This action is permanent and cannot be undone."
    },
    {
        "question": "How do I use the Travel Checklist?",
        "answer": "Our 'Travel Checklist' helps you remember to pack all essential items. You can use our pre-built checklist or add your own custom items to ensure you don't forget anything important."
    },
    {
        "question": "How do I make a group booking?",
        "answer": "For large groups, use our 'Group Booking' service. You will need to provide the details of all passengers, and an e-ticket will be generated for the entire group."
    },

    {
      question: "What if I face technical issues on the website?",
      answer: "If you experience technical issues: 1) Try refreshing the page, 2) Clear your browser cache, 3) Try a different browser, 4) Contact our support team with details about the problem you're facing."
    },
    {
      question: "How do I change my password?",
      answer: "Go to hamburger menu > Settings > Change Password. Enter your current password, then your new password twice for confirmation. Click 'Change Password' to save the changes."
    },
  {
        "question": "How do I cancel a booked ticket?",
        "answer": "To cancel a ticket, go to the 'View Tickets' section, find the ticket you want to cancel, and click on the 'Cancel Ticket' option. The refund amount will be credited to your original payment method as per the cancellation policy."
    },
    {
        "question": "How can I check the weather forecast for my destination?",
        "answer": "Our 'Weather Forecast' service provides hourly updates and a 5-day forecast for any station or city. Simply enter the location to get the latest weather information."
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-yellow-50 dark:bg-yellow-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
              <HelpCircle className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-yellow-700 dark:text-yellow-400">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about Yatra Saral services, booking process, and account management
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}  
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-card rounded-lg shadow-sm border border-border overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-primary pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-border">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-card p-4 rounded-lg">
                <p className="font-semibold text-primary mb-1">Phone Support</p>
                <p className="text-muted-foreground">+91 98968 00458</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <p className="font-semibold text-primary mb-1">Email Support</p>
                <p className="text-muted-foreground">23rudragupta@gmail.com</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <p className="font-semibold text-primary mb-1">Working Hours</p>
                <p className="text-muted-foreground">Mon - Fri: 9 AM - 6 PM | Sat & Sun: 10 AM - 4 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};