import React, { useRef, useEffect, useState } from 'react';

export default function RespWaveform() {
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
  
  // Function to draw one respiratory cycle starting at a given x position
  const drawRespCycle = (ctx: CanvasRenderingContext2D, startX: number, middle: number) => {
    const cycleWidth = 300; // Width of one full respiratory cycle
    const amplitude = Math.min(30, dimensions.height / 5); // Height of the wave, scale for smaller screens
    
    // Starting point
    ctx.moveTo(startX, middle);
    
    // Draw a smoother, slower respiratory pattern (sine-like)
    const points = 60; // Number of points to draw for a smooth curve
    const pointSpacing = cycleWidth / points;
    
    for (let i = 1; i <= points; i++) {
      const x = startX + i * pointSpacing;
      // Sine wave with a slower, gentler curve than ECG
      const y = middle - amplitude * Math.sin((i / points) * Math.PI * 2);
      ctx.lineTo(x, y);
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
        drawRespCycle(ctx, x, middle);
      }
      
      ctx.stroke();
      
      // Move the pattern left more slowly than ECG
      xOffset = (xOffset + 0.5) % patternWidth;
      
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