import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  Package,
  User,
   ArrowLeft,
  Accessibility,
  Bed,
  IndianRupee
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

export const BookingServicesPage: React.FC = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '' });
  const [upiID, setUPIID] = useState('');
  const [bank, setBank] = useState('');
  
  const [savedPassengers, setSavedPassengers] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('yatra-saved-passengers') || '[]');
    setSavedPassengers(saved);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm();

  const services = [
    {
      id: 'cloak-room',
      name: 'Cloak Room',
      icon: Package,
      description: 'Secure luggage storage facility at railway stations',
      basePrice: 10,
      hourlyRate: 5,
      color: 'bg-blue-500'
    },
    {
      id: 'coolie',
      name: 'Coolie Service',
      icon: User,
      description: 'Porter service to help carry your luggage',
      basePrice: 50,
      hourlyRate: 0,
      color: 'bg-green-500'
    },
    {
      id: 'wheelchair',
      name: 'Wheelchair Assistance',
      icon: Accessibility,
      description: 'Wheelchair for elderly and disabled passengers',
      basePrice: 0,
      hourlyRate: 0,
      color: 'bg-purple-500'
    },
    {
      id: 'dormitory',
      name: 'Dormitory',
      icon: Bed,
      description: 'Budget accommodation at railway stations',
      basePrice: 100,
      hourlyRate: 20,
      color: 'bg-orange-500'
    }
  ];
  
  const handlePassengerSelect = (passengerId: string) => {
    const selectedPassenger = savedPassengers.find(p => p.id === passengerId);
    if (selectedPassenger) {
      setValue('name', selectedPassenger.name, { shouldValidate: true });
      setValue('email', selectedPassenger.email, { shouldValidate: true });
      setValue('phone', selectedPassenger.mobile, { shouldValidate: true });
    }
  };

  const calculatePrice = (service: any, hours: number) => {
    if (service.id === 'coolie' || service.id === 'wheelchair') {
      return service.basePrice;
    }
    return service.basePrice + (service.hourlyRate * hours);
  };

  // Step 1: Form details validation and transition to payment
  const onDetailsSubmit = (data: any) => {
    const service = services.find(s => s.id === selectedService);
    if (!service) return;
    const hours = parseInt(data.hours) || 1;
    setTotalAmount(calculatePrice(service, hours));
    setStep('payment');
  };

  // Step 2: Final payment submission
  const handlePayment = async () => {
    try {
      const data = getValues();
      const service = services.find(s => s.id === selectedService);
      if (!service) return;
      const hours = parseInt(data.hours) || 1;
      
      const bookingDetails = {
        service: service.name,
        station: data.station,
        date: data.date,
        time: data.time,
        hours: hours,
        price: totalAmount,
        name: data.name,
        phone: data.phone,
        email: data.email,
        paymentMode: selectedPayment,
        userEmail: user?.email 
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails)
      });

      if (response.ok) {
        const newBooking = await response.json();
        
        const bookings = JSON.parse(localStorage.getItem('yatra-service-bookings') || '[]');
        bookings.push(newBooking);
        localStorage.setItem('yatra-service-bookings', JSON.stringify(bookings));

        setBookingId(newBooking.id);
        setIsBooked(true);
        reset();
        toast({
          title: "Service Booked Successfully",
          description: `${service.name} booked for ${data.station} station. Booking ID: ${newBooking.id}`,
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isBooked) {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md mx-4"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-4">Service Booked!</h2>
          <p className="text-muted-foreground mb-4">
            Your service has been successfully booked.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="font-semibold">Booking ID: {bookingId}</p>
            <p className="text-sm text-muted-foreground">Save this ID for future reference</p>
          </div>
          <Button
            onClick={() => {
              setIsBooked(false);
              setSelectedService(null);
              setStep('details');
            }}
            className="w-full"
          >
            Book Another Service
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-green-50 dark:bg-green-950/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <Calendar className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-5xl font-bold mb-6 text-green-700 dark:text-green-400">
                {t('service.booking')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Book additional services like cloak room, coolie, wheelchair assistance, and dormitory facilities
              </p>
            </motion.div>
          </div>
        </section>
        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
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
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-primary mb-4">Available Services</h2>
              <p className="text-xl text-muted-foreground">
                Choose from our range of railway station services
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${service.color} rounded-full mb-4`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center gap-2 text-lg font-semibold text-green-600 mb-4">
                    <IndianRupee className="h-5 w-5" />
                    {service.id === 'wheelchair' ? (
                      'Free Service'
                    ) : service.id === 'coolie' ? (
                      `₹${service.basePrice} per service`
                    ) : (
                      `₹${service.basePrice} + ₹${service.hourlyRate}/hr`
                    )}
                  </div>
                  <Button className="w-full">Book {service.name}</Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const currentService = services.find(s => s.id === selectedService);

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Service Header */}
      <section className="py-20 bg-green-50 dark:bg-green-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 ${currentService?.color} rounded-full mb-6 mx-auto`}>
              {currentService && <currentService.icon className="h-10 w-10 text-white" />}
            </div>
            <h1 className="text-5xl font-bold mb-6 text-green-700 dark:text-green-400">
              Book {currentService?.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {currentService?.description}
            </p>
          </motion.div>
        </div>
      </section>
      {/* Booking Stepper */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedService(null);
                setStep('details');
              }}
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
            {step === 'details' && (
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
                      defaultValue={user?.name || ''}
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message as string}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      defaultValue={user?.phone || ''}
                      {...register('phone', {
                        required: 'Phone is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Phone number must be exactly 10 digits'
                        }
                      })}
                      placeholder="Enter your phone"
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
                    defaultValue={user?.email || ''}
                    {...register('email', { required: 'Email is required' })}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">Station *</Label>
                  <Input
                    id="station"
                    {...register('station', {
                      required: 'Station is required',
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Station name must contain only letters and spaces"
                      }
                    })}
                    placeholder="e.g., New Delhi Railway Station"
                  />
                  {errors.station && (
                    <p className="text-sm text-destructive">{errors.station.message as string}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      {...register('time', { required: 'Time is required' })}
                    />
                    {errors.time && (
                      <p className="text-sm text-destructive">{errors.time.message as string}</p>
                    )}
                  </div>
                </div>
                {(selectedService === 'cloak-room' || selectedService === 'dormitory') && (
                  <div className="space-y-2">
                    <Label htmlFor="hours">Duration (Hours) *</Label>
                    <Select onValueChange={(value) => setValue('hours', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,6,8,12,24].map(hour => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour} {hour === 1 ? 'Hour' : 'Hours'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <CreditCard className="h-4 w-4 mr-2" /> Proceed to Payment
                </Button>
              </form>
            )}
            {step === 'payment' && (
              <>
                <div className="flex mb-4 gap-2">
                  <Button type="button" variant={selectedPayment === 'card' ? 'default' : 'outline'}
                          onClick={() => setSelectedPayment('card')}>Card</Button>
                  <Button type="button" variant={selectedPayment === 'upi' ? 'default' : 'outline'}
                          onClick={() => setSelectedPayment('upi')}>UPI</Button>
                  <Button type="button" variant={selectedPayment === 'netbanking' ? 'default' : 'outline'}
                          onClick={() => setSelectedPayment('netbanking')}>Net Banking</Button>
                </div>
                {selectedPayment === 'card' && (
                  <div className="space-y-2">
                    <Input placeholder="Card Number (16 digits)"
                      value={cardInfo.number}
                      onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })}
                      maxLength={16}
                    />
                    <div className="flex gap-2">
                      <Input placeholder="Expiry Date (MM/YY)"
                        value={cardInfo.expiry}
                        onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                        maxLength={5}
                      />
                      <Input placeholder="CVV (3 digits)"
                        value={cardInfo.cvv}
                        onChange={e => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                        maxLength={3}
                      />
                    </div>
                  </div>
                )}
                {selectedPayment === 'upi' && (
                  <div className="space-y-2">
                    <Input placeholder="yourname@upi" value={upiID} onChange={e => setUPIID(e.target.value)} />
                  </div>
                )}
                {selectedPayment === 'netbanking' && (
                  <div className="space-y-2">
                    <Select onValueChange={value => setBank(value)}>
                      <SelectTrigger><SelectValue placeholder="Choose Bank" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="State Bank of India">State Bank of India</SelectItem>
                        <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                        <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={handlePayment}>
                  Make Payment ₹{totalAmount}
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};