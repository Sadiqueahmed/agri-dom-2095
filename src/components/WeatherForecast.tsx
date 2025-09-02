import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CloudRain, Sun, Wind, Droplet, CloudSnow, CloudLightning, CloudDrizzle, Cloud } from 'lucide-react';
import { Button } from './ui/button';
import { useWeatherForecast, WeatherData } from '../utils/weatherService';

interface WeatherForecastProps {
  location?: string;
  days?: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  location = 'Current Location', 
  days = 5 
}) => {
  const { forecast, isLoading, error } = useWeatherForecast(location, days);
  const [activeTab, setActiveTab] = useState<string>('daily');

  // Get weather icon based on condition
  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloud':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'cloud-rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'cloud-sun':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloud-lightning':
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      case 'cloud-drizzle':
        return <CloudDrizzle className="h-8 w-8 text-blue-400" />;
      case 'cloud-snow':
        return <CloudSnow className="h-8 w-8 text-blue-200" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading weather forecast...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Unable to load forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                // Refresh will happen automatically through the hook
                window.location.reload();
              }}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Weather Forecast</span>
          <span className="text-sm font-normal">{location}</span>
        </CardTitle>
        <CardDescription>5-day weather forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="pt-4">
            <div className="grid grid-cols-5 gap-2">
              {forecast.map((day, index) => (
                <div key={index} className="text-center p-2 rounded-lg hover:bg-accent transition-colors">
                  <p className="text-sm font-medium">{day.date}</p>
                  <div className="my-2">{getWeatherIcon(day.icon)}</div>
                  <p className="text-lg font-bold">{day.temp}°C</p>
                  <p className="text-xs text-muted-foreground">{day.condition}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="details" className="pt-4">
            <div className="space-y-4">
              {forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div>{getWeatherIcon(day.icon)}</div>
                    <div>
                      <p className="font-medium">{day.date}</p>
                      <p className="text-sm text-muted-foreground">{day.condition}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>{day.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CloudRain className="h-4 w-4 text-blue-400" />
                      <span>{day.precipitation}%</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {day.temp}°C
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleString()}
      </CardFooter>
    </Card>
  );
};

export default WeatherForecast;