import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { motion } from 'framer-motion';
import { Settings, Globe, Moon, Sun, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Settings',
    defaultDescription: 'Configure your application preferences'
  });

  const { settings, updateSetting } = useAppSettings();
  
  // Local state to track changes before saving
  const [localSettings, setLocalSettings] = useState({
    darkMode: settings.darkMode,
    locale: settings.locale,
    units: { ...settings.units },
    weatherApi: { ...settings.weatherApi },
    agriculture: { ...settings.agriculture },
    notifications: { ...settings.notifications },
    dataSync: { ...settings.dataSync }
  });
  
  // State for managing crop types (which can be added/removed)
  const [newCropType, setNewCropType] = useState('');

  // Available locales
  const locales = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'fr-FR', label: 'French (France)' },
    { value: 'hi-IN', label: 'Hindi (India)' }
  ];

  const handleDarkModeChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, darkMode: checked }));
  };

  const handleLocaleChange = (value: string) => {
    setLocalSettings(prev => ({ ...prev, locale: value }));
  };
  
  const handleUnitChange = (unitType: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      units: {
        ...prev.units,
        [unitType]: value
      }
    }));
  };

  const handleWeatherApiChange = (field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      weatherApi: {
        ...prev.weatherApi,
        [field]: value
      }
    }));
  };

  const handleAgricultureChange = (field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        [field]: value
      }
    }));
  };
  
  const handleGrowingSeasonChange = (field: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        growingSeason: {
          ...prev.agriculture.growingSeason,
          [field]: value
        }
      }
    }));
  };
  
  const addCropType = () => {
    if (newCropType.trim() && !localSettings.agriculture.defaultCropTypes.includes(newCropType.trim())) {
      setLocalSettings(prev => ({
        ...prev,
        agriculture: {
          ...prev.agriculture,
          defaultCropTypes: [...prev.agriculture.defaultCropTypes, newCropType.trim()]
        }
      }));
      setNewCropType('');
    }
  };
  
  const removeCropType = (cropToRemove: string) => {
    setLocalSettings(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        defaultCropTypes: prev.agriculture.defaultCropTypes.filter(crop => crop !== cropToRemove)
      }
    }));
  };
  
  const handleNotificationChange = (field: string, value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const saveSettings = () => {
    // Update all settings at once
    Object.entries(localSettings).forEach(([key, value]) => {
      updateSetting(key, value);
    });
    
    // Apply dark mode immediately
    if (localSettings.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };

  return (
    <PageLayout>
      <PageHeader
        icon={<Settings className="h-8 w-8 text-primary" />}
        title={title}
        description={description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
      />

      <div className="container mx-auto py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <Moon className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for a more comfortable viewing experience in low light
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={localSettings.darkMode}
                    onCheckedChange={handleDarkModeChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>
                Configure language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="locale">Language & Region</Label>
                  <Select
                    value={localSettings.locale}
                    onValueChange={handleLocaleChange}
                  >
                    <SelectTrigger id="locale" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {locales.map((locale) => (
                        <SelectItem key={locale.value} value={locale.value}>
                          {locale.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language and regional format
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"></path>
                  <path d="M8 12h8"></path>
                  <path d="M12 16V8"></path>
                </svg>
                Unit Preferences
              </CardTitle>
              <CardDescription>
                Choose your preferred measurement units for the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Select
                    value={localSettings.units.temperature}
                    onValueChange={(value) => handleUnitChange('temperature', value)}
                  >
                    <SelectTrigger id="temperature" className="w-full">
                      <SelectValue placeholder="Select temperature unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Select
                    value={localSettings.units.distance}
                    onValueChange={(value) => handleUnitChange('distance', value)}
                  >
                    <SelectTrigger id="distance" className="w-full">
                      <SelectValue placeholder="Select distance unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kilometers">Kilometers (km)</SelectItem>
                      <SelectItem value="miles">Miles (mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Select
                    value={localSettings.units.area}
                    onValueChange={(value) => handleUnitChange('area', value)}
                  >
                    <SelectTrigger id="area" className="w-full">
                      <SelectValue placeholder="Select area unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hectares">Hectares (ha)</SelectItem>
                      <SelectItem value="acres">Acres (ac)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Select
                    value={localSettings.units.weight}
                    onValueChange={(value) => handleUnitChange('weight', value)}
                  >
                    <SelectTrigger id="weight" className="w-full">
                      <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                      <SelectItem value="pounds">Pounds (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall</Label>
                  <Select
                    value={localSettings.units.rainfall}
                    onValueChange={(value) => handleUnitChange('rainfall', value)}
                  >
                    <SelectTrigger id="rainfall" className="w-full">
                      <SelectValue placeholder="Select rainfall unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="millimeters">Millimeters (mm)</SelectItem>
                      <SelectItem value="inches">Inches (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
                Weather API Configuration
              </CardTitle>
              <CardDescription>
                Configure your weather data provider and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weatherProvider">Weather Provider</Label>
                  <Select
                    value={localSettings.weatherApi.provider}
                    onValueChange={(value) => handleWeatherApiChange('provider', value)}
                  >
                    <SelectTrigger id="weatherProvider" className="w-full">
                      <SelectValue placeholder="Select weather provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openweathermap">OpenWeatherMap</SelectItem>
                      <SelectItem value="weatherapi">WeatherAPI.com</SelectItem>
                      <SelectItem value="accuweather">AccuWeather</SelectItem>
                      <SelectItem value="mock">Mock Data (Development)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred weather data provider
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex">
                    <input 
                      type="password" 
                      id="apiKey"
                      value={localSettings.weatherApi.apiKey}
                      onChange={(e) => handleWeatherApiChange('apiKey', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your API key"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {localSettings.weatherApi.provider !== 'mock' ? 
                      "Your API key for authentication with the weather service" : 
                      "No API key needed for mock data"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Data Refresh Interval (minutes)</Label>
                  <input 
                    type="number" 
                    id="refreshInterval"
                    min="5"
                    max="180"
                    value={localSettings.weatherApi.refreshInterval}
                    onChange={(e) => handleWeatherApiChange('refreshInterval', parseInt(e.target.value) || 30)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-sm text-muted-foreground">
                    How often to refresh weather data (5-180 minutes)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAlerts">Weather Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about severe weather conditions
                    </p>
                  </div>
                  <Switch
                    id="enableAlerts"
                    checked={localSettings.weatherApi.enableAlerts}
                    onCheckedChange={(checked) => handleWeatherApiChange('enableAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M3 7c3-2 6-2 9 0s6 2 9 0"></path>
                  <path d="M3 17c3-2 6-2 9 0s6 2 9 0"></path>
                  <path d="M3 12c3-2 6-2 9 0s6 2 9 0"></path>
                </svg>
                Agricultural Preferences
              </CardTitle>
              <CardDescription>
                Configure your farm and crop management preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Default Crop Types */}
                <div className="space-y-2">
                  <Label>Default Crop Types</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {localSettings.agriculture.defaultCropTypes.map((crop, index) => (
                      <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                        {crop}
                        <button 
                          onClick={() => removeCropType(crop)}
                          className="ml-2 text-secondary-foreground hover:text-destructive focus:outline-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCropType}
                      onChange={(e) => setNewCropType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add new crop type"
                    />
                    <Button 
                      onClick={addCropType}
                      type="button"
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These crop types will be available by default when creating new parcels
                  </p>
                </div>

                {/* Growing Season */}
                <div className="space-y-2">
                  <Label>Growing Season</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seasonStart" className="text-xs">Start Date (MM-DD)</Label>
                      <input
                        type="text"
                        id="seasonStart"
                         value={typeof localSettings.agriculture.growingSeason.start === 'object' ? 
                           `${String(localSettings.agriculture.growingSeason.start.month).padStart(2, '0')}-${String(localSettings.agriculture.growingSeason.start.day).padStart(2, '0')}` : 
                           localSettings.agriculture.growingSeason.start}
                        onChange={(e) => handleGrowingSeasonChange('start', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="MM-DD"
                        pattern="\d{2}-\d{2}"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seasonEnd" className="text-xs">End Date (MM-DD)</Label>
                      <input
                        type="text"
                        id="seasonEnd"
                         value={typeof localSettings.agriculture.growingSeason.end === 'object' ? 
                           `${String(localSettings.agriculture.growingSeason.end.month).padStart(2, '0')}-${String(localSettings.agriculture.growingSeason.end.day).padStart(2, '0')}` : 
                           localSettings.agriculture.growingSeason.end}
                        onChange={(e) => handleGrowingSeasonChange('end', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="MM-DD"
                        pattern="\d{2}-\d{2}"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Define your typical growing season for planning and notifications
                  </p>
                </div>

                {/* Irrigation Preferences */}
                <div className="space-y-2">
                  <Label htmlFor="irrigation">Irrigation Preferences</Label>
                  <Select
                    value={localSettings.agriculture.irrigationPreferences}
                    onValueChange={(value) => handleAgricultureChange('irrigationPreferences', value)}
                  >
                    <SelectTrigger id="irrigation" className="w-full">
                      <SelectValue placeholder="Select irrigation preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic (Weather-based)</SelectItem>
                      <SelectItem value="manual">Manual Control</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pest Management */}
                <div className="space-y-2">
                  <Label htmlFor="pestManagement">Pest Management Approach</Label>
                  <Select
                    value={localSettings.agriculture.pestManagementApproach}
                    onValueChange={(value) => handleAgricultureChange('pestManagementApproach', value)}
                  >
                    <SelectTrigger id="pestManagement" className="w-full">
                      <SelectValue placeholder="Select pest management approach" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conventional">Conventional</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="integrated">Integrated Pest Management (IPM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Your preferred approach to managing pests and diseases
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notification Channels</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={localSettings.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in your browser or mobile app
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={localSettings.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={localSettings.notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weather-alerts">Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about severe weather conditions
                      </p>
                    </div>
                    <Switch
                      id="weather-alerts"
                      checked={localSettings.notifications.weatherAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('weatherAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="market-price-alerts">Market Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about significant changes in crop prices
                      </p>
                    </div>
                    <Switch
                      id="market-price-alerts"
                      checked={localSettings.notifications.marketPriceAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('marketPriceAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders about upcoming and overdue tasks
                      </p>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={localSettings.notifications.taskReminders}
                      onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about system updates and maintenance
                      </p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={localSettings.notifications.systemUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="daily-summary">Daily Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a daily summary of farm activities and conditions
                      </p>
                    </div>
                    <Switch
                      id="daily-summary"
                      checked={localSettings.notifications.dailySummary}
                      onCheckedChange={(checked) => handleNotificationChange('dailySummary', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Data Synchronization
              </CardTitle>
              <CardDescription>
                Configure how your data is synchronized across devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-sync">Automatic Synchronization</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync data with cloud and other devices
                      </p>
                    </div>
                    <Switch
                      id="auto-sync"
                      checked={localSettings.dataSync.autoSync}
                      onCheckedChange={(checked) => {
                        setLocalSettings(prev => ({
                          ...prev,
                          dataSync: {
                            ...prev.dataSync,
                            autoSync: checked
                          }
                        }));
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                    <Input
                      id="sync-interval"
                      type="number"
                      min="5"
                      max="1440"
                      value={localSettings.dataSync.syncInterval}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 5) {
                          setLocalSettings(prev => ({
                            ...prev,
                            dataSync: {
                              ...prev.dataSync,
                              syncInterval: value
                            }
                          }));
                        }
                      }}
                      disabled={!localSettings.dataSync.autoSync}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-wifi">Sync Only on Wi-Fi</Label>
                      <p className="text-sm text-muted-foreground">
                        Only synchronize when connected to Wi-Fi
                      </p>
                    </div>
                    <Switch
                      id="sync-wifi"
                      checked={localSettings.dataSync.syncOnWifi}
                      onCheckedChange={(checked) => {
                        setLocalSettings(prev => ({
                          ...prev,
                          dataSync: {
                            ...prev.dataSync,
                            syncOnWifi: checked
                          }
                        }));
                      }}
                      disabled={!localSettings.dataSync.autoSync}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cloud-backup">Cloud Backup</Label>
                      <p className="text-sm text-muted-foreground">
                        Store backup copies of your data in the cloud
                      </p>
                    </div>
                    <Switch
                      id="cloud-backup"
                      checked={localSettings.dataSync.cloudBackup}
                      onCheckedChange={(checked) => {
                        setLocalSettings(prev => ({
                          ...prev,
                          dataSync: {
                            ...prev.dataSync,
                            cloudBackup: checked
                          }
                        }));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="offline-mode">Offline Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Work without internet connection (sync will be paused)
                      </p>
                    </div>
                    <Switch
                      id="offline-mode"
                      checked={localSettings.dataSync.offlineMode}
                      onCheckedChange={(checked) => {
                        setLocalSettings(prev => ({
                          ...prev,
                          dataSync: {
                            ...prev.dataSync,
                            offlineMode: checked,
                            // Disable autoSync if offline mode is enabled
                            autoSync: checked ? false : prev.dataSync.autoSync
                          }
                        }));
                      }}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Last Synced</p>
                    <p className="text-sm text-muted-foreground">
                      {localSettings.dataSync.lastSynced 
                        ? new Date(localSettings.dataSync.lastSynced).toLocaleString() 
                        : 'Never'}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Simulate sync now functionality
                        toast({
                          title: "Synchronization started",
                          description: "Your data is being synchronized..."
                        });
                        
                        // In a real app, this would trigger actual synchronization
                        setTimeout(() => {
                          const now = new Date().toISOString();
                          setLocalSettings(prev => ({
                            ...prev,
                            dataSync: {
                              ...prev.dataSync,
                              lastSynced: now
                            }
                          }));
                          
                          toast({
                            title: "Synchronization complete",
                            description: "All your data is up to date"
                          });
                        }, 2000);
                      }}
                      disabled={localSettings.dataSync.offlineMode}
                    >
                      Sync Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-end"
        >
          <Button 
            onClick={saveSettings}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;