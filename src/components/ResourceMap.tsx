import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Cloud, Hospital, House } from "lucide-react";
import { Resource } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ResourceMap: React.FC = () => {
  const { resources } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'water' | 'shelter' | 'medical'>('all');
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);

  useEffect(() => {
    // Filter resources based on the active tab
    if (activeTab === 'all') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.type === activeTab));
    }
  }, [activeTab, resources]);

  // Sort resources by proximity to user's location
  useEffect(() => {
    if (user?.location?.coordinates) {
      const sortedResources = [...filteredResources].sort((a, b) => {
        const distA = calculateDistance(
          user.location.coordinates!.latitude,
          user.location.coordinates!.longitude,
          a.location.latitude,
          a.location.longitude
        );
        const distB = calculateDistance(
          user.location.coordinates!.latitude,
          user.location.coordinates!.longitude,
          b.location.latitude,
          b.location.longitude
        );
        return distA - distB;
      });
      setFilteredResources(sortedResources);
    }
  }, [filteredResources, user?.location?.coordinates]);

  // This would be where we initialize the map in a real app
  useEffect(() => {
    // Skip map initialization if no token
    if (!mapboxToken) return;
    
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    // For a real mapbox implementation, we would use:
    const initMap = async () => {
      try {
        // In production, this would be replaced with actual Mapbox initialization
        console.log("Initializing map with token:", mapboxToken);
        mapContainer.style.background = '#e8f4f8';
        mapContainer.style.position = 'relative';
        
        // Display a message in the map container
        const mapMessage = document.createElement('div');
        mapMessage.className = 'absolute inset-0 flex items-center justify-center text-center p-4';
        mapMessage.innerHTML = `<div>
          <p class="font-medium mb-2">Map Initialized!</p>
          <p class="text-sm text-muted-foreground">In a production environment, this would display a real Mapbox map with resource markers.</p>
        </div>`;
        mapContainer.appendChild(mapMessage);
        
        // Mock resource markers
        filteredResources.forEach((resource, index) => {
          setTimeout(() => {
            const marker = document.createElement('div');
            marker.className = 'absolute rounded-full animate-pulse';
            marker.style.width = '12px';
            marker.style.height = '12px';
            marker.style.backgroundColor = getMarkerColor(resource.type);
            marker.style.left = `${Math.random() * 80 + 10}%`;
            marker.style.top = `${Math.random() * 80 + 10}%`;
            mapContainer.appendChild(marker);
          }, index * 200);
        });
        
        setShowTokenInput(false);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      while (mapContainer.firstChild) {
        mapContainer.removeChild(mapContainer.firstChild);
      }
    };
  }, [mapboxToken, filteredResources]);

  const handleMapboxTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, we would validate the token
    console.log("Setting Mapbox token:", mapboxToken);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'food':
        return '#4caf50'; // Green
      case 'water':
        return '#2196f3'; // Blue
      case 'shelter':
        return '#ff9800'; // Orange
      case 'medical':
        return '#f44336'; // Red
      default:
        return '#9e9e9e'; // Grey
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'food':
        return <Cloud className="h-4 w-4 text-green-600" />;
      case 'water':
        return <Cloud className="h-4 w-4 text-blue-600" />;
      case 'shelter':
        return <House className="h-4 w-4 text-orange-600" />;
      case 'medical':
        return <Hospital className="h-4 w-4 text-red-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAvailabilityStyle = (availability: string) => {
    switch (availability) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-blue-500" />
          <CardTitle>Resource Map</CardTitle>
        </div>
        <CardDescription>
          Find nearby resources during emergencies
        </CardDescription>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 mb-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            <TabsTrigger value="shelter">Shelter</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      {showTokenInput ? (
        <div className="p-4">
          <form onSubmit={handleMapboxTokenSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Mapbox Token
              </label>
              <Input
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="Enter your Mapbox public token"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                For a real map, you need a Mapbox token. Get yours at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
              </p>
            </div>
            <Button type="submit" size="sm">Initialize Map</Button>
          </form>
        </div>
      ) : (
        <div className="relative" style={{ height: '280px' }}>
          <div ref={mapContainerRef} className="h-full w-full">
            {/* Map will be initialized here by useEffect */}
          </div>
        </div>
      )}

      <CardContent className="p-4 bg-white">
        <div className="text-sm font-medium mb-2">Available Resources:</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredResources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">No resources of this type found.</p>
          ) : (
            filteredResources.map((resource) => (
              <div key={resource.id} className="flex items-start gap-3 p-2 rounded-md bg-accent/50">
                <div className="mt-1 flex-shrink-0">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">{resource.name}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getAvailabilityStyle(resource.availability)}`}>
                      {resource.availability}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                  <p className="text-xs mt-0.5">{resource.location.address}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceMap;
