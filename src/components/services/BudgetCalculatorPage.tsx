import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Calculator,  Minus, ArrowLeft, FileDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface BudgetItem {
  name: string;
  cost: number;
}

const defaultItems: BudgetItem[] = [
    { name: 'Train Tickets', cost: 0 },
    { name: 'Hotel/Stays', cost: 0 },
    { name: 'Transportation', cost: 0 },
    { name: 'Activities', cost: 0 },
    { name: 'Shopping', cost: 0 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19B2FF'];

export const BudgetCalculatorPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
const [items, setItems] = useState<BudgetItem[]>(defaultItems);
const [email, setEmail] = useState('');
const [name, setName] = useState('');
const [newItemName, setNewItemName] = useState('');
const { toast } = useToast();

  const updateCost = (index: number, newCost: number) => {
    const updatedItems = [...items];
    updatedItems[index].cost = Math.max(0, newCost); 
    setItems(updatedItems);
  };

  const addItem = () => {
    if (newItemName.trim()) {
      setItems([...items, { name: newItemName.trim(), cost: 0 }]);
      setNewItemName('');
    }
  };
  
  const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
  }

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
  const chartData = items.filter(item => item.cost > 0).map(item => ({ name: item.name, value: item.cost }));

  const exportReport = () => {
    let reportContent = "Yatra Saral - Budget Report\n";
    reportContent += "============================\n\n";
    
    items.forEach(item => {
        reportContent += `${item.name}: ₹${item.cost.toFixed(2)}\n`;
    });

    reportContent += "----------------------------\n";
    reportContent += `Total Estimated Budget: ₹${totalCost.toFixed(2)}\n`;
    reportContent += "============================\n";

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YatraSaral_Budget_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
        title: "Report Exported!",
        description: "Your budget report has been downloaded as a text file."
    })
  };
  const sendReportEmail = async () => {
  if (!email) {
    toast({ title: "Email Required", description: "Please enter your email to receive the report." });
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/send-budget-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        totalCost,
        email,
        name,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast({ title: "Report Sent!", description: `Budget report has been emailed to ${email}` });
    } else {
      toast({ title: "Failed", description: data.message || "Could not send email." });
    }
  } catch (error) {
    console.error(error);
    toast({ title: "Error", description: "Something went wrong while sending the email." });
  }
};


  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-fuchsia-50 dark:bg-fuchsia-950/20">
          <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-full mb-6">
                      <Calculator className="h-10 w-10 text-fuchsia-600" />
                  </div>
                  <h1 className="text-5xl font-bold mb-6 text-fuchsia-700 dark:text-fuchsia-400">Budget Calculator</h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Plan your travel expenses with our smart budget tracking tool.</p>
              </motion.div>
          </div>
      </section>

      {/* Main Content */}
             <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
  
          <Button 
            variant="outline" 
            onClick={() => onNavigate('services')} 
            className="mb-8 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Services
          </Button>
           <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Budget Entries */}
                <div className="lg:col-span-2">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Budget Items</CardTitle>
                            <CardDescription>Add or update your expenses for each category.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                                    <Label className="flex-1">{item.name}</Label>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateCost(index, item.cost - 50)}><Minus className="h-4 w-4"/></Button>
                                        <Input 
                                            type="number" 
                                            min="0"
                                            value={item.cost} 
                                            onChange={e => updateCost(index, parseInt(e.target.value) || 0)} 
                                            className="w-28 text-center"
                                        />
                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateCost(index, item.cost + 50)}><Plus className="h-4 w-4"/></Button>
                                    </div>
                                     <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                            ))}
                             <div className="flex items-center gap-2 pt-4 border-t">
                                <Input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Add new category..."/>
                                <Button onClick={addItem}><Plus className="h-4 w-4 mr-2"/> Add</Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Budget Breakdown */}
                <div className="lg:sticky top-24">
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Budget Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-64">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value}`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="border-t pt-4 mt-4 text-center space-y-3">
  <p className="text-muted-foreground">Total Estimated Budget</p>
  <p className="text-3xl font-bold text-primary">₹{totalCost.toFixed(2)}</p>

  {/* Email & Name Inputs */}
  <Input 
    type="text" 
    placeholder="Your Name (optional)" 
    value={name} 
    onChange={e => setName(e.target.value)} 
  />
  <Input 
    type="email" 
    placeholder="Enter your email to receive report" 
    value={email} 
    onChange={e => setEmail(e.target.value)} 
    required 
  />

  <div className="flex gap-2 justify-center">
    <Button onClick={exportReport} variant="outline" size="sm">
      <FileDown className="h-4 w-4 mr-2"/>
      Export Report
    </Button>
    <Button onClick={sendReportEmail} variant="default" size="sm">
      📧 Email Report
    </Button>
  </div>
</div>

                        </CardContent>
                    </Card>
                </div>
           </motion.div>
        </div>
       </section>
    </div>
  );
};