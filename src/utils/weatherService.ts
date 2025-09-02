import { useState, useEffect } from 'react';

// Weather data interface
export interface WeatherData {
  date: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  icon: string;
}

// Weather API response interface
interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    precip_mm: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        daily_chance_of_rain: number;
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        humidity: number;
        wind_kph: number;
        precip_mm: number;
        chance_of_rain: number;
      }>;
    }>;
  };
}

// Weather API key - in a real application, this would be stored in environment variables
const API_KEY = 'YOUR_WEATHER_API_KEY';

// Function to map weather condition to icon name
export const mapConditionToIcon = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return 'sun';
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return 'cloud-rain';
  } else if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) {
    return 'cloud-lightning';
  } else if (conditionLower.includes('snow')) {
    return 'cloud-snow';
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return 'cloud-drizzle';
  } else if (conditionLower.includes('cloud')) {
    return 'cloud';
  } else if (conditionLower.includes('partly')) {
    return 'cloud-sun';
  } else {
    return 'sun';
  }
};

// Hook to fetch weather data
export const useWeatherForecast = (location: string, days: number = 5) => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real application, we would make an API call here
        // For now, we'll use mock data
        // const response = await fetch(
        //   `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`
        // );
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to fetch weather data');
        // }
        // 
        // const data: WeatherApiResponse = await response.json();
        // 
        // const forecastData: WeatherData[] = data.forecast.forecastday.map(day => ({
        //   date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        //   temp: day.day.avgtemp_c,
        //   condition: day.day.condition.text,
        //   humidity: day.hour[12].humidity, // Midday humidity
        //   windSpeed: day.hour[12].wind_kph,
        //   precipitation: day.day.daily_chance_of_rain,
        //   icon: mapConditionToIcon(day.day.condition.text)
        // }));

        // Mock data for demonstration
        const mockForecast = generateMockForecast(days);
        setForecast(mockForecast);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Weather API error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, days]);

  return { forecast, isLoading, error };
};

// Generate mock weather data for demonstration
export const generateMockForecast = (days: number): WeatherData[] => {
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm', 'Drizzle'];
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    const condition = conditions[conditionIndex];
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      temp: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: condition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      precipitation: Math.floor(Math.random() * 70), // 0-70%
      icon: mapConditionToIcon(condition)
    };
  });
};