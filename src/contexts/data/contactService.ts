
import { EmergencyContact } from "@/types";
import * as FirebaseService from "@/firebase/services";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export const useContactService = (userId: string | undefined) => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Emergency contacts management
  const addEmergencyContact = async (contact: Omit<EmergencyContact, "id">) => {
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      const newContact = await FirebaseService.addEmergencyContact(userId, contact);
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

  // Load contacts
  const loadContacts = async () => {
    if (!userId) {
      setEmergencyContacts([]);
      return;
    }
    
    try {
      const contacts = await FirebaseService.getEmergencyContacts(userId);
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
      setEmergencyContacts([]);
    }
  };

  return {
    emergencyContacts,
    setEmergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
    loadContacts
  };
};
