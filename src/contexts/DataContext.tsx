import React, { createContext, useState, useContext, useEffect } from "react";
import { DisasterAlert, EmergencyContact, Resource, CommunityMessage, ChecklistItem, Location } from "@/types";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import * as FirebaseService from "../firebase/services";

// Sample disaster data for India - will later be moved to Firestore
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

// Sample resources data - will later be moved to Firestore
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

// Sample checklist data - will later be moved to Firestore
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
  getLocalDisasters: (location: Location) => Promise<DisasterAlert[]>;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => Promise<void>;
  removeEmergencyContact: (id: string) => Promise<void>;
  resources: Resource[];
  communityMessages: CommunityMessage[];
  addCommunityMessage: (message: string, userName: string, location: string) => Promise<void>;
  checklistItems: ChecklistItem[];
  getChecklistForDisaster: (disasterType: string) => Promise<ChecklistItem[]>;
  toggleChecklistItem: (id: string) => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeDisasters, setActiveDisasters] = useState<DisasterAlert[]>(INDIA_DISASTERS);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [resources, setResources] = useState<Resource[]>(SAMPLE_RESOURCES);
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Firebase when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setEmergencyContacts([]);
        setCommunityMessages([]);
        setChecklistItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Load disasters
        const disasters = await FirebaseService.getDisasters();
        setActiveDisasters(disasters.length > 0 ? disasters : INDIA_DISASTERS);

        // Load user-specific data
        if (user.id) {
          // Load emergency contacts
          const contacts = await FirebaseService.getEmergencyContacts(user.id);
          setEmergencyContacts(contacts);

          // Load checklist items
          const items = await FirebaseService.getChecklistItems(user.id);
          setChecklistItems(items);
        }

        // Load community messages (public)
        const messages = await FirebaseService.getCommunityMessages();
        setCommunityMessages(messages);

        // Load resources (public)
        const fetchedResources = await FirebaseService.getResources();
        setResources(fetchedResources.length > 0 ? fetchedResources : SAMPLE_RESOURCES);

      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data. Using sample data instead.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Get disasters specific to user location
  const getLocalDisasters = async (location: Location): Promise<DisasterAlert[]> => {
    try {
      return await FirebaseService.getLocalDisasters(location);
    } catch (error) {
      console.error("Error getting local disasters:", error);
      
      // Fallback to client-side filtering if Firebase call fails
      if (!location.state) return [];
      
      return activeDisasters.filter(disaster => 
        disaster.location.toLowerCase().includes(location.state.toLowerCase()) ||
        disaster.location.toLowerCase().includes(location.city.toLowerCase())
      );
    }
  };

  // Emergency contacts management
  const addEmergencyContact = async (contact: Omit<EmergencyContact, "id">) => {
    try {
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }
      
      const newContact = await FirebaseService.addEmergencyContact(user.id, contact);
      setEmergencyContacts(prevContacts => [...prevContacts, newContact]);
      toast.success("Emergency contact added!");
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact. Please try again.");
    }
  };

  const removeEmergencyContact = async (id: string) => {
    try {
      await FirebaseService.removeEmergencyContact(id);
      setEmergencyContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      toast.success("Emergency contact removed");
    } catch (error) {
      console.error("Error removing contact:", error);
      toast.error("Failed to remove contact. Please try again.");
    }
  };

  // Community messages
  const addCommunityMessage = async (message: string, userName: string, location: string) => {
    try {
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }
      
      const newMessage = await FirebaseService.addCommunityMessage({
        userId: user.id,
        userName,
        message,
        location
      });
      
      setCommunityMessages(prevMessages => [newMessage, ...prevMessages]);
      toast.success("Message posted to community!");
    } catch (error) {
      console.error("Error posting message:", error);
      toast.error("Failed to post message. Please try again.");
    }
  };

  // Checklist management
  const getChecklistForDisaster = async (disasterType: string): Promise<ChecklistItem[]> => {
    try {
      if (!user || !user.id) {
        // Return sample checklist for non-authenticated users
        return SAMPLE_CHECKLISTS[disasterType] || [];
      }
      
      // Get user-specific checklist
      const userItems = await FirebaseService.getChecklistItems(user.id, disasterType);
      
      // If user has items, return those, otherwise create from sample
      if (userItems.length > 0) {
        return userItems;
      }
      
      // If no items exist for this disaster type, create them from sample
      const sampleItems = SAMPLE_CHECKLISTS[disasterType] || [];
      const newItems: ChecklistItem[] = [];
      
      // Add sample items to Firebase and state
      for (const item of sampleItems) {
        const newItem = await FirebaseService.addChecklistItem(user.id, {
          task: item.task,
          isCompleted: false,
          disasterType
        });
        newItems.push(newItem);
      }
      
      // Update state
      setChecklistItems(prev => [...prev, ...newItems]);
      
      return newItems;
    } catch (error) {
      console.error("Error getting checklist:", error);
      // Fallback to sample data
      return SAMPLE_CHECKLISTS[disasterType] || [];
    }
  };

  const toggleChecklistItem = async (id: string) => {
    try {
      // Find the item to toggle
      const item = checklistItems.find(item => item.id === id);
      if (!item) return;
      
      // Update in Firebase
      await FirebaseService.toggleChecklistItem(id, !item.isCompleted);
      
      // Update state
      setChecklistItems(prevItems => 
        prevItems.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)
      );
    } catch (error) {
      console.error("Error toggling checklist item:", error);
      toast.error("Failed to update checklist. Please try again.");
    }
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
        toggleChecklistItem,
        isLoading
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
