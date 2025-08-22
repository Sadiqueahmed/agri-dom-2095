import React, { createContext, useContext, ReactNode } from 'react';
import useCRMContext from '../hooks/use-crm-context';

// Creating context with appropriate types
interface CRMContextType {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: any) => void;
  getModuleData: (moduleName: string) => any;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: any[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: any) => Promise<boolean>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// Props for the provider
interface CRMProviderProps {
  children: ReactNode;
}

// Provider that will wrap our application
export const CRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  const crmContext = useCRMContext();
  
  return (
    <CRMContext.Provider value={crmContext}>
      {children}
    </CRMContext.Provider>
  );
};

// Custom hook to use the context
export const useCRM = () => {
  const context = useContext(CRMContext);
  
  if (context === undefined) {
    throw new Error('use CRM must be used within a CRM Provider');
  }
  
  return context;
};

export default CRMContext;