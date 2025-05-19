import React, { useRef, useEffect } from 'react';

export default function ECGWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  // Function to draw one ECG cycle starting at a given x position
  const drawECGCycle = (ctx: CanvasRenderingContext2D, startX: number, middle: number) => {
    const cycleWidth = 200; // Width of one full ECG cycle
    
    // Starting point
    ctx.moveTo(startX, middle);
    
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
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let xOffset = 0;
    const patternWidth = 200; // Width of one ECG cycle

    const drawFrame = () => {
      // Clear the canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 0.5;
      
      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw the ECG line
      ctx.strokeStyle = '#00ff00'; // Bright green
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const middle = canvas.height / 2;
      
      // Draw enough cycles to fill the canvas
      for (let x = -xOffset; x < canvas.width; x += patternWidth) {
        drawECGCycle(ctx, x, middle);
      }
      
      ctx.stroke();
      
      // Move the pattern left
      xOffset = (xOffset + 1) % patternWidth;
      
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
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={500} 
      height={200}
      className="border border-gray-700 rounded-md"
    />
  );
} 