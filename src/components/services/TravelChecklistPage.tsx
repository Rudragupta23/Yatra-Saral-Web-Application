import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ListChecks, Plus, Trash2, ArrowLeft, CheckSquare, XSquare, FileDown, FileText, Briefcase, Pill, University, CreditCard, Laptop, Home } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
} from "@/components/ui/alert-dialog";


interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
}

interface ChecklistCategories {
    [key: string]: ChecklistItem[];
}

const initialChecklist: ChecklistCategories = {
    'Documents': [
        { id: 'doc1', label: "Valid Aadhar Card", completed: false },
        { id: 'doc2', label: "Train Ticket (Printed or Digital)", completed: false },
        { id: 'doc3', label: "PAN Card / Other ID", completed: false },
        { id: 'doc4', label: "Travel Insurance Documents", completed: false },
        { id: 'doc5', label: "Hotel Confirmations", completed: false },
    ],
    'Packing': [
        { id: 'pack1', label: "Clothes for weather/activities", completed: false },
        { id: 'pack2', label: "Comfortable walking shoes", completed: false },
        { id: 'pack3', label: "Toiletries", completed: false },
        { id: 'pack4', label: "Phone charger and adapters", completed: false },
    ],
    'Health & Safety': [
        { id: 'health1', label: "Prescription medications", completed: false },
        { id: 'health2', label: "First-aid kit", completed: false },
        { id: 'health3', label: "Emergency contact information", completed: false },
    ],
    'Money & Cards': [
        { id: 'money1', label: "Notify bank of travel plans", completed: false },
        { id: 'money2', label: "Credit/debit cards", completed: false },
        { id: 'money3', label: "Local currency/cash", completed: false },
    ],
    'Technology': [
        { id: 'tech1', label: "Phone with international plan", completed: false },
        { id: 'tech2', label: "Portable charger/power bank", completed: false },
        { id: 'tech3', label: "Download offline maps", completed: false },
    ],
    'Home Preparation': [
        { id: 'home1', label: "Stop mail/newspaper delivery", completed: false },
        { id: 'home2', label: "Arrange pet care", completed: false },
        { id: 'home3', label: "Secure home (locks, lights)", completed: false },
    ],
};


