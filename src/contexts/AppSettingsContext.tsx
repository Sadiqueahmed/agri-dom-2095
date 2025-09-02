import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
  updateNestedSetting: () => {},
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
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateSetting = (key: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  // Fix the updateNestedSetting function with proper typing
  const updateNestedSetting = (section: string, key: string, value: any) => {
    setSettings((prevSettings) => {
      // Create a copy of the current settings
      const updatedSettings = { ...prevSettings };
      
      // Safely handle the nested section
      const sectionData = updatedSettings[section] as Record<string, any>;
      
      // If the section exists, update it
      if (sectionData) {
        // Create a new object for the section to avoid direct mutation
        updatedSettings[section] = {
          ...sectionData,
          [key]: value
        };
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
