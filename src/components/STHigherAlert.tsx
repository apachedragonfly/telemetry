import { useMonitor } from '../context/MonitorContext';

export default function STHigherAlert() {
  const { vitals } = useMonitor();
  
  // Check if heart rate is elevated
  const isElevated = vitals.hr > 120;
  
  // If HR is not elevated, don't render anything
  if (!isElevated) {
    return null;
  }
  
  return (
    <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black border border-yellow-500 rounded-sm st-higher-alert">
      <span className="vital-spo2 text-xs font-bold tracking-wider">ST HIGHER</span>
    </div>
  );
} 