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
    
    // Setup step transition listeners
    window.addEventListener('stepTransition', (e: any) => {
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
    
    try {
      // Use step manager to show cyberpunk loading screen
      await this.stepManager.transitionToStep(stepNumber);
      
      // Hide current step
      this.hideCurrentStep();
      
      // Show new step
      this.showStep(stepNumber);
      
      this.currentStep = stepNumber;
    } catch (error) {
      console.error('Step transition failed:', error);
    }
  }

  private handleStepTransition(step: number): void {
    console.log(`Transitioning to step ${step}`);
    // Additional handling logic can be added here
  }

  private showStep(stepNumber: number): void {
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
        this.step4.initialize();
        this.step4.show();
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
    }
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
