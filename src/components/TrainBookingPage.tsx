import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Train, 
  Search, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Download,
  ArrowRight,
  IndianRupee,
  ArrowLeft,
  Wallet,
  Banknote
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form'; 
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

interface Train {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  duration: number;
  classes: {
    sleeper: { available: number; price: number };
    ac3: { available: number; price: number };
    ac2: { available: number; price: number };
    ac1: { available: number; price: number };
  };
}

// Interface for a saved passenger
interface SavedPassenger {
    _id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    mobile: string;
}

export const TrainBookingPage: React.FC = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [step, setStep] = useState<'search' | 'select' | 'details' | 'payment' | 'ticket'>('search');
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchData, setSearchData] = useState<any>({});
  const [ticket, setTicket] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [savedPassengers, setSavedPassengers] = useState<SavedPassenger[]>([]);
  
  // Add control to useForm
  const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm();

  useEffect(() => {
    const fetchSavedPassengers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/passengers');
            if (response.ok) {
                const data = await response.json();
                setSavedPassengers(data);
            }
        } catch (error) {
            console.error("Failed to fetch saved passengers", error);
        }
    };
    fetchSavedPassengers();
  }, []);

  const generateTrains = (source: string, destination: string) => {
    const trainCount = Math.floor(Math.random() * 2) + 2;
    const generatedTrains: Train[] = [];

    for (let i = 0; i < trainCount; i++) {
      const trainNumber = Math.floor(10000 + Math.random() * 90000);
      const sourceCode = source.substring(0, 3).toUpperCase();
      const destCode = destination.substring(0, 3).toUpperCase();
      const duration = Math.floor(Math.random() * 20) + 2;
      
      const departureHour = Math.floor(Math.random() * 24);
      const departureMin = Math.floor(Math.random() * 4) * 15;
      const departure = `${departureHour.toString().padStart(2, '0')}:${departureMin.toString().padStart(2, '0')}`;
      
      const arrivalTime = new Date();
      arrivalTime.setHours(departureHour + duration);
      const arrival = `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`;

      const calculatePrice = (basePrice: number) => {
        if (duration <= 12) {
          return basePrice + (duration * 10);
        } else {
          return basePrice + 120 + ((duration - 12) * 15);
        }
      };

      const train: Train = {
        id: trainNumber.toString(),
        name: `${sourceCode} ${destCode} SUPERFAST EXPRESS`,
        departure,
        arrival,
        duration,
        classes: {
          sleeper: { available: Math.floor(Math.random() * 80) + 20, price: Math.round(calculatePrice(duration <= 12 ? 400 : 500) / 10) * 10 },
          ac3: { available: Math.floor(Math.random() * 60) + 20, price: Math.round(calculatePrice(duration <= 12 ? 1100 : 1200) / 10) * 10 },
          ac2: { available: Math.floor(Math.random() * 40) + 10, price: Math.round(calculatePrice(duration <= 12 ? 2000 : 2200) / 10) * 10 },
          ac1: { available: Math.floor(Math.random() * 20) + 5, price: Math.round(calculatePrice(duration <= 12 ? 2500 : 3000) / 10) * 10 }
        }
      };
      generatedTrains.push(train);
    }
    return generatedTrains;
  };

  const onSearchSubmit = (data: any) => {
    if (!data.source || !data.destination) {
      toast({
        title: "Missing Information",
        description: "Please enter both source and destination stations",
        variant: "destructive",
      });
      return;
    }

    setSearchData(data);
    const generatedTrains = generateTrains(data.source, data.destination);
    setTrains(generatedTrains);
    setStep('select');
  };

  const selectTrain = (train: Train, trainClass: string) => {
    setSelectedTrain(train);
    setSelectedClass(trainClass);
    setStep('details');
  };

  const handlePassengerSelect = (passengerId: string) => {
    const selected = savedPassengers.find(p => p._id === passengerId);
    if (selected) {
        setValue('name', selected.name, { shouldValidate: true });
        setValue('age', selected.age, { shouldValidate: true });
        setValue('gender', selected.gender, { shouldValidate: true });
        setValue('email', selected.email, { shouldValidate: true });
        setValue('phone', selected.mobile, { shouldValidate: true });
    }
  };

  const onDetailsSubmit = (data: any) => {
    setStep('payment');
  };

  const onPaymentSubmit = async (data: any) => {
    if (!selectedTrain || !selectedClass) return;

    const classMap: any = {
      sleeper: { code: 'S', range: [1, 10] },
      ac3: { code: 'B', range: [1, 8] },
      ac2: { code: 'A', range: [1, 5] },
      ac1: { code: 'H', range: [1, 3] }
    };

    const seatNumber = Math.floor(Math.random() * 60) + 1;
    const coachInfo = classMap[selectedClass];
    const coachNumber = Math.floor(Math.random() * (coachInfo.range[1] - coachInfo.range[0] + 1)) + coachInfo.range[0];

    const ticketPayload = {
      trainNumber: selectedTrain.id,
      trainName: selectedTrain.name,
      source: searchData.source,
      destination: searchData.destination,
      date: searchData.date,
      departure: selectedTrain.departure,
      arrival: selectedTrain.arrival,
      duration: `${selectedTrain.duration}h 00m`,
      class: selectedClass.toUpperCase(),
      coach: `${coachInfo.code}${coachNumber}`,
      seat: seatNumber,
      passenger: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        email: data.email,
        phone: data.phone
      },
      price: selectedTrain.classes[selectedClass as keyof typeof selectedTrain.classes].price,
    };

    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to book ticket');
      }

      const createdTicket = await response.json();
      setTicket(createdTicket);
      setStep('ticket');
      
      toast({
        title: "Ticket Booked Successfully",
        description: `Your ticket has been confirmed. PNR: ${createdTicket.id}`,
      });

    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Could not save the ticket to the server.",
        variant: "destructive",
      });
    }
  };

  const downloadTicket = () => {
    if (!ticket) return;
    
    const ticketData = `
YATRA SARAL - E-TICKET
======================
PNR: ${ticket.id}
Train: ${ticket.trainNumber} - ${ticket.trainName}
From: ${ticket.source} (${ticket.departure})
To: ${ticket.destination} (${ticket.arrival})
Date: ${ticket.date}
Class: ${ticket.class}
Coach: ${ticket.coach}
Seat: ${ticket.seat}
Passenger: ${ticket.passenger.name}
Age: ${ticket.passenger.age}
Gender: ${ticket.passenger.gender}
Status: ${ticket.status}
Price: ₹${ticket.price}
Booked: ${new Date(ticket.bookedAt).toLocaleString()}
======================
Happy Journey!
    `;

    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (step === 'ticket') {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-lg shadow-lg p-8 max-w-md mx-4 text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-4">Ticket Confirmed!</h2>
          
          <div className="bg-muted p-6 rounded-lg mb-6 text-left">
            <h3 className="font-bold mb-2">YATRA SARAL E-TICKET</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">PNR:</span> {ticket?.id}</p>
              <p><span className="font-medium">Train:</span> {ticket?.trainNumber}</p>
              <p><span className="font-medium">Route:</span> {ticket?.source} → {ticket?.destination}</p>
              <p><span className="font-medium">Date:</span> {ticket?.date}</p>
              <p><span className="font-medium">Time:</span> {ticket?.departure} - {ticket?.arrival}</p>
              <p><span className="font-medium">Class:</span> {ticket?.class}</p>
              <p><span className="font-medium">Coach:</span> {ticket?.coach}</p>
              <p><span className="font-medium">Seat:</span> {ticket?.seat}</p>
              <p><span className="font-medium">Passenger:</span> {ticket?.passenger.name}</p>
              <p><span className="font-medium">Price:</span> ₹{ticket?.price}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={downloadTicket} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Ticket
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setStep('search');
                setTrains([]);
                setSelectedTrain(null);
                setSelectedClass('');
                setTicket(null);
                reset();
              }}
              className="w-full"
            >
              Book Another Ticket
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      {step === 'search' && (
        <>
          <section className="py-20 bg-blue-50 dark:bg-blue-950/20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                  <Train className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-5xl font-bold mb-6 text-blue-700 dark:text-blue-400">
                  {t('service.trainBooking')}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Book train tickets with multiple class options and real-time seat availability
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-2xl">
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
                className="bg-card rounded-lg shadow-lg p-8"
              >
                <form onSubmit={handleSubmit(onSearchSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">From Station *</Label>
                      <Input
                        id="source"
                        {...register('source', { required: 'Source station is required' })}
                        placeholder="e.g., New Delhi"
                      />
                      {errors.source && (
                        <p className="text-sm text-destructive">{errors.source.message as string}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">To Station *</Label>
                      <Input
                        id="destination"
                        {...register('destination', { required: 'Destination station is required' })}
                        placeholder="e.g., Mumbai Central"
                      />
                      {errors.destination && (
                        <p className="text-sm text-destructive">{errors.destination.message as string}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Journey Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('date', { required: 'Date is required' })}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive">{errors.date.message as string}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search Trains
                  </Button>
                </form>
              </motion.div>
            </div>
          </section>
        </>
      )}

      {step === 'select' && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Button
                variant="outline"
                onClick={() => setStep('search')}
                className="mb-6"
              >
                ← Back to Search
              </Button>
              <h2 className="text-4xl font-bold text-primary mb-4">Available Trains</h2>
              <p className="text-xl text-muted-foreground">
                {searchData.source} → {searchData.destination} on {searchData.date}
              </p>
            </motion.div>

            <div className="space-y-6 max-w-6xl mx-auto">
              {trains.map((train, index) => (
                <motion.div
                  key={train.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg shadow-lg p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {train.id} - {train.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{train.departure}</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{train.arrival}</span>
                        </div>
                        <span>({train.duration}h 00m)</span>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(train.classes).map(([className, classData]) => (
                          <div key={className} className="border border-border rounded-lg p-4">
                            <div className="text-sm font-semibold mb-1">
                              {className === 'sleeper' ? 'Sleeper' : 
                               className === 'ac3' ? '3AC' :
                               className === 'ac2' ? '2AC' : '1AC'}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {classData.available} seats
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              <IndianRupee className="h-4 w-4" />
                              <span className="font-bold">₹{classData.price}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => selectTrain(train, className)}
                              disabled={classData.available === 0}
                              className="w-full"
                            >
                              {classData.available === 0 ? 'Waitlist' : 'Book'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {step === 'details' && selectedTrain && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-card rounded-lg shadow-lg p-8"
            >
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="mb-6"
              >
                ← Back to Train Selection
              </Button>

              <h2 className="text-2xl font-bold text-primary mb-6">Passenger Details</h2>
              
              <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-6">
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="As per government ID"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      {...register('age', { 
                          required: 'Age is required', 
                          min: { value: 1, message: 'Age must be between 1 and 100.'}, 
                          max: { value: 100, message: 'Age must be between 1 and 100.'} 
                        })}
                      placeholder="Age (1-100)"
                    />
                    {errors.age && (
                      <p className="text-sm text-destructive">{errors.age.message as string}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: 'Gender is required' }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-destructive text-sm">{errors.gender.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register('phone', { 
                          required: 'Phone is required',
                          pattern: {
                              value: /^\d{10}$/,
                              message: 'Please enter a valid 10-digit phone number.'
                          }
                      })}
                      placeholder="10-digit number"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message as string}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    placeholder="Email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message as string}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {step === 'payment' && selectedTrain && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-card rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-primary mb-6">Payment Details</h2>
              
              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <div className="text-sm space-y-1">
                  <p>Train: {selectedTrain.id} - {selectedTrain.name}</p>
                  <p>Class: {selectedClass.toUpperCase()}</p>
                  <p>Price: ₹{selectedTrain.classes[selectedClass as keyof typeof selectedTrain.classes].price}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onPaymentSubmit)} className="space-y-6">
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

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Make Payment ₹{selectedTrain.classes[selectedClass as keyof typeof selectedTrain.classes].price}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};