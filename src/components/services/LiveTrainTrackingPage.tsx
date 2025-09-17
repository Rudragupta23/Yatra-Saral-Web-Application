import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Train, RadioTower, CheckCircle, CircleDot, ArrowLeft, Circle, Clock, Gauge, AlertCircle, Waypoints } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Station {
  name: string;
  time: string;
  status: 'Departed' | 'Current' | 'Upcoming';
}

interface TrainStatus {
  trainNumber: string;
  trainName: string;
  nextStoppage: string;
  platform: string | number;
  delay: string;
  lastUpdated: string;
  route: Station[];
}

const mockTrainData: TrainStatus[] = [
  {
    trainNumber: '12001',
    trainName: 'New Delhi Shatabdi',
    nextStoppage: 'Ambala Cantt Jn',
    platform: 3,
    delay: 'On Time',
    lastUpdated: '5 mins ago',
    route: [
      { name: 'New Delhi', time: '16:30', status: 'Departed' },
      { name: 'Panipat Jn', time: '17:50', status: 'Departed' },
      { name: 'Karnal', time: '18:15', status: 'Current' },
      { name: 'Ambala Cantt Jn', time: '19:03', status: 'Upcoming' },
      { name: 'Kalka', time: '20:00', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12020',
    trainName: 'Ranchi Shatabdi',
    nextStoppage: 'Bokaro Steel City',
    platform: 1,
    delay: 'Delayed by 20 mins',
    lastUpdated: '7 mins ago',
    route: [
      { name: 'Howrah Jn', time: '14:05', status: 'Departed' },
      { name: 'Durgapur', time: '15:48', status: 'Departed' },
      { name: 'Asansol Jn', time: '16:16', status: 'Departed' },
      { name: 'Dhanbad Jn', time: '17:10', status: 'Current' },
      { name: 'Bokaro Steel City', time: '18:35', status: 'Upcoming' },
      { name: 'Ranchi Jn', time: '20:50', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12417',
    trainName: 'Prayagraj Express',
    nextStoppage: 'Aligarh Jn',
    platform: 6,
    delay: 'On Time',
    lastUpdated: '3 mins ago',
    route: [
      { name: 'New Delhi', time: '22:10', status: 'Departed' },
      { name: 'Ghaziabad', time: '22:42', status: 'Current' },
      { name: 'Aligarh Jn', time: '00:05', status: 'Upcoming' },
      { name: 'Prayagraj Jn', time: '07:00', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '22439',
    trainName: 'Vande Bharat Express',
    nextStoppage: 'Kanpur Central',
    platform: 1,
    delay: 'Delayed by 15 mins',
    lastUpdated: '2 mins ago',
    route: [
      { name: 'New Delhi', time: '06:00', status: 'Departed' },
      { name: 'Varanasi Jn', time: '14:00', status: 'Current' },
      { name: 'Kanpur Central', time: '10:08', status: 'Upcoming' },
      { name: 'Prayagraj Jn', time: '12:08', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12259',
    trainName: 'Sealdah Duronto',
    nextStoppage: 'Dhanbad Jn',
    platform: 5,
    delay: 'On Time',
    lastUpdated: '6 mins ago',
    route: [
      { name: 'Sealdah', time: '18:30', status: 'Departed' },
      { name: 'Asansol Jn', time: '21:05', status: 'Current' },
      { name: 'Dhanbad Jn', time: '22:10', status: 'Upcoming' },
      { name: 'New Delhi', time: '11:00', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12909',
    trainName: 'NZM Garib Rath',
    nextStoppage: 'Ratlam Jn',
    platform: 2,
    delay: 'Delayed by 10 mins',
    lastUpdated: '4 mins ago',
    route: [
      { name: 'Bandra Terminus', time: '17:30', status: 'Departed' },
      { name: 'Borivali', time: '17:57', status: 'Departed' },
      { name: 'Surat', time: '20:47', status: 'Departed' },
      { name: 'Vadodara Jn', time: '22:19', status: 'Current' },
      { name: 'Ratlam Jn', time: '01:53', status: 'Upcoming' },
      { name: 'H. Nizamuddin', time: '09:40', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '20801',
    trainName: 'Magadh Express',
    nextStoppage: 'Buxar',
    platform: 7,
    delay: 'On Time',
    lastUpdated: '9 mins ago',
    route: [
      { name: 'Islampur', time: '15:30', status: 'Departed' },
      { name: 'Patna Jn', time: '17:30', status: 'Departed' },
      { name: 'Danapur', time: '17:50', status: 'Current' },
      { name: 'Buxar', time: '19:26', status: 'Upcoming' },
      { name: 'New Delhi', time: '11:50', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12138',
    trainName: 'Punjab Mail',
    nextStoppage: 'Rohtak Jn',
    platform: 1,
    delay: 'Cancelled',
    lastUpdated: '15 mins ago',
    route: [
      { name: 'Firozpur Cantt', time: '21:45', status: 'Departed' },
      { name: 'Bhatinda Jn', time: '23:15', status: 'Departed' },
      { name: 'New Delhi', time: '05:10', status: 'Current' },
      { name: 'Agra Cantt', time: '08:05', status: 'Upcoming' },
      { name: 'C Shivaji Mah T', time: '07:35', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12451',
    trainName: 'Shram Shakti Exp',
    nextStoppage: 'New Delhi',
    platform: 9,
    delay: 'On Time',
    lastUpdated: '3 mins ago',
    route: [
      { name: 'Kanpur Central', time: '23:55', status: 'Current' },
      { name: 'New Delhi', time: '05:50', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani',
    nextStoppage: 'Surat',
    platform: 4,
    delay: 'On Time',
    lastUpdated: '8 mins ago',
    route: [
      { name: 'Mumbai Central', time: '17:00', status: 'Departed' },
      { name: 'Borivali', time: '17:22', status: 'Departed' },
      { name: 'Surat', time: '19:43', status: 'Current' },
      { name: 'Vadodara Jn', time: '21:06', status: 'Upcoming' },
      { name: 'New Delhi', time: '08:32', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '12394',
    trainName: 'Sampoorna Kranti',
    nextStoppage: 'Patna Jn',
    platform: 8,
    delay: 'Delayed by 45 mins',
    lastUpdated: '1 min ago',
    route: [
      { name: 'New Delhi', time: '17:30', status: 'Departed' },
      { name: 'Kanpur Central', time: '22:22', status: 'Departed' },
      { name: 'Mughal Sarai Jn', time: '02:25', status: 'Current' },
      { name: 'Patna Jn', time: '07:20', status: 'Upcoming' },
    ],
  },
  {
    trainNumber: '22691',
    trainName: 'KSR Bengaluru Rajdhani',
    nextStoppage: 'Agra Cantt',
    platform: 2,
    delay: 'On Time',
    lastUpdated: '12 mins ago',
    route: [
      { name: 'Hazrat Nizamuddin', time: '20:45', status: 'Current' },
      { name: 'Agra Cantt', time: '22:48', status: 'Upcoming' },
      { name: 'Bhopal Jn', time: '05:25', status: 'Upcoming' },
      { name: 'KSR Bengaluru', time: '05:20', status: 'Upcoming' },
    ],
  }
];

export const LiveTrainTrackingPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const [trainNumber, setTrainNumber] = useState('');
  const [status, setStatus] = useState<TrainStatus | null>(null);
  const { toast } = useToast();

  const handleTrackTrain = () => {
    const trainNumberRegex = /^\d{5}$/;
    if (!trainNumberRegex.test(trainNumber)) {
      toast({
        title: 'Invalid Train Number',
        description: 'Please enter a valid 5-digit train number.',
        variant: 'destructive',
      });
      setStatus(null);
      return;
    }

    const randomStatus = mockTrainData[Math.floor(Math.random() * mockTrainData.length)];
    randomStatus.trainNumber = trainNumber;
    setStatus(randomStatus);
  };

  const getStatusIcon = (stationStatus: Station['status']) => {
    switch (stationStatus) {
      case 'Departed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Current':
        return <CircleDot className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'Upcoming':
        return <Circle className="h-6 w-6 text-muted-foreground" />;
      default:
        return null;
    }
  };

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
              <Waypoints className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-blue-700 dark:text-blue-400">
              Live Train Tracking
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track your train's real-time location and status.
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
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full space-y-2">
                    <Label htmlFor="trainNumber">Enter 5-Digit Train Number</Label>
                    <Input
                      id="trainNumber"
                      value={trainNumber}
                      onChange={(e) => setTrainNumber(e.target.value)}
                      placeholder="e.g., 12001"
                      maxLength={5}
                    />
                  </div>
                  <Button onClick={handleTrackTrain} className="w-full sm:w-auto flex-shrink-0">
                    <RadioTower className="mr-2 h-4 w-4" /> Track Train
                  </Button>
                </div>
              </CardHeader>
              
              {status && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <CardContent className="space-y-6 pt-6">
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Train className="h-8 w-8 text-primary" />
                        <div>
                          <h2 className="text-2xl font-bold">{status.trainName}</h2>
                          <p className="text-muted-foreground">Train No: {status.trainNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Next Stoppage</p>
                          <p className="font-bold">{status.nextStoppage}</p>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Platform No.</p>
                          <p className="font-bold flex items-center justify-center gap-1">
                            <Gauge className="h-4 w-4" /> {status.platform}
                          </p>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Delay</p>
                          <p className={`font-bold ${status.delay !== 'On Time' ? 'text-destructive' : 'text-green-600'}`}>
                            <AlertCircle className="inline h-4 w-4 mr-1" />{status.delay}
                          </p>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-bold flex items-center justify-center gap-1">
                            <Clock className="h-4 w-4" /> {status.lastUpdated}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-semibold mb-4 text-lg">Route</h3>
                        <div className="relative pl-8">
                          <div className="absolute left-[15px] top-[5px] bottom-[5px] w-0.5 bg-border -translate-x-1/2"></div>
                          {status.route.map((station, index) => (
                            <div key={index} className="flex items-start gap-4 mb-4 last:mb-0">
                              <div className="z-10 bg-card">
                                {getStatusIcon(station.status)}
                              </div>
                              <div className="w-full">
                                <p className={`font-semibold ${station.status === 'Current' ? 'text-primary' : ''}`}>
                                  {station.name}
                                </p>
                                <p className="text-sm text-muted-foreground">Scheduled: {station.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};