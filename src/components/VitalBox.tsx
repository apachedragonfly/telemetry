import { useState } from 'react';
import { useMonitor } from '../context/MonitorContext';
import AlertIndicator, { checkVitalsAlert } from './AlertIndicator';

interface VitalBoxProps {
  type: 'HR' | 'BP' | 'SpO2' | 'RR';
}

export default function VitalBox({ type }: VitalBoxProps) {
  const { vitals, updateHR, updateBP, updateSpO2, updateRR } = useMonitor();
  
  // Local state for input values
  const [hrInput, setHrInput] = useState<string>('');
  const [sysInput, setSysInput] = useState<string>('');
  const [diaInput, setDiaInput] = useState<string>('');
  const [spo2Input, setSpo2Input] = useState<string>('');
  const [rrInput, setRrInput] = useState<string>('');
  
  // Toggle for showing input fields
  const [showInput, setShowInput] = useState<boolean>(false);
  
  // Define display properties for each vital sign
  const vitalsDisplay = {
    HR: {
      label: 'HR',
      value: vitals.hr.toString(),
      unit: 'bpm',
      color: 'vital-hr',
      bgColor: 'from-green-900/10 to-transparent',
      glow: 'shadow-[0_0_8px_rgba(0,255,0,0.3)]',
      isAlert: vitals.hr > 120, // High heart rate alert
    },
    BP: {
      label: 'BP',
      value: `${vitals.bp.sys}/${vitals.bp.dia}`,
      unit: 'mmHg',
      color: 'vital-bp',
      bgColor: 'from-red-900/10 to-transparent',
      glow: 'shadow-[0_0_8px_rgba(255,0,0,0.3)]',
      isAlert: vitals.bp.sys > 140 || vitals.bp.dia > 90 || vitals.bp.sys < 90, // Hypertension or hypotension
    },
    SpO2: {
      label: 'SpO₂',
      value: vitals.spo2.toString(),
      unit: '%',
      color: 'vital-spo2',
      bgColor: 'from-yellow-900/10 to-transparent',
      glow: 'shadow-[0_0_8px_rgba(255,204,0,0.3)]',
      isAlert: vitals.spo2 < 92, // Low oxygen saturation alert
    },
    RR: {
      label: 'RR',
      value: vitals.rr.toString(),
      unit: 'brpm',
      color: 'vital-rr',
      bgColor: 'from-blue-900/10 to-transparent',
      glow: 'shadow-[0_0_8px_rgba(0,160,255,0.3)]',
      isAlert: vitals.rr > 24 || vitals.rr < 10, // Abnormal respiratory rate
    },
  };

  const display = vitalsDisplay[type];
  
  // Global alert state based on critical vitals
  const hasAlert = checkVitalsAlert(vitals.hr, vitals.spo2);
  
  // Handlers for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^\d]/g, '');
    setter(value);
  };
  
  // Handle submission of inputs
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (type) {
      case 'HR':
        if (hrInput) {
          updateHR(Number(hrInput));
          setHrInput('');
        }
        break;
      case 'BP':
        if (sysInput && diaInput) {
          updateBP(Number(sysInput), Number(diaInput));
          setSysInput('');
          setDiaInput('');
        }
        break;
      case 'SpO2':
        if (spo2Input) {
          updateSpO2(Number(spo2Input));
          setSpo2Input('');
        }
        break;
      case 'RR':
        if (rrInput) {
          updateRR(Number(rrInput));
          setRrInput('');
        }
        break;
    }
    
    setShowInput(false);
  };

  return (
    <div className="flex flex-col">
      <AlertIndicator isActive={display.isAlert || (hasAlert && type === 'HR')}>
        <div 
          className={`bg-black p-3 sm:p-4 w-full h-28 sm:h-36 flex flex-col justify-between bg-gradient-to-b ${display.bgColor} border-b border-gray-800`}
          onDoubleClick={() => setShowInput(!showInput)}
        >
          {/* Header with label and normal range */}
          <div className="flex justify-between items-center border-b border-gray-800 pb-1">
            <div className={`text-base sm:text-lg font-bold ${display.color} uppercase tracking-wider flex items-center`}>
              {display.label}
              {vitals.isManual && type === 'HR' && (
                <span className="ml-2 text-xs text-gray-500">(Manual)</span>
              )}
            </div>
            <div className="text-xs text-gray-500 uppercase">NORMAL RANGE</div>
          </div>
          
          {/* Main value display with neon effect */}
          <div className={`text-3xl sm:text-4xl monitor-value text-white text-center ${display.glow} relative group`}>
            {display.value}
            <span className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm text-gray-300">
              Double-click to edit
            </span>
          </div>
          
          {/* Footer with unit and normal range values */}
          <div className="flex justify-between items-end pt-1 border-t border-gray-800">
            <div className={`text-xs sm:text-sm ${display.color}`}>{display.unit}</div>
            <div className="text-xs text-gray-500">
              {type === 'HR' && '60-100'}
              {type === 'BP' && '90-140/60-90'}
              {type === 'SpO2' && '≥ 95%'}
              {type === 'RR' && '12-20'}
            </div>
          </div>
        </div>
      </AlertIndicator>
      
      {/* Manual input form */}
      {showInput && (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-2 rounded-b-md border border-gray-800 border-t-0 flex flex-col space-y-2">
          <div className="text-xs text-gray-400 mb-1">
            Enter value{type === 'BP' ? 's' : ''} to override:
          </div>
          
          {type === 'HR' && (
            <div className="flex items-center">
              <input
                type="text"
                value={hrInput}
                onChange={(e) => handleInputChange(e, setHrInput)}
                className="bg-black text-green-500 border border-gray-700 rounded px-2 py-1 text-sm w-20"
                placeholder="HR"
                maxLength={3}
              />
              <span className="text-gray-400 text-xs ml-1">bpm</span>
            </div>
          )}
          
          {type === 'BP' && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <input
                  type="text"
                  value={sysInput}
                  onChange={(e) => handleInputChange(e, setSysInput)}
                  className="bg-black text-red-500 border border-gray-700 rounded px-2 py-1 text-sm w-16"
                  placeholder="SYS"
                  maxLength={3}
                />
              </div>
              <span className="text-gray-400">/</span>
              <div className="flex items-center">
                <input
                  type="text"
                  value={diaInput}
                  onChange={(e) => handleInputChange(e, setDiaInput)}
                  className="bg-black text-red-500 border border-gray-700 rounded px-2 py-1 text-sm w-16"
                  placeholder="DIA"
                  maxLength={3}
                />
              </div>
              <span className="text-gray-400 text-xs">mmHg</span>
            </div>
          )}
          
          {type === 'SpO2' && (
            <div className="flex items-center">
              <input
                type="text"
                value={spo2Input}
                onChange={(e) => handleInputChange(e, setSpo2Input)}
                className="bg-black text-yellow-500 border border-gray-700 rounded px-2 py-1 text-sm w-20"
                placeholder="SpO₂"
                maxLength={3}
              />
              <span className="text-gray-400 text-xs ml-1">%</span>
            </div>
          )}
          
          {type === 'RR' && (
            <div className="flex items-center">
              <input
                type="text"
                value={rrInput}
                onChange={(e) => handleInputChange(e, setRrInput)}
                className="bg-black text-blue-500 border border-gray-700 rounded px-2 py-1 text-sm w-20"
                placeholder="RR"
                maxLength={2}
              />
              <span className="text-gray-400 text-xs ml-1">brpm</span>
            </div>
          )}
          
          <div className="flex space-x-2 mt-1">
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded border border-gray-700"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded border border-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 