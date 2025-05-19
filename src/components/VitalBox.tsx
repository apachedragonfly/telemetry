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

  return (
    <AlertIndicator isActive={display.isAlert || (hasAlert && type === 'HR')}>
      <div className={`bg-black p-3 sm:p-4 w-full h-28 sm:h-36 flex flex-col justify-between bg-gradient-to-b ${display.bgColor} border-b border-gray-800`}>
        {/* Header with label and normal range */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-1">
          <div className={`text-base sm:text-lg font-bold ${display.color} uppercase tracking-wider`}>{display.label}</div>
          <div className="text-xs text-gray-500 uppercase">NORMAL RANGE</div>
        </div>
        
        {/* Main value display with neon effect */}
        <div className={`text-3xl sm:text-4xl monitor-value text-white text-center ${display.glow}`}>
          {display.value}
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
  );
} 