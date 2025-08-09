// Utility functions for Quantum Computing Experience
import { CyberpunkColor, AnimationConfig } from '../types';

/**
 * Color utilities for cyberpunk theme
 */
export const ColorUtils = {
  getCyberpunkColor(color: CyberpunkColor): string {
    const colors = {
      'cyber-red': '#ff4d4d',
      'cyber-green': '#39ff14',
      'cyber-blue': '#0033ff',
      'cyber-pink': '#ff006e',
      'neon-cyan': '#00ffff'
    };
    return colors[color];
  },

  hexToRgba(hex: string, alpha: number = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  getRandomCyberpunkColor(): CyberpunkColor {
    const colors: CyberpunkColor[] = ['cyber-red', 'cyber-green', 'cyber-blue', 'cyber-pink', 'neon-cyan'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
};

/**
 * Animation utilities
 */
export const AnimationUtils = {
  createAnimation(element: HTMLElement, config: AnimationConfig): Animation {
    return element.animate([], {
      duration: config.duration,
      easing: config.easing,
      iterations: config.iterations === 'infinite' ? Infinity : config.iterations
    });
  },

  fadeIn(element: HTMLElement, duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${duration}ms ease-in`;
      
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  },

  fadeOut(element: HTMLElement, duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease-out`;
      element.style.opacity = '0';
      setTimeout(resolve, duration);
    });
  },

  slideUp(element: HTMLElement, duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      element.style.transform = 'translateY(50px)';
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      
      requestAnimationFrame(() => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  }
};

/**
 * DOM utilities
 */
export const DOMUtils = {
  createElement(tag: string, className?: string, innerHTML?: string): HTMLElement {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },

  getElement(selector: string): HTMLElement | null {
    return document.querySelector(selector);
  },

  getElements(selector: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(selector));
  },

  removeElement(element: HTMLElement): void {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
};

/**
 * Math utilities
 */
export const MathUtils = {
  random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  },

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  },

  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },

  easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
};

/**
 * Performance utilities
 */
export const PerformanceUtils = {
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  measurePerformance(name: string, fn: () => void): number {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;
    console.log(`${name} took ${duration.toFixed(2)}ms`);
    return duration;
  }
};

/**
 * Local storage utilities
 */
export const StorageUtils = {
  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
      return defaultValue;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  }
};

/**
 * Device detection utilities
 */
export const DeviceUtils = {
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  isTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  getViewportSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },

  supportsWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  },

  supportsWebAudio(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }
};
