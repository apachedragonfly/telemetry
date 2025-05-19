import { useRef, useEffect, useState } from 'react';
import { useMonitor } from '../context/MonitorContext';

export default function RespWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 500, height: 150 });
  
  // Get respWaveType from context
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
  
  // Function to draw one respiratory cycle starting at a given x position
  const drawRespCycle = (ctx: CanvasRenderingContext2D, startX: number, middle: number, waveType: string) => {
    const cycleWidth = 300; // Width of one full respiratory cycle
    const amplitude = Math.min(30, dimensions.height / 5); // Height of the wave, scale for smaller screens
    
    // Starting point
    ctx.moveTo(startX, middle);
    
    // Draw different respiratory patterns based on wave type
    switch(waveType) {
      case 'normal':
        // Draw a smoother, slower respiratory pattern (sine-like)
        const normalPoints = 60; // Number of points to draw for a smooth curve
        const normalPointSpacing = cycleWidth / normalPoints;
        
        for (let i = 1; i <= normalPoints; i++) {
          const x = startX + i * normalPointSpacing;
          // Sine wave with a slower, gentler curve
          const y = middle - amplitude * Math.sin((i / normalPoints) * Math.PI * 2);
          ctx.lineTo(x, y);
        }
        break;
        
      case 'rapid':
        // Draw a faster respiratory pattern (more cycles in the same space)
        const rapidPoints = 120; // More points for more cycles
        const rapidPointSpacing = cycleWidth / rapidPoints;
        
        for (let i = 1; i <= rapidPoints; i++) {
          const x = startX + i * rapidPointSpacing;
          // Double frequency sine wave
          const y = middle - amplitude * 0.8 * Math.sin((i / rapidPoints) * Math.PI * 4);
          ctx.lineTo(x, y);
        }
        break;
        
      case 'slow':
        // Draw a slower respiratory pattern (half cycle)
        const slowPoints = 60;
        const slowPointSpacing = cycleWidth / slowPoints;
        
        for (let i = 1; i <= slowPoints; i++) {
          const x = startX + i * slowPointSpacing;
          // Half frequency sine wave
          const y = middle - amplitude * 1.2 * Math.sin((i / slowPoints) * Math.PI);
          ctx.lineTo(x, y);
        }
        break;
        
      case 'irregular':
        // Draw an irregular respiratory pattern
        let lastY = middle;
        
        for (let i = 0; i < cycleWidth; i += 10) {
          const x = startX + i;
          // Random fluctuations with some continuity
          const randomComponent = (Math.random() - 0.5) * amplitude;
          const y = middle - (amplitude * 0.5 * Math.sin((i / cycleWidth) * Math.PI * 2) + randomComponent);
          
          // Ensure some continuity by limiting the change from the last point
          const maxChange = amplitude * 0.3;
          const limitedY = Math.max(
            lastY - maxChange, 
            Math.min(lastY + maxChange, y)
          );
          
          ctx.lineTo(x, limitedY);
          lastY = limitedY;
        }
        break;
        
      case 'flat':
        // Draw a flat line for asystole or apnea
        ctx.lineTo(startX + cycleWidth, middle);
        break;
        
      default:
        // Default to normal pattern
        const defaultPoints = 60;
        const defaultPointSpacing = cycleWidth / defaultPoints;
        
        for (let i = 1; i <= defaultPoints; i++) {
          const x = startX + i * defaultPointSpacing;
          const y = middle - amplitude * Math.sin((i / defaultPoints) * Math.PI * 2);
          ctx.lineTo(x, y);
        }
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
    const patternWidth = 300; // Width of one respiratory cycle

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
      
      // Draw the respiratory line
      ctx.strokeStyle = '#00a0ff'; // Blue for respiratory
      ctx.lineWidth = Math.max(1, dimensions.width / 250); // Adjust line width for screen size
      ctx.beginPath();
      
      const middle = canvas.height / 2;
      
      // Draw enough cycles to fill the canvas
      for (let x = -xOffset; x < canvas.width; x += patternWidth) {
        drawRespCycle(ctx, x, middle, vitals.respWaveType);
      }
      
      ctx.stroke();
      
      // Move the pattern left with speed based on wave type
      let scrollSpeed = 0.5; // Default speed
      
      if (vitals.respWaveType === 'rapid') {
        scrollSpeed = 1.0;
      } else if (vitals.respWaveType === 'slow') {
        scrollSpeed = 0.25;
      } else if (vitals.respWaveType === 'flat') {
        scrollSpeed = 0.1;
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
  }, [dimensions, vitals.respWaveType]); // Re-run effect when dimensions or respWaveType changes

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