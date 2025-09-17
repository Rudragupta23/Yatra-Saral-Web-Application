"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  CloudSun,
  Loader2,
  Calendar,
  ArrowLeft,
  Clock,
  MapPin,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface CurrentWeather {
  city: string;
  temp: number;
  condition: string;
  icon: React.ReactNode;
  humidity: number;
  wind: number;
}
interface HourlyForecast {
  time: string;
  temp: number;
  icon: React.ReactNode;
}
interface DailyForecast {
  day: string;
  temp_max: number;
  temp_min: number;
  icon: React.ReactNode;
}

export const WeatherForecastPage = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<{
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.startsWith("01")) return <Sun className="h-16 w-16 text-yellow-500" />;
    if (iconCode.startsWith("02") || iconCode.startsWith("03") || iconCode.startsWith("04"))
      return <Cloud className="h-16 w-16 text-gray-500" />;
    if (iconCode.startsWith("09") || iconCode.startsWith("10"))
      return <CloudRain className="h-16 w-16 text-blue-500" />;
    if (iconCode.startsWith("13")) return <CloudSnow className="h-16 w-16 text-blue-300" />;
    return <CloudSun className="h-16 w-16 text-orange-400" />;
  };

  const handleFetchWeather = async () => {
    if (!city) {
      toast({ title: "Error", description: "Please enter a city name.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setWeatherData(null);

    try {
const res = await fetch(`${backendUrl}/api/weather?city=${city}&forecast=true`);
      if (!res.ok) throw new Error("City not found");

      const data = await res.json();

      // Current weather
      const current: CurrentWeather = {
        city: data.current.name,
        temp: Math.round(data.current.main.temp),
        condition: data.current.weather[0].main,
        icon: getWeatherIcon(data.current.weather[0].icon),
        humidity: data.current.main.humidity,
        wind: Math.round(data.current.wind.speed * 3.6),
      };

      const hourly: HourlyForecast[] = data.forecast.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temp: Math.round(item.main.temp),
        icon: getWeatherIcon(item.weather[0].icon),
      }));

      // Daily forecast (next 5 days)
      const dailyMap: { [day: string]: { temps: number[]; icons: string[] } } = {};
      data.forecast.list.forEach((item: any) => {
        const day = new Date(item.dt * 1000).toLocaleDateString([], { weekday: "short" });
        if (!dailyMap[day]) dailyMap[day] = { temps: [], icons: [] };
        dailyMap[day].temps.push(item.main.temp);
        dailyMap[day].icons.push(item.weather[0].icon);
      });

      const daily: DailyForecast[] = Object.keys(dailyMap)
        .slice(0, 5)
        .map((day) => {
          const dayData = dailyMap[day];
          const mostFrequentIcon =
            dayData.icons
              .sort((a, b) => dayData.icons.filter((v) => v === a).length - dayData.icons.filter((v) => v === b).length)
              .pop() || "01d";
          return {
            day,
            temp_max: Math.round(Math.max(...dayData.temps)),
            temp_min: Math.round(Math.min(...dayData.temps)),
            icon: getWeatherIcon(mostFrequentIcon),
          };
        });

      setWeatherData({ current, hourly, daily });
    } catch (err: any) {
      console.error("Weather fetch error:", err);
      toast({
        title: "Error",
        description: "Could not fetch weather data. Please check the city name or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Clock, title: "Hourly Updates", description: "Get detailed weather predictions for the next 24 hours." },
    { icon: Calendar, title: "5-Day Forecast", description: "Plan your week ahead with our reliable 5-day forecast." },
    { icon: MapPin, title: "For Any Station", description: "Check the weather for any city or railway station in the world." },
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      <section className="py-20 bg-sky-50 dark:bg-sky-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full mb-6">
              <CloudSun className="h-10 w-10 text-sky-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-sky-700 dark:text-sky-400">Weather Forecast</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get accurate weather updates for your destination.
            </p>
          </motion.div>
        </div>
      </section>

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
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full space-y-2">
                    <Label htmlFor="city">City Name</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Goa, Mumbai, New Delhi" />
                  </div>
                  <Button onClick={handleFetchWeather} className="w-full sm:w-auto flex-shrink-0" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Get Forecast
                  </Button>
                </div>
              </CardHeader>

              {weatherData && (
                <CardContent>
                  {/* Current Weather */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">{weatherData.current.city}</h2>
                      <div className="flex items-center gap-4">
                        {React.cloneElement(weatherData.current.icon as React.ReactElement, { className: "h-24 w-24" })}
                        <div>
                          <p className="text-6xl font-bold">{weatherData.current.temp}°C</p>
                          <p className="text-muted-foreground text-xl">{weatherData.current.condition}</p>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4" /> Humidity: {weatherData.current.humidity}%
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="h-4 w-4" /> Wind: {weatherData.current.wind} km/h
                        </div>
                      </div>
                    </div>

                    {/* Daily Forecast */}
                    <div className="space-y-2">
                      {weatherData.daily.map((day) => (
                        <div key={day.day} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                          <p className="font-semibold w-1/4">{day.day}</p>
                          <div className="w-1/4 flex justify-center">
                            {React.cloneElement(day.icon as React.ReactElement, { className: "h-8 w-8" })}
                          </div>
                          <p className="text-sm w-2/4 text-right">{day.temp_min}° / {day.temp_max}°</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hourly Forecast */}
                  {weatherData.hourly.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-xl font-bold mb-4">Hourly Forecast</h3>
                      <div className="flex overflow-x-auto space-x-4 pb-4">
                        {weatherData.hourly.map((hour) => (
                          <div key={hour.time} className="flex-shrink-0 w-24 text-center bg-muted p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">{hour.time}</p>
                            <div className="my-2">
                              {React.cloneElement(hour.icon as React.ReactElement, { className: "h-10 w-10 mx-auto" })}
                            </div>
                            <p className="font-semibold">{hour.temp}°C</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Features */}
            <Card className="shadow-lg mt-8">
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
{features.map((feature) => (
  <li key={feature.title} className="flex items-start gap-4">
    <div className="bg-primary/10 p-2 rounded-full">
      <feature.icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold">{feature.title}</h3>
      <p className="text-sm text-muted-foreground">
        {feature.description}
      </p>
    </div>
  </li>
))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};