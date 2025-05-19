import React, { useEffect } from 'react';
import VitalBox from '../components/VitalBox';
import ECGWaveform from '../components/ECGWaveform';
import RespWaveform from '../components/RespWaveform';
import SpO2Waveform from '../components/SpO2Waveform';
import TimeDisplay from '../components/TimeDisplay';
import { useVitalsSimulator } from '../hooks/useVitalsSimulator';
import { useMonitor } from '../context/MonitorContext';
import { alertSoundService } from '../services/alertSoundService';
import { checkVitalsAlert } from '../components/AlertIndicator';

// Available cardiac rhythms
const RHYTHMS = [
  'NSR',        // Normal Sinus Rhythm
  'AFIB',       // Atrial Fibrillation
  'SVT',        // Supraventricular Tachycardia
  'VT',         // Ventricular Tachycardia
  'VFIB',       // Ventricular Fibrillation
  'ASYSTOLE',   // Asystole (flatline)
  'PACED',      // Pacemaker Rhythm
  'AV-BLOCK'    // AV Block
];

export default function MonitorPage() {
  // Initialize the vitals simulator
  const { resetVitals } = useVitalsSimulator();
  
  // Get current vitals from context
  const { vitals, updateRhythm } = useMonitor();
  
  // Check for alert conditions and play sound if needed
  useEffect(() => {
    const hasAlert = checkVitalsAlert(vitals.hr, vitals.spo2);
    
    if (hasAlert) {
      alertSoundService.playAlert();
    } else {
      alertSoundService.stopAlert();
    }
  }, [vitals.hr, vitals.spo2]);
  
  // Handle rhythm change
  const handleRhythmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateRhythm(event.target.value);
  };
  
  // Handle reset button click
  const handleReset = () => {
    resetVitals();
    alertSoundService.stopAlert();
  };
  
  // Check if any vital is in alert range for UI styling
  const hasAlert = vitals.hr > 120 || vitals.spo2 < 92 || 
                  vitals.rr > 24 || vitals.rr < 10 || 
                  vitals.bp.sys > 140 || vitals.bp.dia > 90 || vitals.bp.sys < 90;
  
  return (
    <div className="flex flex-col items-center min-h-screen monitor-screen p-2 sm:p-4">
      {/* Monitor casing with screen effect */}
      <div className="w-full max-w-4xl bg-gray-900 border-4 border-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Title bar with inset effect */}
        <div className="bg-black border-b border-gray-800 px-3 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center bg-gray-900 px-2 py-1 rounded-md border border-gray-800">
            <span className="text-gray-400 mr-2 text-sm sm:text-base">Rhythm:</span>
            <select 
              value={vitals.rhythm}
              onChange={handleRhythmChange}
              className="bg-black text-green-500 border border-gray-700 rounded px-2 py-1 font-mono text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              {RHYTHMS.map(rhythm => (
                <option key={rhythm} value={rhythm}>{rhythm}</option>
              ))}
            </select>
          </div>
          <h1 className="text-xl sm:text-2xl font-mono vital-hr font-bold tracking-wider">
            TELEMETRY MONITOR
          </h1>
          <TimeDisplay />
        </div>
        
        {/* Main monitor area with subtle scan line effect */}
        <div className="p-3 sm:p-5 bg-black bg-opacity-95 relative">
          {/* Scan line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900 to-transparent opacity-5 animate-scan"></div>
          
          {/* Alert indicator bar */}
          {hasAlert && (
            <div className="w-full h-6 mb-3 bg-red-900 bg-opacity-30 border border-red-800 rounded flex items-center justify-center animate-pulse">
              <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Alert Condition</span>
            </div>
          )}
          
          {/* Waveforms - Scale width to screen size */}
          <div className="w-full max-w-3xl mx-auto space-y-2 mb-4 sm:mb-6">
            {/* ECG - Green */}
            <div>
              <div className="flex justify-between items-center">
                <div className="vital-hr text-xs sm:text-sm font-bold mb-1">ECG {vitals.rhythm}</div>
                <div className="vital-hr text-xs">{vitals.hr} BPM</div>
              </div>
              <div className="w-full">
                <ECGWaveform />
              </div>
            </div>
            
            {/* Respiratory - Blue */}
            <div>
              <div className="flex justify-between items-center">
                <div className="vital-rr text-xs sm:text-sm font-bold mb-1">RESP</div>
                <div className="vital-rr text-xs">{vitals.rr} /min</div>
              </div>
              <div className="w-full">
                <RespWaveform />
              </div>
            </div>
            
            {/* SpO2 - Yellow */}
            <div>
              <div className="flex justify-between items-center">
                <div className="vital-spo2 text-xs sm:text-sm font-bold mb-1">SpO₂</div>
                <div className="vital-spo2 text-xs">{vitals.spo2}%</div>
              </div>
              <div className="w-full">
                <SpO2Waveform />
              </div>
            </div>
          </div>
          
          {/* Vitals grid - Switch to single column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <VitalBox type="HR" />
            <VitalBox type="BP" />
            <VitalBox type="SpO2" />
            <VitalBox type="RR" />
          </div>
          
          {/* Controls with monitor-style buttons */}
          <div className="flex justify-center mt-2 sm:mt-4">
            <button 
              onClick={handleReset}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md border border-gray-600 text-sm sm:text-base shadow-inner hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset Vitals
            </button>
          </div>
        </div>
        
        {/* Monitor footer with device info */}
        <div className="bg-gray-900 border-t border-gray-800 px-3 py-1 text-xs text-gray-500 flex justify-between">
          <span>Telemetry Sim v0.1</span>
          <span>Medical Training Device</span>
        </div>
      </div>
    </div>
  );
} 