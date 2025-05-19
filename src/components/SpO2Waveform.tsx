import { useRef, useEffect, useState } from 'react';
import { useMonitor } from '../context/MonitorContext';

export default function SpO2Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 500, height: 150 });
  
  // Get spo2WaveType from context
  const { vitals } = useMonitor();
  
  // Resize canvas to fit container
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      
      // Set canvas dimensions based on container width, maintaining aspect ratio
      setDimensions({
        width: containerWidth,
        height: Math.min(150, containerWidth * 0.3) // 30% height ratio, max 150px
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
  
  // Function to draw one SpO2 pulse wave starting at a given x position
  const drawSpO2Cycle = (ctx: CanvasRenderingContext2D, startX: number, middle: number, waveType: string) => {
    const cycleWidth = 100; // Width of one full pulse cycle
    const scaleFactor = dimensions.width / 500; // Scale factor for smaller screens
    
    // SpO2 waveform has a characteristic shape with a quick upstroke
    // followed by a more gradual decline (like a skewed bell curve)
    
    // Starting point
    ctx.moveTo(startX, middle);
    
    // Draw different SpO2 patterns based on wave type
    switch(waveType) {
      case 'normal':
        // Initial flat part
        ctx.lineTo(startX + 10 * scaleFactor, middle);
        
        // Quick upstroke
        ctx.lineTo(startX + 20 * scaleFactor, middle - 30 * scaleFactor);
        
        // Rounded peak
        ctx.lineTo(startX + 25 * scaleFactor, middle - 35 * scaleFactor);
        
        // Dicrotic notch (small bump on the downslope)
        ctx.lineTo(startX + 40 * scaleFactor, middle - 10 * scaleFactor);
        ctx.lineTo(startX + 45 * scaleFactor, middle - 15 * scaleFactor);
        
        // Gradual decline back to baseline
        ctx.lineTo(startX + 60 * scaleFactor, middle - 5 * scaleFactor);
        ctx.lineTo(startX + 70 * scaleFactor, middle);
        
        // Flat until next cycle
        ctx.lineTo(startX + cycleWidth * scaleFactor, middle);
        break;
        
      case 'weak':
        // Initial flat part
        ctx.lineTo(startX + 10 * scaleFactor, middle);
        
        // Weak upstroke (lower amplitude)
        ctx.lineTo(startX + 20 * scaleFactor, middle - 15 * scaleFactor);
        
        // Smaller rounded peak
        ctx.lineTo(startX + 25 * scaleFactor, middle - 18 * scaleFactor);
        
        // Less pronounced dicrotic notch
        ctx.lineTo(startX + 40 * scaleFactor, middle - 5 * scaleFactor);
        ctx.lineTo(startX + 45 * scaleFactor, middle - 7 * scaleFactor);
        
        // Gradual decline back to baseline
        ctx.lineTo(startX + 60 * scaleFactor, middle - 2 * scaleFactor);
        ctx.lineTo(startX + 70 * scaleFactor, middle);
        
        // Flat until next cycle
        ctx.lineTo(startX + cycleWidth * scaleFactor, middle);
        break;
        
      case 'noisy':
        // Initial flat part with noise
        for (let i = 0; i < 10; i++) {
          const x = startX + i * scaleFactor;
          const y = middle + (Math.random() - 0.5) * 5 * scaleFactor;
          ctx.lineTo(x, y);
        }
        
        // Noisy upstroke
        ctx.lineTo(startX + 20 * scaleFactor, middle - 30 * scaleFactor + (Math.random() - 0.5) * 10 * scaleFactor);
        
        // Noisy peak
        ctx.lineTo(startX + 25 * scaleFactor, middle - 35 * scaleFactor + (Math.random() - 0.5) * 10 * scaleFactor);
        
        // Noisy dicrotic notch
        ctx.lineTo(startX + 40 * scaleFactor, middle - 10 * scaleFactor + (Math.random() - 0.5) * 8 * scaleFactor);
        ctx.lineTo(startX + 45 * scaleFactor, middle - 15 * scaleFactor + (Math.random() - 0.5) * 8 * scaleFactor);
        
        // Noisy decline
        for (let i = 45; i < 70; i += 5) {
          const x = startX + i * scaleFactor;
          const progress = (i - 45) / 25; // 0 to 1 as we go from 45 to 70
          const baseY = middle - (15 * (1 - progress)) * scaleFactor; // Gradually go from -15 to 0
          const y = baseY + (Math.random() - 0.5) * 5 * scaleFactor;
          ctx.lineTo(x, y);
        }
        
        // Noisy flat part
        for (let i = 70; i < cycleWidth; i += 5) {
          const x = startX + i * scaleFactor;
          const y = middle + (Math.random() - 0.5) * 3 * scaleFactor;
          ctx.lineTo(x, y);
        }
        break;
        
      case 'flat':
        // Flat line (no pulse)
        ctx.lineTo(startX + cycleWidth * scaleFactor, middle);
        break;
        
      default:
        // Default to normal pattern
        ctx.lineTo(startX + 10 * scaleFactor, middle);
        ctx.lineTo(startX + 20 * scaleFactor, middle - 30 * scaleFactor);
        ctx.lineTo(startX + 25 * scaleFactor, middle - 35 * scaleFactor);
        ctx.lineTo(startX + 40 * scaleFactor, middle - 10 * scaleFactor);
        ctx.lineTo(startX + 45 * scaleFactor, middle - 15 * scaleFactor);
        ctx.lineTo(startX + 60 * scaleFactor, middle - 5 * scaleFactor);
        ctx.lineTo(startX + 70 * scaleFactor, middle);
        ctx.lineTo(startX + cycleWidth * scaleFactor, middle);
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
    const patternWidth = 100 * (dimensions.width / 500); // Scale cycle width for smaller screens

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
      
      // Draw the SpO2 line
      ctx.strokeStyle = '#ffcc00'; // Yellow for SpO2
      ctx.lineWidth = Math.max(1, dimensions.width / 250); // Adjust line width for screen size
      ctx.beginPath();
      
      const middle = canvas.height / 2;
      
      // Draw enough cycles to fill the canvas
      for (let x = -xOffset; x < canvas.width; x += patternWidth) {
        drawSpO2Cycle(ctx, x, middle, vitals.spo2WaveType);
      }
      
      ctx.stroke();
      
      // Adjust speed based on wave type
      let scrollSpeed = 0.8; // Default speed
      
      if (vitals.spo2WaveType === 'weak') {
        scrollSpeed = 0.6; // Slower for weak pulse
      } else if (vitals.spo2WaveType === 'flat') {
        scrollSpeed = 0.3; // Very slow for flat line
      } else if (vitals.spo2WaveType === 'noisy') {
        scrollSpeed = 1.0; // Faster for noisy signal
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
  }, [dimensions, vitals.spo2WaveType]); // Re-run effect when dimensions or spo2WaveType changes

  return (
    <div ref={containerRef} className="w-full">
      <canvas 
        ref={canvasRef} 
        className="border border-gray-700 rounded-md w-full waveform-container"
        style={{ height: `${dimensions.height}px` }}
      />
    </div>
  );
} 