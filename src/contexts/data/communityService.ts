
import { CommunityMessage } from "@/types";
import * as FirebaseService from "@/firebase/services";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export const useCommunityService = (userId: string | undefined) => {
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>([]);

  // Community messages
  const addCommunityMessage = async (message: string, userName: string, location: string) => {
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      const newMessage = await FirebaseService.addCommunityMessage({
        userId,
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

  // Load community messages
  const loadMessages = async () => {
    try {
      const messages = await FirebaseService.getCommunityMessages();
      setCommunityMessages(messages);
    } catch (error) {
      console.error("Error loading community messages:", error);
      setCommunityMessages([]);
    }
  };

  return {
    communityMessages,
    setCommunityMessages,
    addCommunityMessage,
    loadMessages
  };
};
