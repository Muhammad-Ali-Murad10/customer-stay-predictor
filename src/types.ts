
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
  keyDrivers: string[]; // Top 3 influencing factors
}

// Feature weights for Random Forest model
export interface RandomForestWeights {
  complaints: number;
  cashbackAmount: number;
  tenure: number;
  satisfactionScore: number;
  mobile: number;
  laptopAccessory: number;
  cityTier: number;
  grocery: number;
  otherProducts: number;
}

// Feature weights for XGBoost model
export interface XGBoostWeights {
  cashbackAmount: number;
  complaints: number;
  tenure: number;
  satisfactionScore: number;
  mobile: number;
  laptopAccessory: number;
  cityTier: number;
  grocery: number;
  otherProducts: number;
}

// Model coefficients
export interface ModelCoefficients {
  randomForest: number;
  xgboost: number;
}
