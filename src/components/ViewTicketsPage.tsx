import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Download, Calendar, MapPin, Train, Clock, ArrowLeft, Quote, XCircle, Users, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export const ViewTicketsPage: React.FC = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user, t } = useApp();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/api/tickets/${user.email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch tickets');
          }
          const data = await response.json();
          setTickets(data);
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not load your tickets from the server.",
            variant: "destructive",
          });
        }
      }
    };
    fetchTickets();
  }, [user, toast]);

  const downloadTicket = (ticket: any) => {
    let ticketData;
    if(ticket.isGroup) {
        ticketData = `
YATRA SARAL - GROUP E-TICKET
============================
PNR: ${ticket.id}
Train: ${ticket.trainNumber} - ${ticket.trainName}
From: ${ticket.source} (${ticket.departure})
To: ${ticket.destination} (${ticket.arrival})
Date: ${ticket.date}
Class: ${ticket.class}
Total Passengers: ${ticket.passengers.length}
Total Price: ₹${ticket.price}
Status: ${ticket.status}
Booked On: ${new Date(ticket.bookedAt).toLocaleString()}
Contact: ${ticket.contactPerson}
============================
PASSENGER DETAILS
----------------------------
`;
    ticket.passengers.forEach((p: any, index: number) => {
        ticketData += `
${index + 1}. Name: ${p.name}, Age: ${p.age}, Gender: ${p.gender}
   Coach: ${ticket.coach}, Seat: ${ticket.seats[index]}
----------------------------`;
    });
    ticketData += "\nHappy Journey!";
    } else {
        ticketData = `
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
    }

    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const cancelTicket = async (ticketId: string) => {
    try {
        const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/cancel`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            throw new Error('Failed to cancel ticket');
        }
        await fetch(`http://localhost:5000/api/seat-upgrades/by-pnr/${ticketId}`, {
            method: 'DELETE',
        });
        setTickets(prevTickets => 
            prevTickets.map(ticket => 
                ticket.id === ticketId ? { ...ticket, status: 'Cancelled' } : ticket
            )
        );

        toast({
            title: "Ticket Cancelled!",
            description: "Your payment will be refunded in 3-5 working days.",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Could not cancel the ticket. Please try again.",
            variant: "destructive",
        });
    }
  };

  const removeCancelledTickets = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/tickets/cancelled', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user?.email }),
        });

        if (!response.ok) {
            throw new Error('Failed to remove tickets');
        }

        setTickets(prevTickets => prevTickets.filter(ticket => ticket.status !== 'Cancelled'));

        toast({
            title: "Cancelled Tickets Removed",
            description: "Your cancelled tickets have been cleared from the list.",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Could not remove cancelled tickets. Please try again.",
            variant: "destructive",
        });
    }
  };
  
  const activeTicketCount = tickets.filter(ticket => ticket.status === 'Confirmed').length;
  const hasCancelledTickets = tickets.some(ticket => ticket.status === 'Cancelled');

  const inspirationalQuotes = [
    "Every journey begins with a single step. Start yours today!",
    "Travel is the only thing you buy that makes you richer.",
    "Adventure awaits at every railway station. Book your next journey!",
  ];

  const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-purple-50 dark:bg-purple-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
              <Ticket className="h-10 w-10 text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-purple-700 dark:text-purple-400">
              {t('service.viewTickets')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              View, download, and manage all your booked train tickets in one place
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tickets Content */}
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
          {tickets.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-primary mb-4">Your Tickets</h2>
                <p className="text-xl text-muted-foreground">
                  You have {activeTicketCount} active {activeTicketCount === 1 ? 'ticket' : 'tickets'} booked
                </p>
                {hasCancelledTickets && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="mt-4">
                                    <Trash2 className="h-4 w-4 mr-2"/>
                                    Remove Cancelled Tickets
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove all cancelled tickets from your list. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction onClick={removeCancelledTickets}>
                                    Yes, Remove Them
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                )}
              </motion.div>

              <div className="space-y-6">
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-card rounded-lg shadow-lg border border-border overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">YATRA SARAL E-TICKET</h3>
                          <p className="text-white/90">PNR: {ticket.id}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ticket.status === 'Confirmed' ? 'bg-green-500' : 'bg-red-500'
                          }`}>{ticket.status}</div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3"><Train className="h-5 w-5 text-primary" /><div><p className="font-semibold">{ticket.trainNumber}</p><p className="text-sm text-muted-foreground">{ticket.trainName}</p></div></div>
                            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><div><p className="font-semibold">{ticket.source} → {ticket.destination}</p><p className="text-sm text-muted-foreground">{ticket.departure} - {ticket.arrival}</p></div></div>
                            <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-primary" /><div><p className="font-semibold">{ticket.date}</p><p className="text-sm text-muted-foreground">Journey Date</p></div></div>
                        </div>

                        {ticket.isGroup ? (
                             <div className="space-y-4">
                                 <div className="flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><div><p className="font-semibold">{ticket.passengers.length} Passengers (Group Booking)</p><p className="text-sm text-muted-foreground">Contact: {ticket.contactPerson}</p></div></div>
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                      <AccordionTrigger>View Passenger Details</AccordionTrigger>
                                      <AccordionContent>
                                        <ul className="space-y-2 text-sm">
                                          {ticket.passengers.map((p:any, i:number) => (
                                              <li key={i}>{i+1}. {p.name} ({p.age}, {p.gender}) - Seat: {ticket.seats[i]}</li>
                                          ))}
                                        </ul>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                  <p className="font-semibold text-green-600 text-lg">Total Price: ₹{ticket.price}</p>
                               </div>
                        ) : (
                            <div className="space-y-4">
                                <div><p className="font-semibold text-lg">{ticket.passenger.name}</p><p className="text-sm text-muted-foreground">{ticket.passenger.age} years, {ticket.passenger.gender}</p></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-sm text-muted-foreground">Class</p><p className="font-semibold">{ticket.class}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Coach</p><p className="font-semibold">{ticket.coach}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Seat</p><p className="font-semibold">{ticket.seat}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Price</p><p className="font-semibold text-green-600">₹{ticket.price}</p></div>
                                </div>
                            </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-6">
                         <Button onClick={() => downloadTicket(ticket)} className="w-full"><Download className="h-4 w-4 mr-2" />Download</Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full" disabled={ticket.status === 'Cancelled'}><XCircle className="h-4 w-4 mr-2" />Cancel</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently cancel your ticket.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Back</AlertDialogCancel><AlertDialogAction onClick={() => cancelTicket(ticket.id)}>Yes, Cancel Ticket</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </div>

                    <div className="bg-muted px-6 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>Booked on {new Date(ticket.bookedAt).toLocaleString()}</span></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-8"><Ticket className="h-12 w-12 text-muted-foreground" /></div>
              <h2 className="text-3xl font-bold text-primary mb-4">No Tickets Found</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">You haven't booked any train tickets yet. Start your journey today!</p>
              <div className="bg-card rounded-lg shadow-lg p-8 max-w-md mx-auto mb-8"><Quote className="h-8 w-8 text-primary mx-auto mb-4" /><p className="text-lg text-muted-foreground italic">"{randomQuote}"</p></div>
              <Button size="lg" className="gradient-primary text-white px-12 py-4 text-lg" onClick={() => onNavigate('services')}><Train className="h-5 w-5 mr-2" />Book Your First Journey</Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};