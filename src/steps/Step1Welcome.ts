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
    // Open the test runner in a new tab
    window.open('./test-runner.html', '_blank');
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
