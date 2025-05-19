import React from 'react';
import { useMonitor } from '../context/MonitorContext';
import AlertIndicator, { checkVitalsAlert } from './AlertIndicator';

interface VitalBoxProps {
  type: 'HR' | 'BP' | 'SpO2' | 'RR';
}

export default function VitalBox({ type }: VitalBoxProps) {
  const { vitals } = useMonitor();
  
  // Define display properties for each vital sign
  const vitalsDisplay = {
    HR: {
      label: 'HR',
      value: vitals.hr.toString(),
      unit: 'bpm',
      color: 'text-green-500',
      bgColor: 'from-green-900/10 to-transparent',
      isAlert: vitals.hr > 120, // High heart rate alert
    },
    BP: {
      label: 'BP',
      value: `${vitals.bp.sys}/${vitals.bp.dia}`,
      unit: 'mmHg',
      color: 'text-red-500',
      bgColor: 'from-red-900/10 to-transparent',
      isAlert: vitals.bp.sys > 140 || vitals.bp.dia > 90 || vitals.bp.sys < 90, // Hypertension or hypotension
    },
    SpO2: {
      label: 'SpO₂',
      value: vitals.spo2.toString(),
      unit: '%',
      color: 'text-yellow-500',
      bgColor: 'from-yellow-900/10 to-transparent',
      isAlert: vitals.spo2 < 92, // Low oxygen saturation alert
    },
    RR: {
      label: 'RR',
      value: vitals.rr.toString(),
      unit: 'brpm',
      color: 'text-blue-500',
      bgColor: 'from-blue-900/10 to-transparent',
      isAlert: vitals.rr > 24 || vitals.rr < 10, // Abnormal respiratory rate
    },
  };

  const display = vitalsDisplay[type];
  
  // Global alert state based on critical vitals
  const hasAlert = checkVitalsAlert(vitals.hr, vitals.spo2);

  return (
    <AlertIndicator isActive={display.isAlert || (hasAlert && type === 'HR')}>
      <div className={`bg-black p-3 sm:p-4 w-full h-28 sm:h-36 flex flex-col justify-between bg-gradient-to-b ${display.bgColor}`}>
        <div className="flex justify-between items-center">
          <div className={`text-base sm:text-lg font-bold ${display.color}`}>{display.label}</div>
          <div className="text-xs text-gray-500">NORMAL RANGE</div>
        </div>
        <div className="text-3xl sm:text-4xl font-mono text-white font-bold tracking-wider text-center">
          {display.value}
        </div>
        <div className="flex justify-between items-end">
          <div className="text-xs sm:text-sm text-gray-400">{display.unit}</div>
          <div className="text-xs text-gray-500">
            {type === 'HR' && '60-100'}
            {type === 'BP' && '90-140/60-90'}
            {type === 'SpO2' && '≥ 95%'}
            {type === 'RR' && '12-20'}
          </div>
        </div>
      </div>
    </AlertIndicator>
  );
} 