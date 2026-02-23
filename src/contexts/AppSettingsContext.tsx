import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppSettings {
  darkMode: boolean;
  locale: string;
  units: {
    temperature: 'celsius' | 'fahrenheit';
    distance: 'kilometers' | 'miles';
    area: 'hectares' | 'acres';
    weight: 'kilograms' | 'pounds';
    rainfall: 'millimeters' | 'inches';
  };
  weatherApi: {
    provider: 'openweathermap' | 'weatherapi' | 'accuweather' | 'mock';
    apiKey: string;
    refreshInterval: number; // in minutes
    enableAlerts: boolean;
  };
  agriculture: {
    defaultCropTypes: string[];
    soilTypes: string[];
    growingSeason: {
      start: { month: number; day: number };
      end: { month: number; day: number };
    };
    irrigationPreferences: 'drip' | 'sprinkler' | 'flood' | 'manual';
    pestManagementApproach: 'organic' | 'integrated' | 'conventional';
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weatherAlerts: boolean;
    marketPriceAlerts: boolean;
    taskReminders: boolean;
    systemUpdates: boolean;
    dailySummary: boolean;
  };
  dataSync: {
    autoSync: boolean;
    syncInterval: number; // in minutes
    syncOnWifi: boolean;
    lastSynced: string | null; // ISO date string
    devices: string[];
    cloudBackup: boolean;
    offlineMode: boolean;
  };
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: (key: string, value: any) => void;
  updateNestedSetting: (section: string, key: string, value: any) => void;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  locale: 'en-US',
  units: {
    temperature: 'celsius',
    distance: 'kilometers',
    area: 'hectares',
    weight: 'kilograms',
    rainfall: 'millimeters',
  },
  weatherApi: {
    provider: 'mock',
    apiKey: '',
    refreshInterval: 30,
    enableAlerts: true,
  },
  agriculture: {
    defaultCropTypes: ['Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton'],
    soilTypes: ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty'],
    growingSeason: {
      start: { month: 3, day: 15 }, // March 15
      end: { month: 10, day: 15 },   // October 15
    },
    irrigationPreferences: 'drip',
    pestManagementApproach: 'integrated',
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    weatherAlerts: true,
    marketPriceAlerts: true,
    taskReminders: true,
    systemUpdates: false,
    dailySummary: true,
  },
  dataSync: {
    autoSync: true,
    syncInterval: 30,
    syncOnWifi: true,
    lastSynced: null,
    devices: [],
    cloudBackup: true,
    offlineMode: false
  }
};

// Key for localStorage
const SETTINGS_STORAGE_KEY = 'agri-settings';

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  updateSetting: () => { },
  updateNestedSetting: () => { },
});

// Create a named function declaration for the hook
function useAppSettings() {
  return useContext(AppSettingsContext);
}

// Export the hook separately
export { useAppSettings };

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  // Initialize state directly from localStorage to prevent flash of default theme
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        // Merge stored settings with default settings to handle any missing keys from updates/migrations
        return {
          ...defaultSettings,
          ...JSON.parse(storedSettings),
          // Deep merge components where necessary (e.g., nested objects)
          units: { ...defaultSettings.units, ...JSON.parse(storedSettings).units },
          weatherApi: { ...defaultSettings.weatherApi, ...JSON.parse(storedSettings).weatherApi },
          agriculture: { ...defaultSettings.agriculture, ...JSON.parse(storedSettings).agriculture },
          notifications: { ...defaultSettings.notifications, ...JSON.parse(storedSettings).notifications },
          dataSync: { ...defaultSettings.dataSync, ...JSON.parse(storedSettings).dataSync }
        };
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage', error);
    }
    return defaultSettings;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage', error);
    }
  }, [settings]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const updateNestedSetting = (section: keyof AppSettings, key: string, value: any) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings };

      // Ensure the section exists before trying to access it
      if (updatedSettings[section] && typeof updatedSettings[section] === 'object') {
        updatedSettings[section] = {
          ...updatedSettings[section],
          [key]: value
        } as any;
      }

      return updatedSettings;
    });
  };

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting, updateNestedSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
