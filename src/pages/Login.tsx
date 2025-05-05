
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ShoppingCart, BarChart, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="animate-enter w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 text-primary">
            <ShoppingCart className="h-8 w-8" />
            <span className="text-2xl font-bold">ShopIQ</span>
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Sign in to access your customer analytics dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  For demo: use "admin" and "password"
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-medium">ShopIQ Analytics</span>
          </p>
          <div className="flex justify-center mt-4 text-muted-foreground">
            <BarChart className="h-4 w-4 mx-1" />
            <ShoppingCart className="h-4 w-4 mx-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
