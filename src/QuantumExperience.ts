// Quantum Experience Main Application Class
import { QuantumExperienceConfig, StepData } from './types/index.js';
import { PreloaderComponent } from './components/Preloader.js';
import { ParticleSystem } from './components/ParticleSystem.js';
import { GlitchEffect } from './components/GlitchEffect.js';
import { AudioSystem } from './components/AudioSystem.js';
import { PerformanceMonitor } from './components/PerformanceMonitor.js';
import { MatrixRain } from './components/MatrixRain.js';
import { StepManager } from './components/StepManager.js';
import { Step1Welcome } from './steps/Step1Welcome.js';
import { Step2QuantumBasics } from './steps/Step2QuantumBasics.js';
import { Step3BlochSphere } from './steps/Step3BlochSphere.js';
import { Step4MeasurementCollapse } from './steps/Step4MeasurementCollapse.js';
import { Step5QuantumEntanglement } from './steps/Step5QuantumEntanglement.js';
import { Step6QuantumGates } from './steps/Step6QuantumGates.js';
import { Step7Thermodynamics } from './steps/Step7Thermodynamics.js';

export class QuantumExperience {
  private config: QuantumExperienceConfig;
  private preloader!: PreloaderComponent;
  private mainApp!: HTMLElement;
  private particlesContainer!: HTMLElement;
  private particleSystem!: ParticleSystem;
  private glitchEffect!: GlitchEffect;
  private audioSystem!: AudioSystem;
  private performanceMonitor!: PerformanceMonitor;
  private matrixRain!: MatrixRain;
  private stepManager!: StepManager;
  private currentStep: number = 1;
  
  // Step components
  private step1!: Step1Welcome;
  private step2!: Step2QuantumBasics;
  private step3!: Step3BlochSphere;
  private step4!: Step4MeasurementCollapse;
  private step5!: Step5QuantumEntanglement;
  private step6!: Step6QuantumGates;
  private step7!: Step7Thermodynamics;

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
    this.initializeSteps();
    this.init();
  }

  private initializeElements(): void {
    this.preloader = new PreloaderComponent('preloader');
    this.mainApp = document.getElementById('main-app')!;
    this.particlesContainer = document.getElementById('particles-container')!;

    if (!this.mainApp) {
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
    
    this.stepManager = new StepManager((step: number) => {
      this.handleStepTransition(step);
    });
  }

  private initializeSteps(): void {
    this.step1 = new Step1Welcome();
    this.step2 = new Step2QuantumBasics();
    this.step3 = new Step3BlochSphere();
    this.step4 = new Step4MeasurementCollapse();
    this.step5 = new Step5QuantumEntanglement();
    this.step6 = new Step6QuantumGates();
    this.step7 = new Step7Thermodynamics();
    
    // Setup step transition listeners
    window.addEventListener('stepTransition', (e: any) => {
      console.log(`QuantumExperience: Received stepTransition event with step: ${e.detail.step}`);
      this.transitionToStep(e.detail.step);
    });
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
    this.matrixRain.start();
    this.initScrollEffects();
    
    // Initialize and show first step
    this.showStep(1);
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

  private async transitionToStep(stepNumber: number): Promise<void> {
    if (stepNumber === this.currentStep) return;
    
    // Validate step number
    if (stepNumber < 1 || stepNumber > 7) {
      console.warn(`Invalid step number: ${stepNumber}. Valid steps are 1-7.`);
      if (stepNumber > 7) {
        this.showComingSoonModal();
      }
      return;
    }
    
    try {
      console.log(`QuantumExperience: Starting transition from step ${this.currentStep} to step ${stepNumber}`);
      
      // Use step manager to show cyberpunk loading screen
      await this.stepManager.transitionToStep(stepNumber);
      
      console.log(`QuantumExperience: Loading screen completed, switching steps`);
      
      // Hide current step
      this.hideCurrentStep();
      
      // Show new step
      this.showStep(stepNumber);
      
      this.currentStep = stepNumber;
      
      console.log(`QuantumExperience: Transition to step ${stepNumber} completed`);
    } catch (error) {
      console.error('Step transition failed:', error);
    }
  }

  private handleStepTransition(step: number): void {
    console.log(`Transitioning to step ${step}`);
    // Additional handling logic can be added here
  }

  private showStep(stepNumber: number): void {
    console.log(`QuantumExperience: Showing step ${stepNumber}`);
    switch (stepNumber) {
      case 1:
        this.step1.initialize();
        this.step1.show();
        break;
      case 2:
        this.step2.initialize();
        this.step2.show();
        break;
      case 3:
        this.step3.initialize();
        this.step3.show();
        break;
      case 4:
        console.log('QuantumExperience: Initializing and showing Step 4');
        this.step4.initialize();
        this.step4.show();
        break;
      case 5:
        console.log('QuantumExperience: Initializing and showing Step 5');
        this.step5.initialize();
        this.step5.show();
        break;
      case 6:
        console.log('QuantumExperience: Initializing and showing Step 6');
        this.step6.show();
        break;
      case 7:
        console.log('QuantumExperience: Initializing and showing Step 7');
        this.step7.initialize();
        this.step7.show();
        break;
      default:
        console.warn(`Step ${stepNumber} not implemented yet`);
        break;
    }
  }

  private hideCurrentStep(): void {
    switch (this.currentStep) {
      case 1:
        this.step1.hide();
        break;
      case 2:
        this.step2.hide();
        break;
      case 3:
        this.step3.hide();
        break;
      case 4:
        this.step4.hide();
        break;
      case 5:
        this.step5.hide();
        break;
      case 6:
        this.step6.hide();
        break;
      case 7:
        this.step7.hide();
        break;
    }
  }

  private showComingSoonModal(): void {
    // Create a cyberpunk-style modal for "Coming Soon"
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: 'Orbitron', monospace;
    `;

    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #39ff14;
        border-radius: 10px;
        padding: 2rem;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 0 30px rgba(57, 255, 20, 0.3);
      ">
        <h2 style="color: #39ff14; margin-bottom: 1rem; font-size: 2rem;">STEP_06</h2>
        <p style="color: #ffffff; margin-bottom: 1.5rem; font-size: 1.1rem;">
          Coming Soon...
        </p>
        <p style="color: #cccccc; margin-bottom: 2rem;">
          More quantum adventures await! This step is currently under development.
        </p>
        <button id="close-modal" style="
          background: #39ff14;
          color: #000;
          border: none;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          font-family: 'Orbitron', monospace;
        ">UNDERSTOOD</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('#close-modal');
    const closeModal = () => {
      document.body.removeChild(modal);
    };

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Public API methods
  public destroy(): void {
    this.particleSystem?.stop();
    this.matrixRain?.stop();
    this.performanceMonitor?.destroy();
    this.stepManager?.destroy();
    this.step1?.destroy();
    this.step2?.destroy();
    this.step3?.destroy();
    this.step4?.destroy();
    this.step5?.destroy();
  }

  public getConfig(): QuantumExperienceConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<QuantumExperienceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getCurrentStep(): number {
    return this.currentStep;
  }

  public async goToStep(stepNumber: number): Promise<void> {
    await this.transitionToStep(stepNumber);
  }
}
