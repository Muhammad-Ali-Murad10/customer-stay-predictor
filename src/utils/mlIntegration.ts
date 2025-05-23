
/**
 * This file contains utility functions for integrating with a real ML model.
 * In a production app, you would replace the mock prediction in PredictionContext
 * with an actual API call to your ML service.
 * 
 * Example integration with a ML model API:
 */

import { ChurnPredictionData, ChurnPredictionResult } from "@/types";

/**
 * Send customer data to ML model API and get prediction
 * @param data Customer data for prediction
 * @returns Prediction result from ML model
 */
export const getPredictionFromAPI = async (data: ChurnPredictionData): Promise<ChurnPredictionResult> => {
  try {
    // Example API call configuration
    const response = await fetch('https://your-ml-api-endpoint.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // Replace with your API key
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to get prediction from API');
    }
    
    const result = await response.json();
    
    // Transform API response to match our application's data structure
    return {
      churnProbability: result.probability,
      churnRisk: getChurnRiskCategory(result.probability),
      recommendations: result.recommendations || generateRecommendations(data, result.probability),
      keyDrivers: result.keyDrivers || determineKeyFactors(data) // Added missing keyDrivers property
    };
  } catch (error) {
    console.error('Error getting prediction:', error);
    
    // Fallback to local calculation in case of API failure
    return getFallbackPrediction(data);
  }
};

/**
 * Helper function to categorize churn risk based on probability
 */
const getChurnRiskCategory = (probability: number): "low" | "medium" | "high" => {
  if (probability < 0.4) return "low";
  if (probability < 0.7) return "medium";
  return "high";
};

/**
 * Generate recommendations based on customer data and churn probability
 * This is a fallback for when the API doesn't provide recommendations
 */
const generateRecommendations = (data: ChurnPredictionData, probability: number): string[] => {
  const recommendations: string[] = [];
  
  if (probability > 0.5) {
    if (data.complaints > 0) {
      recommendations.push("Address customer complaints promptly");
    }
    
    if (data.satisfactionScore < 7) {
      recommendations.push("Improve customer experience to boost satisfaction");
    }
    
    if (data.cashbackAmount < 200) {
      recommendations.push("Consider increasing cashback rewards");
    }
  }
  
  // Add more personalized recommendations based on product history
  if (!data.purchasedMobile) {
    recommendations.push("Offer mobile product promotions");
  }
  
  if (!data.purchasedLaptopAccessory) {
    recommendations.push("Suggest laptop accessories based on browsing history");
  }
  
  return recommendations.length > 0 ? recommendations : ["Continue monitoring customer behavior"];
};

/**
 * Determine key factors influencing the prediction
 */
const determineKeyFactors = (data: ChurnPredictionData): string[] => {
  const factors: string[] = [];
  
  // Add factors based on customer data with updated weight considerations
  if (data.complaints > 0) {
    factors.push("Customer Complaints");
  }
  
  if (data.tenure < 12) {
    factors.push("Short Customer Tenure");
  }
  
  if (data.satisfactionScore < 7) {
    factors.push("Low Satisfaction Score");
  }
  
  if (data.cashbackAmount < 200) {
    factors.push("Low Cashback Amount");
  }
  
  if (!data.purchasedLaptopAccessory) {
    factors.push("No Tech Product Purchases");
  }
  
  if (data.cityTier > 1) {
    factors.push("City Tier");
  }
  
  // Ensure we have at least some factors
  if (factors.length === 0) {
    factors.push("Overall Customer Profile");
  }
  
  // Return up to 3 key factors
  return factors.slice(0, 3);
};

/**
 * Fallback prediction in case API call fails
 * In production, consider more sophisticated offline models or caching
 */
const getFallbackPrediction = (data: ChurnPredictionData): ChurnPredictionResult => {
  // Updated scoring formula as fallback with new weights
  let score = 0.3; // Adjusted base score
  
  // Tenure has higher weight in new model
  score -= (data.tenure / 80) * 0.31;
  
  // Complaints have higher weight in new model
  score += (data.complaints * 0.39);
  
  // Satisfaction still important but less weight
  score -= (data.satisfactionScore / 15) * 0.10;
  
  // Cashback has less weight
  score -= (data.cashbackAmount / 1000) * 0.08;
  
  // Product purchases with adjusted weights
  score -= data.purchasedLaptopAccessory ? 0.03 : 0;
  score -= data.purchasedGrocery ? 0.04 : 0;
  score -= data.purchasedMobile ? 0.02 : 0;
  score -= data.purchasedOtherProducts ? 0.03 : 0;
  
  // City tier has less impact
  score += (3 - data.cityTier) / 3 * 0.004;
  
  // Ensure score is between 0 and 1
  score = Math.max(0, Math.min(1, score));
  
  return {
    churnProbability: score,
    churnRisk: getChurnRiskCategory(score),
    recommendations: generateRecommendations(data, score),
    keyDrivers: determineKeyFactors(data)
  };
};
