import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  ChurnPredictionData, 
  ChurnPredictionResult, 
  CustomerData,
  RandomForestWeights,
  XGBoostWeights,
  ModelCoefficients
} from '@/types';

// Initial mock data
const INITIAL_CUSTOMER_DATA: CustomerData = {
  totalCustomers: 14325,
  loyalCustomers: 9876,
  atRiskCustomers: 1324,
};

// Updated feature weights from Random Forest model
const RF_WEIGHTS: RandomForestWeights = {
  complaints: 0.39462851,
  cashbackAmount: 0.08225383,
  tenure: 0.3127214,
  satisfactionScore: 0.09988074,
  mobile: 0.02439683,
  laptopAccessory: 0.00701376,
  cityTier: 0.00416976,
  grocery: 0.04293347,
  otherProducts: 0.0320017
};

// Updated feature weights from XGBoost model
const XGB_WEIGHTS: XGBoostWeights = {
  tenure: 8.1933012008667,
  complaints: 6.182362079620361,
  cashbackAmount: 2.498544931411743,
  satisfactionScore: 2.7193634510040283,
  laptopAccessory: 4.488865852355957,
  grocery: 3.5970733165740967,
  otherProducts: 3.577709674835205,
  cityTier: 3.27629017829895,
  mobile: 2.8912057876586914
};

// Updated model coefficients for meta-model (Logistic Regression)
const MODEL_COEFFICIENTS: ModelCoefficients = {
  randomForest: 3.14200716,
  xgboost: 3.26506879
};

// Risk thresholds
const HIGH_RISK_THRESHOLD = 0.7;
const MEDIUM_RISK_THRESHOLD = 0.4;

interface PredictionContextType {
  customerData: CustomerData;
  makePrediction: (data: ChurnPredictionData) => Promise<ChurnPredictionResult>;
  isLoading: boolean;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [customerData] = useState<CustomerData>(INITIAL_CUSTOMER_DATA);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Calculate Random Forest probability
   * Higher weights increase or decrease churn risk based on impact direction
   */
  const calculateRandomForestProbability = (data: ChurnPredictionData): number => {
    // Base probability
    let probability = 0.3; // Adjusted base probability
    
    // Apply feature impacts with proper scaling and direction
    // Complaint increases churn risk (positive impact on probability)
    probability += data.complaints > 0 ? RF_WEIGHTS.complaints * 0.8 : 0;
    
    // CashbackAmount decreases churn risk (negative impact on probability)
    probability -= (data.cashbackAmount / 1000) * RF_WEIGHTS.cashbackAmount;
    
    // Tenure decreases churn risk (negative impact on probability)
    probability -= (data.tenure / 80) * RF_WEIGHTS.tenure;
    
    // SatisfactionScore decreases churn risk (negative impact on probability)
    probability -= (data.satisfactionScore / 15) * RF_WEIGHTS.satisfactionScore;
    
    // Mobile_final decreases churn risk (negative impact on probability)
    probability -= data.purchasedMobile ? RF_WEIGHTS.mobile : 0;
    
    // Laptop & Accessory decreases churn risk (negative impact on probability)
    probability -= data.purchasedLaptopAccessory ? RF_WEIGHTS.laptopAccessory : 0;
    
    // CityTier increases churn risk (positive impact on probability) - higher tier is lower number
    probability += (3 - data.cityTier) / 3 * RF_WEIGHTS.cityTier;
    
    // Grocery decreases churn risk (negative impact on probability)
    probability -= data.purchasedGrocery ? RF_WEIGHTS.grocery : 0;
    
    // Other products decrease churn risk (negative impact on probability)
    probability -= data.purchasedOtherProducts ? RF_WEIGHTS.otherProducts : 0;
    
    // Ensure probability is between 0 and 1
    return Math.max(0, Math.min(1, probability));
  };

  /**
   * Calculate XGBoost probability with updated weights
   * XGBoost tends to produce larger raw values, so we need to scale them
   */
  const calculateXGBoostProbability = (data: ChurnPredictionData): number => {
    // Base score for XGBoost
    let score = 0;
    
    // Apply feature contributions - these are much larger values than RF model
    score += data.complaints > 0 ? XGB_WEIGHTS.complaints / 10 : 0;
    score -= (data.cashbackAmount / 1500) * XGB_WEIGHTS.cashbackAmount / 10;
    score -= (data.tenure / 100) * XGB_WEIGHTS.tenure / 10;
    score -= (data.satisfactionScore / 15) * XGB_WEIGHTS.satisfactionScore / 10;
    score -= data.purchasedMobile ? XGB_WEIGHTS.mobile / 15 : 0;
    score -= data.purchasedLaptopAccessory ? XGB_WEIGHTS.laptopAccessory / 15 : 0;
    score += (3 - data.cityTier) / 3 * XGB_WEIGHTS.cityTier / 15;
    score -= data.purchasedGrocery ? XGB_WEIGHTS.grocery / 15 : 0;
    score -= data.purchasedOtherProducts ? XGB_WEIGHTS.otherProducts / 15 : 0;
    
    // Convert score to probability using sigmoid function
    const probability = 1 / (1 + Math.exp(-score));
    
    return Math.max(0, Math.min(1, probability));
  };

  /**
   * Final prediction using updated logistic regression meta-model
   */
  const metaModelPrediction = (rfProb: number, xgbProb: number): number => {
    // Using the formula with the new coefficients
    // Note: Coefficients are larger, so we need to scale the combined value
    const logit = (MODEL_COEFFICIENTS.randomForest * rfProb + MODEL_COEFFICIENTS.xgboost * xgbProb) / 10;
    return 1 / (1 + Math.exp(-logit));
  };

