import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Eye, 
  EyeOff, 
  Trash2, 
  Type, 
  Globe,
  Save,
  AlertTriangle,
  Volume2,
  VolumeX,
   ArrowLeft,
  RotateCcw,
  Share2,
  UserX,
  Lock
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export const SettingsPage: React.FC = () => {
  const { user, language, setLanguage, fontSize, setFontSize, logout, t, isReadAloudEnabled, setIsReadAloudEnabled, cancelSpeak, resetSettings } = useApp();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm();
  const { register: registerDelete, handleSubmit: handleDeleteSubmit, formState: { errors: deleteErrors }, reset: resetDeleteForm } = useForm();

  const handlePasswordChange = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      toast({ title: "Success!", description: "Your password has been changed successfully." });
      resetPasswordForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to change password.", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/delete-account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
      logout(); 
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete account.", variant: "destructive" });
    }
  };

  const handleToggleReadAloud = () => {
    if (isReadAloudEnabled) {
      cancelSpeak();
    } else {
      setIsReadAloudEnabled(true);
    }
  };
  
  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "Your personalization settings have been restored to their default values.",
    });
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'Yatra Saral',
      text: 'Check out Yatra Saral, your simple solution for train travel!',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({ title: 'Thanks for sharing!' });
      } catch (err) {
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: 'Link Copied!', description: 'App link copied to your clipboard.' });
      } catch (err) {
        toast({ title: 'Failed to copy link', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-900/30 rounded-full mb-6">
              <SettingsIcon className="h-10 w-10 text-gray-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-gray-700 dark:text-gray-400">{t('settings.title')}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('settings.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 gap-8">
            
            {/* Personalization */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Type className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
                  {t('settings.personalization')}
                  <span className="text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-md">
                    {t('settings.beta')}
                  </span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                
                {/* Item 1: Font Size */}
                <div>
                  <Label className="flex items-center gap-2 mb-1">{t('settings.fontSize')}</Label>
                  <p className="text-sm text-muted-foreground min-h-[40px]">Adjust the text size for readability.</p>
                  <Select value={fontSize} onValueChange={(value: '16px' | '18px' | '20px') => setFontSize(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16px">Small</SelectItem>
                      <SelectItem value="18px">Medium</SelectItem>
                      <SelectItem value="20px">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Item 2: Read Aloud */}
                <div>
                  <Label className="flex items-center gap-2 mb-1">{t('settings.readAloud')}</Label>
                  <p className="text-sm text-muted-foreground min-h-[40px]">{t('settings.readAloud.desc')}</p>
                  <Button onClick={handleToggleReadAloud} variant="outline" className="w-full">
                    {isReadAloudEnabled ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                    {isReadAloudEnabled ? 'Stop Reading' : 'Start Reading'}
                  </Button>
                </div>

                {/* Item 3: Language */}
                <div>
                  <Label className="flex items-center gap-2 mb-1">{t('settings.language')}</Label>
                  <p className="text-sm text-muted-foreground min-h-[40px]">Choose your preferred language.</p>
                  <Select value={language} onValueChange={(value: 'en' | 'hi') => setLanguage(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t('settings.english')}</SelectItem>
                      <SelectItem value="hi">{t('settings.hindi')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Item 4: Reset Preferences */}
                <div>
                  <Label className="flex items-center gap-2 mb-1">Reset Preferences</Label>
                  <p className="text-sm text-muted-foreground min-h-[40px]">
                    Revert all personalization settings to their defaults.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Default
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset your theme, language, and font size. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetSettings}>
                          Confirm Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </motion.div>

            {/* --- NEW SHARE CARD --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Share2 className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Support & Share</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">Share the App</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you enjoy using Yatra Saral, share it with your friends and family!
                  </p>
                  <Button onClick={handleShareApp} variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share App
                  </Button>
                </div>
              </div>
            </motion.div>
            {/* --- END OF NEW SHARE CARD --- */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Password Change */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">{t('settings.changePassword')}</h2>
                </div>

                <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('settings.password.current')}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordErrors.currentPassword && <p className="text-sm text-destructive">{passwordErrors.currentPassword.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('settings.password.new')}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordErrors.newPassword && <p className="text-sm text-destructive">{passwordErrors.newPassword.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('settings.password.confirm')}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword('confirmPassword', { required: 'Please confirm your password' })}
                    />
                    {passwordErrors.confirmPassword && <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message as string}</p>}
                  </div>

                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {t('settings.password.save')}
                  </Button>
                </form>
              </motion.div>

              {/* Account Management */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card rounded-lg shadow-lg p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">{t('settings.accountManagement')}</h2>
                </div>
                
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">{t('settings.accountInfo')}</h3>
                    {user && (
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {user.name}</p>
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        <p><span className="font-medium">Phone:</span> {user.phone}</p>
                      </div>
                    )}
                </div>

                <div className="space-y-4 mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-red-600">{t('settings.dangerZone')}</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('settings.deleteAccount')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data. Please enter your password to confirm.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <form onSubmit={handleDeleteSubmit(handleDeleteAccount)}>
                        <div className="space-y-2 my-4">
                            <Label htmlFor="delete-password">Password</Label>
                            <Input id="delete-password" type="password" {...registerDelete('password', { required: 'Password is required to delete your account' })} />
                            {deleteErrors.password && <p className="text-sm text-destructive">{deleteErrors.password.message as string}</p>}
                        </div>
                        <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => resetDeleteForm()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">
                          Delete Account
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};