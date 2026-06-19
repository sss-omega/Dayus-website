"use client";

import React from 'react';
import './DarkVeil.css';

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
}

export default function DarkVeil({}: DarkVeilProps) {
  // We keep the props interface so it doesn't break any page imports,
  // but internally render pure CSS animations which are 1000x faster.
  return (
    <div className="darkveil-container-css">
      <div className="darkveil-glow"></div>
      <div className="darkveil-glow-2"></div>
    </div>
  );
}
