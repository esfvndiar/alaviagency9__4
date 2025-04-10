// src/contexts/toastDefinitions.ts
import { createContext, useContext } from 'react';
import { ToastType } from '../components/Toast'; // Assuming ToastType is needed here, check Toast.tsx if error

// Interface for a single toast message
export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Interface for the context properties
export interface ToastContextProps {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

// Create the context
export const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
