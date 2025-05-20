
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DisasterAlert } from "@/types";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from 'date-fns';

interface DisasterDetailsProps {
  alert: DisasterAlert;
}

const DisasterDetails: React.FC<DisasterDetailsProps> = ({ alert }) => {
  // Format the timestamp
  const formattedTime = format(new Date(alert.timestamp), 'PPpp');

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
          <div>
            <CardTitle>{alert.type} Alert for {alert.location}</CardTitle>
            <CardDescription>Issued {formattedTime}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-sm">{alert.description}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Safety Instructions</h3>
          <ul className="space-y-2">
            {alert.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterDetails;
