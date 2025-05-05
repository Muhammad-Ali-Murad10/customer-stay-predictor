
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChurnPredictionData, ChurnPredictionResult, CustomerData } from '@/types';

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
  const [isLoading, setIsLoading] = useState(false);

  // This is a mock prediction function
  // In a real app, this would call an API endpoint with a trained ML model
  const makePrediction = async (data: ChurnPredictionData): Promise<ChurnPredictionResult> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Very simple prediction logic - in a real app this would use a trained model
    // This is just for demonstration
    let churnScore = 0;
    
    // Tenure - longer tenure reduces churn risk
    churnScore -= data.tenure * 0.05;
    
    // Complaints increase churn risk
    churnScore += data.complaints * 0.15;
    
    // Cashback reduces churn risk
    churnScore -= data.cashbackAmount * 0.01;
    
    // Satisfaction score - higher reduces churn risk
    churnScore -= data.satisfactionScore * 0.1;
    
    // Product categories
    if (data.purchasedLaptopAccessory) churnScore -= 0.2;
    if (data.purchasedGrocery) churnScore -= 0.1;
    if (data.purchasedOtherProducts) churnScore -= 0.15;
    if (data.purchasedMobile) churnScore -= 0.25;
    
    // City tier - higher tier (usually more urban) has lower churn
    churnScore += (4 - data.cityTier) * 0.2;
    
    // Normalize between 0 and 1
    const normalizedScore = Math.max(0, Math.min(1, (churnScore + 2) / 4));
    
    // Generate recommendations based on inputs
    const recommendations = [];
    
    if (data.complaints > 0) {
      recommendations.push("Address customer complaints promptly to improve satisfaction");
    }
    
    if (data.satisfactionScore < 7) {
      recommendations.push("Improve overall customer experience to boost satisfaction scores");
    }
    
    if (data.cashbackAmount < 200) {
      recommendations.push("Consider increasing cashback rewards for this customer");
    }
    
    if (!data.purchasedLaptopAccessory && !data.purchasedMobile) {
      recommendations.push("Offer personalized tech product promotions");
    }
    
    if (!data.purchasedGrocery) {
      recommendations.push("Introduce grocery product offerings to this customer");
    }
    
    // Ensure we always have at least one recommendation
    if (recommendations.length === 0) {
      recommendations.push("Continue providing excellent service to maintain customer loyalty");
    }
    
    setIsLoading(false);
    
    return {
      churnProbability: normalizedScore,
      churnRisk: normalizedScore > 0.7 ? "high" : normalizedScore > 0.4 ? "medium" : "low",
      recommendations
    };
  };

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
