import { useRef, useEffect, useState } from 'react';
import { useMonitor } from '../context/MonitorContext';

export default function ECGWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 500, height: 200 });
  const { vitals } = useMonitor();
  
  // Resize canvas to fit container
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      
      // Set canvas dimensions based on container width, maintaining aspect ratio
      setDimensions({
        width: containerWidth,
        height: Math.min(200, containerWidth * 0.4) // 40% height ratio, max 200px
      });
    };
    
    // Initial sizing
    updateDimensions();
    
    // Resize on window changes
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Draw different ECG patterns based on the rhythm
  const drawECGCycle = (
    ctx: CanvasRenderingContext2D, 
    startX: number, 
    middle: number, 
    rhythm: string
  ) => {
    const cycleWidth = 200; // Width of one full ECG cycle
    
    // Starting point
    ctx.moveTo(startX, middle);
    
    switch (rhythm) {
      case 'NSR': // Normal Sinus Rhythm
        // P wave
        ctx.lineTo(startX + 20, middle - 10);
        
        // Back to baseline
        ctx.lineTo(startX + 40, middle);
        
        // QRS complex
        ctx.lineTo(startX + 60, middle - 5);
        ctx.lineTo(startX + 70, middle - 40); // R peak
        ctx.lineTo(startX + 80, middle + 20); // S dip
        ctx.lineTo(startX + 90, middle);
        
        // T wave
        ctx.lineTo(startX + 130, middle + 15);
        
        // Back to baseline
        ctx.lineTo(startX + 160, middle);
        ctx.lineTo(startX + cycleWidth, middle);
        break;
        
      case 'AFIB': // Atrial Fibrillation - Irregular, no clear P waves
        // Irregular baseline with small oscillations (representing fibrillatory waves)
        for (let i = 0; i < 40; i += 4) {
          ctx.lineTo(startX + i, middle - Math.random() * 6);
        }
        
        // QRS complex (normal)
        ctx.lineTo(startX + 60, middle - 5);
        ctx.lineTo(startX + 70, middle - 35); // R peak
        ctx.lineTo(startX + 80, middle + 15); // S dip
        ctx.lineTo(startX + 90, middle);
        
        // T wave
        ctx.lineTo(startX + 130, middle + 12);
        
        // Back to baseline with some irregularity
        ctx.lineTo(startX + 160, middle - 2);
        
        // More irregular baseline
        for (let i = 160; i < cycleWidth; i += 4) {
          ctx.lineTo(startX + i, middle - Math.random() * 4);
        }
        break;
        
      case 'SVT': // Supraventricular Tachycardia - Fast, regular, narrow QRS
        // Rapid rhythm, so make the cycle narrower
        const svtCycleWidth = 100;
        
        // Small or absent P wave
        ctx.lineTo(startX + 10, middle - 5);
        
        // Quick QRS (narrow)
        ctx.lineTo(startX + 20, middle - 5);
        ctx.lineTo(startX + 25, middle - 30); // R peak
        ctx.lineTo(startX + 30, middle + 10); // S dip
        ctx.lineTo(startX + 35, middle);
        
        // T wave merging with next beat due to speed
        ctx.lineTo(startX + 50, middle + 8);
        ctx.lineTo(startX + 70, middle);
        
        // Rest of the cycle
        ctx.lineTo(startX + svtCycleWidth, middle);
        break;
        
      case 'VT': // Ventricular Tachycardia - Fast, wide QRS, no visible P waves
        // No P wave
        
        // Wide QRS complex
        ctx.lineTo(startX + 20, middle);
        ctx.lineTo(startX + 30, middle - 40); // R peak
        ctx.lineTo(startX + 60, middle + 30); // Wide S wave
        ctx.lineTo(startX + 90, middle);
        
        // T wave often not visible
        ctx.lineTo(startX + 120, middle);
        break;
        
      case 'VFIB': // Ventricular Fibrillation - Chaotic, irregular
        // Chaotic pattern with no regular waves
        for (let i = 0; i < cycleWidth; i += 2) {
          // Create randomized chaotic signal
          const amplitude = Math.random() * 50 - 25;
          ctx.lineTo(startX + i, middle + amplitude);
        }
        break;
        
      case 'ASYSTOLE': // Asystole - Flat line
        // Flatline
        ctx.lineTo(startX + cycleWidth, middle);
        break;
        
      case 'PACED': // Paced rhythm
        // Pacemaker spike
        ctx.lineTo(startX + 10, middle);
        ctx.lineTo(startX + 10, middle - 30);
        ctx.lineTo(startX + 10, middle);
        
        // QRS after spike
        ctx.lineTo(startX + 20, middle - 5);
        ctx.lineTo(startX + 30, middle - 25);
        ctx.lineTo(startX + 40, middle + 15);
        ctx.lineTo(startX + 50, middle);
        
        // T wave
        ctx.lineTo(startX + 90, middle + 10);
        ctx.lineTo(startX + 120, middle);
        ctx.lineTo(startX + cycleWidth, middle);
        break;
        
      case 'AV-BLOCK': // AV Block - P waves without corresponding QRS
        // P wave
        ctx.lineTo(startX + 20, middle - 10);
        ctx.lineTo(startX + 40, middle);
        
        // P wave without QRS (blocked)
        ctx.lineTo(startX + 80, middle - 10);
        ctx.lineTo(startX + 100, middle);
        
        // Finally conducted P wave with QRS
        ctx.lineTo(startX + 140, middle - 10);
        ctx.lineTo(startX + 160, middle);
        ctx.lineTo(startX + 170, middle - 5);
        ctx.lineTo(startX + 180, middle - 35);
        ctx.lineTo(startX + 190, middle + 15);
        ctx.lineTo(startX + 200, middle);
        
        // T wave
        ctx.lineTo(startX + 240, middle + 12);
        ctx.lineTo(startX + 260, middle);
        break;
        
      default:
        // Default to NSR if rhythm not recognized
        // P wave
        ctx.lineTo(startX + 20, middle - 10);
        ctx.lineTo(startX + 40, middle);
        
        // QRS complex
        ctx.lineTo(startX + 60, middle - 5);
        ctx.lineTo(startX + 70, middle - 40);
        ctx.lineTo(startX + 80, middle + 20);
        ctx.lineTo(startX + 90, middle);
        
        // T wave
        ctx.lineTo(startX + 130, middle + 15);
        ctx.lineTo(startX + 160, middle);
        ctx.lineTo(startX + cycleWidth, middle);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let xOffset = 0;
    // Adjust cycle width based on rhythm
    const getPatternWidth = (rhythm: string): number => {
      switch (rhythm) {
        case 'SVT':
        case 'VT':
          return 100; // Faster rhythms have shorter cycles
        case 'VFIB':
          return 50;  // Very fast, chaotic
        case 'AV-BLOCK':
          return 300; // Longer due to blocked beats
        default:
          return 200; // Default cycle width
      }
    };

    const drawFrame = () => {
      // Clear the canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 0.5;
      
      // Vertical grid lines - adjust spacing for smaller screens
      const gridSpacing = Math.max(10, Math.min(20, dimensions.width / 25));
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw the ECG line
      ctx.strokeStyle = '#00ff00'; // Bright green
      ctx.lineWidth = Math.max(1, dimensions.width / 250); // Adjust line width for screen size
      ctx.beginPath();
      
      const middle = canvas.height / 2;
      const patternWidth = getPatternWidth(vitals.rhythm);
      
      // Draw enough cycles to fill the canvas
      for (let x = -xOffset; x < canvas.width; x += patternWidth) {
        drawECGCycle(ctx, x, middle, vitals.rhythm);
      }
      
      ctx.stroke();
      
      // Adjust scrolling speed based on rhythm
      let scrollSpeed = 1;
      
      if (vitals.rhythm === 'SVT' || vitals.rhythm === 'VT') {
        scrollSpeed = 2;
      } else if (vitals.rhythm === 'VFIB') {
        scrollSpeed = 3;
      } else if (vitals.rhythm === 'ASYSTOLE') {
        scrollSpeed = 0.5;
      }
      
      // Move the pattern left
      xOffset = (xOffset + scrollSpeed) % patternWidth;
      
      // Continue animation
      animationRef.current = requestAnimationFrame(drawFrame);
    };
    
    // Start the animation
    animationRef.current = requestAnimationFrame(drawFrame);
    
    // Cleanup function to cancel animation when component unmounts
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [vitals.rhythm, dimensions]); // Re-run effect when rhythm or dimensions change

  return (
    <div ref={containerRef} className="w-full">
      <canvas 
        ref={canvasRef} 
        className="border border-gray-700 rounded-md w-full"
        style={{ height: `${dimensions.height}px` }}
      />
    </div>
  );
} 