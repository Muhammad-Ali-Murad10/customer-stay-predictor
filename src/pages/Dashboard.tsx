
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePrediction } from '@/contexts/PredictionContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, LogOut, Users, UserCheck, UserX, Activity, CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DateRangePicker from '@/components/DateRangePicker';
import ChurnRateChart from '@/components/ChurnRateChart';
import SatisfactionChart from '@/components/SatisfactionChart';
import { churnRateData, satisfactionData } from '@/data/chartData';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { customerData } = usePrediction();
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  const [startMonth, setStartMonth] = useState(0); // January
  const [endMonth, setEndMonth] = useState(11); // December

  const atRiskPercentage = Math.round((customerData.atRiskCustomers / customerData.totalCustomers) * 100);
  const loyalPercentage = Math.round((customerData.loyalCustomers / customerData.totalCustomers) * 100);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <header className="bg-primary text-white shadow-md w-full">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart className="h-6 w-6" />
              <h1 className="text-xl font-bold">ShopIQ Analytics</h1>
              <Badge variant="secondary" className="ml-2">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline-block">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" className="text-primary-foreground" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-1" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8 opacity-100">
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to ShopIQ Analytics</CardTitle>
              <CardDescription>
                Your e-commerce customer retention platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                ShopIQ is a growing e-commerce platform that helps businesses retain customers through
                data-driven insights and predictive analytics. Our ML-powered churn prediction tool
                helps you identify at-risk customers before they leave, enabling proactive retention strategies.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/predict')} disabled={isLoading}>
                  Start New Prediction
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Customers */}
          <Card className="card-hover border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {customerData.totalCustomers.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Active e-commerce customers
              </p>
            </CardContent>
          </Card>

          {/* Loyal Customers */}
          <Card className="card-hover border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-success" />
                Loyal Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {customerData.loyalCustomers.toLocaleString()}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{loyalPercentage}% of total</span>
                </div>
                <Progress value={loyalPercentage} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* At-Risk Customers */}
          <Card className="card-hover border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UserX className="h-5 w-5 mr-2 text-danger" />
                At-Risk Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-danger">
                {customerData.atRiskCustomers.toLocaleString()}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{atRiskPercentage}% of total</span>
                </div>
                <Progress value={atRiskPercentage} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Activity */}
        <section className="opacity-100">
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Analytics Overview
              </CardTitle>
              <CardDescription className="flex items-center">
                <CalendarRange className="h-4 w-4 mr-1.5" />
                Customer retention insights and churn prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Date Range Picker */}
                <DateRangePicker 
                  startMonth={startMonth}
                  endMonth={endMonth}
                  onStartMonthChange={setStartMonth}
                  onEndMonthChange={setEndMonth}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-muted/50 border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Churn Rate Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ChurnRateChart 
                        data={churnRateData} 
                        startMonth={startMonth} 
                        endMonth={endMonth} 
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50 border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Customer Satisfaction
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <SatisfactionChart 
                        data={satisfactionData} 
                        startMonth={startMonth} 
                        endMonth={endMonth} 
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => navigate('/predict')}>
                    Run New Prediction Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
