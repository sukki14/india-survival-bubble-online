
import { db } from './config';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { DisasterAlert, EmergencyContact, Resource, CommunityMessage, ChecklistItem, Location } from "@/types";

// Collection references
const emergencyContactsCollection = collection(db, 'emergencyContacts');
const communityMessagesCollection = collection(db, 'communityMessages');
const checklistItemsCollection = collection(db, 'checklistItems');
const resourcesCollection = collection(db, 'resources');
const disastersCollection = collection(db, 'disasters');

// Emergency contacts
export const getEmergencyContacts = async (userId: string) => {
  const q = query(emergencyContactsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyContact));
};

export const addEmergencyContact = async (userId: string, contact: Omit<EmergencyContact, "id">) => {
  const newContact = { ...contact, userId };
  const docRef = await addDoc(emergencyContactsCollection, newContact);
  return { id: docRef.id, ...newContact } as EmergencyContact;
};

export const removeEmergencyContact = async (id: string) => {
  await deleteDoc(doc(emergencyContactsCollection, id));
};

// Community messages
export const getCommunityMessages = async () => {
  const snapshot = await getDocs(communityMessagesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityMessage));
};

export const addCommunityMessage = async (message: Omit<CommunityMessage, "id" | "timestamp">) => {
  const newMessage = { ...message, timestamp: serverTimestamp() };
  const docRef = await addDoc(communityMessagesCollection, newMessage);
  return { id: docRef.id, ...newMessage, timestamp: new Date().toISOString() } as CommunityMessage;
};

// Checklist items
export const getChecklistItems = async (userId: string, disasterType?: string) => {
  let q = query(checklistItemsCollection, where("userId", "==", userId));
  
  if (disasterType) {
    q = query(q, where("disasterType", "==", disasterType));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChecklistItem));
};

export const toggleChecklistItem = async (id: string, isCompleted: boolean) => {
  const itemRef = doc(checklistItemsCollection, id);
  await updateDoc(itemRef, { isCompleted });
};

export const addChecklistItem = async (userId: string, item: Omit<ChecklistItem, "id">) => {
  const newItem = { ...item, userId };
  const docRef = await addDoc(checklistItemsCollection, newItem);
  return { id: docRef.id, ...newItem } as ChecklistItem;
};

// Resources
export const getResources = async (location?: Location) => {
  const snapshot = await getDocs(resourcesCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        address: data.location.address
      }
    } as Resource;
  });
};

// Disasters
export const getDisasters = async () => {
  const snapshot = await getDocs(disastersCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp instanceof Timestamp ? 
        data.timestamp.toDate().toISOString() : 
        data.timestamp
    } as DisasterAlert;
  });
};

export const getLocalDisasters = async (location: Location) => {
  // In a real app, you would use geolocation queries
  // For now, we'll filter based on state/city strings
  const disasters = await getDisasters();
  
  if (!location.state) return [];
  
  return disasters.filter(disaster => 
    disaster.location.toLowerCase().includes(location.state.toLowerCase()) ||
    disaster.location.toLowerCase().includes(location.city.toLowerCase())
  );
};
