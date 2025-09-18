import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Users, UserPlus, Trash2, Edit, UserRound, AtSign, Calendar, VenetianMask, Phone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Passenger {
  _id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  mobile: string;
  userEmail: string;
}

export const SavedPassengersPage: React.FC = () => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Passenger>();

  useEffect(() => {
    register('gender', { required: 'Gender is required' });
  }, [register]);

  useEffect(() => {
    const fetchPassengers = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passengers/${user.email}`);
        if (!response.ok) throw new Error('Failed to fetch passengers');
        const data = await response.json();
        setPassengers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load saved passengers.",
          variant: "destructive",
        });
      }
    };
    fetchPassengers();
  }, [toast, user]);


  const onSubmit = async (data: Omit<Passenger, '_id'>) => {
    const passengerData = { ...data, userEmail: user?.email };

    if (editingPassenger) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passengers/${editingPassenger._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passengerData),
        });

        if (!response.ok) {
          let errorMessage = `Server responded with status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage += ` - ${errorData.message || JSON.stringify(errorData)}`;
          } catch (jsonError) {
            errorMessage += ` - ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const updatedPassenger = await response.json();
        setPassengers(prev =>
          prev.map(p => (p._id === updatedPassenger._id ? updatedPassenger : p))
        );
        toast({ title: "Success", description: `${updatedPassenger.name}'s details have been updated.` });

      } catch (error) {
        console.error("Update failed:", error);
        toast({
          title: "Update Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred. Check the console.",
          variant: "destructive"
        });
      }
    } else {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passengers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passengerData),
        });
        if (!response.ok) throw new Error('Failed to add passenger');
        const newPassenger = await response.json();
        setPassengers(prev => [...prev, newPassenger]);
        toast({ title: "Passenger Added", description: `${data.name} has been saved.` });
      } catch (error) {
        toast({ title: "Error", description: "Could not save passenger.", variant: "destructive" });
      }
    }
    reset();
    setEditingPassenger(null);
    setIsDialogOpen(false);
  };

  const handleDelete = async (passengerId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passengers/${passengerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete passenger');
      setPassengers(passengers.filter(p => p._id !== passengerId));
      toast({ title: "Passenger Removed", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "Could not remove passenger.", variant: "destructive" });
    }
  };

  const openEditDialog = (passenger: Passenger) => {
    setEditingPassenger(passenger);
    reset(passenger);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingPassenger(null);
    reset({ name: '', age: undefined, gender: undefined, email: '', mobile: '' });
    setIsDialogOpen(true);
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-blue-50 dark:bg-blue-950/20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-blue-700 dark:text-blue-400">Saved Passengers</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Manage your list of frequent co-travelers to make booking faster.</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Your Passenger List ({passengers.length})</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Passenger
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingPassenger ? 'Edit Passenger' : 'Add a New Passenger'}</DialogTitle>
                  <DialogDescription>Save details for faster checkout in the future.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register('name', { required: 'Name is required' })} />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" {...register('age', {
                          required: 'Age is required',
                          valueAsNumber: true,
                          min: { value: 1, message: "Age must be between 1 and 100" },
                          max: { value: 100, message: "Age must be between 1 and 100" }
                      })} />
                      {errors.age && <p className="text-sm text-destructive mt-1">{errors.age.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => setValue('gender', value as any, { shouldValidate: true })} defaultValue={editingPassenger?.gender}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
                    </div>
                  </div>
                    <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" type="tel" maxLength={10} {...register('mobile', {
                        required: 'Mobile number is required',
                        pattern: {
                            value: /^\d{10}$/,
                            message: 'Please enter a valid 10-digit mobile number.'
                        }
                    })} />
                    {errors.mobile && <p className="text-sm text-destructive mt-1">{errors.mobile.message}</p>}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">{editingPassenger ? 'Save Changes' : 'Add Passenger'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {passengers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {passengers.map((p, index) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card p-6 rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-primary">{p.name}</h3>
                      <div className="text-muted-foreground mt-2 space-y-1 text-sm">
                        <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {p.age} years old</p>
                        <p className="flex items-center gap-2"><VenetianMask className="h-4 w-4" /> {p.gender}</p>
                        <p className="flex items-center gap-2"><AtSign className="h-4 w-4" /> {p.email}</p>
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {p.mobile}</p>
                      </div>
                    </div>
                    <UserRound className="h-12 w-12 text-muted-foreground/50"/>
                  </div>
                  <div className="flex gap-2 mt-4 border-t pt-4">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => openEditDialog(p)}>
                      <Edit className="h-3 w-3 mr-2" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="w-full"><Trash2 className="h-3 w-3 mr-2" /> Delete</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently remove {p.name} from your saved passengers. This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No Passengers Saved</h3>
              <p className="mt-2 text-muted-foreground">Click "Add New Passenger" to start building your list.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};