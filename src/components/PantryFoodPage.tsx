import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, CheckCircle, Clock, ArrowLeft, Leaf, Coffee } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

export const PantryFoodPage: React.FC = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  const [savedPassengers, setSavedPassengers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      if (!user) return;
      try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passengers/${user.email}`);
          if (response.ok) {
              const data = await response.json();
              setSavedPassengers(data);
          }
      } catch (error) {
          console.error("Could not fetch saved passengers for pantry form.", error);
      }
    };
    fetchPassengers();
  }, [user]);

  const foodOptions = [
    {
      id: 'veg',
      name: 'Vegetarian',
      icon: Leaf,
      description: 'Fresh vegetarian meals with dal, rice, roti, vegetables, and curd',
      color: 'bg-green-500'
    },
    {
      id: 'nonveg',
      name: 'Non-Vegetarian',
      icon: UtensilsCrossed,
      description: 'Delicious non-veg meals with chicken/mutton curry, rice, roti, and sides',
      color: 'bg-red-500'
    },
    {
      id: 'jain',
      name: 'Jain Food',
      icon: Coffee,
      description: 'Pure Jain meals prepared without onion, garlic, and root vegetables',
      color: 'bg-orange-500'
    }
  ];

  const handlePassengerSelect = (passengerId: string) => {
    const selectedPassenger = savedPassengers.find(p => p._id === passengerId);
    if (selectedPassenger) {
      setValue('name', selectedPassenger.name, { shouldValidate: true });
      setValue('email', selectedPassenger.email, { shouldValidate: true });
      setValue('phone', selectedPassenger.mobile, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const selectedFood = foodOptions.find(f => f.id === data.foodType);
      if (!selectedFood) return;

      const orderDetails = {
        foodType: selectedFood.name,
        trainNumber: data.trainNumber,
        coach: data.coach,
        seatNumber: data.seatNumber,
        name: data.name,
        phone: data.phone,
        email: data.email,
        userEmail: user?.email 
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        const newOrder = await response.json();
        setOrderId(newOrder.id);
        setIsOrdered(true);
        reset();
        
        toast({
          title: "Order Placed Successfully",
          description: `${selectedFood.name} food will be delivered to ${data.coach}-${data.seatNumber}. Order ID: ${newOrder.id}`,
        });
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isOrdered) {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md mx-4"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-4">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-4">
            Your food order has been placed successfully and will be delivered within 30 minutes.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="font-semibold">Order ID: {orderId}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: 30 minutes</span>
            </div>
          </div>
          <Button 
            onClick={() => {
              setIsOrdered(false);
              setOrderId('');
            }}
            className="w-full"
          >
            Order More Food
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
              <UtensilsCrossed className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-orange-700 dark:text-orange-400">
              {t('service.pantryFood')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Order fresh, delicious meals delivered directly to your seat during the journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Food Options */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">Food Categories</h2>
            <p className="text-xl text-muted-foreground">
              Choose from our variety of freshly prepared meals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {foodOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${option.color} rounded-full mb-4`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {option.name}
                </h3>
                
                <p className="text-muted-foreground text-sm">
                  {option.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Order Form */}
            <div className="max-w-2xl mx-auto">
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
                    <div className="flex items-center gap-4 mb-8">
                    <UtensilsCrossed className="h-8 w-8 text-orange-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Order Food</h2>
                        <p className="text-muted-foreground">Fill your details to place order</p>
                    </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Train & Seat Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-1">
                        <Label htmlFor="trainNumber">Train Number *</Label>
                        <Input
                            id="trainNumber"
                            {...register('trainNumber', { 
                                required: 'Train number is required',
                                pattern: {
                                    value: /^\d{5}$/,
                                    message: 'Enter a valid 5-digit train number.'
                                }
                            })}
                            placeholder="5-digit number"
                        />
                        {errors.trainNumber && (
                            <p className="text-sm text-destructive">{errors.trainNumber.message as string}</p>
                        )}
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="coach">Coach *</Label>
                        <Input
                            id="coach"
                            {...register('coach', {
                                required: 'Coach is required',
                                pattern: {
                                    value: /^(S(10|[1-9])|B(10|[1-9])|A(10|[1-9])|C(1[0-5]|[1-9])|H(10|[1-9]))$/i,
                                    message: 'Invalid coach (e.g., S1-S10, B1-B10).'
                                }
                            })}
                            placeholder="e.g., S1, B2"
                        />
                        {errors.coach && (
                            <p className="text-sm text-destructive">{errors.coach.message as string}</p>
                        )}
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="seatNumber">Seat Number *</Label>
                        <Input
                            id="seatNumber"
                            type="number"
                            min="1"
                            {...register('seatNumber', { 
                                required: 'Seat number is required',
                                min: { value: 1, message: 'Seat number must be at least 1.' },
                                max: { value: 70, message: 'Seat number cannot exceed 70.' }
                            })}
                            placeholder="1-70"
                        />
                        {errors.seatNumber && (
                            <p className="text-sm text-destructive">{errors.seatNumber.message as string}</p>
                        )}
                        </div>
                    </div>

                    {savedPassengers.length > 0 && (
                        <div className="space-y-2 pt-6 border-t">
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
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            defaultValue={user?.phone || ''}
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
                        defaultValue={user?.email || ''}
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Enter your email"
                        />
                        {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message as string}</p>
                        )}
                    </div>

                    {/* Food Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="foodType">Food Type *</Label>
                        <Select onValueChange={(value) => setValue('foodType', value, { shouldValidate: true })} {...register('foodType', { required: 'Please select a food type' })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select food type" />
                        </SelectTrigger>
                        <SelectContent>
                            {foodOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                                {option.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        {errors.foodType && (
                        <p className="text-sm text-destructive">{errors.foodType.message as string}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                        <UtensilsCrossed className="h-4 w-4 mr-2" />
                        Place Order
                    </Button>
                    </form>

                    <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Delivery Information:</h3>
                    <ul className="text-sm text-orange-600 dark:text-orange-300 space-y-1">
                        <li>• Food will be delivered within 30 minutes</li>
                        <li>• Fresh meals prepared in our pantry car</li>
                        <li>• Payment to be made upon delivery</li>
                        <li>• Available during meal hours (7AM-10PM)</li>
                    </ul>
                    </div>
                </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};