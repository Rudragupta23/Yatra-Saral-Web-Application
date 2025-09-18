import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { BellRing, Clock, Ban, ArrowLeft, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';

interface UserTicket {
  id: string; // This is the PNR
  trainName: string;
  source: string;
  destination: string;
}

export const TravelAlertsPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user } = useApp();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [activeTickets, setActiveTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserTickets = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${user.email}`);
          const tickets = await response.json();
          const filteredActiveTickets = tickets.filter((ticket: any) => ticket.status !== 'Cancelled');
          setActiveTickets(filteredActiveTickets);
        } catch (error) {
          console.error("Failed to fetch user tickets for alerts page.", error);
        }
      }
      setIsLoading(false);
    };
    checkUserTickets();
  }, [user]);

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscribe-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr: data.pnr, email: data.email }),
      });
      const result = await response.json();
      if (response.ok) {
        toast({ title: 'Subscribed!', description: result.message });
        reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({ title: 'Subscription Failed', description: error.message || 'An error occurred.', variant: 'destructive' });
    }
  };

  const features = [
      { icon: Clock, title: "Delay Notifications", description: "Get instant alerts if your train is running late." },
      { icon: Ban, title: "Cancellation Alerts", description: "Be the first to know if your train is cancelled." },
      { icon: MapPin, title: "Platform Changes", description: "Receive updates on last-minute platform changes." }
  ];

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center">Loading your ticket information...</p>;
    }
    if (!user) {
      return <p className="text-center text-muted-foreground">Please log in to subscribe to travel alerts.</p>;
    }
    if (activeTickets.length === 0) {
        return <p className="text-center text-muted-foreground">You must have a booked ticket to subscribe for alerts. Please book a ticket first.</p>;
    }
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Subscribe for Alerts</CardTitle>
                <CardDescription>Select your PNR to receive live hourly updates for your journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pnr">Select Your PNR *</Label>
                    <Controller
                        name="pnr"
                        control={control}
                        rules={{ required: 'Please select a PNR' }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose from your booked tickets..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {activeTickets.map(ticket => (
                                        <SelectItem key={ticket.id} value={ticket.id}>
                                            {ticket.id} ({ticket.source} → {ticket.destination})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.pnr && <p className="text-sm text-destructive">{errors.pnr.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        defaultValue={user.email}
                        {...register('email', { required: 'Email is required' })} 
                        placeholder="Enter the email for alerts" 
                    />
                     {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
                  </div>
                  <Button type="submit" className="w-full">Subscribe to Alerts</Button>
                </form>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <section className="py-20 bg-amber-50 dark:bg-amber-950/20">
          <div className="container mx-auto px-4">
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
              >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
                      <BellRing className="h-10 w-10 text-amber-600" />
                  </div>
                  <h1 className="text-5xl font-bold mb-6 text-amber-700 dark:text-amber-400">Travel Alerts</h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Get hourly notifications about delays, cancellations, and updates for your upcoming journey.</p>
              </motion.div>
          </div>
      </section>

       <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('services')} 
            className="mb-8 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Services
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {renderContent()}

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>Stay informed with our comprehensive alert system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {features.map(feature => (
                            <li key={feature.title} className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <feature.icon className="h-6 w-6 text-primary"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};