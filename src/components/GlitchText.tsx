"use client";

import React from 'react';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  className = ''
}) => {
  return (
    <span className={className}>
      {children}
    </span>
  );
};

export default GlitchText;
