import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { RhythmKey } from '../data/rhythmProfiles';
import rhythmProfiles from '../data/rhythmProfiles';

// Define the shape of our monitor state
interface VitalsState {
  hr: number;
  bp: { sys: number; dia: number };
  spo2: number;
  rr: number;
  rhythm: RhythmKey;
  ecgWaveType: string;  // Add waveform type values
  respWaveType: string;
  spo2WaveType: string;
  isManual: boolean;    // New flag to track if values are manually overridden
}

// Define the context shape with state and updater functions
interface MonitorContextType {
  vitals: VitalsState;
  setVitals: React.Dispatch<React.SetStateAction<VitalsState>>;
  updateHR: (value: number) => void;
  updateBP: (sys: number, dia: number) => void;
  updateSpO2: (value: number) => void;
  updateRR: (value: number) => void;
  updateRhythm: (value: RhythmKey) => void;
  setIsManual: (value: boolean) => void;
}

// Initial state with normal values using NSR profile
const initialProfile = rhythmProfiles['NSR'];
const initialVitals: VitalsState = {
  hr: initialProfile.hr,
  bp: { ...initialProfile.bp },
  spo2: initialProfile.spo2,
  rr: initialProfile.rr,
  rhythm: 'NSR',
  ecgWaveType: initialProfile.ecg,
  respWaveType: initialProfile.resp,
  spo2WaveType: initialProfile.spo2Wave,
  isManual: false,
};

// Create the context with a default undefined value
const MonitorContext = createContext<MonitorContextType | undefined>(undefined);

// Provider component that wraps app and makes context available
export function MonitorProvider({ children }: { children: ReactNode }) {
  const [vitals, setVitals] = useState<VitalsState>(initialVitals);

  // Helper functions to update specific vitals
  const updateHR = (value: number) => {
    setVitals(prev => ({ ...prev, hr: value, isManual: true }));
  };

  const updateBP = (sys: number, dia: number) => {
    setVitals(prev => ({ ...prev, bp: { sys, dia }, isManual: true }));
  };

  const updateSpO2 = (value: number) => {
    setVitals(prev => ({ ...prev, spo2: value, isManual: true }));
  };

  const updateRR = (value: number) => {
    setVitals(prev => ({ ...prev, rr: value, isManual: true }));
  };

  const updateRhythm = (value: RhythmKey) => {
    // When rhythm changes, update all vitals from the rhythm profile
    const profile = rhythmProfiles[value];
    
    setVitals({
      hr: profile.hr,
      bp: { ...profile.bp },
      spo2: profile.spo2,
      rr: profile.rr,
      rhythm: value,
      ecgWaveType: profile.ecg,
      respWaveType: profile.resp,
      spo2WaveType: profile.spo2Wave,
      isManual: false, // Reset manual flag when rhythm changes
    });
  };

  const setIsManual = (value: boolean) => {
    setVitals(prev => ({ ...prev, isManual: value }));
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
    setIsManual,
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