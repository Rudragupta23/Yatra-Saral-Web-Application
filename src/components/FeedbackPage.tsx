import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, CheckCircle, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

export const FeedbackPage: React.FC = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  const [savedPassengers, setSavedPassengers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPassengers = async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:5000/api/passengers/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setSavedPassengers(data);
            }
        } catch (error) {
            console.error("Could not fetch saved passengers for feedback form.", error);
        }
    };
    fetchPassengers();
  }, [user]);

  const feedbackCategories = [
    'Website Experience',
    'Booking Process',
    'Customer Service',
    'Train Journey',
    'Station Facilities',
    'Food Quality',
    'App Performance',
    'Payment Process',
    'General Suggestion',
    'Other'
  ];

  const handlePassengerSelect = (passengerId: string) => {
    const selectedPassenger = savedPassengers.find(p => p._id === passengerId);
    if (selectedPassenger) {
      setValue('name', selectedPassenger.name || '', { shouldValidate: true });
      setValue('email', selectedPassenger.email || '', { shouldValidate: true });
      setValue('phone', selectedPassenger.mobile || '', { shouldValidate: true });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const feedbackData = {
        name: data.name,
        email: data.email,
        phone: data.phone || 'N/A',
        category: data.category,
        rating: rating,
        feedback: data.feedback,
        suggestions: data.suggestions || 'N/A',
        userEmail: user?.email 
      };

      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        setRating(0);
        toast({
          title: "Feedback Submitted Successfully",
          description: "Thank you for your valuable feedback! We appreciate your input.",
        });
      } else {
        throw new Error('Submission to backend failed');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later or contact support directly.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md mx-4"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your feedback has been successfully submitted. We value your input and will use it to improve our services.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            Submit More Feedback
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-pink-50 dark:bg-pink-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-6">
              <Heart className="h-10 w-10 text-pink-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-pink-700 dark:text-pink-400">Share Your Feedback</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your opinion matters! Help us improve Yatra Saral by sharing your experience and suggestions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <h2 className="text-2xl font-bold text-primary">We Value Your Opinion</h2>
                <p className="text-muted-foreground">Help us serve you better</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {savedPassengers.length > 0 && (
                <div className="space-y-2 pb-6 border-b">
                  <Label>Fill from Saved Passengers (Optional)</Label>
                  <Select onValueChange={handlePassengerSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a saved passenger..." />
                    </SelectTrigger>
                    <SelectContent>
                      {savedPassengers.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} ({p.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name || ''}
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    {...register('email', { required: 'Email is required' })}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message as string}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  defaultValue={user?.phone || ''}
                  {...register('phone')}
                  placeholder="Enter your phone number (optional)"
                />
              </div>

              {/* Feedback Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Feedback Category *</Label>
                <Select onValueChange={(value) => setValue('category', value)} {...register('category', { required: 'Please select a category' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback category" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message as string}</p>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Overall Rating *</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-muted-foreground">
                    {rating > 0 && `${rating}/5 stars`}
                  </span>
                </div>
                {rating === 0 && (
                  <p className="text-sm text-destructive">Please provide a rating</p>
                )}
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback *</Label>
                <Textarea
                  id="feedback"
                  rows={6}
                  {...register('feedback', { required: 'Feedback is required' })}
                  placeholder="Please share your experience, what you liked, and areas for improvement..."
                />
                {errors.feedback && (
                  <p className="text-sm text-destructive">{errors.feedback.message as string}</p>
                )}
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <Label htmlFor="suggestions">Suggestions for Improvement</Label>
                <Textarea
                  id="suggestions"
                  rows={4}
                  {...register('suggestions')}
                  placeholder="Any specific suggestions to make our service better? (optional)"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                disabled={rating === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </form>

            <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Why your feedback matters:</h3>
              <ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
                <li>• Helps us understand your needs better</li>
                <li>• Guides our product development decisions</li>
                <li>• Improves experience for all travelers</li>
                <li>• Shows us what we're doing right</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};