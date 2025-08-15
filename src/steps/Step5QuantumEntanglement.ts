// Step 5: Quantum Entanglement
import { StepData } from '../types/index.js';

export class Step5QuantumEntanglement {
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;
  private entangledPairs: Array<{
    particle1: { x: number, y: number, spin: number },
    particle2: { x: number, y: number, spin: number },
    connected: boolean
  }> = [];

  constructor() {
    this.createStep5Content();
  }

  private createStep5Content(): void {
    this.container = document.createElement('div');
    this.container.id = 'step-5-container';
    this.container.className = 'step-container hidden';
    this.container.style.cssText = `
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0f0f0f 100%);
      color: white;
      padding: 2rem;
      position: relative;
      overflow-x: hidden;
    `;
    
    this.container.innerHTML = `
      <!-- Main Content -->
      <div class="pt-8 max-w-7xl mx-auto">
        <!-- Step Header -->
        <div class="text-center mb-12">
          <h1 class="main-title font-cyber font-black mb-6 text-6xl md:text-8xl text-cyber-pink glitch-text" data-text="QUANTUM ENTANGLEMENT">
            QUANTUM ENTANGLEMENT
          </h1>
          <p class="text-2xl md:text-3xl text-purple-300 font-mono typewriter">
            "Spooky Action at a Distance" - Albert Einstein
          </p>
        </div>

        <!-- Theory Section -->
        <div class="grid lg:grid-cols-2 gap-8 mb-12">
          <div class="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-cyber-pink p-8 rounded-lg cyber-box">
            <h2 class="text-xl font-cyber text-cyber-pink mb-6">WHAT_IS_ENTANGLEMENT?</h2>
            <div class="space-y-4 text-gray-300">
              <p class="border-l-4 border-cyber-pink pl-6">
                Entanglement is when <span class="text-cyber-pink">two or more qubits become linked</span> 
                in such a way that the state of one <span class="text-cyber-green">instantly</span> affects 
                the state of the other — no matter how far apart they are.
              </p>
              
              <div class="bg-black/30 p-4 rounded border border-purple-500">
                <p class="text-cyber-green font-mono text-sm">
                  <strong>Einstein called this:</strong><br>
                  "Spooky Action at a Distance"<br>
                  <em>He didn't like it, but it's real!</em>
                </p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-cyber-blue p-8 rounded-lg cyber-box">
            <h2 class="text-xl font-cyber text-cyber-blue mb-6">WHY_IT'S_POWERFUL</h2>
            <div class="space-y-4 text-gray-300">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-cyber-pink rounded-full mt-2 animate-pulse"></div>
                <div>
                  <p class="font-semibold text-cyber-green">Quantum Computing:</p>
                  <p class="text-sm">Enables parallel processing of quantum information</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-cyber-blue rounded-full mt-2 animate-pulse"></div>
                <div>
                  <p class="font-semibold text-cyber-green">Quantum Teleportation:</p>
                  <p class="text-sm">Transfer quantum states instantaneously</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-cyber-pink rounded-full mt-2 animate-pulse"></div>
                <div>
                  <p class="font-semibold text-cyber-green">Quantum Cryptography:</p>
                  <p class="text-sm">Unbreakable communication security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deep Dive Explanation -->
        <div class="mb-12">
          <div class="bg-gradient-to-r from-gray-900/50 to-purple-900/30 border-2 border-cyber-green p-8 rounded-lg">
            <h2 class="text-2xl font-cyber text-cyber-green text-center mb-6">THE_PHYSICS_BEHIND_IT</h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-6">
              Quantum entanglement happens when particles share the same quantum state, so measuring one instantly affects the other, no matter the distance. You can imagine each particle as creating an invisible field that other particles can "notice" and respond to. This mutual awareness links their behaviors in a way that classical physics cannot explain.
            </p>
            
            <div class="text-center">
              <a href="quantum-field-visualization/index.html" target="_blank" 
                 class="cyber-btn bg-gradient-to-r from-cyber-green to-emerald-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform inline-block">
                EXPLORE QUANTUM FIELD VISUALIZATION →
              </a>
            </div>
          </div>
        </div>

        <!-- Entanglement Demonstration -->
        <div class="mb-12">
          <h2 class="text-2xl font-cyber text-cyber-pink text-center mb-8">ENTANGLEMENT_DEMO</h2>
          <div class="bg-black/50 border-2 border-cyber-pink rounded-lg p-8">
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div class="text-center">
                <div class="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <span class="text-2xl font-cyber">⚛️</span>
                </div>
                <p class="text-cyber-blue font-cyber">QUBIT A</p>
                <p class="text-sm text-gray-400 mt-2">State: <span id="qubit-a-state" class="text-cyber-green">Unknown</span></p>
              </div>
              
              <div class="text-center">
                <div class="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <span class="text-2xl font-cyber">⚛️</span>
                </div>
                <p class="text-cyber-pink font-cyber">QUBIT B</p>
                <p class="text-sm text-gray-400 mt-2">State: <span id="qubit-b-state" class="text-cyber-green">Unknown</span></p>
              </div>
            </div>
            
            <div class="mt-8 text-center space-x-4">
              <button id="create-entanglement" class="cyber-btn bg-cyber-pink text-black px-6 py-3 rounded font-bold">
                CREATE ENTANGLEMENT
              </button>
              <button id="measure-qubit-a" class="cyber-btn bg-cyber-blue text-black px-6 py-3 rounded font-bold">
                MEASURE QUBIT A
              </button>
              <button id="reset-qubits" class="cyber-btn bg-gray-700 text-white px-6 py-3 rounded">
                RESET
              </button>
            </div>
            
            <div class="mt-6 text-center">
              <p class="text-gray-400 text-sm">Create entangled qubits and observe instant correlation when measured</p>
            </div>
          </div>
        </div>

        <!-- Bell States Demo -->
        <div class="mb-12">
          <h2 class="text-2xl font-cyber text-cyber-green text-center mb-8">BELL_STATES</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-cyber-green p-6 rounded-lg">
              <h3 class="text-cyber-green font-bold text-xl mb-4">Φ⁺ = (|00⟩ + |11⟩)/√2</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Measure |00⟩:</span>
                  <span class="text-cyber-green font-mono">50%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Measure |11⟩:</span>
                  <span class="text-cyber-green font-mono">50%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Phase:</span>
                  <span class="text-cyber-blue font-mono">Same</span>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-cyber-blue p-6 rounded-lg"> 
              <h3 class="text-cyber-blue font-bold text-xl mb-4">Φ⁻ = (|00⟩ - |11⟩)/√2</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Measure |00⟩:</span>
                  <span class="text-cyber-green font-mono">50%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Measure |11⟩:</span>
                  <span class="text-cyber-green font-mono">50%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Phase:</span>
                  <span class="text-cyber-pink font-mono">π difference</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Navigation -->
        <div class="flex justify-center items-center mt-16 mb-8">
          <div class="flex items-center space-x-2">
            <div class="step-indicator completed">01</div>
            <div class="progress-line"></div>
            <div class="step-indicator completed">02</div>
            <div class="progress-line"></div>
            <div class="step-indicator completed">03</div>
            <div class="progress-line"></div>
            <div class="step-indicator completed">04</div>
            <div class="progress-line"></div>
            <div class="step-indicator active">05</div>
          </div>
        </div>
        
        <div class="navigation-buttons space-x-4 text-center">
          <button id="prev-step" class="cyber-btn bg-gray-700 text-white px-6 py-3 rounded-lg">
            ← STEP_04
          </button>
          <button id="next-step" class="cyber-btn bg-cyber-pink text-black px-6 py-3 rounded-lg font-bold">
            COMING_SOON
          </button>
        </div>
      </div>
    `;
  }

