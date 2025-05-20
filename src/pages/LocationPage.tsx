
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocationForm from '@/components/LocationForm';
import { Bell } from 'lucide-react';

const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLocationSet = () => {
    navigate('/dashboard');
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
            <h1 className="text-2xl font-bold mb-2">Set Your Location</h1>
            <p className="text-muted-foreground">
              We need your location to provide relevant disaster alerts and resources
            </p>
          </div>
          
          <LocationForm onComplete={handleLocationSet} />
        </div>
      </main>
      
      <footer className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Survival Bubble India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LocationPage;
