import { useEffect, useRef } from 'react';
import { useMonitor, initialVitals } from '../context/MonitorContext';

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
    // Generate a new value with small fluctuations
    const generateValue = (
      current: number,
      min: number,
      max: number, 
      baseVariation: number
    ) => {
      // Create slight random variation
      const randomComponent = (Math.random() - 0.5) * 2 * baseVariation * variationFactor;
      
      // Create a sinusoidal variation for smoother changes (with a long period)
      const sinComponent = Math.sin(simulationTimeRef.current / 10) * baseVariation * variationFactor;
      
      // Combine both variations
      let newValue = current + randomComponent + sinComponent;
      
      // Ensure the value stays within the allowed range
      newValue = Math.max(min, Math.min(max, newValue));
      
      // Round to whole number for most vitals
      return Math.round(newValue);
    };
    
    // Setup interval to update vitals
    const intervalId = setInterval(() => {
      // Update simulation time
      simulationTimeRef.current += 1;
      
      // Randomly decide if this update should generate abnormal values
      const isAbnormal = Math.random() < abnormalFrequency;
      
      // Update all vitals with slight variations
      setVitals(prev => {
        // Generate new heart rate
        const hrRange = isAbnormal ? ALERT_RANGES.hr : NORMAL_RANGES.hr;
        const hr = generateValue(
          prev.hr,
          hrRange.min,
          hrRange.max,
          NORMAL_RANGES.hr.baselineVariation
        );
        
        // Generate new SpO2
        const spo2Range = isAbnormal ? ALERT_RANGES.spo2 : NORMAL_RANGES.spo2;
        const spo2 = generateValue(
          prev.spo2,
          spo2Range.min,
          spo2Range.max,
          NORMAL_RANGES.spo2.baselineVariation
        );
        
        // Generate new respiration rate
        const rrRange = isAbnormal ? ALERT_RANGES.rr : NORMAL_RANGES.rr;
        const rr = generateValue(
          prev.rr,
          rrRange.min,
          rrRange.max,
          NORMAL_RANGES.rr.baselineVariation
        );
        
        // Generate new blood pressure
        const bpSysRange = isAbnormal ? ALERT_RANGES.bp.sys : NORMAL_RANGES.bp.sys;
        const sys = generateValue(
          prev.bp.sys,
          bpSysRange.min,
          bpSysRange.max,
          NORMAL_RANGES.bp.sys.baselineVariation
        );
        
        const bpDiaRange = isAbnormal ? ALERT_RANGES.bp.dia : NORMAL_RANGES.bp.dia;
        const dia = generateValue(
          prev.bp.dia,
          bpDiaRange.min,
          bpDiaRange.max,
          NORMAL_RANGES.bp.dia.baselineVariation
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
  }, [setVitals, updateInterval, variationFactor, abnormalFrequency]);
  
  // Function to reset vitals to initial values
  const resetVitals = () => {
    setVitals(initialVitals);
  };
  
  return { resetVitals };
} 