
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomerData, ChurnPredictionData, ChurnPredictionResult } from '@/types';
import { usePredictionCalculation } from '@/hooks/usePredictionCalculation';

// Initial mock data
const INITIAL_CUSTOMER_DATA: CustomerData = {
  totalCustomers: 14325,
  loyalCustomers: 9876,
  atRiskCustomers: 1324,
};

interface PredictionContextType {
  customerData: CustomerData;
  makePrediction: (data: ChurnPredictionData) => Promise<ChurnPredictionResult>;
  isLoading: boolean;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [customerData] = useState<CustomerData>(INITIAL_CUSTOMER_DATA);
  const { makePrediction, isLoading } = usePredictionCalculation();

  return (
    <PredictionContext.Provider value={{ customerData, makePrediction, isLoading }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};
