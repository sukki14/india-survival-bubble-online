
import { ChecklistItem } from "@/types";
import * as FirebaseService from "@/firebase/services";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { SAMPLE_CHECKLISTS } from "./sampleData";

export const useChecklistService = (userId: string | undefined) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Checklist management
  const getChecklistForDisaster = async (disasterType: string): Promise<ChecklistItem[]> => {
    try {
      if (!userId) {
        // Return sample checklist for non-authenticated users
        return SAMPLE_CHECKLISTS[disasterType] || [];
      }
      
      // Get user-specific checklist
      const userItems = await FirebaseService.getChecklistItems(userId, disasterType);
      
      // If user has items, return those, otherwise create from sample
      if (userItems.length > 0) {
        return userItems;
      }
      
      // If no items exist for this disaster type, create them from sample
      const sampleItems = SAMPLE_CHECKLISTS[disasterType] || [];
      const newItems: ChecklistItem[] = [];
      
      // Add sample items to Firebase and state
      for (const item of sampleItems) {
        const newItem = await FirebaseService.addChecklistItem(userId, {
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

  // Load checklist items
  const loadChecklistItems = async () => {
    if (!userId) {
      setChecklistItems([]);
      return;
    }
    
    try {
      const items = await FirebaseService.getChecklistItems(userId);
      setChecklistItems(items);
    } catch (error) {
      console.error("Error loading checklist items:", error);
      setChecklistItems([]);
    }
  };

  return {
    checklistItems,
    setChecklistItems,
    getChecklistForDisaster,
    toggleChecklistItem,
    loadChecklistItems
  };
};
