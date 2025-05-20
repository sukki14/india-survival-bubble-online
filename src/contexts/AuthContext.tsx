
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Location } from "@/types";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserLocation: (location: Location) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user data in localStorage
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate login
      setIsLoading(true);
      
      // Simple validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user for now
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        location: {
          city: "",
          state: ""
        }
      };
      
      // Save to state and localStorage
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user creation
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        name,
        email,
        location: {
          city: "",
          state: ""
        }
      };
      
      // Save to state and localStorage
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Signup failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  const updateUserLocation = (location: Location) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
