import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Users, CheckCircle, Percent, Headset, Train, ArrowLeft, CreditCard, Wallet, Banknote, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

export const GroupBookingPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [trains, setTrains] = useState<Train[]>([]);
  const [searchData, setSearchData] = useState<any>({});
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [ticket, setTicket] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [savedPassengers, setSavedPassengers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPassengers = async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:5000/api/passengers/${user.email}`);
            const data = await response.json();
            setSavedPassengers(data);
        } catch (error) {
            console.error("Failed to fetch saved passengers");
        }
    };
    fetchPassengers();
  }, [user]);

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      passengers: [{ name: '', age: '', gender: '' }],
      contactName: user?.name || '',
      contactEmail: user?.email || '',
      passengerCount: 6,
      source: '',
      destination: '',
      date: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers"
  });

  const passengerCount = watch('passengerCount') || 0;
  const totalFare = selectedTrain && selectedClass ? passengerCount * selectedTrain.classes[selectedClass as keyof typeof selectedTrain.classes].price : 0;
  
  const generateTrains = (source: string, destination: string): Train[] => {
    const trainCount = Math.floor(Math.random() * 2) + 2;
    const generatedTrains: Train[] = [];
    for (let i = 0; i < trainCount; i++) {
        const trainNumber = Math.floor(10000 + Math.random() * 90000);
        const duration = Math.floor(Math.random() * 20) + 2;
        generatedTrains.push({
            id: trainNumber.toString(),
            name: `${source.substring(0,3).toUpperCase()} ${destination.substring(0,3).toUpperCase()} EXP`,
            departure: `${Math.floor(Math.random() * 24).toString().padStart(2,'0')}:${(Math.floor(Math.random()*4)*15).toString().padStart(2,'0')}`,
            arrival: `${Math.floor(Math.random() * 24).toString().padStart(2,'0')}:${(Math.floor(Math.random()*4)*15).toString().padStart(2,'0')}`,
            duration,
            classes: {
                sleeper: { available: 200, price: 500 + duration * 10 },
                ac3: { available: 150, price: 1200 + duration * 10 },
                ac2: { available: 100, price: 2200 + duration * 10 },
                ac1: { available: 50, price: 3000 + duration * 10 }
            }
        });
    }
    return generatedTrains;
  };

  const handlePassengerSelect = (passengerId: string, index: number) => {
    const selectedPassenger = savedPassengers.find(p => p._id === passengerId);
    if (selectedPassenger) {
      setValue(`passengers.${index}.name`, selectedPassenger.name, { shouldValidate: true });
      setValue(`passengers.${index}.age`, selectedPassenger.age, { shouldValidate: true });
      setValue(`passengers.${index}.gender`, selectedPassenger.gender, { shouldValidate: true });
    }
  };
  
  const downloadGroupTicket = (ticketData: any) => {
    let ticketString = `
YATRA SARAL - GROUP E-TICKET
============================
PNR: ${ticketData.id}
Train: ${ticketData.trainNumber} - ${ticketData.trainName}
From: ${ticketData.source} (${ticketData.departure})
To: ${ticketData.destination} (${ticketData.arrival})
Date: ${ticketData.date}
Class: ${ticketData.class}
Total Passengers: ${ticketData.passengers.length}
Total Price: ₹${ticketData.price}
Status: ${ticketData.status}
Booked On: ${new Date(ticketData.bookedAt).toLocaleString()}
Contact: ${ticketData.contactPerson}
============================
PASSENGER DETAILS
----------------------------
`;
    ticketData.passengers.forEach((p: any, index: number) => {
        ticketString += `
${index + 1}. Name: ${p.name}, Age: ${p.age}, Gender: ${p.gender}
   Coach: ${ticketData.coach}, Seat: ${ticketData.seats[index]}
----------------------------`;
    });
    ticketString += "\nHappy Journey!";

    const blob = new Blob([ticketString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `group-ticket-${ticketData.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const onFormSubmit = async (data: any) => {
    if (step === 1) { 
        setSearchData(data);
        const generatedTrains = generateTrains(data.source, data.destination);
        setTrains(generatedTrains);
        setStep(2);
    } else if (step === 3) { 
        if (!selectedTrain || !selectedClass) return;
        
        const classMap: any = { sleeper: 'S', ac3: 'B', ac2: 'A', ac1: 'H' };
        const coach = `${classMap[selectedClass]}${Math.floor(Math.random() * 10) + 1}`;
        const seats = Array.from({ length: passengerCount }, () => Math.floor(Math.random() * 70) + 1);

        const ticketPayload = {
          trainNumber: selectedTrain.id, trainName: selectedTrain.name,
          source: searchData.source, destination: searchData.destination, date: searchData.date,
          departure: selectedTrain.departure, arrival: selectedTrain.arrival,
          class: selectedClass.toUpperCase(), 
          passengers: data.passengers,
          price: totalFare,
          contactPerson: data.contactName,
          email: user?.email,
          coach,
          seats,
        };
        
        try {
            const response = await fetch('http://localhost:5000/api/group-tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketPayload),
            });
            if (!response.ok) throw new Error("Booking failed");
            
            const newTicket = await response.json();
            setTicket(newTicket);
            toast({ title: "Group Booking Successful!", description: `Your ticket for ${passengerCount} passengers is confirmed.` });
            setStep(4);

        } catch (error) {
            toast({ title: "Error", description: "Could not complete booking.", variant: "destructive" });
        }
    }
  };

  const selectTrainAndClass = (train: Train, trainClass: string) => {
    setSelectedTrain(train);
    setSelectedClass(trainClass);
    const requiredFields = parseInt(watch('passengerCount').toString(), 10);
    const currentFields = fields.length;
    if (requiredFields > currentFields) {
        for(let i=0; i < requiredFields - currentFields; i++) append({ name: '', age: '', gender: '' });
    } else if (requiredFields < currentFields) {
        for(let i=0; i < currentFields - requiredFields; i++) remove(currentFields - 1 - i);
    }
    setStep(3);
  };
  
  const features = [
      { icon: Users, title: "For Large Groups", description: "Ideal for booking tickets for 6 or more people at once." },
      { icon: Percent, title: "E-ticket generation", description: "Download your E-ticket seamlessly." },
      { icon: Headset, title: "Dedicated Support", description: "Get personalized assistance from our group booking experts." }
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      <section className="py-20 bg-pink-50 dark:bg-pink-950/20">
          <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-6">
                      <Users className="h-10 w-10 text-pink-600" />
                  </div>
                  <h1 className="text-5xl font-bold mb-6 text-pink-700 dark:text-pink-400">Group Booking</h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Book tickets for large groups at once</p>
              </motion.div>
          </div>
      </section>

       <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
            {step === 1 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
                    <Button 
                        variant="outline" 
                        onClick={() => onNavigate('services')} 
                        className="flex items-center w-fit"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to All Services
                    </Button>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Inquiry and Journey Details</CardTitle>
                            <CardDescription>Provide your group and journey details to find trains.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="contactName">Contact Person Name</Label>
                                    <Input id="contactName" {...register('contactName', { required: 'Name is required', pattern: { value: /^[A-Za-z\s]+$/, message: 'Please enter a valid name (characters only).' } })} placeholder="Only characters"/>
                                    {errors.contactName && <p className="text-destructive text-sm">{errors.contactName.message as string}</p>}
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="passengerCount">Number of Passengers</Label>
                                    <Input id="passengerCount" type="number" min="6" {...register('passengerCount', { required: true, min: { value: 6, message: 'Minimum 6 passengers required.' } })} placeholder="Minimum 6" />
                                    {errors.passengerCount && <p className="text-destructive text-sm">{errors.passengerCount.message as string}</p>}
                                  </div>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input {...register('source', { required: 'Source is required' })} placeholder="From Station" />
                                    <Input {...register('destination', { required: 'Destination is required' })} placeholder="To Station" />
                                </div>
                                <Input type="date" {...register('date', { required: 'Date is required' })} min={new Date().toISOString().split('T')[0]}/>
                                <Button type="submit" className="w-full">Search Trains</Button>
                              </form>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader><CardTitle>Group Booking Benefits</CardTitle></CardHeader>
                        <CardContent>
                             <ul className="space-y-4">
                                {features.map(feature => (
                                    <li key={feature.title} className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-2 rounded-full"><feature.icon className="h-6 w-6 text-primary"/></div>
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
            )}

            {step === 2 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                       <Button variant="outline" onClick={() => setStep(1)} className="mb-6">← Back to Search</Button>
                       <h2 className="text-4xl font-bold text-primary mb-4 text-center">Available Trains for Group Booking</h2>
                       <div className="space-y-6">
                            {trains.map(train => (
                                <Card key={train.id} className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle>{train.id} - {train.name}</CardTitle>
                                        <CardDescription>{train.departure} → {train.arrival} ({train.duration}h)</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {Object.entries(train.classes).map(([className, classData]) => (
                                            <div key={className} className="border p-4 rounded-lg">
                                                <div className="font-semibold">{className.toUpperCase()}</div>
                                                <div className="text-sm text-muted-foreground">{classData.available} seats</div>
                                                <div className="font-bold my-2">₹{classData.price}</div>
                                                <Button size="sm" className="w-full" onClick={() => selectTrainAndClass(train, className)} disabled={classData.available < passengerCount}>Select</Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <Button variant="outline" onClick={() => setStep(2)} className="mb-6">← Back to Train Selection</Button>
                       <form onSubmit={handleSubmit(onFormSubmit)}>
                            <Card className="shadow-lg">
                                 <CardHeader>
                                    <CardTitle>Passenger Details & Payment</CardTitle>
                                    <CardDescription>Enter details for {passengerCount} passengers.</CardDescription>
                                 </CardHeader>
                                 <CardContent className="space-y-6">
                                    <div className="max-h-96 overflow-y-auto pr-4 space-y-4">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4">
                                                {savedPassengers.length > 0 && (
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-muted-foreground">Auto-fill (Optional)</Label>
                                                        <Select onValueChange={(passengerId) => handlePassengerSelect(passengerId, index)}>
                                                            <SelectTrigger><SelectValue placeholder="Select Saved..." /></SelectTrigger>
                                                            <SelectContent>
                                                                {savedPassengers.map((p) => (
                                                                <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                                <div className="space-y-1">
                                                    <Input {...register(`passengers.${index}.name`, {
                                                        required: 'Name is required',
                                                        pattern: {
                                                            value: /^[A-Za-z\s]+$/,
                                                            message: 'Only characters are allowed.'
                                                        },
                                                        validate: (value) => {
                                                            const passengers = watch('passengers');
                                                            const otherNames = passengers
                                                                .filter((_, i) => i !== index)
                                                                .map(p => p.name?.trim().toLowerCase());
                                                            
                                                            return !otherNames.includes(value?.trim().toLowerCase()) || 'Passenger names must be unique.';
                                                        }
                                                    })} placeholder={`Passenger ${index + 1} Name`} />
                                                    {errors.passengers?.[index]?.name && <p className="text-destructive text-sm">{errors.passengers?.[index]?.name?.message as string}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <Input type="number" min="1" {...register(`passengers.${index}.age`, { required: 'Age is required', min: { value: 1, message: 'Age must be 1-100.' }, max: { value: 100, message: 'Age must be 1-100.' } })} placeholder="Age" />
                                                    {errors.passengers?.[index]?.age && <p className="text-destructive text-sm">{errors.passengers?.[index]?.age?.message as string}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <Select 
                                                        onValueChange={(value) => setValue(`passengers.${index}.gender`, value)}
                                                        value={watch(`passengers.${index}.gender`)}
                                                    >
                                                        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.passengers?.[index]?.gender && <p className="text-destructive text-sm">Please select a gender.</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="text-2xl font-bold mb-4">Payment</h3>
                                        <p className="text-lg font-semibold mb-4">Total Fare: ₹{totalFare}</p>
                                        <div className="flex gap-2 mb-6 border-b">
                                            <Button type="button" variant={paymentMethod === 'card' ? 'default' : 'ghost'} onClick={() => setPaymentMethod('card')}><CreditCard className="mr-2 h-4 w-4"/>Card</Button>
                                            <Button type="button" variant={paymentMethod === 'upi' ? 'default' : 'ghost'} onClick={() => setPaymentMethod('upi')}><Wallet className="mr-2 h-4 w-4"/>UPI</Button>
                                            <Button type="button" variant={paymentMethod === 'netbanking' ? 'default' : 'ghost'} onClick={() => setPaymentMethod('netbanking')}><Banknote className="mr-2 h-4 w-4"/>Net Banking</Button>
                                        </div>
                                        
                                         {paymentMethod === 'card' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <Input {...register('cardNumber' as any, { required: 'Card number is required', pattern: { value: /^\d{16}$/, message: 'Please enter a valid 16-digit card number.' }})} placeholder="Card Number (16 digits)" />
                                                    {errors.cardNumber && <p className="text-destructive text-sm">{errors.cardNumber.message as string}</p>}
                                                </div>
                                                <div className="flex gap-4">
                                                   <div className="w-full">
                                                      <Input {...register('expiryDate' as any, { required: 'Expiry date is required', pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY format.' }})} placeholder="Expiry Date (MM/YY)" />
                                                      {errors.expiryDate && <p className="text-destructive text-sm">{errors.expiryDate.message as string}</p>}
                                                   </div>
                                                   <div className="w-full">
                                                       <Input type="password" {...register('cvv' as any, { required: 'CVV is required', pattern: { value: /^\d{3}$/, message: 'Enter a 3-digit CVV.' }})} placeholder="CVV (3 digits)" />
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
                                        <Button type="submit" className="w-full mt-6">Confirm & Book</Button>
                                    </div>
                                 </CardContent>
                            </Card>
                           </form>
                </motion.div>
            )}

            {step === 4 && ticket && (
                 <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary mb-4">Group Booking Confirmed!</h2>
                    <p className="font-semibold">PNR: {ticket.id}</p>
                    <Button onClick={() => downloadGroupTicket(ticket)} className="mt-6">
                        <Download className="h-4 w-4 mr-2" /> Download Group Ticket
                    </Button>
                </motion.div>
            )}

        </div>
       </section>
    </div>
  );
};