import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { TicketPercent, CreditCard, Wallet, Banknote, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext'; 

type FormStep = 'details' | 'payment';

export const PlatformTicketsPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user } = useApp(); 
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({mode: 'onChange'});
  const { toast } = useToast();
  const [step, setStep] = useState<FormStep>('details');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const ticketCount = watch('ticketCount') || 0;
  const totalPrice = ticketCount * 10;

  const onSubmit = async (data: any) => {
    if (step === 'details') {
        setStep('payment');
        return;
    }

    if (step === 'payment') {
      const ticketPurchaseData = {
        station: data.station,
        count: data.ticketCount,
        email: data.email,
        price: totalPrice,
        paymentMethod: paymentMethod,
        userEmail: user?.email,
      };

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/platform-tickets`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketPurchaseData) 
        });
        
        if (res.ok) {
          toast({ title: 'Success!', description: 'Your platform tickets have been sent to your email.' });
          reset();
          setStep('details');
        } else {
          toast({ title: 'Error', description: 'Failed to submit request.', variant: 'destructive' });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'An error occurred while connecting to the server.', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-lime-50 dark:bg-lime-950/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-lime-100 dark:bg-lime-900/30 rounded-full mb-6">
                        <TicketPercent className="h-10 w-10 text-lime-600" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 text-lime-700 dark:text-lime-400">
                        Platform Tickets
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Buy platform entry tickets for non-passengers.
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
                >
                    <Card className="shadow-lg">
                        <CardHeader>
                             {step === 'payment' && (
                               <Button variant="ghost" size="sm" className="w-fit" onClick={() => setStep('details')}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
                              </Button>
                              )}
                            <CardTitle>{step === 'details' ? 'Enter Details' : 'Complete Payment'}</CardTitle>
                            <CardDescription>
                                {step === 'details' ? 'Enter station and ticket details below.' : `Total amount to pay: ₹${totalPrice}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {step === 'details' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="station">Station Name</Label>
                                            <Input id="station" {...register('station', { required: 'Station name is required' })} placeholder="e.g., New Delhi (NDLS)" />
                                            {errors.station && <p className="text-destructive text-sm">{errors.station.message as string}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ticketCount">Number of Tickets</Label>
                                            <Input id="ticketCount" type="number" min="1" max="10" {...register('ticketCount', { 
                                                required: 'Number of tickets is required',
                                                min: { value: 1, message: 'Minimum 1 ticket.'},
                                                max: { value: 10, message: 'Maximum 10 tickets.'}
                                             })} placeholder="1" />
                                            {errors.ticketCount && <p className="text-destructive text-sm">{errors.ticketCount.message as string}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email for Tickets</Label>
                                            <Input id="email" type="email" defaultValue={user?.email || ''} {...register('email', { required: 'Email is required' })} placeholder="Enter your email address" />
                                            {errors.email && <p className="text-destructive text-sm">{errors.email.message as string}</p>}
                                        </div>
                                        <Button type="submit" className="w-full md:w-auto">Proceed to Payment</Button>
                                    </>
                                )}

                                {step === 'payment' && (
                                    <div className="space-y-6">
                                        <div className="flex gap-2 mb-6 border-b">
                                            <Button type="button" variant={paymentMethod === 'card' ? 'default' : 'ghost'} onClick={() => setPaymentMethod('card')}><CreditCard className="mr-2 h-4 w-4"/>Card</Button>
                                            <Button type="button" variant={paymentMethod === 'upi' ? 'default' : 'ghost'} onClick={() => setPaymentMethod('upi')}><Wallet className="mr-2 h-4 w-4"/>UPI</Button>
                                            <Button type="button" variant={paymentMethod === 'netbanking' ? 'default' : 'ghost'} onClick={() => setPaymentMethod('netbanking')}><Banknote className="mr-2 h-4 w-4"/>Net Banking</Button>
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <Input {...register('cardNumber', { required: 'Card number is required', pattern: { value: /^\d{16}$/, message: 'Please enter a valid 16-digit card number.' }})} placeholder="Card Number (16 digits)" />
                                                    {errors.cardNumber && <p className="text-destructive text-sm">{errors.cardNumber.message as string}</p>}
                                                </div>
                                                <div className="flex gap-4">
                                                   <div className="w-full">
                                                      <Input {...register('expiryDate', { required: 'Expiry date is required', pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY format.' }})} placeholder="Expiry Date (MM/YY)" />
                                                      {errors.expiryDate && <p className="text-destructive text-sm">{errors.expiryDate.message as string}</p>}
                                                   </div>
                                                   <div className="w-full">
                                                       <Input type="password" {...register('cvv', { required: 'CVV is required', pattern: { value: /^\d{3}$/, message: 'Enter a 3-digit CVV.' }})} placeholder="CVV (3 digits)" />
                                                       {errors.cvv && <p className="text-destructive text-sm">{errors.cvv.message as string}</p>}
                                                   </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <div>
                                                <Label htmlFor="upiId" className="mb-2 block">Enter your UPI ID</Label>
                                                <Input id="upiId" placeholder="yourname@upi" />
                                            </div>
                                        )}

                                        {paymentMethod === 'netbanking' && (
                                            <div>
                                                <Label htmlFor="bank" className="mb-2 block">Select your bank</Label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Choose Bank" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sbi">State Bank of India</SelectItem>
                                                        <SelectItem value="hdfc">HDFC Bank</SelectItem>
                                                        <SelectItem value="icici">ICICI Bank</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <Button type="submit" className="w-full md:w-auto">Buy Ticket (₹{totalPrice})</Button>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    </div>
  );
};