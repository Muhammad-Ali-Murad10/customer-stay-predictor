
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
      recommendations: result.recommendations || generateRecommendations(data, result.probability)
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
  
  return recommendations.length > 0 ? recommendations : ["Continue monitoring customer behavior"];
};

/**
 * Fallback prediction in case API call fails
 * In production, consider more sophisticated offline models or caching
 */
const getFallbackPrediction = (data: ChurnPredictionData): ChurnPredictionResult => {
  // Simple scoring formula as fallback
  let score = 0.5; // Start at middle
  
  // Reduce score (less likely to churn) for positive factors
  score -= (data.tenure / 100); // Longer tenure = less likely to churn
  score -= (data.satisfactionScore / 20); // Higher satisfaction = less likely to churn
  score -= (data.cashbackAmount / 1000); // More cashback = less likely to churn
  
  // Increase score (more likely to churn) for negative factors
  score += (data.complaints / 10); // More complaints = more likely to churn
  
  // Ensure score is between 0 and 1
  score = Math.max(0, Math.min(1, score));
  
  return {
    churnProbability: score,
    churnRisk: getChurnRiskCategory(score),
    recommendations: generateRecommendations(data, score)
  };
};
