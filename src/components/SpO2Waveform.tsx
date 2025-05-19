import React, { useRef, useEffect, useState } from 'react';

export default function SpO2Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 500, height: 150 });
  
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
  const drawSpO2Cycle = (ctx: CanvasRenderingContext2D, startX: number, middle: number) => {
    const cycleWidth = 100; // Width of one full pulse cycle
    const scaleFactor = dimensions.width / 500; // Scale factor for smaller screens
    
    // SpO2 waveform has a characteristic shape with a quick upstroke
    // followed by a more gradual decline (like a skewed bell curve)
    
    // Starting point
    ctx.moveTo(startX, middle);
    
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
        drawSpO2Cycle(ctx, x, middle);
      }
      
      ctx.stroke();
      
      // Move the pattern left
      xOffset = (xOffset + 0.8) % patternWidth;
      
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
  }, [dimensions]); // Re-run effect when dimensions change

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