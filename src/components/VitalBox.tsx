import React from 'react';

interface VitalBoxProps {
  type: 'HR' | 'BP' | 'SpO2' | 'RR';
}

export default function VitalBox({ type }: VitalBoxProps) {
  // Define display properties for each vital sign
  const vitals = {
    HR: {
      label: 'HR',
      value: '72',
      unit: 'bpm',
      color: 'text-green-500',
    },
    BP: {
      label: 'BP',
      value: '120/80',
      unit: 'mmHg',
      color: 'text-red-500',
    },
    SpO2: {
      label: 'SpO₂',
      value: '98',
      unit: '%',
      color: 'text-yellow-500',
    },
    RR: {
      label: 'RR',
      value: '16',
      unit: 'brpm',
      color: 'text-blue-500',
    },
  };

  const vital = vitals[type];

  return (
    <div className="bg-black border border-gray-700 rounded-md p-4 w-48 h-36 flex flex-col justify-between">
      <div className={`text-lg font-bold ${vital.color}`}>{vital.label}</div>
      <div className="text-4xl font-mono text-white">{vital.value}</div>
      <div className="text-sm text-gray-400">{vital.unit}</div>
    </div>
  );
} 