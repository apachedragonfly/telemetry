import React, { useState, useEffect } from 'react';

interface AlertIndicatorProps {
  isActive: boolean;
  children: React.ReactNode;
}

export default function AlertIndicator({ isActive, children }: AlertIndicatorProps) {
  const [visible, setVisible] = useState(true);
  
  // Flash effect when alert is active
  useEffect(() => {
    if (!isActive) {
      setVisible(true);
      return;
    }
    
    // Flash border at a rate of 2Hz (on for 250ms, off for 250ms)
    const intervalId = setInterval(() => {
      setVisible(prev => !prev);
    }, 250);
    
    return () => clearInterval(intervalId);
  }, [isActive]);
  
  // Apply the border style based on alert state
  const borderStyle = isActive 
    ? visible 
      ? 'border-red-500 border-2 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
      : 'border-gray-700 border'
    : 'border-gray-700 border';
    
  return (
    <div className={`rounded-md transition-colors ${borderStyle}`}>
      {children}
    </div>
  );
}

// Utility function to check if any vitals are in alert range
export function checkVitalsAlert(hr: number, spo2: number): boolean {
  // Alert conditions: HR > 120 or SpO₂ < 92
  return hr > 120 || spo2 < 92;
} 