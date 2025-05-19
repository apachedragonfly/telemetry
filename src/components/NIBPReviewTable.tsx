import { useState, useEffect } from 'react';
import { useMonitor } from '../context/MonitorContext';

// Define the structure for NIBP review table entries
interface NIBPReviewEntry {
  timestamp: string;
  hr: number;
  bp: { sys: number; dia: number };
  spo2: number;
  rr: number;
}

export default function NIBPReviewTable() {
  const { vitals } = useMonitor();
  const [entries, setEntries] = useState<NIBPReviewEntry[]>([]);
  
  // Add current vitals to the table every 30 seconds
  useEffect(() => {
    // Function to add a new entry with current timestamp and vitals
    const addEntry = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timestamp = `${hours}:${minutes}`;
      
      const newEntry: NIBPReviewEntry = {
        timestamp,
        hr: vitals.hr,
        bp: { ...vitals.bp },
        spo2: vitals.spo2,
        rr: vitals.rr
      };
      
      // Add new entry at the beginning and limit to last 5 entries
      setEntries(prev => [newEntry, ...prev].slice(0, 5));
    };
    
    // Add initial entry immediately
    addEntry();
    
    // Set up interval to add entries every 30 seconds
    const intervalId = setInterval(addEntry, 30000);
    
    return () => clearInterval(intervalId);
  }, [vitals]);
  
  return (
    <div className="w-full mt-4 border border-gray-800 rounded-md bg-black/50">
      <div className="border-b border-gray-800 bg-gray-900 px-3 py-1">
        <h3 className="text-sm font-bold text-gray-300">NIBP REVIEW</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-2 py-1 text-left text-gray-500">Time</th>
              <th className="px-2 py-1 text-left vital-hr">HR</th>
              <th className="px-2 py-1 text-left vital-bp">BP</th>
              <th className="px-2 py-1 text-left vital-spo2">SpO₂</th>
              <th className="px-2 py-1 text-left vital-rr">RR</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="border-b border-gray-800 last:border-b-0 odd:bg-black/30">
                <td className="px-2 py-1 font-mono text-gray-400">{entry.timestamp}</td>
                <td className="px-2 py-1 font-mono vital-hr">{entry.hr}</td>
                <td className="px-2 py-1 font-mono vital-bp">{entry.bp.sys}/{entry.bp.dia}</td>
                <td className="px-2 py-1 font-mono vital-spo2">{entry.spo2}%</td>
                <td className="px-2 py-1 font-mono vital-rr">{entry.rr}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 py-1 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 