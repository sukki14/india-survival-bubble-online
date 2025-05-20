
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from '@/contexts/DataContext';
import { CheckCircle } from "lucide-react";

const DisasterChecklist: React.FC = () => {
  const { getChecklistForDisaster, toggleChecklistItem, activeDisasters } = useData();
  const [selectedDisasterType, setSelectedDisasterType] = useState<string>("Flood");
  
  // Get unique disaster types from active disasters
  const disasterTypes = useMemo(() => {
    const types = activeDisasters.map(d => d.type);
    // Add default types if not present
    const defaultTypes = ["Flood", "Cyclone", "Earthquake", "Heatwave", "Landslide"];
    return Array.from(new Set([...types, ...defaultTypes]));
  }, [activeDisasters]);
  
  // Get checklist items for selected disaster
  const checklistItems = useMemo(() => {
    return getChecklistForDisaster(selectedDisasterType);
  }, [selectedDisasterType, getChecklistForDisaster]);
  
  // Calculate progress
  const completedItems = checklistItems.filter(item => item.isCompleted).length;
  const progress = checklistItems.length > 0 
    ? Math.round((completedItems / checklistItems.length) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          <CardTitle>Disaster Preparedness Checklist</CardTitle>
        </div>
        <CardDescription>
          Stay prepared with essential tasks
        </CardDescription>
        
        <div className="mt-2">
          <Select 
            value={selectedDisasterType} 
            onValueChange={setSelectedDisasterType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select disaster type" />
            </SelectTrigger>
            <SelectContent>
              {disasterTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}% completed</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-3">
          {checklistItems.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No checklist items available for this type of disaster.
            </p>
          ) : (
            checklistItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-2">
                <Checkbox
                  id={item.id}
                  checked={item.isCompleted}
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className={`text-sm leading-tight ${
                    item.isCompleted ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item.task}
                </label>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterChecklist;
