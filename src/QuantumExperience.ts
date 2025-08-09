// Quantum Experience Main Application Class
import { QuantumExperienceConfig, StepData } from './types/index.js';
import { PreloaderComponent } from './components/Preloader.js';
import { ParticleSystem } from './components/ParticleSystem.js';
import { GlitchEffect } from './components/GlitchEffect.js';
import { AudioSystem } from './components/AudioSystem.js';
import { PerformanceMonitor } from './components/PerformanceMonitor.js';
import { MatrixRain } from './components/MatrixRain.js';

export class QuantumExperience {
  private config: QuantumExperienceConfig;
  private preloader!: PreloaderComponent;
  private mainApp!: HTMLElement;
  private continueBtn!: HTMLElement;
  private particlesContainer!: HTMLElement;
  private particleSystem!: ParticleSystem;
  private glitchEffect!: GlitchEffect;
  private audioSystem!: AudioSystem;
  private performanceMonitor!: PerformanceMonitor;
  private matrixRain!: MatrixRain;

  constructor(config: Partial<QuantumExperienceConfig> = {}) {
    this.config = {
      preloaderDuration: 3000,
      particleCount: 50,
      audioEnabled: true,
      performanceMonitoring: false,
      ...config
    };

    this.initializeElements();
    this.initializeComponents();
    this.init();
  }

  private initializeElements(): void {
    this.preloader = new PreloaderComponent('preloader');
    this.mainApp = document.getElementById('main-app')!;
    this.continueBtn = document.getElementById('continueBtn')!;
    this.particlesContainer = document.getElementById('particles-container')!;

    if (!this.mainApp || !this.continueBtn || !this.particlesContainer) {
      throw new Error('Required DOM elements not found');
    }
  }

  private initializeComponents(): void {
    this.particleSystem = new ParticleSystem(this.particlesContainer, {
      count: this.config.particleCount
    });

    this.glitchEffect = new GlitchEffect({
      intensity: 0.5,
      frequency: 2000
    });

    if (this.config.audioEnabled) {
      this.audioSystem = new AudioSystem();
    }

    if (this.config.performanceMonitoring) {
      this.performanceMonitor = new PerformanceMonitor();
    }

    this.matrixRain = new MatrixRain();
  }

  public init(): void {
    this.showPreloader();
    
    setTimeout(() => {
      this.hidePreloader();
      this.initMainApp();
    }, this.config.preloaderDuration);
  }

  private showPreloader(): void {
    this.preloader.show();
  }

  private hidePreloader(): void {
    this.preloader.hide(() => {
      this.mainApp.classList.remove('hidden');
      this.fadeInMainApp();
    });
  }

  private fadeInMainApp(): void {
    this.mainApp.style.opacity = '0';
    this.mainApp.style.transition = 'opacity 1s ease-in';
    
    requestAnimationFrame(() => {
      this.mainApp.style.opacity = '1';
    });
  }

  private initMainApp(): void {
    this.glitchEffect.initialize();
    this.particleSystem.start();
    this.initTypewriter();
    this.initButtonInteractions();
    this.initScrollEffects();
    this.matrixRain.start();
  }

  private initTypewriter(): void {
    const typewriterElement = document.querySelector('.typewriter') as HTMLElement;
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent || '';
    typewriterElement.textContent = '';
    typewriterElement.style.borderRight = '3px solid #39ff14';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      typewriterElement.textContent += text.charAt(i);
      i++;
      
      if (i >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          typewriterElement.style.borderRight = 'none';
        }, 2000);
      }
    }, 100);
  }

  private initButtonInteractions(): void {
    if (this.continueBtn) {
      this.continueBtn.addEventListener('mouseenter', () => {
        this.continueBtn.style.boxShadow = '0 0 20px #39ff14, inset 0 0 20px rgba(57, 255, 20, 0.1)';
        this.continueBtn.style.transform = 'translateY(-2px)';
      });
      
      this.continueBtn.addEventListener('mouseleave', () => {
        this.continueBtn.style.boxShadow = '';
        this.continueBtn.style.transform = '';
      });
      
      this.continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleContinue();
      });
    }
  }

  private handleContinue(): void {
    this.continueBtn.style.transform = 'scale(0.95)';
    this.continueBtn.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      this.continueBtn.style.transform = '';
    }, 100);
    
    this.showContinueMessage();
  }

  private showContinueMessage(): void {
    const message = this.createContinueModal();
    document.body.appendChild(message.modal);
    document.body.appendChild(message.backdrop);
    
    this.handleModalInteractions(message);
  }

  private createContinueModal(): { modal: HTMLElement; backdrop: HTMLElement } {
    const modal = document.createElement('div');
    modal.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border-2 border-cyber-green p-8 rounded-lg text-center z-50';
    modal.innerHTML = `
      <div class="text-cyber-green text-2xl font-cyber mb-4">STEP_01_COMPLETE</div>
      <div class="text-gray-300 mb-6">Ready to proceed to Step 2: How Quantum Computing Works?</div>
      <div class="space-x-4">
        <button id="proceedBtn" class="bg-cyber-green text-black px-6 py-2 font-bold hover:bg-cyber-blue transition-colors">PROCEED</button>
        <button id="cancelBtn" class="bg-transparent border border-cyber-red text-cyber-red px-6 py-2 hover:bg-cyber-red hover:text-black transition-colors">CANCEL</button>
      </div>
    `;

    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black bg-opacity-75 z-40';

    return { modal, backdrop };
  }

  private handleModalInteractions(elements: { modal: HTMLElement; backdrop: HTMLElement }): void {
    const proceedBtn = elements.modal.querySelector('#proceedBtn') as HTMLElement;
    const cancelBtn = elements.modal.querySelector('#cancelBtn') as HTMLElement;

    proceedBtn?.addEventListener('click', () => {
      this.proceedToStep2();
    });
    
    cancelBtn?.addEventListener('click', () => {
      this.closeModal(elements);
    });
    
    elements.backdrop.addEventListener('click', () => {
      this.closeModal(elements);
    });
  }

  private closeModal(elements: { modal: HTMLElement; backdrop: HTMLElement }): void {
    document.body.removeChild(elements.modal);
    document.body.removeChild(elements.backdrop);
  }

  private proceedToStep2(): void {
    const transition = this.createTransitionScreen();
    document.body.appendChild(transition);
    
    requestAnimationFrame(() => {
      transition.style.opacity = '1';
    });
    
    setTimeout(() => {
      alert('Step 2 will be implemented next! This is where we\'ll dive into qubits and superposition.');
      document.body.removeChild(transition);
    }, 2000);
  }

  private createTransitionScreen(): HTMLElement {
    const transition = document.createElement('div');
    transition.className = 'fixed inset-0 bg-cyber-blue z-50 flex items-center justify-center';
    transition.style.opacity = '0';
    transition.style.transition = 'opacity 0.5s ease-in';
    transition.innerHTML = `
      <div class="text-white text-4xl font-cyber">LOADING_STEP_02...</div>
    `;
    return transition;
  }

  private initScrollEffects(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.cyber-box');
    animateElements.forEach(el => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }

  // Public API methods
  public destroy(): void {
    this.particleSystem?.stop();
    this.matrixRain?.stop();
    this.performanceMonitor?.destroy();
  }

  public getConfig(): QuantumExperienceConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<QuantumExperienceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
