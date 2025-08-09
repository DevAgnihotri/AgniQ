// Glitch Effect Component
import { GlitchTextOptions } from '../types';

export class GlitchEffect {
  private options: GlitchTextOptions;
  private elements: HTMLElement[] = [];
  private intervals: number[] = [];

  constructor(options: Partial<GlitchTextOptions> = {}) {
    this.options = {
      text: '',
      intensity: 0.5,
      frequency: 2000,
      ...options
    };
  }

  public initialize(): void {
    this.findGlitchElements();
    this.setupGlitchEffects();
  }

  private findGlitchElements(): void {
    const glitchElements = document.querySelectorAll('.glitch-text');
    this.elements = Array.from(glitchElements) as HTMLElement[];
  }

  private setupGlitchEffects(): void {
    this.elements.forEach(element => {
      // Store original text
      element.setAttribute('data-text', element.textContent || '');
      
      // Start random glitch intervals
      const intervalId = window.setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
          this.triggerGlitch(element);
        }
      }, this.options.frequency);
      
      this.intervals.push(intervalId);
    });
  }

  private triggerGlitch(element: HTMLElement): void {
    element.style.animation = 'none';
    
    setTimeout(() => {
      element.style.animation = 'glitch 0.3s ease-in-out';
    }, 50);
  }

  public addGlitchElement(element: HTMLElement): void {
    if (!this.elements.includes(element)) {
      this.elements.push(element);
      element.setAttribute('data-text', element.textContent || '');
      
      const intervalId = window.setInterval(() => {
        if (Math.random() < 0.1) {
          this.triggerGlitch(element);
        }
      }, this.options.frequency);
      
      this.intervals.push(intervalId);
    }
  }

  public removeGlitchElement(element: HTMLElement): void {
    const index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
      // Note: We can't easily remove specific intervals without tracking them per element
      // This is a simplified implementation
    }
  }

  public updateOptions(newOptions: Partial<GlitchTextOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  public destroy(): void {
    this.intervals.forEach(intervalId => {
      clearInterval(intervalId);
    });
    this.intervals = [];
    this.elements = [];
  }
}
