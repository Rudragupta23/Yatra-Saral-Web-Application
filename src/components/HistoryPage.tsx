import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Trash2,
  UtensilsCrossed,
  MessageSquare,
  ArrowUpRightSquare,
  Ticket,
  Package,
  Info,
  Train,
  Tag,
  MapPin,
  Calendar,
  Clock,
  CircleHelp
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const historyTypeDetails: { [key: string]: any } = {
  pantry: {
    title: 'PANTRY ORDER',
    icon: UtensilsCrossed,
    gradient: 'from-orange-500 to-amber-500',
    deleteEndpoint: '/api/food-orders/'
  },
  complaint: {
    title: 'FILED COMPLAINT',
    icon: MessageSquare,
    gradient: 'from-red-500 to-rose-500',
    deleteEndpoint: '/api/complaints/'
  },
  upgrade: {
    title: 'SEAT UPGRADE',
    icon: ArrowUpRightSquare,
    gradient: 'from-indigo-500 to-violet-500',
   
  },
  platform: {
    title: 'PLATFORM TICKET',
    icon: Ticket,
    gradient: 'from-lime-500 to-green-500',
   
  },
  service: {
    title: 'SERVICE BOOKING',
    icon: Package,
    gradient: 'from-cyan-500 to-sky-500',
    deleteEndpoint: '/api/bookings/'
  },
  ticket: { 
    title: 'TRAIN TICKET',
    icon: Ticket,
    gradient: 'from-blue-500 to-indigo-500',
    deleteEndpoint: '/api/tickets/'
  }
};

const HistoryCard = ({ item, onDelete }: { item: any; onDelete: (item: any) => void; }) => {
  const details = historyTypeDetails[item.type];

  const renderContent = () => {
    switch (item.type) {
      case 'pantry':
        return (
          <>
            <div className="flex items-center gap-3"><Train className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.trainNumber}</p><p className="text-sm text-muted-foreground">Train Number</p></div></div>
            <div className="flex items-center gap-3"><Tag className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.foodType}</p><p className="text-sm text-muted-foreground">Food Type</p></div></div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.coach}-{item.seatNumber}</p><p className="text-sm text-muted-foreground">Coach & Seat</p></div></div>
          </>
        );
      case 'complaint':
        return (
          <>
            <div className="flex items-center gap-3"><CircleHelp className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.category}</p><p className="text-sm text-muted-foreground">Category</p></div></div>
            <div className="flex items-center gap-3"><Train className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.trainNumber}</p><p className="text-sm text-muted-foreground">Train Number</p></div></div>
          </>
        );
      case 'ticket':
        return (
            <>
              <div className="flex items-center gap-3"><Train className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.trainNumber} - {item.trainName}</p><p className="text-sm text-muted-foreground">Train</p></div></div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.source} → {item.destination}</p><p className="text-sm text-muted-foreground">Route</p></div></div>
              <div className="flex items-center gap-3"><p className="font-semibold text-green-600">₹{item.price}</p><p className="text-sm text-muted-foreground">Price</p></div>
            </>
        );
      case 'service':
        return (
          <>
            <div className="flex items-center gap-3"><Package className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.service}</p><p className="text-sm text-muted-foreground">Service Type</p></div></div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><div><p className="font-semibold">{item.station}</p><p className="text-sm text-muted-foreground">Station</p></div></div>
            <div className="flex items-center gap-3"><p className="font-semibold text-green-600">₹{item.price}</p><p className="text-sm text-muted-foreground">Price</p></div>
          </>
        );
      default:
        return <p>Details not available for this item type.</p>;
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-lg shadow-lg border border-border overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${details.gradient} text-white p-6`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><details.icon className="h-5 w-5" /> {details.title}</h3>
            <p className="text-white/90">ID: {item.id}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium bg-black/20`}>{item.status}</div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderContent()}
        </div>
        {details.deleteEndpoint && (
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full"><Trash2 className="h-4 w-4 mr-2" />Delete Record</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete this history record. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(item)}>Yes, Delete</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        )}
      </div>

      <div className="bg-muted px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />
          <span>Recorded on {new Date(item.bookedAt || item.orderedAt || item.date || item.submittedAt).toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};


export const HistoryPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const [ticketsRes, bookingsRes, complaintsRes, pantryRes] = await Promise.all([
            fetch(`http://localhost:5000/api/tickets/${user.email}`),
            fetch(`http://localhost:5000/api/bookings/${user.email}`),
            fetch(`http://localhost:5000/api/complaints/${user.email}`),
            fetch(`http://localhost:5000/api/food-orders/${user.email}`)
          ]);

          const tickets = (await ticketsRes.json()).map((i: any) => ({...i, type: 'ticket'}));
          const bookings = (await bookingsRes.json()).map((i: any) => ({...i, type: 'service'}));
          const complaints = (await complaintsRes.json()).map((i: any) => ({...i, type: 'complaint'}));
          const pantry = (await pantryRes.json()).map((i: any) => ({...i, type: 'pantry'}));

          const allItems = [...tickets, ...bookings, ...complaints, ...pantry];

          allItems.sort((a, b) => new Date(b.bookedAt || b.orderedAt || b.date || b.submittedAt).getTime() - new Date(a.bookedAt || a.orderedAt || a.date || a.submittedAt).getTime());

          setHistoryItems(allItems);

        } catch (error) {
          toast({ title: "Error", description: "Could not load activity history.", variant: "destructive"});
        }
      }
    };
    fetchHistory();
  }, [user, toast]);

  const handleDelete = async (itemToDelete: any) => {
    const details = historyTypeDetails[itemToDelete.type];
    if (!details || !details.deleteEndpoint) {
        toast({ title: 'Info', description: 'This item cannot be deleted.'});
        return;
    }

    const idToDelete = itemToDelete.type === 'ticket' ? itemToDelete.id : itemToDelete._id;

    try {
        const response = await fetch(`http://localhost:5000${details.deleteEndpoint}${idToDelete}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete item.');
        }

        setHistoryItems(prev => prev.filter(item => item._id !== itemToDelete._id));
        toast({ title: 'History item removed.' });

    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive'});
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-900/30 rounded-full mb-6">
              <FileText className="h-10 w-10 text-gray-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-gray-700 dark:text-gray-400">
              Your Activity
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Review and manage your past activities, including orders, complaints, and bookings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {historyItems.length > 0 ? (
             <div className="space-y-6">
                {historyItems.map((item) => (
                    <HistoryCard key={item._id} item={item} onDelete={handleDelete} />
                ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-8"><Info className="h-12 w-12 text-muted-foreground" /></div>
                <h2 className="text-3xl font-bold text-primary mb-4">No History Found</h2>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">You haven't performed any actions yet. Your history of bookings, orders, and complaints will appear here.</p>
                <Button size="lg" className="mt-8" onClick={() => onNavigate('services')}>
                  <Train className="h-5 w-5 mr-2" />
                  Explore Services
                </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};