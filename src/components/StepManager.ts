// Step Manager Component
import { StepData } from '../types/index.js';

export class StepManager {
  private currentStep: number = 1;
  private maxSteps: number = 6; // Updated to include Step 6: Quantum Gates
  private loadingContainer: HTMLElement | null = null;
  private stepCallback: ((step: number) => void) | null = null;

  constructor(callback?: (step: number) => void) {
    this.stepCallback = callback || null;
  }

  public async transitionToStep(stepNumber: number): Promise<void> {
    if (stepNumber < 1 || stepNumber > this.maxSteps) {
      throw new Error(`Invalid step number: ${stepNumber}. Must be between 1 and ${this.maxSteps}`);
    }

    // Show cyberpunk loading screen
    await this.showCyberpunkLoader(stepNumber);
    
    // Update current step
    this.currentStep = stepNumber;
    
    // Execute callback if provided
    if (this.stepCallback) {
      this.stepCallback(stepNumber);
    }
  }

  private async showCyberpunkLoader(targetStep: number): Promise<void> {
    return new Promise((resolve) => {
      // Create loading container
      this.loadingContainer = this.createLoaderElement(targetStep);
      document.body.appendChild(this.loadingContainer);

      // Start loader animation
      this.animateLoader();

      // Remove loader after animation completes
      setTimeout(() => {
        if (this.loadingContainer) {
          document.body.removeChild(this.loadingContainer);
          this.loadingContainer = null;
        }
        resolve();
      }, 4000); // 4 seconds total including fade out
    });
  }

  private createLoaderElement(targetStep: number): HTMLElement {
    const container = document.createElement('div');
    container.className = 'step-loader-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      color: white;
      overflow: hidden;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Orbitron', 'Share Tech Mono', monospace;
    `;

    const loader = document.createElement('div');
    loader.className = 'step-loader';
    loader.style.cssText = `
      display: flex;
      flex-direction: column;
      width: 80%;
      max-width: 600px;
      animation: loaderFadeIn 0.5s ease-in-out;
    `;

    loader.innerHTML = `
      <div class="loader-title" style="display: flex; align-items: center; margin-bottom: 2rem;">
        <p class="loading-text" style="font-size: 1.5rem; letter-spacing: 0.3rem; margin-right: 1rem;">LOADING STEP_${targetStep.toString().padStart(2, '0')}</p>
        <div class="therefore" style="font-size: 24px; animation: rotate 1s linear infinite; margin-right: 1rem;">∴</div>
        <p class="loading-number" style="font-size: 1.5rem; margin-left: auto;">0%</p>
      </div>
      
      <div class="loading-bar-border" style="
        display: flex;
        align-items: center;
        padding: 3px;
        border-radius: 3px;
        border-top: 1px solid rgba(57, 255, 20, 0.5);
        border-bottom: 1px solid rgba(57, 255, 20, 0.5);
        width: 100%;
        margin-bottom: 1rem;
      ">
        <div class="loading-bar" style="
          height: 0.6rem;
          margin: 1px 0px;
          background: linear-gradient(90deg, #39ff14, #00ff9f);
          width: 0%;
          transition: width 3s ease-in-out;
        "></div>
      </div>
      
      <div class="warning" style="margin-top: 0.5rem; display: flex; height: 1.2rem; align-items: center;">
        <div class="exclamation" style="
          width: 1rem;
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #39ff14;
          color: black;
          border-radius: 3px;
          margin-right: 0.5rem;
          font-weight: bold;
        ">!</div>
        <span style="color: #39ff14;">QUANTUM SYSTEM INITIALIZING - DO NOT INTERRUPT</span>
      </div>
      
      <div class="line-cascades" style="
        margin-left: auto;
        display: flex;
        align-items: end;
        margin-top: 3rem;
        height: 5rem;
        overflow: hidden;
      ">
        <div class="cascade-text" style="
          font-size: 12px;
          white-space: pre;
          text-align: end;
          color: #b5b5b5;
          line-height: 1.2;
        "></div>
      </div>
    `;

    container.appendChild(loader);
    this.addLoaderStyles();
    return container;
  }

  private addLoaderStyles(): void {
    if (document.getElementById('step-loader-styles')) return;

    const style = document.createElement('style');
    style.id = 'step-loader-styles';
    style.textContent = `
      @keyframes loaderFadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes rotate {
        0% { transform: rotate(0); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes textGlow {
        0%, 100% { text-shadow: 0 0 5px #39ff14; }
        50% { text-shadow: 0 0 20px #39ff14, 0 0 30px #39ff14; }
      }
      
      .step-loader .loading-text {
        animation: textGlow 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }

  private animateLoader(): void {
    if (!this.loadingContainer) return;

    const loadingBar = this.loadingContainer.querySelector('.loading-bar') as HTMLElement;
    const loadingNumber = this.loadingContainer.querySelector('.loading-number') as HTMLElement;
    const cascadeText = this.loadingContainer.querySelector('.cascade-text') as HTMLElement;

    if (!loadingBar || !loadingNumber || !cascadeText) return;

    // Animate loading bar and percentage
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      
      loadingBar.style.width = `${progress}%`;
      loadingNumber.textContent = `${Math.round(progress)}%`;
    }, 150);

    // Animate cascade text
    const cascadeMessages = [
      'Initializing quantum field generators...',
      'Loading qubit configuration matrices...',
      'Establishing superposition protocols...',
      'Verifying entanglement channels...',
      'Calibrating measurement apparatus...',
      'Synchronizing quantum state vectors...',
      'Activating cyberpunk interface...',
      'Step transition complete.'
    ];

    let messageIndex = 0;
    let displayedMessages: string[] = [];
    
    const messageInterval = setInterval(() => {
      if (messageIndex < cascadeMessages.length) {
        displayedMessages.push(cascadeMessages[messageIndex]);
        if (displayedMessages.length > 5) {
          displayedMessages.shift(); // Keep only last 5 messages
        }
        cascadeText.textContent = displayedMessages.join('\\n');
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 400);
  }

  public getCurrentStep(): number {
    return this.currentStep;
  }

  public getMaxSteps(): number {
    return this.maxSteps;
  }

  public setStepCallback(callback: (step: number) => void): void {
    this.stepCallback = callback;
  }

  public destroy(): void {
    if (this.loadingContainer && this.loadingContainer.parentNode) {
      this.loadingContainer.parentNode.removeChild(this.loadingContainer);
      this.loadingContainer = null;
    }
    
    const styles = document.getElementById('step-loader-styles');
    if (styles) {
      styles.remove();
    }
  }
}
