import { useEffect, useRef } from 'react';
import { useMonitor, initialVitals } from '../context/MonitorContext';
import type { RhythmKey } from '../data/rhythmProfiles';
import rhythmProfiles from '../data/rhythmProfiles';

// Define normal ranges for all vital signs
const NORMAL_RANGES = {
  hr: { min: 60, max: 100, baselineVariation: 5 },
  spo2: { min: 95, max: 100, baselineVariation: 1 },
  rr: { min: 12, max: 20, baselineVariation: 2 },
  bp: { 
    sys: { min: 100, max: 140, baselineVariation: 5 },
    dia: { min: 60, max: 90, baselineVariation: 3 }
  }
};

// Define alert ranges for simulating abnormal conditions
const ALERT_RANGES = {
  hr: { min: 120, max: 150 },
  spo2: { min: 85, max: 91 },
  rr: { min: 25, max: 30 },
  bp: {
    sys: { min: 150, max: 180 },
    dia: { min: 95, max: 110 }
  }
};

/**
 * Hook that simulates vital sign fluctuations
 * @param updateInterval Time in ms between updates, defaults to 1000ms (1 second)
 * @param variationFactor Controls how much variation to apply (0-1)
 * @param abnormalFrequency Frequency of generating abnormal values (0-1)
 */
export function useVitalsSimulator(
  updateInterval = 1000,
  variationFactor = 0.5,
  abnormalFrequency = 0.05
) {
  const { vitals, setVitals } = useMonitor();
  
  // Use a ref for the simulation time to avoid re-renders affecting the calculation
  const simulationTimeRef = useRef(0);
  
  useEffect(() => {
    // Skip simulation if in manual mode
    if (vitals.isManual) {
      return;
    }

    // Generate a new value with small fluctuations based on the rhythm profile
    const generateValue = (
      current: number,
      baseValue: number,
      variance: number
    ) => {
      // Create slight random variation
      const randomComponent = (Math.random() - 0.5) * 2 * variance;
      
      // Create a sinusoidal variation for smoother changes (with a long period)
      const sinComponent = Math.sin(simulationTimeRef.current / 10) * variance;
      
      // Combine both variations
      let newValue = baseValue + randomComponent + sinComponent;
      
      // Ensure the value stays within a reasonable range of the base value
      const minAllowed = baseValue * 0.9;
      const maxAllowed = baseValue * 1.1;
      newValue = Math.max(minAllowed, Math.min(maxAllowed, newValue));
      
      // Round to whole number for most vitals
      return Math.round(newValue);
    };
    
    // Setup interval to update vitals
    const intervalId = setInterval(() => {
      // Update simulation time
      simulationTimeRef.current += 1;
      
      // Get the profile for the current rhythm
      const currentProfile = rhythmProfiles[vitals.rhythm as RhythmKey];
      
      // Update all vitals with slight variations around the profile values
      setVitals(prev => {
        // Skip if in manual mode
        if (prev.isManual) return prev;
        
        // Generate new heart rate
        const hr = generateValue(
          prev.hr,
          currentProfile.hr,
          NORMAL_RANGES.hr.baselineVariation * variationFactor
        );
        
        // Generate new SpO2
        const spo2 = generateValue(
          prev.spo2,
          currentProfile.spo2,
          NORMAL_RANGES.spo2.baselineVariation * variationFactor
        );
        
        // Generate new respiration rate
        const rr = generateValue(
          prev.rr,
          currentProfile.rr,
          NORMAL_RANGES.rr.baselineVariation * variationFactor
        );
        
        // Generate new blood pressure
        const sys = generateValue(
          prev.bp.sys,
          currentProfile.bp.sys,
          NORMAL_RANGES.bp.sys.baselineVariation * variationFactor
        );
        
        const dia = generateValue(
          prev.bp.dia,
          currentProfile.bp.dia,
          NORMAL_RANGES.bp.dia.baselineVariation * variationFactor
        );
        
        return {
          ...prev,
          hr,
          spo2,
          rr,
          bp: { sys, dia }
        };
      });
    }, updateInterval);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [setVitals, updateInterval, variationFactor, abnormalFrequency, vitals.isManual, vitals.rhythm]);
  
  // Function to reset vitals to initial values
  const resetVitals = () => {
    setVitals({
      ...initialVitals,
      isManual: false, // Make sure to reset the manual flag
    });
  };
  
  return { resetVitals };
} 