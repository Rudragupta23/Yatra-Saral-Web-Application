import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, User, LogOut, TramFront } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Sidebar } from './Sidebar';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string; 
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, logout, t } = useApp();

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.services') },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-800 to-black text-white shadow-lg z-30"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <motion.button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-2xl font-bold text-white"
                whileHover={{ scale: 1.05, color: '#e5e7eb' /* gray-200 */ }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <TramFront className="h-7 w-7" />
                {t('site.name')}
              </motion.button>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="font-medium transition-colors px-3 py-2 z-10 relative"
                  >
                    {item.label}
                  </button>
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-md"
                      layoutId="active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300 hidden sm:block">
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onNavigate('profile')}
                    className="hover:bg-white/10"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="hover:bg-white/10"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setAuthModalOpen(true)}
                  className="gap-2 bg-transparent border-white/80 text-white/90 hover:bg-white/10 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};