import React, { useEffect, useState } from 'react';
import VitalBox from '../components/VitalBox';
import ECGWaveform from '../components/ECGWaveform';
import RespWaveform from '../components/RespWaveform';
import SpO2Waveform from '../components/SpO2Waveform';
import TimeDisplay from '../components/TimeDisplay';
import NIBPReviewTable from '../components/NIBPReviewTable';
import STHigherAlert from '../components/STHigherAlert';
import rhythmProfiles from '../data/rhythmProfiles';
import type { RhythmKey } from '../data/rhythmProfiles';
import { useVitalsSimulator } from '../hooks/useVitalsSimulator';
import { useMonitor } from '../context/MonitorContext';
import { alertSoundService } from '../services/alertSoundService';
import { checkVitalsAlert } from '../components/AlertIndicator';

// Available cardiac rhythms - imported from rhythmProfiles
const RHYTHMS = Object.keys(rhythmProfiles) as RhythmKey[];

export default function MonitorPage() {
  // Initialize the vitals simulator
  const { resetVitals } = useVitalsSimulator();
  
  // Get current vitals from context
  const { vitals, updateRhythm } = useMonitor();
  
  // Show rhythm description tooltip
  const [showDescription, setShowDescription] = useState(false);
  
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
    const newRhythm = event.target.value as RhythmKey;
    updateRhythm(newRhythm);
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
  
  // Get current rhythm description
  const currentRhythmDescription = rhythmProfiles[vitals.rhythm as RhythmKey]?.description || '';
  
  return (
    <div className="flex flex-col items-center min-h-screen monitor-screen p-2 sm:p-4">
      {/* Monitor casing with screen effect */}
      <div className="w-full max-w-4xl bg-gray-900 border-4 border-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Title bar with inset effect */}
        <div className="bg-black border-b border-gray-800 px-3 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="relative">
            <div className="flex items-center bg-gray-900 px-2 py-1 rounded-md border border-gray-800">
              <span className="text-gray-400 mr-2 text-sm sm:text-base">Rhythm:</span>
              <select 
                value={vitals.rhythm}
                onChange={handleRhythmChange}
                className={`bg-black text-green-500 border border-gray-700 rounded px-2 py-1 font-mono text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${vitals.isManual ? 'opacity-50' : ''}`}
                onMouseEnter={() => setShowDescription(true)}
                onMouseLeave={() => setShowDescription(false)}
                disabled={vitals.isManual}
              >
                {RHYTHMS.map(rhythm => (
                  <option key={rhythm} value={rhythm}>
                    {rhythm}
                  </option>
                ))}
              </select>
              {vitals.isManual && (
                <span className="ml-2 text-red-500 text-xs whitespace-nowrap">(Manual Mode)</span>
              )}
              <button 
                className="text-gray-400 hover:text-gray-300 ml-1 text-xs"
                onMouseEnter={() => setShowDescription(true)}
                onMouseLeave={() => setShowDescription(false)}
                aria-label="Show rhythm description"
              >
                ?
              </button>
            </div>
            
            {/* Rhythm description tooltip */}
            {showDescription && currentRhythmDescription && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-xs z-10 w-60">
                <p className="text-white">{currentRhythmDescription}</p>
              </div>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-mono vital-hr font-bold tracking-wider">
            TELEMETRY MONITOR
            {vitals.isManual && <span className="text-xs ml-2 text-red-500">(MANUAL)</span>}
          </h1>
          <TimeDisplay />
        </div>
        
        {/* Main monitor area with subtle scan line effect */}
        <div className="p-3 sm:p-5 bg-black bg-opacity-95 relative">
          {/* Scan line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900 to-transparent opacity-5 animate-scan"></div>
          
          {/* ST Higher Alert - appears at the top-left when HR > 120 */}
          <STHigherAlert />
          
          {/* Alert indicator bar */}
          {hasAlert && (
            <div className="w-full h-6 mb-3 bg-red-900 bg-opacity-30 border border-red-800 rounded flex items-center justify-center animate-pulse">
              <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Alert Condition</span>
            </div>
          )}
          
          {/* Waveforms - Scale width to screen size */}
          <div className="w-full max-w-3xl mx-auto mb-4 sm:mb-6">
            {/* ECG - Green */}
            <div className="mb-1 pb-1 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <div className="vital-hr text-xs sm:text-sm font-bold mb-1">
                  ECG {vitals.rhythm}
                  {vitals.isManual && <span className="text-xs text-gray-500 ml-1">(Manual)</span>}
                </div>
                <div className="vital-hr text-xs">{vitals.hr} BPM</div>
              </div>
              <div className="w-full p-1 bg-black/50">
                <ECGWaveform />
              </div>
            </div>
            
            {/* Respiratory - Blue */}
            <div className="mt-3 mb-1 pb-1 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <div className="vital-rr text-xs sm:text-sm font-bold mb-1">
                  RESP
                  {vitals.isManual && <span className="text-xs text-gray-500 ml-1">(Manual)</span>}
                </div>
                <div className="vital-rr text-xs">{vitals.rr} /min</div>
              </div>
              <div className="w-full p-1 bg-black/50">
                <RespWaveform />
              </div>
            </div>
            
            {/* SpO2 - Yellow */}
            <div className="mt-3">
              <div className="flex justify-between items-center">
                <div className="vital-spo2 text-xs sm:text-sm font-bold mb-1">
                  SpO₂
                  {vitals.isManual && <span className="text-xs text-gray-500 ml-1">(Manual)</span>}
                </div>
                <div className="vital-spo2 text-xs">{vitals.spo2}%</div>
              </div>
              <div className="w-full p-1 bg-black/50">
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
          
          {/* NIBP Review Table */}
          <div className="w-full max-w-3xl mx-auto mb-4">
            <NIBPReviewTable />
          </div>
          
          {/* Controls with monitor-style buttons */}
          <div className="flex justify-center mt-2 sm:mt-4 gap-3">
            <button 
              onClick={handleReset}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md border border-gray-600 text-sm sm:text-base shadow-inner hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset Vitals
            </button>
            
            {vitals.isManual && (
              <button 
                onClick={() => updateRhythm(vitals.rhythm)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md border border-gray-600 text-sm sm:text-base shadow-inner hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Return to Rhythm
                </span>
              </button>
            )}
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