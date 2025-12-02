import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'signIn' | 'signUp' | 'forgotPassword' | 'resetPassword' | 'verifyOtp';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<AuthView>('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [emailToReset, setEmailToReset] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signupData, setSignupData] = useState<any>(null);
  const [signupOtp, setSignupOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');

  const { login, register: signUp, t, logout, user } = useApp();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        logout();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
        });
      }, 20 * 60 * 1000);
    };
    if (user && user.name === 'Guest') {
      const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => window.addEventListener(event, resetTimer));
      resetTimer();
      return () => {
        clearTimeout(inactivityTimer);
        events.forEach(event => window.removeEventListener(event, resetTimer));
      };
    }
  }, [user, logout, toast]);

  const handleAuthSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (view === 'signUp') {
        const otpRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-signup-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email }),
        });
        const otpResult = await otpRes.json();
        if (!otpRes.ok) throw new Error(otpResult.message || 'Failed to send OTP');
        setServerOtp(otpResult.otp);
        setSignupData(data); 
        setView('verifyOtp');
        toast({ title: "OTP Sent", description: "Check your email for the verification code." });
        return;
      }

      // Normal Sign In
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed');
      login(result);
      toast({ title: "Success!", description: "Logged in successfully." });
      onClose();
      reset();

    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  //  Handle OTP Verification & Final Registration
  const handleVerifyOtp = async () => {
    if (signupOtp !== serverOtp) {
      toast({ title: "Invalid OTP", description: "The code you entered is incorrect.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to register');
      signUp(result);
      toast({ title: "Success!", description: "Account created and signed in successfully." });
      onClose();
      reset();
      setView('signIn');
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to send code.');
      setResetCode(result.code);
      setEmailToReset(data.email);
      toast({ title: "Code Sent!", description: "A verification code has been sent to your email." });
      setView('resetPassword');
      reset();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    if (data.code !== resetCode) {
      toast({ title: "Error", description: "Invalid verification code.", variant: "destructive" });
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToReset, newPassword: data.newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to reset password');
      toast({ title: "Success!", description: "Your password has been reset. Please sign in." });
      setView('signIn');
      reset();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const renderForm = () => {
    if (view === 'verifyOtp') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">Enter the 6-digit code sent to **{signupData?.email}**</p>

          <Alert className="bg-card shadow-lg border border-primary/30 rounded-xl p-4 flex items-start space-x-3">
            <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <AlertTitle className="text-base font-bold text-primary">
                OTP Taking Time?
              </AlertTitle>
              <AlertDescription className="text-sm text-foreground/85">
                Please check your **Spam or Junk folder** immediately. Your verification email may have been filtered there.
              </AlertDescription>
            </div>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input id="otp" value={signupOtp} onChange={e => setSignupOtp(e.target.value)} placeholder="Enter OTP" />
          </div>
          <Button onClick={handleVerifyOtp} className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Sign Up
          </Button>
        </div>
      );
    }

    if (view === 'forgotPassword') {
      return (
        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
          <p className="text-sm text-muted-foreground">Enter your email to receive a verification code.</p>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email', { required: 'Email is required' })} placeholder="Enter your email" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Code
          </Button>
        </form>
      );
    }

    if (view === 'resetPassword') {
      return (
        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
          
          <Alert className="bg-card shadow-lg border border-primary/30 rounded-xl p-4 flex items-start space-x-3">
            <div>
              <AlertTitle className="text-base font-bold text-primary">
                Code Sent! Check Your Inbox.
              </AlertTitle>
              <AlertDescription className="text-sm text-foreground/85">
                If the email hasn't arrived, please check your **Spam or Junk folder** immediately. The reset mail may have been filtered.
              </AlertDescription>
            </div>
          </Alert>

          <p className="text-sm text-muted-foreground">A 6-digit code was sent to {emailToReset}.</p>
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input id="code" {...register('code', { required: 'Code is required' })} placeholder="Enter 6-digit code" />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register('newPassword', { required: 'New password is required' })} placeholder="Enter new password" />
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword', { required: 'Please confirm password' })} placeholder="Confirm new password" />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message as string}</p>}
          </div>
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit(handleAuthSubmit)} className="space-y-4">
        {view === 'signUp' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name', { required: 'Name is required' })} placeholder="Enter your full name" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                {...register('phone', { 
                  required: 'Phone number is required',
                  minLength: {
                    value: 10,
                    message: 'Phone number must be exactly 10 digits'
                  },
                  maxLength: {
                    value: 10,
                    message: 'Phone number must be exactly 10 digits'
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Please enter only numbers'
                  }
                })} 
                placeholder="Enter your 10-digit phone number" 
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message as string}</p>}
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: 'Email is required' })} placeholder="Enter your email" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required' })} placeholder="Enter your password" />
            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message as string}</p>}
        </div>
        {view === 'signIn' && (
          <div className="text-right">
            <button type="button" onClick={() => setView('forgotPassword')} className="text-sm text-primary hover:underline">
              Forgot Password?
            </button>
          </div>
        )}
        <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {view === 'signUp' ? t('auth.signUp') : t('auth.signIn')}
        </Button>
      </form>
    );
  };

  const getTitle = () => {
    if (view === 'forgotPassword') return "Forgot Password";
    if (view === 'resetPassword') return "Reset Password";
    if (view === 'verifyOtp') return "Verify Email";
    return view === 'signUp' ? t('auth.signUp') : t('auth.signIn');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-card rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">{getTitle()}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
            </div>
            {renderForm()}
            <div className="mt-6 text-center">
              {view === 'signIn' && (
                <button type="button" onClick={() => setView('signUp')} className="text-primary hover:underline">
                  Don't have an account? Sign Up
                </button>
              )}
              {view === 'signUp' && (
                <button type="button" onClick={() => setView('signIn')} className="text-primary hover:underline">
                  Already have an account? Sign In
                </button>
              )}
              {view === 'forgotPassword' && (
                <button type="button" onClick={() => setView('signIn')} className="text-primary hover:underline">
                  Back to Sign In
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
