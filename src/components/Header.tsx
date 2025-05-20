
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, MapPin, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LocationForm from './LocationForm';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center space-x-1">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">Survival Bubble</h1>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location.city ? `${user.location.city}, ${user.location.state}` : "Set Location"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Your Location</DialogTitle>
                </DialogHeader>
                <LocationForm />
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center gap-1 text-sm">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
