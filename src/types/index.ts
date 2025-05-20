
export interface User {
  id: string;
  name: string;
  email: string;
  location: Location;
}

export interface Location {
  city: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface DisasterAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
  description: string;
  instructions: string[];
}

export interface CommunityMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  location: string;
}

export interface Resource {
  id: string;
  type: 'food' | 'water' | 'shelter' | 'medical';
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  availability: 'high' | 'medium' | 'low';
}

export interface ChecklistItem {
  id: string;
  task: string;
  isCompleted: boolean;
  disasterType: string;
}
