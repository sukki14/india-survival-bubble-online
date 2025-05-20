
import React, { createContext, useState, useContext, useEffect } from "react";
import { DisasterAlert, EmergencyContact, Resource, CommunityMessage, ChecklistItem, Location } from "@/types";
import { toast } from "@/components/ui/sonner";

// Sample disaster data for India
const INDIA_DISASTERS: DisasterAlert[] = [
  {
    id: "da1",
    type: "Flood",
    severity: "high",
    location: "Mumbai, Maharashtra",
    timestamp: new Date().toISOString(),
    description: "Heavy rainfall causing severe flooding in multiple areas of Mumbai. Local authorities advise staying indoors.",
    instructions: [
      "Move to higher ground immediately",
      "Avoid walking or driving through flood waters",
      "Follow evacuation orders if issued",
      "Keep emergency supplies ready"
    ]
  },
  {
    id: "da2",
    type: "Cyclone",
    severity: "high",
    location: "Chennai, Tamil Nadu",
    timestamp: new Date().toISOString(),
    description: "Cyclone approaching the eastern coast. Expected to make landfall within 24 hours.",
    instructions: [
      "Secure loose items outside your home",
      "Stay indoors and away from windows",
      "Keep battery-powered radio for updates",
      "Prepare emergency kit with food, water and medicines"
    ]
  },
  {
    id: "da3",
    type: "Earthquake",
    severity: "medium",
    location: "Delhi NCR",
    timestamp: new Date().toISOString(),
    description: "5.2 magnitude earthquake detected. Aftershocks possible in the coming hours.",
    instructions: [
      "Drop, cover, and hold on",
      "Stay away from buildings and power lines",
      "Check for injuries and damage",
      "Be prepared for aftershocks"
    ]
  },
  {
    id: "da4",
    type: "Heatwave",
    severity: "medium",
    location: "Rajasthan",
    timestamp: new Date().toISOString(),
    description: "Extreme temperatures exceeding 45°C expected for the next 5 days.",
    instructions: [
      "Stay hydrated and drink plenty of water",
      "Avoid going outside during peak hours (11am-4pm)",
      "Wear light-colored loose clothing",
      "Check on elderly neighbors and vulnerable individuals"
    ]
  },
  {
    id: "da5",
    type: "Landslide",
    severity: "high",
    location: "Shimla, Himachal Pradesh",
    timestamp: new Date().toISOString(),
    description: "Heavy rainfall has triggered landslides in multiple locations. Roads blocked and evacuations in progress.",
    instructions: [
      "Evacuate the area immediately if advised",
      "Watch for signs like cracking trees, soil, or rocks",
      "Listen for unusual sounds that might indicate moving debris",
      "Contact local emergency services if stranded"
    ]
  }
];

// Sample resources data
const SAMPLE_RESOURCES: Resource[] = [
  {
    id: "r1",
    type: "shelter",
    name: "Government High School Shelter",
    description: "Temporary shelter with capacity for 500 people",
    location: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: "Sector 4, New Delhi"
    },
    availability: "high"
  },
  {
    id: "r2",
    type: "food",
    name: "Community Kitchen",
    description: "Hot meals available 3 times daily",
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: "Near India Gate, New Delhi"
    },
    availability: "medium"
  },
  {
    id: "r3",
    type: "medical",
    name: "Emergency Medical Camp",
    description: "Basic medical aid and supplies",
    location: {
      latitude: 28.6692,
      longitude: 77.4538,
      address: "Sector 62, Noida"
    },
    availability: "high"
  },
  {
    id: "r4",
    type: "water",
    name: "Water Distribution Center",
    description: "Clean drinking water available",
    location: {
      latitude: 28.5355,
      longitude: 77.3910,
      address: "Sector 18, Noida"
    },
    availability: "low"
  }
];

