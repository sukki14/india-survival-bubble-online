
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin } from "lucide-react";
import { Resource } from '@/types';

// This is a mock component that simulates a map
// In a real app, we would use a proper map library like Mapbox or Google Maps
const ResourceMap: React.FC = () => {
  const { resources } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'water' | 'shelter' | 'medical'>('all');
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter resources based on the active tab
    if (activeTab === 'all') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.type === activeTab));
    }
  }, [activeTab, resources]);

  // This would be where we initialize the map in a real app
  useEffect(() => {
    // Mock map initialization
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    // In a real app, we'd initialize a map here
    // For now, we'll just add a simple styling to simulate a map
    mapContainer.style.background = '#e8f4f8';
    mapContainer.style.position = 'relative';

    // Clean up function
    return () => {
      // Cleanup would happen here
    };
  }, []);

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

      <div className="relative" style={{ height: '280px' }}>
        {/* This would be a real map in production */}
        <div ref={mapContainerRef} className="h-full w-full">
          {/* Simulated map markers */}
          {filteredResources.map((resource) => (
            <div 
              key={resource.id}
              style={{
                position: 'absolute',
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="cursor-pointer"
            >
              <div 
                className="h-4 w-4 rounded-full animate-pulse relative"
                style={{ backgroundColor: getMarkerColor(resource.type) }}
              >
                <div 
                  className="absolute -inset-1 rounded-full opacity-30 animate-ping"
                  style={{ backgroundColor: getMarkerColor(resource.type) }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardContent className="p-4 bg-white">
        <div className="text-sm font-medium mb-2">Available Resources:</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredResources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">No resources of this type found.</p>
          ) : (
            filteredResources.map((resource) => (
              <div key={resource.id} className="flex items-start gap-3 p-2 rounded-md bg-accent/50">
                <div 
                  className="h-3 w-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: getMarkerColor(resource.type) }}
                ></div>
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
