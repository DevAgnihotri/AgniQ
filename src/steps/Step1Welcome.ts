// Step 1: Welcome & Introduction
import { StepData } from '../types/index.js';

export class Step1Welcome {
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.createStep1Content();
  }

  private createStep1Content(): void {
    this.container = document.createElement('div');
    this.container.id = 'step-1-container';
    this.container.className = 'step-container';
    
    // Extract the current main-app content and put it in Step 1
    this.container.innerHTML = `
      <!-- Navigation Header -->
      <nav class="fixed top-0 w-full z-40 bg-dark-bg/90 backdrop-blur-sm border-b border-cyber-red">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-cyber font-bold text-cyber-red glitch-text" data-text="AgniQ">AgniQ</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-cyber-green font-mono text-sm">STEP_01_ACTIVE</span>
              <div class="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content Section -->
      <section class="min-h-screen flex flex-col justify-center items-center relative pt-20 pb-12">
        <div class="max-w-6xl mx-auto text-center px-4">
          <!-- Main Titles -->
          <div class="mb-16">
            <h1 class="main-title font-cyber font-black mb-6 glitch-text" data-text="AgniQ">AgniQ</h1>
            <h2 class="main-title font-cyber font-black mb-12 text-cyber-blue glitch-text" data-text="QUANTUM COMPUTING">QUANTUM COMPUTING</h2>
            
            <div class="section-header text-2xl md:text-3xl font-bold text-cyber-green mb-8">
              A Progressive Cyberpunk Quantum Experience
            </div>
            
            <p class="typewriter text-lg md:text-xl text-gray-300 font-mono max-w-3xl mx-auto leading-relaxed">
              Welcome to AgniQ - where quantum mechanics meets cyberpunk aesthetics. 
              Journey through the quantum realm where reality bends to probability and computation transcends classical limits. 
              Experience the future of quantum computing through an immersive interactive interface.
            </p>
          </div>

          <!-- Feature Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div class="cyber-box p-6 hover:border-cyber-blue transition-colors duration-300">
              <div class="text-4xl mb-4">⚛️</div>
              <h3 class="text-xl font-cyber font-bold text-cyber-green mb-3">QUANTUM MECHANICS</h3>
              <p class="text-gray-400 text-sm">Explore superposition, entanglement, and quantum gates through interactive visualizations</p>
            </div>
            
            <div class="cyber-box p-6 hover:border-cyber-blue transition-colors duration-300">
              <div class="text-4xl mb-4">🧮</div>
              <h3 class="text-xl font-cyber font-bold text-cyber-green mb-3">QUANTUM ALGORITHMS</h3>
              <p class="text-gray-400 text-sm">Discover how quantum algorithms solve problems exponentially faster than classical computers</p>
            </div>
            
            <div class="cyber-box p-6 hover:border-cyber-blue transition-colors duration-300">
              <div class="text-4xl mb-4">🔮</div>
              <h3 class="text-xl font-cyber font-bold text-cyber-green mb-3">FUTURE APPLICATIONS</h3>
              <p class="text-gray-400 text-sm">Learn about quantum cryptography, drug discovery, and AI acceleration</p>
            </div>

            <a href="./flowchart/index.html" target="_blank" class="cyber-box p-6 hover:border-cyber-pink transition-colors duration-300 cursor-pointer group">
              <div class="text-4xl mb-4 group-hover:animate-pulse">📊</div>
              <h3 class="text-xl font-cyber font-bold text-cyber-pink mb-3">QUANTUM FLOWCHART</h3>
              <p class="text-gray-400 text-sm">Interactive quantum field visualization showing the complete quantum computation process</p>
              <div class="mt-3 text-cyber-pink font-mono text-xs">Click to explore →</div>
            </a>
          </div>

          <!-- Journey Steps Preview -->
          <div class="mb-16">
            <h3 class="text-2xl font-cyber font-bold text-cyber-blue mb-8">YOUR QUANTUM JOURNEY</h3>
            <div class="flex flex-wrap justify-center items-center space-x-4 space-y-2">
              <div class="step-preview bg-cyber-green text-black px-4 py-2 rounded font-bold">01: INTRODUCTION</div>
              <div class="text-cyber-green">→</div>
              <div class="step-preview border border-gray-600 text-gray-400 px-4 py-2 rounded">02: QUANTUM BASICS</div>
              <div class="text-gray-600">→</div>
              <div class="step-preview border border-gray-600 text-gray-400 px-4 py-2 rounded">03: ALGORITHMS</div>
              <div class="text-gray-600">→</div>
              <div class="step-preview border border-gray-600 text-gray-400 px-4 py-2 rounded">04: APPLICATIONS</div>
              <div class="text-gray-600">→</div>
              <div class="step-preview border border-gray-600 text-gray-400 px-4 py-2 rounded">05: FUTURE</div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="text-center">
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <button id="continueBtn" class="cyber-btn bg-cyber-green text-black text-xl font-cyber font-bold px-12 py-4 rounded-lg 
                         border-2 border-cyber-green hover:bg-transparent hover:text-cyber-green 
                         transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyber-green/50">
                CONTINUE_TO_STEP_02 →
              </button>
              
              <button id="testModeBtn" class="cyber-btn bg-cyber-blue text-white text-lg font-cyber font-bold px-8 py-3 rounded-lg 
                         border-2 border-cyber-blue hover:bg-transparent hover:text-cyber-blue 
                         transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyber-blue/50">
                🧪 TEST_MODE
              </button>
            </div>
            
            <div class="mt-8 text-sm text-gray-500 font-mono">
              Press [CTRL+SHIFT+P] for performance monitor | Test Mode: Quick step navigation
            </div>
          </div>
        </div>

        <!-- Floating Particles Container -->
        <div id="particles-container" class="absolute inset-0 pointer-events-none"></div>
      </section>
    `;
  }

  public initialize(): void {
    if (this.isInitialized) return;
    
    // Add to main app container
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
      // Clear existing content and add step 1
      mainApp.innerHTML = '';
      mainApp.appendChild(this.container!);
    }

    this.setupEventListeners();
    this.isInitialized = true;
  }

  private setupEventListeners(): void {
    const continueBtn = document.getElementById('continueBtn');
    const testModeBtn = document.getElementById('testModeBtn');
    
    if (continueBtn) {
      continueBtn.addEventListener('mouseenter', () => {
        continueBtn.style.boxShadow = '0 0 20px #39ff14, inset 0 0 20px rgba(57, 255, 20, 0.1)';
        continueBtn.style.transform = 'translateY(-2px) scale(1.05)';
      });
      
      continueBtn.addEventListener('mouseleave', () => {
        continueBtn.style.boxShadow = '';
        continueBtn.style.transform = '';
      });
      
      continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleContinue();
      });
    }

    if (testModeBtn) {
      testModeBtn.addEventListener('mouseenter', () => {
        testModeBtn.style.boxShadow = '0 0 20px #00d9ff, inset 0 0 20px rgba(0, 217, 255, 0.1)';
        testModeBtn.style.transform = 'translateY(-2px) scale(1.05)';
      });
      
      testModeBtn.addEventListener('mouseleave', () => {
        testModeBtn.style.boxShadow = '';
        testModeBtn.style.transform = '';
      });
      
      testModeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openTestMode();
      });
    }
  }

  private handleContinue(): void {
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
      continueBtn.style.transform = 'scale(0.95)';
      continueBtn.style.transition = 'transform 0.1s ease';
      
      setTimeout(() => {
        continueBtn.style.transform = '';
        // Directly proceed to step 2 without modal
        this.proceedToStep2();
      }, 100);
    }
  }

  private proceedToStep2(): void {
    // Dispatch event to main application to use StepManager
    const event = new CustomEvent('stepTransition', { detail: { step: 2 } });
    window.dispatchEvent(event);
  }

  private openTestMode(): void {
    // Create test mode overlay directly in the current page
    this.createTestModeOverlay();
  }

  private createTestModeOverlay(): void {
    // Create test panel overlay
    const testOverlay = document.createElement('div');
    testOverlay.id = 'test-mode-overlay';
    testOverlay.className = `
      fixed inset-0 z-50 bg-black/90 backdrop-blur-sm 
      flex items-center justify-center
    `;

    testOverlay.innerHTML = `
      <div class="bg-gray-900/95 border border-cyan-400/50 rounded-lg p-6 max-w-2xl w-full mx-4 
                  shadow-2xl shadow-cyan-400/20">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-cyan-400">🧪 QUANTUM STEP TESTER</h2>
          <button id="close-test-mode" class="text-red-400 hover:text-red-300 text-2xl font-bold">✕</button>
        </div>

        <!-- Current Step Display -->
        <div class="mb-6 text-center">
          <div class="text-sm text-gray-400 mb-2">CURRENT STEP:</div>
          <div id="current-step-display" class="text-3xl font-bold text-cyan-400">1</div>
        </div>

        <!-- Step Navigation Grid -->
        <div class="grid grid-cols-4 gap-3 mb-6">
          ${this.createStepButtons()}
        </div>

        <!-- Quick Navigation -->
        <div class="flex gap-3 mb-6">
          <button id="prev-step" class="flex-1 px-4 py-3 bg-orange-600/30 hover:bg-orange-600/50 
                     border border-orange-400/50 rounded text-orange-400 font-bold 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            ← PREVIOUS
          </button>
          <button id="next-step" class="flex-1 px-4 py-3 bg-cyan-600/30 hover:bg-cyan-600/50 
                     border border-cyan-400/50 rounded text-cyan-400 font-bold 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            NEXT →
          </button>
        </div>

        <!-- Status -->
        <div class="bg-gray-800/50 rounded p-3 mb-4">
          <div class="text-xs text-gray-400 mb-1">STATUS:</div>
          <div id="test-status" class="text-sm text-green-400 font-mono">Ready for testing</div>
        </div>

        <!-- Help -->
        <div class="text-xs text-gray-500 text-center">
          Use keyboard: 1-7 for steps | ← → for navigation | ESC to close
        </div>
      </div>
    `;

    document.body.appendChild(testOverlay);
    this.attachTestModeListeners();
  }

  private createStepButtons(): string {
    const steps = [
      { num: 1, name: 'Welcome', color: 'blue' },
      { num: 2, name: 'Basics', color: 'green' },
      { num: 3, name: 'Bloch', color: 'purple' },
      { num: 4, name: 'Measure', color: 'red' },
      { num: 5, name: 'Entangle', color: 'pink' },
      { num: 6, name: 'Gates', color: 'indigo' },
      { num: 7, name: 'Thermo', color: 'orange' }
    ];

    return steps.map(step => `
      <button class="test-step-btn px-3 py-3 bg-${step.color}-600/30 hover:bg-${step.color}-600/50 
                     border border-${step.color}-400/50 rounded text-${step.color}-400 
                     font-bold text-sm transition-all duration-200 text-center" 
              data-step="${step.num}">
        <div class="text-lg">${step.num}</div>
        <div class="text-xs opacity-75">${step.name}</div>
      </button>
    `).join('');
  }

  private attachTestModeListeners(): void {
    let currentTestStep = 1;

    // Close button
    document.getElementById('close-test-mode')?.addEventListener('click', () => {
      document.getElementById('test-mode-overlay')?.remove();
    });

    // Step buttons
    document.querySelectorAll('.test-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepNum = parseInt((e.currentTarget as HTMLElement).dataset.step!);
        this.navigateToTestStep(stepNum);
        currentTestStep = stepNum;
        this.updateTestDisplay(currentTestStep);
      });
    });

    // Previous/Next buttons
    document.getElementById('prev-step')?.addEventListener('click', () => {
      if (currentTestStep > 1) {
        currentTestStep--;
        this.navigateToTestStep(currentTestStep);
        this.updateTestDisplay(currentTestStep);
      }
    });

    document.getElementById('next-step')?.addEventListener('click', () => {
      if (currentTestStep < 7) {
        currentTestStep++;
        this.navigateToTestStep(currentTestStep);
        this.updateTestDisplay(currentTestStep);
      }
    });

    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.getElementById('test-mode-overlay')?.remove();
        document.removeEventListener('keydown', handleKeyPress);
        return;
      }

      if (e.ctrlKey || e.metaKey) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentTestStep > 1) {
            currentTestStep--;
            this.navigateToTestStep(currentTestStep);
            this.updateTestDisplay(currentTestStep);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentTestStep < 7) {
            currentTestStep++;
            this.navigateToTestStep(currentTestStep);
            this.updateTestDisplay(currentTestStep);
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          e.preventDefault();
          const stepNum = parseInt(e.key);
          currentTestStep = stepNum;
          this.navigateToTestStep(stepNum);
          this.updateTestDisplay(currentTestStep);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('test-mode-overlay')?.remove();
      }
    });
  }

  private navigateToTestStep(stepNumber: number): void {
    try {
      this.updateTestStatus(`Loading Step ${stepNumber}...`, 'loading');
      
      // Dispatch step transition event
      const event = new CustomEvent('stepTransition', { detail: { step: stepNumber } });
      window.dispatchEvent(event);
      
      this.updateTestStatus(`Step ${stepNumber} loaded successfully`, 'success');
      console.log(`✅ Test Mode: Loaded Step ${stepNumber}`);
    } catch (error) {
      this.updateTestStatus(`Error loading Step ${stepNumber}: ${error}`, 'error');
      console.error(`❌ Test Mode Error:`, error);
    }
  }

  private updateTestDisplay(currentStep: number): void {
    // Update current step display
    const display = document.getElementById('current-step-display');
    if (display) {
      display.textContent = currentStep.toString();
    }

    // Update button states
    document.querySelectorAll('.test-step-btn').forEach(btn => {
      const stepNum = parseInt((btn as HTMLElement).dataset.step!);
      if (stepNum === currentStep) {
        btn.classList.add('ring-2', 'ring-white', 'ring-opacity-50');
      } else {
        btn.classList.remove('ring-2', 'ring-white', 'ring-opacity-50');
      }
    });

    // Update prev/next button states
    const prevBtn = document.getElementById('prev-step') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-step') as HTMLButtonElement;
    
    if (prevBtn) prevBtn.disabled = currentStep <= 1;
    if (nextBtn) nextBtn.disabled = currentStep >= 7;
  }

  private updateTestStatus(message: string, type: 'success' | 'error' | 'loading' = 'success'): void {
    const statusElement = document.getElementById('test-status');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `text-sm font-mono ${
        type === 'success' ? 'text-green-400' :
        type === 'error' ? 'text-red-400' :
        'text-yellow-400'
      }`;
    }
  }

  public show(): void {
    if (this.container) {
      this.container.classList.remove('hidden');
      this.container.style.display = 'block';
    }
  }

  public hide(): void {
    if (this.container) {
      this.container.classList.add('hidden');
      this.container.style.display = 'none';
    }
  }

  public destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.isInitialized = false;
  }

  public getStepData(): StepData {
    return {
      id: 1,
      title: "Welcome to Quantum Computing",
      description: "Introduction to the quantum computing experience",
      completed: true,
      progress: 100
    };
  }
}
