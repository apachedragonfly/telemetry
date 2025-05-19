import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of our monitor state
interface VitalsState {
  hr: number;
  bp: { sys: number; dia: number };
  spo2: number;
  rr: number;
  rhythm: string;
}

// Define the context shape with state and updater functions
interface MonitorContextType {
  vitals: VitalsState;
  setVitals: React.Dispatch<React.SetStateAction<VitalsState>>;
  updateHR: (value: number) => void;
  updateBP: (sys: number, dia: number) => void;
  updateSpO2: (value: number) => void;
  updateRR: (value: number) => void;
  updateRhythm: (value: string) => void;
}

// Initial state with normal values
const initialVitals: VitalsState = {
  hr: 72,
  bp: { sys: 120, dia: 80 },
  spo2: 98,
  rr: 16,
  rhythm: 'NSR', // Normal Sinus Rhythm
};

// Create the context with a default undefined value
const MonitorContext = createContext<MonitorContextType | undefined>(undefined);

// Provider component that wraps app and makes context available
export function MonitorProvider({ children }: { children: ReactNode }) {
  const [vitals, setVitals] = useState<VitalsState>(initialVitals);

  // Helper functions to update specific vitals
  const updateHR = (value: number) => {
    setVitals(prev => ({ ...prev, hr: value }));
  };

  const updateBP = (sys: number, dia: number) => {
    setVitals(prev => ({ ...prev, bp: { sys, dia } }));
  };

  const updateSpO2 = (value: number) => {
    setVitals(prev => ({ ...prev, spo2: value }));
  };

  const updateRR = (value: number) => {
    setVitals(prev => ({ ...prev, rr: value }));
  };

  const updateRhythm = (value: string) => {
    setVitals(prev => ({ ...prev, rhythm: value }));
  };

  // Create the context value object
  const contextValue: MonitorContextType = {
    vitals,
    setVitals,
    updateHR,
    updateBP,
    updateSpO2,
    updateRR,
    updateRhythm,
  };

  return (
    <MonitorContext.Provider value={contextValue}>
      {children}
    </MonitorContext.Provider>
  );
}

// Custom hook to use the monitor context
export function useMonitor() {
  const context = useContext(MonitorContext);
  
  if (context === undefined) {
    throw new Error('useMonitor must be used within a MonitorProvider');
  }
  
  return context;
}

// Export initial values for testing or reset functionality
export { initialVitals }; 