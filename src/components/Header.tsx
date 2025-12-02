import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, User, LogOut, TramFront, AlertTriangle, Edit2, Check, Camera, Settings } from 'lucide-react'; 
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Sidebar } from './Sidebar';
import { AuthModal } from './AuthModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 


interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string; 
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TRAVEL_QUOTES = [
    "Adventure awaits!",
    "Life is a journey, not a destination.",
    "Ready for departure!",
    "Your next great story starts now.",
    "Collect moments, not things.",
    "Go explore. The train is calling!",
    "Where to next, traveler?",
];

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, logout, t, remainingSessionTime } = useApp();
  
  const getUserKey = (key: string): string | null => {
      return user?.name ? `yatraSaral_${key}_${user.name.replace(/\s/g, '_')}` : null;
  };

  const [isRenaming, setIsRenaming] = useState(false);
  const [displayUserName, setDisplayUserName] = useState('Traveler');
  const [newName, setNewName] = useState('Traveler');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  
  useEffect(() => {
    if (user) {
        const nameKey = getUserKey('displayName');
        const picKey = getUserKey('profilePic');
        
        const savedName = nameKey ? localStorage.getItem(nameKey) : null;
        const savedPic = picKey ? localStorage.getItem(picKey) : null;
        const contextName = user.name || "Traveler";

        if (savedName) {
            setDisplayUserName(savedName);
            setNewName(savedName);
        } else {
            setDisplayUserName(contextName);
            setNewName(contextName);
        }
        
        setProfilePicture(savedPic);

    } else {
        setDisplayUserName("Traveler");
        setNewName("Traveler");
        setProfilePicture(null);
    }
  }, [user?.name, user]); 

  const isValidName = /^[a-zA-Z\s]{1,14}$/.test(newName.trim());
  
  const handleSaveName = () => {
    if (isValidName) {
      const trimmedName = newName.trim();
      const nameKey = getUserKey('displayName');
      if (nameKey) {
        localStorage.setItem(nameKey, trimmedName);
      }
      setDisplayUserName(trimmedName);
      setIsRenaming(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        const picKey = getUserKey('profilePic');
        if (picKey) {
          localStorage.setItem(picKey, base64Image);
        }
        setProfilePicture(base64Image);
      };
      if (file.size > 2097152) {
        alert("File size exceeds 2MB limit.");
        return;
      }
      reader.readAsDataURL(file);
    }
  };
  
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
          <div className="relative flex items-center justify-between h-16">
            
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
                whileHover={{ scale: 1.05, color: '#e5e7eb' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <TramFront className="h-7 w-7" />
                {t('site.name')}
              </motion.button>
            </div>

            <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
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
                  
                  {remainingSessionTime > 0 && (
                    <div className="flex items-center mr-1">
                      <div className="text-sm font-semibold text-gray-300 transition-colors duration-200 px-1 py-1 rounded-md hover:bg-white/10 cursor-default">
                        {t('session.time.label')} {formatTime(remainingSessionTime)}
                      </div>
                      <div className="w-px h-5 bg-gray-600 hidden sm:block mx-1" /> {/* Separator after time */}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    
                    <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-9 w-9 rounded-full hover:bg-white/10 p-0"
                            >
                                <Avatar className="h-9 w-9">
                                    {profilePicture ? (
                                        <AvatarImage src={profilePicture} alt={`${displayUserName}'s avatar`} />
                                    ) : (
                                        <AvatarFallback className="bg-indigo-600 text-white text-sm">
                                            {displayUserName ? displayUserName.substring(0, 2).toUpperCase() : <User className="h-4 w-4" />}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </Button>
                        </DialogTrigger>
                    </Dialog>

                    <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
                        <DialogTrigger asChild>
                            <span className="text-sm font-bold text-white hidden sm:block cursor-pointer px-1 py-1 rounded-md hover:bg-white/10 transition-colors duration-200">
                                {displayUserName}
                            </span>
                        </DialogTrigger>
                    </Dialog>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-white/10"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                           <AlertTriangle className="h-6 w-6"/> End Your Journey?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to end your secure session now? All unsaved data might be lost, and you will need to sign in again to access restricted services.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Stay Logged In</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => {
                            logout();
                          }} 
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Confirm Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader className="items-center">
                <Camera className="h-7 w-7 text-indigo-500 mb-2"/>
                <DialogTitle className="text-2xl font-bold">
                    Update Your Profile Photo
                </DialogTitle>
                <DialogDescription className="text-center">
                    Personalize your journey! Your photo will be visible across sessions.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-6 border-y border-gray-200">
                <Avatar className="h-32 w-32 border-4 border-indigo-500/50 hover:border-indigo-500 transition-colors duration-200">
                    {profilePicture ? (
                        <AvatarImage src={profilePicture} alt="Current profile" className="object-cover" />
                    ) : (
                        <AvatarFallback className="bg-gray-200 text-gray-800 text-4xl font-bold">
                            {displayUserName ? displayUserName.substring(0, 2).toUpperCase() : <User className="h-12 w-12" />}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="w-full">
                    <Label htmlFor="picture" className="text-sm font-medium text-gray-700 block mb-1">Upload New Image (JPG/PNG, Max 2MB)</Label>
                    <Input
                        id="picture"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleFileUpload}
                        className="mt-2 cursor-pointer border-indigo-300 hover:border-indigo-500 transition-colors"
                    />
                </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
                <div className="flex space-x-2">
                    <Button 
                        variant="destructive" 
                        onClick={() => {
                            localStorage.removeItem(getUserKey('profilePic')!);
                            setProfilePicture(null);
                        }}
                        disabled={!profilePicture}
                        className="gap-2"
                    >
                        Remove Photo
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            setIsPhotoDialogOpen(false); 
                            onNavigate('settings');
                        }}
                        className="gap-2"
                    >
                        <Settings className="h-4 w-4"/> Go to Settings
                    </Button>
                </div>
                <Button variant="default" onClick={() => setIsPhotoDialogOpen(false)}>Done</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <p className="text-purple-500 font-bold text-lg">You deserve a dazzling new name! ✨</p>
                <DialogTitle className="flex items-center gap-2">
                    <Edit2 className="h-5 w-5"/> Rename Display Name
                </DialogTitle>
                <DialogDescription>
                    Update your displayed name. It must contain only alphabetic characters and spaces.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        New Name
                    </Label>
                    <Input
                        id="name"
                        value={newName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 14 && /^[a-zA-Z\s]*$/.test(value)) {
                                setNewName(value);
                            }
                        }}
                        maxLength={14}
                        className="col-span-3"
                        placeholder="Alphabets and spaces only"
                    />
                </div>
                {!isValidName && newName.trim().length > 0 && (
                    <p className="text-red-500 text-xs text-right col-span-4 mt-[-10px]">
                        Invalid name format. Only alphabetic characters and spaces (1-14 chars) are allowed.
                    </p>
                )}
            </div>
            <DialogFooter>
                <Button 
                    type="submit" 
                    onClick={handleSaveName} 
                    disabled={!isValidName}
                    className="gap-1"
                >
                    <Check className="h-4 w-4" /> Save Changes
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

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