  public initialize(): void {
    console.log('Step5QuantumEntanglement: initialize() called');
    if (this.isInitialized) return;
    
    // Add to main app container
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
      mainApp.appendChild(this.container!);
    }

    this.setupEventListeners();
    this.isInitialized = true;
  }

  private setupEventListeners(): void {
    console.log('Step5: Setting up event listeners');
    
    // Entanglement demo buttons
    const createBtn = this.container?.querySelector('#create-entanglement') as HTMLElement;
    const measureBtn = this.container?.querySelector('#measure-qubit-a') as HTMLElement;
    const resetBtn = this.container?.querySelector('#reset-qubits') as HTMLElement;

    createBtn?.addEventListener('click', () => this.createEntanglement());
    measureBtn?.addEventListener('click', () => this.measureQubit());
    resetBtn?.addEventListener('click', () => this.resetQubits());

    // Navigation
    console.log('Step5: Setting up navigation event listeners');
    const nextBtn = this.container?.querySelector('#next-step') as HTMLElement;
    const prevBtn = this.container?.querySelector('#prev-step') as HTMLElement;

    console.log('Step5: Next button found:', !!nextBtn);
    console.log('Step5: Prev button found:', !!prevBtn);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        console.log('Step5: Next button clicked (Coming Soon)');
        this.showComingSoonAlert();
      });
    } else {
      console.error('Step5: Next button not found!');
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        console.log('Step5: Prev button clicked (to Step 4)');
        this.onPrevStep();
      });
    } else {
      console.error('Step5: Prev button not found!');
    }
  }

  private createEntanglement(): void {
    const stateA = this.container?.querySelector('#qubit-a-state');
    const stateB = this.container?.querySelector('#qubit-b-state');
    
    if (stateA && stateB) {
      stateA.textContent = 'Entangled';
      stateB.textContent = 'Entangled';
      stateA.className = 'text-cyber-pink';
      stateB.className = 'text-cyber-pink';
    }
  }

  private measureQubit(): void {
    const stateA = this.container?.querySelector('#qubit-a-state');
    const stateB = this.container?.querySelector('#qubit-b-state');
    
    if (stateA && stateB) {
      const measurement = Math.random() > 0.5 ? '↑' : '↓';
      const opposite = measurement === '↑' ? '↓' : '↑';
      
      stateA.textContent = measurement;
      stateB.textContent = opposite;
      stateA.className = 'text-cyber-green';
      stateB.className = 'text-cyber-green';
    }
  }

  private resetQubits(): void {
    const stateA = this.container?.querySelector('#qubit-a-state');
    const stateB = this.container?.querySelector('#qubit-b-state');
    
    if (stateA && stateB) {
      stateA.textContent = 'Unknown';
      stateB.textContent = 'Unknown';
      stateA.className = 'text-cyber-green';
      stateB.className = 'text-cyber-green';
    }
  }

  private showComingSoonAlert(): void {
    alert('Step 6 is coming soon! This concludes the current quantum computing experience.');
  }

  private onPrevStep(): void {
    const event = new CustomEvent('stepTransition', { detail: { step: 4 } });
    window.dispatchEvent(event);
  }

  public show(): void {
    console.log('Step5QuantumEntanglement: show() called');
    if (this.container) {
      console.log('Step5QuantumEntanglement: Showing container');
      this.container.classList.remove('hidden');
      this.container.style.display = 'block';
    } else {
      console.error('Step5QuantumEntanglement: Container is null!');
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
    this.container = null;
    this.isInitialized = false;
  }

  public getData(): StepData {
    return {
      id: 5,
      title: 'Quantum Entanglement',
      description: 'Explore quantum entanglement and Bell states',
      completed: false,
      progress: 0
    };
  }
}
