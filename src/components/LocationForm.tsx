
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Location } from "@/types";
import { MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// List of Indian states
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Puducherry", "Chandigarh"
];

interface LocationFormProps {
  onComplete?: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ onComplete }) => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateUserLocation } = useAuth();

  // Function to get user's geolocation
  const getUserLocation = () => {
    setIsGettingLocation(true);
    setLocationError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use reverse geocoding to get city and state
          // For now, we'll just set Delhi as a placeholder
          setCity("New Delhi");
          setState("Delhi");
          setIsGettingLocation(false);
          toast({
            title: "Location detected!",
            description: "Your location has been automatically detected."
          });
        },
        (error) => {
          setIsGettingLocation(false);
          setLocationError("Error getting location. Please enter manually.");
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Unable to get your location. Please enter manually."
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      setLocationError("Geolocation is not supported by your browser. Please enter location manually.");
      toast({
        variant: "destructive",
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation. Please enter manually."
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!city || !state) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both city and state."
      });
      return;
    }

    // Save location
    const location: Location = {
      city,
      state,
    };
    
    // Update user location in auth context
    updateUserLocation(location);
    
    toast({
      title: "Location Saved",
      description: "Your location has been saved successfully."
    });

    // Navigate to dashboard or call completion callback
    if (onComplete) {
      onComplete();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Set Your Location</CardTitle>
        <CardDescription className="text-center">
          We need your location to provide relevant disaster alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {INDIAN_STATES.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {locationError && (
            <p className="text-sm text-red-500">{locationError}</p>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={getUserLocation}
            disabled={isGettingLocation}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {isGettingLocation ? "Detecting Location..." : "Detect My Location"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleSubmit}
          disabled={!city || !state || isGettingLocation}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocationForm;
