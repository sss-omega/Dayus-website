"use client";

import React, { useEffect, useRef } from "react";

interface SoundWaveVisualizerProps {
  color?: string;
  secondaryColor?: string;
}

export default function SoundWaveVisualizer({
  color = "#ffcc00",
  secondaryColor = "#d95d24",
}: SoundWaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetAmplitude: 1, currentAmplitude: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        // Increase wave height when mouse is near
        mouseRef.current.targetAmplitude = 2.0;
      } else {
        mouseRef.current.targetAmplitude = 1.0;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetAmplitude = 1.0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let phase = 0;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation for the amplitude shift
      mouseRef.current.currentAmplitude +=
        (mouseRef.current.targetAmplitude - mouseRef.current.currentAmplitude) * 0.08;

      const amp = mouseRef.current.currentAmplitude;

      // Draw multiple overlapping sine waves to represent complex audio
      const waves = [
        {
          color: color,
          opacity: 0.16,
          speed: 0.004,
          freq: 0.005,
          ampOffset: 35,
          lineWidth: 2,
        },
        {
          color: secondaryColor,
          opacity: 0.12,
          speed: -0.006,
          freq: 0.008,
          ampOffset: 25,
          lineWidth: 1.5,
        },
        {
          color: "#ffffff",
          opacity: 0.06,
          speed: 0.003,
          freq: 0.003,
          ampOffset: 15,
          lineWidth: 1,
        },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = wave.lineWidth;

        // Shadow glow effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = wave.color;

        for (let x = 0; x < width; x++) {
          const angle = x * wave.freq + phase * (wave.speed * 200);
          
          // Taper formula: makes the wave flat at left and right edges for a clean look
          const taper = Math.sin((x / width) * Math.PI);

          // Sum of sines for a rich organic audio wave look
          let y =
            Math.sin(angle) * wave.ampOffset * amp * taper +
            Math.cos(angle * 0.45) * (wave.ampOffset * 0.6) * amp * taper;

          // Minor micro-vibrations
          y += Math.sin(angle * 4.0 + phase * 3) * 3 * taper;

          const centerY = height / 2;
          if (x === 0) {
            ctx.moveTo(x, centerY + y);
          } else {
            ctx.lineTo(x, centerY + y);
          }
        }
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      phase += 0.04;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, secondaryColor]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
