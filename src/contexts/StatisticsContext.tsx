import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for different statistical data
export interface YieldData {
  name: string;
  current: number;
  previous: number;
  unit: string;
}

export interface FinancialData {
  name: string;
  profitability: number;
  size: number;
  crop: string;
}

export interface CostData {
  name: string;
  value: number;
  color: string;
}

export interface EnvironmentalData {
  indicator: string;
  current: number;
  target: number;
  trend: string;
  status: 'Achieved' | 'In Progress' | 'Delayed';
}

interface StatisticsContextType {
  // Yield data
  yieldData: YieldData[];
  setYieldData: React.Dispatch<React.SetStateAction<YieldData[]>>;

  // Financial data
  financialData: {
    profitabilityByParcel: FinancialData[];
    costAnalysis: CostData[];
    revenueByMonth: any[];
  };
  setFinancialData: React.Dispatch<React.SetStateAction<{
    profitabilityByParcel: FinancialData[];
    costAnalysis: CostData[];
    revenueByMonth: any[];
  }>>;

  // Environmental data
  environmentalData: {
    indicators: EnvironmentalData[];
    carbonFootprint: number;
    waterUsage: number;
    biodiversity: number;
  };
  setEnvironmentalData: React.Dispatch<React.SetStateAction<{
    indicators: EnvironmentalData[];
    carbonFootprint: number;
    waterUsage: number;
    biodiversity: number;
  }>>;

  // Forecast data
  forecastData: any[];
  setForecastData: React.Dispatch<React.SetStateAction<any[]>>;

  // Period and filters
  period: 'day' | 'week' | 'month' | 'year';
  setPeriod: React.Dispatch<React.SetStateAction<'day' | 'week' | 'month' | 'year'>>;
  cropFilter: string;
  setCropFilter: React.Dispatch<React.SetStateAction<string>>;

  // Function to update data based on filters
  updateDataWithFilters: (period: string, crop: string) => void;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};

// Initial data
const initialYieldData: YieldData[] = [
  { name: 'Sugar Cane', current: 85, previous: 75, unit: 't/ha' },
  { name: 'Banana', current: 32, previous: 30, unit: 't/ha' },
  { name: 'Pineapple', current: 45, previous: 48, unit: 't/ha' },
  { name: 'Yam', current: 18, previous: 15, unit: 't/ha' },
  { name: 'Sweet Potato', current: 22, previous: 20, unit: 't/ha' }
];

const initialProfitabilityData: FinancialData[] = [
  { name: 'North Parcel', profitability: 1250, size: 12.5, crop: 'Sugar Cane' },
  { name: 'East Parcel', profitability: 980, size: 8.3, crop: 'Banana' },
  { name: 'South Parcel', profitability: 1580, size: 15.7, crop: 'Pineapple' },
  { name: 'West Parcel', profitability: 850, size: 10.2, crop: 'Yam' },
  { name: 'Central Parcel', profitability: 920, size: 6.8, crop: 'Sweet Potato' }
];

const initialCostData: CostData[] = [
  { name: 'Seeds', value: 1800, color: '#4CAF50' },
  { name: 'Fertilizers', value: 2200, color: '#8D6E63' },
  { name: 'Phytosanitary', value: 1500, color: '#FFC107' },
  { name: 'Fuel', value: 1200, color: '#2196F3' },
  { name: 'Labor', value: 3500, color: '#673AB7' },
  { name: 'Mechanization', value: 2800, color: '#E91E63' },
  { name: 'Miscellaneous', value: 900, color: '#9E9E9E' }
];

