
import { Resource } from "@/types";
import * as FirebaseService from "@/firebase/services";
import { useState } from "react";
import { SAMPLE_RESOURCES } from "./sampleData";

export const useResourceService = () => {
  const [resources, setResources] = useState<Resource[]>(SAMPLE_RESOURCES);

  // Load resources
  const loadResources = async () => {
    try {
      const fetchedResources = await FirebaseService.getResources();
      setResources(fetchedResources.length > 0 ? fetchedResources : SAMPLE_RESOURCES);
    } catch (error) {
      console.error("Error loading resources:", error);
      setResources(SAMPLE_RESOURCES);
    }
  };

  return {
    resources,
    setResources,
    loadResources
  };
};
