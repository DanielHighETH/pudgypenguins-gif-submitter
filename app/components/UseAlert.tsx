'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AlertContextProps {
  message: string;
  showMessage: (message: string) => void;
  clearMessage: () => void;
}

const AlertContext = createContext<AlertContextProps>({
  message: '',
  showMessage: () => {},
  clearMessage: () => {},
});

export const useAlert = () => useContext(AlertContext);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [message, setMessage] = useState('');

  const showMessage = (newMessage: string) => {
    setMessage(newMessage);
  };

  const clearMessage = () => {
    setMessage('');
  };

  return (
    <AlertContext.Provider value={{ message, showMessage, clearMessage }}>
      {children}
    </AlertContext.Provider>
  );
};
