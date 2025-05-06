import { ChurnPredictionData } from "@/types";

// Updated feature weights from Random Forest model
export const RF_WEIGHTS = {
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
export const XGB_WEIGHTS = {
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
export const MODEL_COEFFICIENTS = {
  randomForest: 3.14200716,
  xgboost: 3.26506879
};

// Risk thresholds
export const HIGH_RISK_THRESHOLD = 0.7;
export const MEDIUM_RISK_THRESHOLD = 0.4;

/**
 * Calculate Random Forest probability
 * Higher weights increase or decrease churn risk based on impact direction
 */
export const calculateRandomForestProbability = (data: ChurnPredictionData): number => {
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
export const calculateXGBoostProbability = (data: ChurnPredictionData): number => {
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
export const metaModelPrediction = (rfProb: number, xgbProb: number): number => {
  // Using the formula with the new coefficients
  // Note: Coefficients are larger, so we need to scale the combined value
  const logit = (MODEL_COEFFICIENTS.randomForest * rfProb + MODEL_COEFFICIENTS.xgboost * xgbProb) / 10;
  return 1 / (1 + Math.exp(-logit));
};
