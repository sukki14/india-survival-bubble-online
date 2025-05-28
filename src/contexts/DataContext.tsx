
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import * as FirebaseService from "../firebase/services";
import { DataContextType } from "./data/types";
import { INDIA_DISASTERS } from "./data/sampleData";
import { useDisasterService } from "./data/disasterService";
import { useContactService } from "./data/contactService";
import { useCommunityService } from "./data/communityService";
import { useChecklistService } from "./data/checklistService";
import { useResourceService } from "./data/resourceService";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeDisasters, setActiveDisasters] = useState(INDIA_DISASTERS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize all services
  const { getLocalDisasters } = useDisasterService(activeDisasters);
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact, loadContacts } = useContactService(user?.id);
  const { communityMessages, addCommunityMessage, loadMessages } = useCommunityService(user?.id);
  const { checklistItems, getChecklistForDisaster, toggleChecklistItem, loadChecklistItems } = useChecklistService(user?.id);
  const { resources, loadResources } = useResourceService();

  // Load data from Firebase when user changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load disasters
        const disasters = await FirebaseService.getDisasters();
        setActiveDisasters(disasters.length > 0 ? disasters : INDIA_DISASTERS);

        if (user?.id) {
          // Load user-specific data in parallel
          await Promise.all([
            loadContacts(),
            loadChecklistItems()
          ]);
        }

        // Load public data in parallel
        await Promise.all([
          loadMessages(),
          loadResources()
        ]);

      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data. Using sample data instead.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

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
