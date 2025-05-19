import { useState, useEffect } from 'react';

export default function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    // Function to format time as HH:MM:SS (24-hour format)
    const updateTimeAndDate = (): void => {
      const now = new Date();
      
      // Format time (HH:MM:SS)
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      // Format date (DD-MMM-YYYY)
      const day = now.getDate().toString().padStart(2, '0');
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDate(`${day}-${month}-${year}`);
    };
    
    // Update time immediately
    updateTimeAndDate();
    
    // Set up interval to update time every second
    const intervalId = setInterval(updateTimeAndDate, 1000);
    
    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="bg-gray-900 px-3 py-1 rounded-md border border-gray-800 text-right">
      <div className="font-mono text-lg text-green-500">{currentTime}</div>
      <div className="font-mono text-xs text-gray-400">{currentDate}</div>
    </div>
  );
} 