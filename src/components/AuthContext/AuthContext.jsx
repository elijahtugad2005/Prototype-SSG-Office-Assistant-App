// context/AuthContext.jsx
// PURPOSE: Manages user authentication state across the entire app
// FUNCTIONS:
//   - Tracks if user is logged in
//   - Stores user data (email, role, name)
//   - Provides login/logout/signup functions to all components

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from "../../firebase/firebaseConfig.js";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Create context to share auth data across app
const AuthContext = createContext();

// Custom hook to easily access auth data in any component
export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========================================
  // SIGNUP FUNCTION
  // Creates new user account and stores role in Firestore
  // ========================================
  const signup = async (email, password, name, role) => {
    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        name: name,
        role: role, // admin, secretary, representative
        createdAt: new Date().toISOString(),
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // ========================================
  // LOGIN FUNCTION
  // Authenticates user and fetches their role from Firestore
  // ========================================
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // ========================================
  // LOGOUT FUNCTION
  // Signs out user and clears auth state
  // ========================================
  const logout = () => {
    return signOut(auth);
  };

  // ========================================
  // AUTH STATE LISTENER
  // Runs on app load and whenever auth state changes
  // Automatically fetches user role from Firestore
  // ========================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is logged in, fetch their role
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        // User is logged out
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);




  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed - User:', user);
    setCurrentUser(user);
    
    if (user) {
      try {
        console.log('Fetching user data for UID:', user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log('User document exists:', userDoc.exists());
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData);
          console.log('User role:', userData.role);
          setUserRole(userData.role);
        } else {
          console.log('No user document found for UID:', user.uid);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    } else {
      console.log('No user logged in');
      setUserRole(null);
    }
    
    setLoading(false);
  });

  return unsubscribe;
}, []);



  // Values accessible to all components via useAuth()
  const value = {
    currentUser,      // Firebase user object
    userRole,         // 'admin', 'secretary', or 'representative'
    login,            // Function to log in
    signup,           // Function to create account
    logout,           // Function to log out
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );




  
}