export const TravelChecklistPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
    const [checklist, setChecklist] = useState<ChecklistCategories>(initialChecklist);
    const [newItemLabel, setNewItemLabel] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Packing');
    const { toast } = useToast();

    useEffect(() => {
        const savedChecklist = localStorage.getItem('yatra-travel-checklist');
        if (savedChecklist) {
            setChecklist(JSON.parse(savedChecklist));
        }
    }, []);

    const saveChecklist = (newChecklist: ChecklistCategories) => {
        setChecklist(newChecklist);
        localStorage.setItem('yatra-travel-checklist', JSON.stringify(newChecklist));
    };

    const handleCheck = (category: string, itemId: string, isChecked: boolean) => {
        const newChecklist = { ...checklist };
        newChecklist[category] = newChecklist[category].map(item =>
            item.id === itemId ? { ...item, completed: isChecked } : item
        );
        saveChecklist(newChecklist);
    };

    const addItem = () => {
        if (!newItemLabel.trim()) return;
        const newItem: ChecklistItem = {
            id: `custom-${Date.now()}`,
            label: newItemLabel,
            completed: false,
        };
        const newChecklist = { ...checklist };
        newChecklist[selectedCategory] = [...newChecklist[selectedCategory], newItem];
        saveChecklist(newChecklist);
        setNewItemLabel('');
        toast({ title: "Item Added!", description: `"${newItemLabel}" added to ${selectedCategory}.`})
    };
    
    const deleteItem = (category: string, itemId: string) => {
        const newChecklist = { ...checklist };
        newChecklist[category] = newChecklist[category].filter(item => item.id !== itemId);
        saveChecklist(newChecklist);
    };
    
    const markAllComplete = () => {
        const newChecklist = { ...checklist };
        Object.keys(newChecklist).forEach(category => {
            newChecklist[category] = newChecklist[category].map(item => ({...item, completed: true}));
        });
        saveChecklist(newChecklist);
    };
    
    const resetAll = () => {
        const newChecklist = { ...checklist };
        Object.keys(newChecklist).forEach(category => {
            newChecklist[category] = newChecklist[category].map(item => ({...item, completed: false}));
        });
        saveChecklist(newChecklist);
    };
    
    const exportChecklist = () => {
        let content = "My Travel Checklist\n====================\n\n";
        Object.entries(checklist).forEach(([category, items]) => {
            content += `${category.toUpperCase()}\n--------------------\n`;
            items.forEach(item => {
                content += `[${item.completed ? 'x' : ' '}] ${item.label}\n`;
            });
            content += "\n";
        });
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'YatraSaral_Travel_Checklist.txt';
        a.click();
        URL.revokeObjectURL(url);
    };
    const sendChecklistEmail = async () => {
  if (!email) {
    toast({ title: "Email Required", description: "Please enter your email to receive the checklist." });
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/send-travel-checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checklist,
        email,
        name,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast({ title: "Checklist Sent!", description: `Checklist emailed to ${email}` });
    } else {
      toast({ title: "Failed", description: data.message || "Could not send checklist." });
    }
  } catch (error) {
    console.error(error);
    toast({ title: "Error", description: "Something went wrong while sending email." });
  }
};


    const allItems = Object.values(checklist).flat();
    const completedItems = allItems.filter(item => item.completed).length;
    const totalItems = allItems.length;
    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    const categoryIcons: { [key: string]: React.ElementType } = {
        'Documents': FileText, 'Packing': Briefcase, 'Health & Safety': Pill,
        'Money & Cards': CreditCard, 'Technology': Laptop, 'Home Preparation': Home,
    };

    return (
        <div className="pt-16 min-h-screen bg-background">
            <section className="py-20 bg-emerald-50 dark:bg-emerald-950/20">
              <div className="container mx-auto px-4">
                  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
                          <ListChecks className="h-10 w-10 text-emerald-600" />
                      </div>
                      <h1 className="text-5xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">Travel Checklist</h1>
                      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Never forget important items with our travel checklist.</p>
                  </motion.div>
              </div>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-4xl space-y-8">
                    <Button 
                        variant="outline" 
                        onClick={() => onNavigate('services')} 
                        className="mb-8 flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to All Services
                    </Button>
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Overall Progress</CardTitle>
                            <CardDescription>{completedItems} of {totalItems} items completed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={progress} />
                        </CardContent>
                     </Card>

                     <Card className="shadow-lg">
                         <CardHeader>
                             <CardTitle>Add Custom Item</CardTitle>
                         </CardHeader>
                         <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Input value={newItemLabel} onChange={e => setNewItemLabel(e.target.value)} placeholder="e.g., Buy travel pillow"/>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="sm:w-[200px]"><SelectValue placeholder="Select Category"/></SelectTrigger>
                                    <SelectContent>{Object.keys(checklist).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button onClick={addItem} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2"/> Add Item</Button>
                            </div>
                         </CardContent>
                     </Card>

                    {Object.entries(checklist).map(([category, items]) => {
                       const CategoryIcon = categoryIcons[category] || Briefcase;
                       return (
                        <Card key={category} className="shadow-lg">
                           <CardHeader>
                               <CardTitle className="flex items-center gap-2"><CategoryIcon className="h-6 w-6 text-primary"/> {category}</CardTitle>
                           </CardHeader>
                           <CardContent>
                               <div className="space-y-3">
                                   {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted">
                                        <div className="flex items-center gap-3">
                                            <Checkbox 
                                              id={item.id} 
                                              checked={item.completed}
                                              onCheckedChange={(checked) => handleCheck(category, item.id, !!checked)}
                                            />
                                            <Label htmlFor={item.id} className={`text-base ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                              {item.label}
                                            </Label>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteItem(category, item.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                        </Button>
                                    </div>
                                   ))}
                               </div>
                           </CardContent>
                        </Card>
                       )
                    })}
                    
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Quick Actions & Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
   <div className="flex flex-col gap-4">
  <div className="flex flex-col sm:flex-row gap-4">
    <Button className="w-full" onClick={markAllComplete}>
      <CheckSquare className="h-4 w-4 mr-2"/> Mark All Complete
    </Button>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <XSquare className="h-4 w-4 mr-2"/> Reset All
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This will uncheck all items in your list.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={resetAll}>Yes, Reset</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Button variant="secondary" className="w-full" onClick={exportChecklist}>
      <FileDown className="h-4 w-4 mr-2"/> Export Checklist
    </Button>
  </div>

  <div className="flex flex-col sm:flex-row gap-4">
    <Input 
      type="text" 
      placeholder="Your Name (optional)" 
      value={name} 
      onChange={e => setName(e.target.value)} 
    />
    <Input 
      type="email" 
      placeholder="Enter your email to receive checklist" 
      value={email} 
      onChange={e => setEmail(e.target.value)} 
      required 
    />
    <Button onClick={sendChecklistEmail} className="w-full sm:w-auto">
      📧 Email Checklist
    </Button>
  </div>
</div>

                            <div className="border-t pt-6 text-sm text-muted-foreground space-y-2">
                                <p><strong>✈️ Documents:</strong> Keep copies of important documents in separate bags and scan them to cloud storage.</p>
                                <p><strong>🎒 Packing:</strong> Roll clothes instead of folding to save space and prevent wrinkles.</p>
                                <p><strong>💊 Medications:</strong> Pack medications in your carry-on bag and bring prescription letters.</p>
                            </div>
                        </CardContent>
                     </Card>
                </div>
            </section>
        </div>
    );
};