// Sample checklist data
const SAMPLE_CHECKLISTS: Record<string, ChecklistItem[]> = {
  "Flood": [
    { id: "c1", task: "Move valuables to higher levels", isCompleted: false, disasterType: "Flood" },
    { id: "c2", task: "Prepare emergency kit with food, water, and medications", isCompleted: false, disasterType: "Flood" },
    { id: "c3", task: "Disconnect electrical appliances", isCompleted: false, disasterType: "Flood" },
    { id: "c4", task: "Fill bathtub and containers with clean water", isCompleted: false, disasterType: "Flood" },
    { id: "c5", task: "Keep important documents in waterproof container", isCompleted: false, disasterType: "Flood" }
  ],
  "Cyclone": [
    { id: "c6", task: "Secure loose items in your yard/balcony", isCompleted: false, disasterType: "Cyclone" },
    { id: "c7", task: "Cover windows with storm shutters or plywood", isCompleted: false, disasterType: "Cyclone" },
    { id: "c8", task: "Charge mobile phones and power banks", isCompleted: false, disasterType: "Cyclone" },
    { id: "c9", task: "Prepare emergency lighting (torches, candles)", isCompleted: false, disasterType: "Cyclone" },
    { id: "c10", task: "Store extra drinking water", isCompleted: false, disasterType: "Cyclone" }
  ],
  "Earthquake": [
    { id: "c11", task: "Identify safe spots in each room (under sturdy furniture)", isCompleted: false, disasterType: "Earthquake" },
    { id: "c12", task: "Secure heavy furniture to walls", isCompleted: false, disasterType: "Earthquake" },
    { id: "c13", task: "Keep emergency whistle accessible", isCompleted: false, disasterType: "Earthquake" },
    { id: "c14", task: "Know how to shut off gas/water/electricity", isCompleted: false, disasterType: "Earthquake" },
    { id: "c15", task: "Prepare first aid kit", isCompleted: false, disasterType: "Earthquake" }
  ],
  "Heatwave": [
    { id: "c16", task: "Stock up on oral rehydration salts (ORS)", isCompleted: false, disasterType: "Heatwave" },
    { id: "c17", task: "Prepare cooling arrangements (fans, ice, damp cloths)", isCompleted: false, disasterType: "Heatwave" },
    { id: "c18", task: "Plan daily activities to avoid midday heat", isCompleted: false, disasterType: "Heatwave" },
    { id: "c19", task: "Keep emergency contact numbers ready", isCompleted: false, disasterType: "Heatwave" },
    { id: "c20", task: "Check on elderly neighbors and vulnerable people", isCompleted: false, disasterType: "Heatwave" }
  ],
  "Landslide": [
    { id: "c21", task: "Know evacuation routes from your area", isCompleted: false, disasterType: "Landslide" },
    { id: "c22", task: "Prepare emergency go-bag", isCompleted: false, disasterType: "Landslide" },
    { id: "c23", task: "Monitor local news for warnings", isCompleted: false, disasterType: "Landslide" },
    { id: "c24", task: "Keep important documents ready for quick evacuation", isCompleted: false, disasterType: "Landslide" },
    { id: "c25", task: "Have a family emergency plan", isCompleted: false, disasterType: "Landslide" }
  ]
};

interface DataContextType {
  activeDisasters: DisasterAlert[];
  getLocalDisasters: (location: Location) => DisasterAlert[];
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (id: string) => void;
  resources: Resource[];
  communityMessages: CommunityMessage[];
  addCommunityMessage: (message: string, userName: string, location: string) => void;
  checklistItems: ChecklistItem[];
  getChecklistForDisaster: (disasterType: string) => ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDisasters, setActiveDisasters] = useState<DisasterAlert[]>(INDIA_DISASTERS);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [resources, setResources] = useState<Resource[]>(SAMPLE_RESOURCES);
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedContacts = localStorage.getItem("emergencyContacts");
    if (storedContacts) {
      setEmergencyContacts(JSON.parse(storedContacts));
    }

    const storedMessages = localStorage.getItem("communityMessages");
    if (storedMessages) {
      setCommunityMessages(JSON.parse(storedMessages));
    }

    const storedChecklist = localStorage.getItem("checklistItems");
    if (storedChecklist) {
      setChecklistItems(JSON.parse(storedChecklist));
    }
  }, []);

  // Get disasters specific to user location
  const getLocalDisasters = (location: Location): DisasterAlert[] => {
    if (!location.state) return [];
    
    // Filter disasters by state (in a real app this would be more precise)
    return activeDisasters.filter(disaster => 
      disaster.location.toLowerCase().includes(location.state.toLowerCase()) ||
      disaster.location.toLowerCase().includes(location.city.toLowerCase())
    );
  };

  // Emergency contacts management
  const addEmergencyContact = (contact: Omit<EmergencyContact, "id">) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: "ec_" + Math.random().toString(36).substring(2, 9)
    };
    
    const updatedContacts = [...emergencyContacts, newContact];
    setEmergencyContacts(updatedContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts));
    toast.success("Emergency contact added!");
  };

  const removeEmergencyContact = (id: string) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== id);
    setEmergencyContacts(updatedContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts));
    toast.success("Emergency contact removed");
  };

  // Community messages
  const addCommunityMessage = (message: string, userName: string, location: string) => {
    const newMessage: CommunityMessage = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      userId: "user_" + Math.random().toString(36).substring(2, 9),
      userName,
      message,
      timestamp: new Date().toISOString(),
      location
    };
    
    const updatedMessages = [newMessage, ...communityMessages];
    setCommunityMessages(updatedMessages);
    localStorage.setItem("communityMessages", JSON.stringify(updatedMessages));
    toast.success("Message posted to community!");
  };

  // Checklist management
  const getChecklistForDisaster = (disasterType: string): ChecklistItem[] => {
    // First check if user has saved checklist items
    const userItems = checklistItems.filter(item => item.disasterType === disasterType);
    
    // If user has items, return those, otherwise return sample items
    if (userItems.length > 0) {
      return userItems;
    }
    
    // Return sample checklist or empty array if not found
    return SAMPLE_CHECKLISTS[disasterType] || [];
  };

  const toggleChecklistItem = (id: string) => {
    const updatedItems = checklistItems.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    
    setChecklistItems(updatedItems);
    localStorage.setItem("checklistItems", JSON.stringify(updatedItems));
  };

  return (
    <DataContext.Provider
      value={{
        activeDisasters,
        getLocalDisasters,
        emergencyContacts,
        addEmergencyContact,
        removeEmergencyContact,
        resources,
        communityMessages,
        addCommunityMessage,
        checklistItems,
        getChecklistForDisaster,
        toggleChecklistItem
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
