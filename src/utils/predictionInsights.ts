
import { ChurnPredictionData } from "@/types";
import { RF_WEIGHTS, XGB_WEIGHTS, MODEL_COEFFICIENTS, HIGH_RISK_THRESHOLD, MEDIUM_RISK_THRESHOLD } from "./predictionModels";

/**
 * Determine the key drivers of the prediction
 */
export const determineKeyDrivers = (data: ChurnPredictionData): string[] => {
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

/**
 * Generate recommendations based on inputs and model results
 */
export const generateRecommendations = (data: ChurnPredictionData, probability: number): string[] => {
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
