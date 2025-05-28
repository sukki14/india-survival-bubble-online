
import { DisasterAlert, EmergencyContact, Resource, CommunityMessage, ChecklistItem, Location } from "@/types";

export interface DataContextType {
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