const initialRevenueData = [
  { month: 'Jan', revenue: 28500, expenses: 20100, profit: 8400 },
  { month: 'Feb', revenue: 30200, expenses: 21800, profit: 8400 },
  { month: 'Mar', revenue: 32800, expenses: 22400, profit: 10400 },
  { month: 'Apr', revenue: 35500, expenses: 23100, profit: 12400 },
  { month: 'May', revenue: 38200, expenses: 23500, profit: 14700 },
  { month: 'Jun', revenue: 37800, expenses: 22900, profit: 14900 },
  { month: 'Jul', revenue: 42500, expenses: 24200, profit: 18300 },
  { month: 'Aug', revenue: 44800, expenses: 25300, profit: 19500 },
  { month: 'Sep', revenue: 40200, expenses: 24800, profit: 15400 },
  { month: 'Oct', revenue: 38200, expenses: 23100, profit: 15100 },
  { month: 'Nov', revenue: 36500, expenses: 22500, profit: 14000 },
  { month: 'Dec', revenue: 41200, expenses: 25800, profit: 15400 }
];

const initialEnvironmentalIndicators: EnvironmentalData[] = [
  { indicator: 'CO2 Emissions (t/ha)', current: 2.8, target: 2.5, trend: '-5%', status: 'In Progress' },
  { indicator: 'Water Consumption (m³/ha)', current: 350, target: 320, trend: '-8%', status: 'Achieved' },
  { indicator: 'Input Usage (kg/ha)', current: 180, target: 150, trend: '-12%', status: 'In Progress' },
  { indicator: 'Organic Farming Area (%)', current: 15, target: 25, trend: '+5%', status: 'In Progress' },
  { indicator: 'Biodiversity (species/ha)', current: 12, target: 15, trend: '+12%', status: 'Achieved' }
];

const STATS_STORAGE_KEY = 'agri-statistics-data';

// Helper to init state from local storage or fallback
const initStatsFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[key] !== undefined) {
        return parsed[key];
      }
    }
  } catch (e) {
    console.error('Error reading stats data from local storage', e);
  }
  return fallback;
};

export const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [yieldData, setYieldData] = useState<YieldData[]>(() => initStatsFromStorage('yieldData', initialYieldData));
  const [financialData, setFinancialData] = useState(() => initStatsFromStorage('financialData', {
    profitabilityByParcel: initialProfitabilityData,
    costAnalysis: initialCostData,
    revenueByMonth: initialRevenueData
  }));
  const [environmentalData, setEnvironmentalData] = useState(() => initStatsFromStorage('environmentalData', {
    indicators: initialEnvironmentalIndicators,
    carbonFootprint: -15,
    waterUsage: -8,
    biodiversity: 12
  }));
  const [forecastData, setForecastData] = useState(() => initStatsFromStorage('forecastData', initialRevenueData));
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('year');
  const [cropFilter, setCropFilter] = useState('all');

  // Save changes to local storage
  useEffect(() => {
    try {
      const dataToSave = {
        yieldData,
        financialData,
        environmentalData,
        forecastData
      };
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save stats data', e);
    }
  }, [yieldData, financialData, environmentalData, forecastData]);

  // Function to update data based on filters
  const updateDataWithFilters = (period: string, crop: string) => {
    // Filter yield data by crop if necessary
    if (crop !== 'all') {
      const filteredYieldData = initialYieldData.filter(item => item.name === crop);
      setYieldData(filteredYieldData);

      // Also filter financial data by crop
      const filteredProfitabilityData = initialProfitabilityData.filter(item => item.crop === crop);
      setFinancialData(prev => ({
        ...prev,
        profitabilityByParcel: filteredProfitabilityData
      }));
    } else {
      setYieldData(initialYieldData);
      setFinancialData(prev => ({
        ...prev,
        profitabilityByParcel: initialProfitabilityData
      }));
    }

    // You could also adjust other data based on the period
  };

  // Update data when filters change
  useEffect(() => {
    updateDataWithFilters(period, cropFilter);
  }, [period, cropFilter]);

  return (
    <StatisticsContext.Provider
      value={{
        yieldData,
        setYieldData,
        financialData,
        setFinancialData,
        environmentalData,
        setEnvironmentalData,
        forecastData,
        setForecastData,
        period,
        setPeriod,
        cropFilter,
        setCropFilter,
        updateDataWithFilters
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};