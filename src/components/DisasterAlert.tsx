
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DisasterAlert as DisasterAlertType } from "@/types";
import { AlertCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface DisasterAlertProps {
  alert: DisasterAlertType;
  onViewDetails?: (alert: DisasterAlertType) => void;
}

const DisasterAlert: React.FC<DisasterAlertProps> = ({ alert, onViewDetails }) => {
  // Format the timestamp
  const timeAgo = formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true });
  
  // Determine severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600 hover:bg-red-700';
      case 'medium':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'low':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <Card className={`border-l-4 ${alert.severity === 'high' ? 'border-l-red-600 alert-blink' : 
      alert.severity === 'medium' ? 'border-l-orange-500' : 'border-l-yellow-500'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
              {alert.type}
            </CardTitle>
            <CardDescription>{alert.location}</CardDescription>
          </div>
          <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
            {alert.severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{alert.description}</p>
        <p className="text-xs mt-2 text-muted-foreground">{timeAgo}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails?.(alert)}
        >
          View Details & Instructions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DisasterAlert;
