import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

export const ComplaintPage: React.FC = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
            console.error("Could not fetch saved passengers for complaint form.", error);
        }
    };
    fetchPassengers();
  }, [user]);

  const complaintCategories = [
    'Train Cleanliness',
    'AC/Heating Issues',
    'Bathroom/Toilet Problems',
    'Food Quality',
    'Staff Behavior',
    'Safety Concerns',
    'Station Facilities',
    'Ticket Issues',
    'Luggage Problems',
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
      const complaintData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        category: data.category,
        trainNumber: data.trainNumber || 'N/A',
        journeyDate: data.journeyDate || 'N/A',
        description: data.description,
        userEmail: user?.email 
      };

      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData),
      });

      if (response.ok) {
        const newComplaint = await response.json();
        setIsSubmitted(true);
        reset();
        
        toast({
          title: "Complaint Submitted Successfully",
          description: `RPF will contact you soon. Reference ID: ${newComplaint.id}`,
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
          <h2 className="text-2xl font-bold text-primary mb-4">Complaint Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your complaint has been successfully submitted. RPF (Railway Protection Force) will contact you soon for resolution.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            Submit Another Complaint
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-orange-50 dark:bg-orange-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
              <MessageSquare className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-orange-700 dark:text-orange-400">File a Complaint</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Report any issues with train services, cleanliness, or facilities. We take your feedback seriously.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Complaint Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <h2 className="text-2xl font-bold text-primary">Submit Your Complaint</h2>
                <p className="text-muted-foreground">All fields marked with * are required</p>
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
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  defaultValue={user?.phone || ''}
                  {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                          value: /^\d{10}$/,
                          message: 'Please enter a valid 10-digit phone number.'
                      }
                  })}
                  placeholder="Enter your 10-digit phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message as string}</p>
                )}
              </div>

              {/* Complaint Details */}
              <div className="space-y-2">
                <Label htmlFor="category">Complaint Category *</Label>
                <Select onValueChange={(value) => setValue('category', value)} {...register('category', { required: 'Please select a category' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complaint category" />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintCategories.map((category) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainNumber">Train Number (if applicable)</Label>
                  <Input
                    id="trainNumber"
                    {...register('trainNumber', {
                        pattern: {
                            value: /^\d{5}$/,
                            message: 'Please enter a valid 5-digit train number.'
                        }
                    })}
                    placeholder="e.g., 12345"
                  />
                   {errors.trainNumber && (
                    <p className="text-sm text-destructive">{errors.trainNumber.message as string}</p>
                  )}
                </div>

<div className="space-y-2">
  <Label htmlFor="journeyDate">Journey Date (if applicable)</Label>
  <Input
    id="journeyDate"
    type="date"
    min={new Date().toISOString().split('T')[0]} 
    {...register('journeyDate')}
  />
</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Complaint Description *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Please provide detailed information about your complaint..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message as string}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Send className="h-4 w-4 mr-2" />
                Submit Complaint
              </Button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                <li>• Your complaint will be forwarded to RPF (Railway Protection Force)</li>
                <li>• You will receive a reference ID for tracking</li>
                <li>• RPF will contact you within 24-48 hours</li>
                <li>• Urgent safety issues are prioritized immediately</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};