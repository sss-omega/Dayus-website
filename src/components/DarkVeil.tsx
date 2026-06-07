"use client";

import { useRef, useEffect } from 'react';
// @ts-ignore
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import './DarkVeil.css';

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
#ifdef GL_ES
precision highp float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;

void main(){
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    // Scale and center UV coordinates
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;
    
    // Slow down the time variable for smooth micro-animations
    float t = uTime * 0.4;
    
    // Shifting wave pattern 1
    float wave1 = sin(p.x * 2.2 + t) * 0.5 + 0.5;
    
    // Shifting wave pattern 2
    float wave2 = sin(p.y * 2.8 - t * 1.2) * 0.5 + 0.5;
    
    // Rotating coordinates to simulate light rotating inside
    float angle = t * 0.8 + length(p) * 0.3;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotatedP = rot * p;
    
    // Secondary noise/glow calculation
    float glowPattern = sin(rotatedP.x * 2.5) * cos(rotatedP.y * 2.5) * 0.5 + 0.5;
    
    // Shifting glow pattern 3
    float wave3 = cos(length(rotatedP) * 3.5 - t * 1.5) * 0.5 + 0.5;
    
    // Premium theme colors:
    vec3 baseBg = vec3(0.04, 0.03, 0.02);       // Deep amber-black background
    vec3 darkRed = vec3(0.35, 0.08, 0.02);     // Deep crimson glow
    vec3 vibrantOrange = vec3(0.85, 0.32, 0.08); // Accent orange
    vec3 goldAccent = vec3(0.98, 0.72, 0.28);    // Shimmering gold
    
    // Blend layers together
    float mixFactor = (wave1 * 0.3 + wave2 * 0.3 + wave3 * 0.2 + glowPattern * 0.2);
    
    vec3 finalColor = mix(baseBg, darkRed, mixFactor);
    finalColor = mix(finalColor, vibrantOrange, wave1 * wave2);
    finalColor = mix(finalColor, goldAccent, glowPattern * wave3 * 0.65);
    
    // Add vignette to center the focus and make the edges darker
    float vignette = 1.0 - dot(p * 0.45, p * 0.45);
    finalColor *= clamp(vignette, 0.25, 1.0);
    
    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
}

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
  resolutionScale = 1
}: DarkVeilProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uHueShift: { value: hueShift }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = parent.clientWidth,
        h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', resize);
    resize();

    const start = performance.now();
    let frame = 0;

    const loop = () => {
      program.uniforms.uTime.value = ((performance.now() - start) / 1000) * speed;
      program.uniforms.uHueShift.value = hueShift;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [hueShift, speed, resolutionScale]);
  return <canvas ref={ref} className="darkveil-canvas" />;
}
