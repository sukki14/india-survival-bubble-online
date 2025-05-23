
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Location } from "@/types";
import { toast } from "@/components/ui/sonner";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserLocation: (location: Location) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Firebase user to our User type
const createUserProfile = async (firebaseUser: FirebaseUser, name?: string): Promise<User> => {
  // Check if user profile exists in Firestore
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (userDoc.exists()) {
    // Return existing user profile
    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || name || firebaseUser.email?.split('@')[0] || "User",
      email: userData.email || firebaseUser.email || "",
      location: userData.location || { city: "", state: "" }
    };
  } else {
    // Create new user profile
    const newUser: User = {
      id: firebaseUser.uid,
      name: name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
      email: firebaseUser.email || "",
      location: { city: "", state: "" }
    };
    
    // Save to Firestore
    await setDoc(userDocRef, newUser);
    
    return newUser;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      try {
        if (firebaseUser) {
          // User is signed in
          const userProfile = await createUserProfile(firebaseUser);
          setUser(userProfile);
        } else {
          // User is signed out
          setUser(null);
        }
      } catch (error) {
        console.error("Error processing authentication:", error);
        toast.error("Authentication error. Please try again.");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await createUserProfile(userCredential.user);
      setUser(userProfile);
      
      toast.success("Login successful!");
    } catch (error: any) {
      let errorMessage = "Login failed";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later";
      } else if (error.message) {
        errorMessage = `Login failed: ${error.message}`;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }
      
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userProfile = await createUserProfile(userCredential.user, name);
      setUser(userProfile);
      
      toast.success("Account created successfully!");
    } catch (error: any) {
      let errorMessage = "Signup failed";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak";
      } else if (error.message) {
        errorMessage = `Signup failed: ${error.message}`;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const updateUserLocation = async (location: Location) => {
    if (!user) return;
    
    try {
      // Update in Firestore
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, { location });
      
      // Update local state
      setUser({ ...user, location });
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
