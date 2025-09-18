import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ShieldCheck, Wallet, Banknote, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext'; 

type Plan = 'Basic' | 'Standard' | 'Premium';
type FormStep = 'plans' | 'details' | 'payment';

const plans = {
  Basic: {
    name: 'Basic',
    price: '₹299',
    priceValue: 299,
    description: 'Essential coverage for short trips.',
    features: ['Up to ₹1,00,000 Medical Coverage', 'Lost Luggage Assistance', '24/7 Support'],
  },
  Standard: {
    name: 'Standard',
    price: '₹499',
    priceValue: 499,
    description: 'Comprehensive coverage for most travelers.',
    features: ['Up to ₹3,00,000 Medical Coverage', 'Trip Cancellation Protection', 'Lost Luggage Assistance', 'Emergency Evacuation'],
  },
  Premium: {
    name: 'Premium',
    price: '₹799',
    priceValue: 799,
    description: 'Maximum protection for complete peace of mind.',
    features: ['Up to ₹5,00,000 Medical Coverage', 'Trip Cancellation & Interruption', 'Lost Luggage & Gadget Protection', 'Emergency Evacuation'],
  },
};

export const TravelInsurancePage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user } = useApp();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [step, setStep] = useState<FormStep>('plans');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [savedPassengers, setSavedPassengers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPassengers = async () => {
        if (!user) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passengers/${user.email}`);
            const data = await response.json();
            setSavedPassengers(data);
        } catch (error) {
            console.error("Failed to fetch saved passengers");
        }
    };
    fetchPassengers();
  }, [user]);

  const today = new Date().toISOString().split('T')[0];
  const startDate = watch("startDate");

  const handlePassengerSelect = (passengerId: string) => {
    const selectedPassenger = savedPassengers.find(p => p._id === passengerId);
    if (selectedPassenger) {
      setValue('fullName', selectedPassenger.name, { shouldValidate: true });
      setValue('age', selectedPassenger.age, { shouldValidate: true });
      setValue('email', selectedPassenger.email, { shouldValidate: true });
      setValue('phone', selectedPassenger.mobile, { shouldValidate: true });
    }
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 'N/A';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays + 1} days`;
  };

  const onSubmit = async (data: any) => {
    if (step === 'details') {
      setStep('payment');
      return;
    }
    
    if (step === 'payment') {
      if (!selectedPlan) return;

      const applicationData = {
        selectedPlan,
        planPrice: plans[selectedPlan].price,
        tripDuration: calculateDuration(data.startDate, data.endDate),
        fullName: data.fullName,
        age: data.age,
        email: data.email,
        phone: data.phone,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        paymentMethod,
        userEmail: user?.email, 
      };

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/insurance-applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(applicationData),
        });
        
        if (res.ok) {
          toast({
            title: 'Application Submitted!',
            description: `Your application for the ${selectedPlan} plan has been received.`,
          });
          reset();
          setSelectedPlan(null);
          setStep('plans');
        } else {
          toast({
            title: 'Error',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
         toast({
            title: 'Error',
            description: 'Could not submit your application.',
            variant: 'destructive',
          });
      }
    }
  };
  
  const handleSelectPlan = (plan: Plan) => {
      setSelectedPlan(plan);
      setStep('details');
  }

  const PlanCard = ({ plan, isPopular }: { plan: typeof plans[Plan], isPopular?: boolean }) => (
    <Card className={`flex flex-col ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader>
        {isPopular && <Badge className="w-fit self-end">Most Popular</Badge>}
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-4xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/trip</span></CardDescription>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <ul className="space-y-2 mb-6 flex-grow">
          {plan.features.map(feature => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button onClick={() => handleSelectPlan(plan.name as Plan)} className="w-full">
          Choose Plan
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-blue-50 dark:bg-blue-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <ShieldCheck className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-blue-700 dark:text-blue-400">
              Travel Insurance
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose a plan that's right for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
       <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
            <Button 
                variant="outline" 
                onClick={() => onNavigate('services')} 
                className="mb-8 flex items-center"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Services
            </Button>
            <AnimatePresence mode="wait">
              {step === 'plans' && (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  <PlanCard plan={plans.Basic} />
                  <PlanCard plan={plans.Standard} isPopular />
                  <PlanCard plan={plans.Premium} />
                </motion.div>
              )}

              {(step === 'details' || step === 'payment') && selectedPlan &&(
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                      <Card className="shadow-xl">
                        <CardHeader>
                          {step === 'details' && (
                           <Button variant="ghost" size="sm" className="w-fit" onClick={() => { setStep('plans'); setSelectedPlan(null); }}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
                          </Button>
                          )}
                          <CardTitle className="text-3xl">{step === 'details' ? 'Application Form' : 'Payment'}</CardTitle>
                          <CardDescription>
                            You have selected the <span className="font-bold text-primary">{selectedPlan}</span> plan.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {step === 'details' && (
                              <div className="space-y-6">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" {...register('fullName', { required: 'Full name is required' })} placeholder="Enter your full name" />
                                    {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message as string}</p>}
                                  </div>
                                   <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" type="number" min="1" {...register('age', { 
                                        required: 'Age is required',
                                        min: { value: 1, message: 'Age must be between 1 and 100.'}, 
                                        max: { value: 100, message: 'Age must be between 1 and 100.'} 
                                    })} placeholder="Age (1-100)" />
                                    {errors.age && <p className="text-destructive text-sm">{errors.age.message as string}</p>}
                                  </div>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue={user?.email || ''} {...register('email', { required: 'Email is required' })} placeholder="Enter your email" />
                                    {errors.email && <p className="text-destructive text-sm">{errors.email.message as string}</p>}
                                  </div>
                                   <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" {...register('phone', { 
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: 'Please enter a valid 10-digit phone number.'
                                        }
                                    })} placeholder="10-digit number" />
                                    {errors.phone && <p className="text-destructive text-sm">{errors.phone.message as string}</p>}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="startDate">Trip Start Date</Label>
                                    <Input id="startDate" type="date" {...register('startDate', { required: 'Start date is required' })} min={today} />
                                    {errors.startDate && <p className="text-destructive text-sm">{errors.startDate.message as string}</p>}
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="endDate">Trip End Date</Label>
                                    <Input id="endDate" type="date" {...register('endDate', { required: 'End date is required' })} min={startDate || today} />
                                    {errors.endDate && <p className="text-destructive text-sm">{errors.endDate.message as string}</p>}
                                  </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="destination">Destination</Label>
                                    <Input id="destination" {...register('destination', { required: 'Destination is required' })} placeholder="e.g., Mumbai" />
                                    {errors.destination && <p className="text-destructive text-sm">{errors.destination.message as string}</p>}
                                </div>
                                <Button type="submit" className="w-full md:w-auto">Proceed to Payment</Button>
                              </div>
                          )}

                          {step === 'payment' && (
                               <div className="space-y-6">
                                <p className="text-lg font-semibold mb-4">Total Amount: {plans[selectedPlan].price}</p>
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
                                <Button type="submit" className="w-full md:w-auto">Submit Application</Button>
                              </div>
                          )}
                        </CardContent>
                      </Card>
                    </form>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </section>
    </div>
  );
};