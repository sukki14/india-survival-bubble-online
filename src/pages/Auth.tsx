
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LoginForm, SignupForm } from '@/components/AuthForms';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    navigate('/location');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/50 to-background flex flex-col">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center mb-8">
          <Bell className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Survival Bubble</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome to Survival Bubble</h1>
            <p className="text-muted-foreground">
              Your essential companion for disaster preparedness in India
            </p>
          </div>
          
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"}
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Survival Bubble India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Auth;
