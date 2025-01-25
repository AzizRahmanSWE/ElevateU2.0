import React, { createContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { id: clerkId, isSignedIn } = useUser();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (isSignedIn && clerkId) {
      axios
        .get(`/api/users/getclerk/${clerkId}`)
        .then((res) => setUser(res.data.data))
        .catch((err) => console.error('Error Fetching user:', err));
    }
  }, [clerkId, isSignedIn]);

  return (
    <DataContext.Provider value={{ clerkId, user, setUser }}>
      {children}
    </DataContext.Provider>
  );
};