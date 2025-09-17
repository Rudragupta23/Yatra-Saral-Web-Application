import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRightSquare, CheckCircle, Search, ArrowLeft, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext'; 

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'waitlist' | 'unavailable';

export const SeatUpgradesPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user } = useApp();
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors, isValid } } = useForm({mode: 'onChange'});
  const { toast } = useToast();
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [availableUpgrades, setAvailableUpgrades] = useState<string[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle');
  const [isChecking, setIsChecking] = useState(false);

  const desiredClassInput = watch('desiredClass');

  const upgradeOptions: { [key: string]: string[] } = {
    'S': ['3A', '2A', '1A'],
    'B': ['2A', '1A'],
    'A': ['1A'],
    'C': ['2A', '1A'],
    'H': [],
  };
  
  const classMap: { [key:string]: string } = {
      'SL': 'Sleeper',
      '3A': 'AC 3-Tier',
      '2A': 'AC 2-Tier',
      '1A': 'AC 1st Class'
  }

  useEffect(() => {
    const fetchUserTickets = async () => {
        if (user?.email) {
            try {
                const response = await fetch(`http://localhost:5000/api/tickets/${user.email}`);
                const data = await response.json();
                const eligibleTickets = data.filter((t: any) => t.status === 'Confirmed' && !t.isGroup);
                setUserTickets(eligibleTickets);
            } catch (error) {
                toast({ title: "Error", description: "Could not fetch your tickets.", variant: "destructive" });
            }
        }
    };
    fetchUserTickets();
  }, [user, toast]);

  const handlePnrSelect = (pnr: string) => {
    const ticket = userTickets.find(t => t.id === pnr);
    if (ticket) {
        setSelectedTicket(ticket);
        setValue('currentClass', ticket.coach);
        const coachPrefix = ticket.coach.charAt(0).toUpperCase();
        setAvailableUpgrades(upgradeOptions[coachPrefix] || []);
        setValue('desiredClass', '');
        setAvailabilityStatus('idle');
    }
  };

  const isTopClass = selectedTicket?.coach?.toUpperCase().startsWith('H');

  const handleCheckAvailability = () => {
      setIsChecking(true);
      setAvailabilityStatus('checking');
      setTimeout(() => {
          const outcome = Math.random();
          if (outcome > 0.5) setAvailabilityStatus('available');
          else if (outcome > 0.1) setAvailabilityStatus('waitlist');
          else setAvailabilityStatus('unavailable');
          setIsChecking(false);
      }, 1500);
  }

  const onSubmit = async (data: any) => {
    const finalStatus = availabilityStatus === 'available' ? 'Confirmed Upgrade' : 'Waitlisted';
    
    const upgradeData = {
        pnr: data.pnr,
        from: selectedTicket.coach,
        to: classMap[data.desiredClass as keyof typeof classMap],
        requestWindowSeat: data.requestWindowSeat || false,
        status: finalStatus,
        userEmail: user?.email
    };

    try {
      const res = await fetch('http://localhost:5000/api/seat-upgrades', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(upgradeData)
      });
      
      if (res.ok) {
        toast({ title: 'Success!', description: `Your request for an upgrade has been submitted with status: ${finalStatus}.` });
        reset();
        setSelectedTicket(null);
        setAvailabilityStatus('idle');
      } else {
        toast({ title: 'Error', description: 'Failed to submit request.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred while connecting to the server.', variant: 'destructive' });
    }
  };

  const features = [
      { icon: SlidersHorizontal, title: "Upgrade Class", description: "Move to a higher class like AC 3-Tier, 2-Tier, or 1st Class." },
      { icon: CheckCircle, title: "Request Window Seat", description: "Preference for a window seat will be considered if available." },
      { icon: Search, title: "Check Availability", description: "Our system checks for last-minute cancellations to find you a spot." }
  ];

  const renderSubmitButton = () => {
      switch(availabilityStatus) {
          case 'available':
              return <Button type="submit" className="w-full md:w-auto">Confirm Upgrade</Button>;
          case 'waitlist':
              return <Button type="submit" className="w-full md:w-auto">Join Waitlist</Button>;
          case 'checking':
              return <Button disabled className="w-full md:w-auto"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</Button>;
          case 'unavailable':
              return <Button disabled variant="destructive" className="w-full md:w-auto">Not Available</Button>;
          default:
              return <Button type="button" onClick={handleCheckAvailability} disabled={!selectedTicket || !desiredClassInput || isChecking} className="w-full md:w-auto">Check Availability</Button>;
      }
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-indigo-50 dark:bg-indigo-950/20">
          <div className="container mx-auto px-4">
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
              >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
                      <ArrowUpRightSquare className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h1 className="text-5xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">
                      Seat Upgrades
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                      Upgrade your seat class before or during travel.
                  </p>
              </motion.div>
          </div>
      </section>

       {/* Main Content */}
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
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Request an Upgrade</CardTitle>
                    <CardDescription>Select your PNR to check for upgrade eligibility.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="pnr">Select Your PNR</Label>
                        <Controller
                            name="pnr"
                            control={control}
                            rules={{ required: 'Please select your ticket PNR' }}
                            render={({ field }) => (
                                <Select onValueChange={(value) => { field.onChange(value); handlePnrSelect(value); }} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose from your booked tickets..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userTickets.length > 0 ? (
                                            userTickets.map(ticket => (
                                                <SelectItem key={ticket.id} value={ticket.id}>
                                                    {ticket.id} ({ticket.source} → {ticket.destination})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-4 text-sm text-muted-foreground">No eligible tickets found.</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.pnr && <p className="text-sm text-destructive">{errors.pnr.message as string}</p>}
                      </div>
                      
                      {selectedTicket && (
                        <>
                          <div className="space-y-2">
                            <Label>Current Coach</Label>
                            <Input value={selectedTicket.coach} disabled />
                          </div>

                          {isTopClass ? (
                            <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                                You are already in the highest available class!
                            </div>
                          ) : (
                            <>
                                <div className="space-y-2">
                                <Label htmlFor="desiredClass">Desired Upgrade Class</Label>
                                <Controller
                                    name="desiredClass"
                                    control={control}
                                    rules={{ required: 'Please select a class' }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value} disabled={availableUpgrades.length === 0}>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select class to upgrade to" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            {availableUpgrades.map(opt => (
                                                <SelectItem key={opt} value={opt}>{classMap[opt as keyof typeof classMap]}</SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.desiredClass && <p className="text-sm text-destructive">{errors.desiredClass.message as string}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Controller
                                        name="requestWindowSeat"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox 
                                                id="requestWindowSeat"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label htmlFor="requestWindowSeat" className="text-sm font-medium leading-none">
                                        Request Window Seat
                                    </Label>
                                </div>
                                
                                {availabilityStatus !== 'idle' &&
                                    <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="p-3 text-center rounded-md bg-muted text-sm">
                                        {availabilityStatus === 'available' && <p className="text-green-600 font-semibold">Good news! An upgrade is available.</p>}
                                        {availabilityStatus === 'waitlist' && <p className="text-amber-600 font-semibold">No direct upgrade available, but you can join the waitlist.</p>}
                                        {availabilityStatus === 'unavailable' && <p className="text-destructive font-semibold">Sorry, no upgrades are available for this class right now.</p>}
                                    </motion.div>
                                }
                                {renderSubmitButton()}
                            </>
                          )}
                        </>
                      )}
                    </form>
                </CardContent>
            </Card>

             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>How it Works</CardTitle>
                    <CardDescription>Our seat upgrade service is simple and efficient.</CardDescription>
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