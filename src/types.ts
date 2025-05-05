
// Customer data types
export interface CustomerData {
  totalCustomers: number;
  loyalCustomers: number;
  atRiskCustomers: number;
}

// Churn prediction form data
export interface ChurnPredictionData {
  tenure: number;
  complaints: number;
  cashbackAmount: number;
  satisfactionScore: number;
  purchasedLaptopAccessory: boolean;
  purchasedGrocery: boolean;
  purchasedOtherProducts: boolean;
  purchasedMobile: boolean;
  cityTier: number;
}

// Churn prediction result
export interface ChurnPredictionResult {
  churnProbability: number; // 0-1 value representing probability of churning
  churnRisk: "low" | "medium" | "high";
  recommendations: string[];
}
