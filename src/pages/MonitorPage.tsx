import React from 'react';
import VitalBox from '../components/VitalBox';
import ECGWaveform from '../components/ECGWaveform';

export default function MonitorPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-4">
      {/* Title bar */}
      <div className="w-full text-center mb-4">
        <h1 className="text-2xl font-mono text-green-500">Telemetry Monitor</h1>
      </div>
      
      {/* ECG Waveform */}
      <div className="mb-6">
        <ECGWaveform />
      </div>
      
      {/* Vitals grid */}
      <div className="grid grid-cols-2 gap-4">
        <VitalBox type="HR" />
        <VitalBox type="BP" />
        <VitalBox type="SpO2" />
        <VitalBox type="RR" />
      </div>
    </div>
  );
} 