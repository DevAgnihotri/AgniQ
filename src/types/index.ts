// Type definitions for Quantum Computing Experience
export { Step7Thermodynamics } from '../steps/Step7Thermodynamics';

export interface QuantumExperienceConfig {
  preloaderDuration: number;
  particleCount: number;
  audioEnabled: boolean;
  performanceMonitoring: boolean;
}

export interface ParticleOptions {
  size: number;
  duration: number;
  delay: number;
  position: {
    x: number;
    y: number;
  };
}

export interface GlitchTextOptions {
  text: string;
  intensity: number;
  frequency: number;
}

export interface AudioOptions {
  frequency: number;
  duration: number;
  volume: number;
}

export interface StepData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

export interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
  };
  timestamp: number;
}

export type CyberpunkColor = 'cyber-red' | 'cyber-green' | 'cyber-blue' | 'cyber-pink' | 'neon-cyan';

export interface AnimationConfig {
  name: string;
  duration: number;
  easing: string;
  iterations: number | 'infinite';
}
