'use client'
import React, { createContext, useContext, useMemo, useState } from 'react';

// Create a context for user data
const StoreContext = createContext();

// Custom hook for accessing user context
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {

    const [store, setStore] = useState({
        user: null,
        isAuthenticated: false,
    });

    // Function to update the store
    const updateStore = (newState) => {
        setStore((prevState) => ({ ...prevState, ...newState }));
    };

    const storeValue = useMemo(() => ({ store, updateStore }), [store, updateStore]);

    return (
        <StoreContext.Provider value={storeValue}>
            {children}
        </StoreContext.Provider>
    );
};
