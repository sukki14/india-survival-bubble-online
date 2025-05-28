
import { DisasterAlert, Location } from "@/types";
import * as FirebaseService from "@/firebase/services";
import { INDIA_DISASTERS } from "./sampleData";

export const useDisasterService = (activeDisasters: DisasterAlert[]) => {
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

  return {
    getLocalDisasters
  };
};