  /**
   * Determine the key drivers of the prediction
   */
  const determineKeyDrivers = (data: ChurnPredictionData): string[] => {
    const drivers: Array<{factor: string; impact: number}> = [];
    
    // Calculate impact scores for each factor
    if (data.complaints > 0) {
      drivers.push({
        factor: "Customer Complaints",
        impact: RF_WEIGHTS.complaints * MODEL_COEFFICIENTS.randomForest + 
                XGB_WEIGHTS.complaints * MODEL_COEFFICIENTS.xgboost
      });
    }
    
    drivers.push({
      factor: "Cashback Rewards",
      impact: (data.cashbackAmount / 1000) * 
              (RF_WEIGHTS.cashbackAmount * MODEL_COEFFICIENTS.randomForest + 
               XGB_WEIGHTS.cashbackAmount * MODEL_COEFFICIENTS.xgboost)
    });
    
    drivers.push({
      factor: "Customer Tenure",
      impact: (data.tenure / 80) * 
              (RF_WEIGHTS.tenure * MODEL_COEFFICIENTS.randomForest + 
               XGB_WEIGHTS.tenure * MODEL_COEFFICIENTS.xgboost)
    });
    
    drivers.push({
      factor: "Satisfaction Score",
      impact: (data.satisfactionScore / 15) * 
              (RF_WEIGHTS.satisfactionScore * MODEL_COEFFICIENTS.randomForest + 
               XGB_WEIGHTS.satisfactionScore * MODEL_COEFFICIENTS.xgboost)
    });
    
    if (data.cityTier !== 1) {
      drivers.push({
        factor: "City Tier",
        impact: ((3 - data.cityTier) / 3) * 
                (RF_WEIGHTS.cityTier * MODEL_COEFFICIENTS.randomForest + 
                 XGB_WEIGHTS.cityTier * MODEL_COEFFICIENTS.xgboost)
      });
    }
    
    if (data.purchasedMobile) {
      drivers.push({
        factor: "Mobile Purchase Activity",
        impact: RF_WEIGHTS.mobile * MODEL_COEFFICIENTS.randomForest + 
                XGB_WEIGHTS.mobile * MODEL_COEFFICIENTS.xgboost
      });
    }
    
    if (data.purchasedLaptopAccessory) {
      drivers.push({
        factor: "Tech Product Purchases",
        impact: RF_WEIGHTS.laptopAccessory * MODEL_COEFFICIENTS.randomForest + 
                XGB_WEIGHTS.laptopAccessory * MODEL_COEFFICIENTS.xgboost
      });
    }
    
    // Sort by absolute impact value (regardless of direction)
    drivers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    
    // Return top 3 drivers
    return drivers.slice(0, 3).map(d => d.factor);
  };

  // Generate recommendations based on inputs and model results
  const generateRecommendations = (data: ChurnPredictionData, probability: number): string[] => {
    const recommendations: string[] = [];
    
    // Recommendations based on high-impact features
    if (data.complaints > 0) {
      recommendations.push("Address customer complaints promptly to improve satisfaction");
    }
    
    if (data.satisfactionScore < 7) {
      recommendations.push("Implement customer experience improvement initiatives");
    }
    
    if (data.cashbackAmount < 200) {
      recommendations.push("Consider increasing cashback rewards for this customer");
    }
    
    if (data.tenure < 12) {
      recommendations.push("Create special retention offers for new customers in their first year");
    }
    
    if (!data.purchasedLaptopAccessory && !data.purchasedMobile) {
      recommendations.push("Offer personalized tech product promotions");
    }
    
    if (!data.purchasedGrocery) {
      recommendations.push("Introduce grocery product offerings to this customer");
    }
    
    if (data.cityTier > 1) {
      recommendations.push("Develop targeted promotions for customers in Tier " + data.cityTier + " cities");
    }
    
    // Add general recommendations based on risk level
    if (probability > HIGH_RISK_THRESHOLD) {
      recommendations.push("Implement immediate retention strategy including personalized outreach");
    } else if (probability > MEDIUM_RISK_THRESHOLD) {
      recommendations.push("Schedule regular check-ins and satisfaction surveys");
    } else {
      recommendations.push("Continue providing excellent service to maintain customer loyalty");
    }
    
    // Ensure we have unique recommendations and limit to a reasonable number
    const uniqueRecommendations = Array.from(new Set(recommendations));
    return uniqueRecommendations.slice(0, 5);
  };

  // Main prediction function
  const makePrediction = async (data: ChurnPredictionData): Promise<ChurnPredictionResult> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Calculate probabilities from each model with updated weights
      const rfProbability = calculateRandomForestProbability(data);
      const xgbProbability = calculateXGBoostProbability(data);
      
      // Apply updated meta-model to get final prediction
      const finalProbability = metaModelPrediction(rfProbability, xgbProbability);
      
      // Determine risk level
      let churnRisk: "low" | "medium" | "high";
      if (finalProbability > HIGH_RISK_THRESHOLD) {
        churnRisk = "high";
      } else if (finalProbability > MEDIUM_RISK_THRESHOLD) {
        churnRisk = "medium";
      } else {
        churnRisk = "low";
      }
      
      // Generate key drivers
      const keyDrivers = determineKeyDrivers(data);
      
      // Generate recommendations
      const recommendations = generateRecommendations(data, finalProbability);
      
      return {
        churnProbability: finalProbability,
        churnRisk,
        recommendations,
        keyDrivers
      };
    } finally {
      setIsLoading(false);
    }
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
