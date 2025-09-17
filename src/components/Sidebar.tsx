import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import { 
  X, 
  Sun, 
  Moon, 
  Bell, 
  MessageSquare, 
  Heart, 
  Users, 
  Phone, 
  Settings, 
  HelpCircle,
  Shield,
  FileText,
  Mail
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
const { user, setAuthModal, theme, toggleTheme, t } = useApp();
const { toast } = useToast();
  const menuItems = [
    {
      id: 'theme',
      icon: theme === 'light' ? Moon : Sun,
      label: theme === 'light' ? t('menu.darkMode') : t('menu.lightMode'),
      onClick: toggleTheme
    },
    {
      id: 'history',
      icon: FileText,
      label: t('menu.history'),
      onClick: () => onNavigate('history')
    },
    {
      id: 'emergency',
      icon: Bell,
      label: t('menu.emergency'),
      onClick: () => onNavigate('emergency')
    },
{
  id: 'complaint',
  icon: MessageSquare,
  label: t('menu.complaint'),
  onClick: () => {
    if (user) {
      onNavigate('complaint');
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign in or sign up to file a complaint.",
      });
      setAuthModal({ isOpen: true, view: 'login' });
    }
  }
},
    {
      id: 'feedback',
      icon: Heart,
      label: t('menu.feedback'),
      onClick: () => onNavigate('feedback')
    },
    {
      id: 'saved-passengers',
      icon: Users,
      label: t('menu.savedPassengers'),
      onClick: () => onNavigate('saved-passengers')
    },
    {
      id: 'contact',
      icon: Phone,
      label: t('menu.contact'),
      onClick: () => onNavigate('contact')
    },
    {
      id: 'settings',
      icon: Settings,
      label: t('menu.settings'),
      onClick: () => onNavigate('settings')
    },
    {
      id: 'faq',
      icon: HelpCircle,
      label: t('menu.faq'),
      onClick: () => onNavigate('faq')
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              opacity: { duration: 0.3 }
            }}
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-card to-card/95 
              backdrop-blur-sm border-r border-border z-50 shadow-2xl overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />
            
            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <motion.h2 
                  onClick={() => {
                    onNavigate('home');
                    onClose();
                  }}
                  className="text-2xl font-black text-primary tracking-tight cursor-pointer transition-opacity hover:opacity-80"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t('site.name')}
                </motion.h2>
                <motion.div
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-destructive/10 hover:text-destructive rounded-full
                      transition-all duration-300 hover:shadow-lg"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-3">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-14 text-left rounded-xl border border-transparent 
                        hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 
                        hover:border-primary/20 hover:shadow-lg hover:scale-[1.02] 
                        transition-all duration-300 ease-out
                        group-hover:translate-x-1 relative overflow-hidden
                        before:absolute before:inset-0 before:bg-gradient-to-r 
                        before:from-primary/5 before:to-secondary/5 before:opacity-0 
                        before:transition-opacity before:duration-300 
                        hover:before:opacity-100"
                      onClick={() => {
                        item.onClick();
                        if (item.id !== 'theme') onClose();
                      }}
                    >
                      <motion.div
                        className="relative z-10 flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                          <item.icon className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors duration-300" />
                        </div>
                        <span className="font-medium group-hover:text-primary transition-colors duration-300">
                          {item.label}
                        </span>
                      </motion.div>
                      
                      {/* Animated border highlight */}
                      <motion.div
                        className="absolute inset-0 border-2 border-primary/20 rounded-xl opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                        animate={{ translateX: ["100%", "-100%"] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          repeatDelay: 3,
                          ease: "easeInOut" 
                        }}
                      />
                    </Button>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};