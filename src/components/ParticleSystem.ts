// Particle System Component
import { ParticleOptions } from '../types';

export class ParticleSystem {
  private container: HTMLElement;
  private particleCount: number;
  private particles: HTMLElement[] = [];
  private isRunning: boolean = false;
  private animationId: number | null = null;

  constructor(container: HTMLElement, options: { count: number }) {
    this.container = container;
    this.particleCount = options.count;
  }

  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.createInitialParticles();
    this.startParticleGeneration();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      clearInterval(this.animationId);
      this.animationId = null;
    }
    this.clearAllParticles();
  }

  private createInitialParticles(): void {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }
  }

  private startParticleGeneration(): void {
    this.animationId = window.setInterval(() => {
      if (this.particles.length < this.particleCount) {
        this.createParticle();
      }
    }, 3000);
  }

  private createParticle(): void {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const options = this.generateParticleOptions();
    this.applyParticleStyles(particle, options);
    
    this.container.appendChild(particle);
    this.particles.push(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      this.removeParticle(particle);
    }, (options.duration + options.delay) * 1000);
  }

  private generateParticleOptions(): ParticleOptions {
    return {
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    };
  }

  private applyParticleStyles(particle: HTMLElement, options: ParticleOptions): void {
    particle.style.width = options.size + 'px';
    particle.style.height = options.size + 'px';
    particle.style.left = options.position.x + '%';
    particle.style.top = options.position.y + '%';
    particle.style.animationDuration = options.duration + 's';
    particle.style.animationDelay = options.delay + 's';
  }

  private removeParticle(particle: HTMLElement): void {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
    }
    
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }

  private clearAllParticles(): void {
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }

  public getParticleCount(): number {
    return this.particles.length;
  }
}
