import React, { createContext, useContext, useReducer } from 'react';
import { AuthReducer, initialState } from './AuthReducer';

const AuthStateContext = createContext();

export const useAuthState = () => useContext(AuthStateContext);

export const AuthProvider = ({ children }) => (
    <AuthStateContext.Provider value={useReducer(AuthReducer, initialState)}>
        {children}
    </AuthStateContext.Provider>
  );
