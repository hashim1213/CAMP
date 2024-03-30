import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase-config'; // Ensure this path is correct
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Define loading state here

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once the user is fetched
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}> 
      {!loading && children}
    </AuthContext.Provider>
  );
};
