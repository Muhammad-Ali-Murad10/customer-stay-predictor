
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Mock login function - in a real app, this would call an API
  const login = async (username: string, password: string): Promise<boolean> => {
    // Basic validation
    if (!username || !password) {
      toast({
        title: "Login Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return false;
    }

    // For demo purposes - in production this would verify against a backend
    if (username === "admin" && password === "password") {
      const mockUser = {
        id: "1",
        username: "admin",
        name: "Admin User",
        role: "admin",
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      return true;
    }
    
    toast({
      title: "Login Failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
