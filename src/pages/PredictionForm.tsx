import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, HelpCircle, Save, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrediction } from '@/contexts/PredictionContext';
import { ChurnPredictionData, ChurnPredictionResult } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generatePDF } from '@/utils/reportGenerator';
import { toast } from '@/hooks/use-toast';

const PredictionForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { makePrediction, isLoading } = usePrediction();
  
  const [formData, setFormData] = useState<ChurnPredictionData>({
    tenure: 12,
    complaints: 1,
    cashbackAmount: 150,
    satisfactionScore: 7,
    purchasedLaptopAccessory: false,
    purchasedGrocery: false,
    purchasedOtherProducts: true,
    purchasedMobile: false,
    cityTier: 2
  });
  
  const [predictionResult, setPredictionResult] = useState<ChurnPredictionResult | null>(null);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };

  const handleBooleanChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: parseInt(value)
    });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await makePrediction(formData);
    setPredictionResult(result);
  };

  const resetForm = () => {
    setPredictionResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart className="h-6 w-6" />
              <h1 className="text-xl font-bold">ShopIQ Analytics</h1>
            </div>
            <div>
              <span className="text-sm">Logged in as {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Customer Churn Prediction</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prediction Form */}
          <div className="lg:col-span-2 animate-enter">
            <Card>
              <CardHeader>
                <CardTitle>Customer Data Analysis</CardTitle>
                <CardDescription>
                  Enter customer details to predict churn probability
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tenure */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="tenure">Customer Tenure (months)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">How long the customer has been with your business (in months)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="tenure"
                        name="tenure"
                        type="number"
                        min="1"
                        max="120"
                        value={formData.tenure}
                        onChange={handleNumberChange}
                      />
                    </div>

                    {/* Complaints */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="complaints">Number of Complaints</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Number of complaints the customer has filed</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="complaints"
                        name="complaints"
                        type="number"
                        min="0"
                        max="20"
                        value={formData.complaints}
                        onChange={handleNumberChange}
                      />
                    </div>

                    {/* Cashback Amount */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cashbackAmount">Cashback Amount ($)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Total cashback amount received by the customer</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="cashbackAmount"
                        name="cashbackAmount"
                        type="number"
                        min="0"
                        max="1000"
                        value={formData.cashbackAmount}
                        onChange={handleNumberChange}
                      />
                    </div>

                    {/* City Tier */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cityTier">City Tier</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">The tier of the city where the customer resides. Tier 1 cities are the most developed.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={formData.cityTier.toString()}
                        onValueChange={(value) => handleSelectChange("cityTier", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Tier 1 (Metro)</SelectItem>
                          <SelectItem value="2">Tier 2 (City)</SelectItem>
                          <SelectItem value="3">Tier 3 (Town)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Satisfaction Score */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="satisfactionScore">Satisfaction Score</Label>
                      <span className="text-sm font-medium">{formData.satisfactionScore}/10</span>
                    </div>
                    <Slider
                      id="satisfactionScore"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.satisfactionScore]}
                      onValueChange={(value) => handleSliderChange("satisfactionScore", value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Dissatisfied</span>
                      <span>Very Satisfied</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Product Purchases */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Product Purchase History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="purchasedLaptopAccessory" className="cursor-pointer">
                          Purchased Laptop & Accessory
                        </Label>
                        <Switch
                          id="purchasedLaptopAccessory"
                          checked={formData.purchasedLaptopAccessory}
                          onCheckedChange={(checked) => handleBooleanChange("purchasedLaptopAccessory", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="purchasedGrocery" className="cursor-pointer">
                          Purchased Grocery
                        </Label>
                        <Switch
                          id="purchasedGrocery"
                          checked={formData.purchasedGrocery}
                          onCheckedChange={(checked) => handleBooleanChange("purchasedGrocery", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="purchasedOtherProducts" className="cursor-pointer">
                          Purchased Other Products
                        </Label>
                        <Switch
                          id="purchasedOtherProducts"
                          checked={formData.purchasedOtherProducts}
                          onCheckedChange={(checked) => handleBooleanChange("purchasedOtherProducts", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="purchasedMobile" className="cursor-pointer">
                          Purchased Mobile
                        </Label>
                        <Switch
                          id="purchasedMobile"
                          checked={formData.purchasedMobile}
                          onCheckedChange={(checked) => handleBooleanChange("purchasedMobile", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading || !predictionResult}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Predict Churn Risk"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Result panel */}
          <div className="lg:col-span-1">
            {predictionResult ? (
              <div className="animate-enter">
                <PredictionResult result={predictionResult} />
              </div>
            ) : (
              <Card className="bg-muted/50 h-full flex flex-col justify-center items-center p-8 text-center animate-enter">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Prediction Yet</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Fill out the form and click "Predict Churn Risk" to see the analysis.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Prediction Result Component
interface PredictionResultProps {
  result: ChurnPredictionResult;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getColor = () => {
    switch (result.churnRisk) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-emerald-500";
      default:
        return "text-primary";
    }
  };

  const getProgressColor = () => {
    const score = result.churnProbability;
    if (score > 0.7) return "bg-destructive";
    if (score > 0.4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleSaveAnalysis = async () => {
    if (!resultRef.current) return;
    
    try {
      setIsSaving(true);
      // Format date for filename
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const filename = `churn-analysis-${formattedDate}`;
      
      await generatePDF('prediction-result', filename);
      
      toast({
        title: "Analysis Saved",
        description: "Your churn prediction report has been downloaded.",
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: "Error Saving Analysis",
        description: "There was a problem creating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-lg" id="prediction-result" ref={resultRef}>
      <CardHeader className="pb-2">
        <CardTitle>Churn Prediction Result</CardTitle>
        <CardDescription>
          Based on the customer data analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-3">
          <div className="text-2xl font-bold mb-1 uppercase">
            <span className={getColor()}>
              {result.churnRisk === "high" ? "High Risk" : 
               result.churnRisk === "medium" ? "Medium Risk" : 
               "Low Risk"}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Churn Probability: {Math.round(result.churnProbability * 100)}%
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${getProgressColor()} transition-all duration-500 ease-in-out`}
            style={{ width: `${result.churnProbability * 100}%` }}
          />
        </div>

        <Separator />

        {/* Key Drivers Section */}
        <div>
          <h3 className="font-medium mb-3">Key Factors Influencing Risk</h3>
          <ul className="space-y-2">
            {result.keyDrivers.map((driver, i) => (
              <li key={i} className="flex items-center space-x-2 text-sm">
                <div className={`rounded-full ${i === 0 ? 'bg-destructive' : i === 1 ? 'bg-amber-500' : 'bg-primary'} h-5 w-5 flex items-center justify-center text-white text-xs shrink-0`}>
                  {i + 1}
                </div>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3">Recommended Actions</h3>
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, i) => (
              <li key={i} className="flex items-start space-x-2 text-sm">
                <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        <Alert className="bg-muted/50 border-muted">
          <AlertDescription className="text-xs text-muted-foreground">
            Prediction is based on an ensemble model combining Random Forest and XGBoost algorithms with logistic regression meta-modeling.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleSaveAnalysis}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Analysis"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
