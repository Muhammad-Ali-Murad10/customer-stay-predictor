
import { useState } from 'react';
import { ChurnPredictionData, ChurnPredictionResult } from "@/types";
import { 
  calculateRandomForestProbability, 
  calculateXGBoostProbability, 
  metaModelPrediction,
  HIGH_RISK_THRESHOLD,
  MEDIUM_RISK_THRESHOLD
} from "@/utils/predictionModels";
import { determineKeyDrivers, generateRecommendations } from "@/utils/predictionInsights";

export const usePredictionCalculation = () => {
  const [isLoading, setIsLoading] = useState(false);
  
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

  return {
    makePrediction,
    isLoading
  };
};
