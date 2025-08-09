// Step 2: Quantum Computing Fundamentals
import { StepData } from '../types/index.js';

export class Step2QuantumBasics {
  private container: HTMLElement | null = null;
  private qubitVisualizer: HTMLCanvasElement | null = null;
  private animationId: number | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.createStep2Content();
  }

  private createStep2Content(): void {
    this.container = document.createElement('div');
    this.container.id = 'step-2-container';
    this.container.className = 'step-container hidden';
    this.container.style.cssText = `
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
      color: white;
      padding: 2rem;
      position: relative;
      overflow-x: hidden;
    `;

    this.container.innerHTML = `
      <!-- Step 2 Header -->
      <div class="step-header text-center mb-12">
        <h1 class="main-title text-6xl md:text-8xl font-cyber font-bold mb-4 glitch-text" data-text="QUANTUM_BASICS">
          QUANTUM_BASICS
        </h1>
        <div class="section-header text-2xl md:text-3xl font-bold text-cyber-blue mb-8">
          STEP_02: Understanding Qubits & Superposition
        </div>
      </div>

      <!-- Qubit Visualizer Section -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div class="cyber-box p-6">
          <h3 class="text-2xl font-cyber font-bold text-cyber-green mb-4">QUBIT VISUALIZER</h3>
          <div class="qubit-canvas-container relative">
            <canvas id="qubit-canvas" width="400" height="400" class="border border-cyber-green rounded-lg w-full"></canvas>
            <div class="qubit-controls mt-4">
              <button id="superposition-btn" class="cyber-btn bg-cyber-blue text-black px-4 py-2 rounded mr-2">
                CREATE SUPERPOSITION
              </button>
              <button id="measure-btn" class="cyber-btn bg-cyber-red text-white px-4 py-2 rounded mr-2">
                MEASURE QUBIT
              </button>
              <button id="reset-btn" class="cyber-btn bg-gray-600 text-white px-4 py-2 rounded">
                RESET
              </button>
            </div>
          </div>
        </div>

        <div class="cyber-box p-6">
          <h3 class="text-2xl font-cyber font-bold text-cyber-green mb-4">QUANTUM CONCEPTS</h3>
          <div class="concept-list space-y-4">
            <div class="concept-item" data-concept="qubit">
              <h4 class="text-lg font-bold text-cyber-blue mb-2">🔬 QUBIT (Quantum Bit)</h4>
              <p class="text-gray-300 text-sm">
                Unlike classical bits (0 or 1), qubits can exist in superposition - 
                simultaneously being both 0 and 1 until measured.
              </p>
            </div>
            
            <div class="concept-item" data-concept="superposition">
              <h4 class="text-lg font-bold text-cyber-blue mb-2">⚛️ SUPERPOSITION</h4>
              <p class="text-gray-300 text-sm">
                A quantum state where a qubit exists in all possible states simultaneously.
                This is what gives quantum computers their power.
              </p>
            </div>
            
            <div class="concept-item" data-concept="measurement">
              <h4 class="text-lg font-bold text-cyber-blue mb-2">📊 QUANTUM MEASUREMENT</h4>
              <p class="text-gray-300 text-sm">
                The act of observing a quantum system collapses the superposition
                to a definite state (0 or 1).
              </p>
            </div>

            <div class="concept-item" data-concept="bloch">
              <h4 class="text-lg font-bold text-cyber-blue mb-2">🌐 BLOCH SPHERE</h4>
              <p class="text-gray-300 text-sm">
                A geometric representation of qubit states. The poles represent |0⟩ and |1⟩,
                while the equator represents superposition states.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Demo Section -->
      <div class="max-w-7xl mx-auto mb-12">
        <div class="cyber-box p-8">
          <h3 class="text-3xl font-cyber font-bold text-cyber-green mb-6 text-center">
            INTERACTIVE QUANTUM SIMULATOR
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Classical Bit Comparison -->
            <div class="classical-demo border border-gray-600 p-4 rounded">
              <h4 class="text-lg font-bold text-white mb-3">Classical Bit</h4>
              <div class="bit-display text-center">
                <div id="classical-bit" class="text-4xl font-mono mb-3 text-cyber-red">0</div>
                <button id="flip-classical" class="cyber-btn bg-gray-700 text-white px-3 py-1 rounded text-sm">
                  FLIP BIT
                </button>
              </div>
            </div>

            <!-- Quantum Bit Demo -->
            <div class="quantum-demo border border-cyber-green p-4 rounded">
              <h4 class="text-lg font-bold text-cyber-green mb-3">Quantum Bit</h4>
              <div class="qubit-display text-center">
                <div id="quantum-state" class="text-sm font-mono mb-3 text-cyber-blue">
                  |ψ⟩ = |0⟩
                </div>
                <div class="mb-3">
                  <div class="probability-display text-xs">
                    <span class="text-cyber-green">P(0): <span id="prob-0">100%</span></span><br>
                    <span class="text-cyber-red">P(1): <span id="prob-1">0%</span></span>
                  </div>
                </div>
                <button id="hadamard-gate" class="cyber-btn bg-cyber-blue text-black px-3 py-1 rounded text-sm mb-1">
                  HADAMARD GATE
                </button>
              </div>
            </div>

            <!-- Measurement Results -->
            <div class="measurement-demo border border-cyber-blue p-4 rounded">
              <h4 class="text-lg font-bold text-cyber-blue mb-3">Measurement</h4>
              <div class="measurement-display text-center">
                <div id="measurement-result" class="text-2xl font-mono mb-3 text-white">?</div>
                <div id="measurement-count" class="text-xs text-gray-400 mb-3">
                  Measurements: 0
                </div>
                <button id="measure-quantum" class="cyber-btn bg-cyber-red text-white px-3 py-1 rounded text-sm">
                  MEASURE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Navigation -->
      <div class="text-center">
        <div class="step-progress mb-6">
          <div class="flex justify-center items-center space-x-4">
            <div class="step-indicator completed">01</div>
            <div class="progress-line"></div>
            <div class="step-indicator active">02</div>
            <div class="progress-line"></div>
            <div class="step-indicator">03</div>
            <div class="progress-line"></div>
            <div class="step-indicator">04</div>
            <div class="progress-line"></div>
            <div class="step-indicator">05</div>
          </div>
        </div>
        
        <div class="navigation-buttons space-x-4">
          <button id="prev-step" class="cyber-btn bg-gray-700 text-white px-6 py-3 rounded-lg">
            ← PREVIOUS STEP
          </button>
          <button id="next-step" class="cyber-btn bg-cyber-green text-black px-6 py-3 rounded-lg font-bold">
            CONTINUE TO STEP_03 →
          </button>
        </div>
      </div>
    `;
  }

  public initialize(): void {
    if (this.isInitialized) return;
    
    // Add to main app container
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
      mainApp.appendChild(this.container!);
    }

    this.setupQubitVisualizer();
    this.setupInteractiveDemo();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  private setupQubitVisualizer(): void {
    this.qubitVisualizer = document.getElementById('qubit-canvas') as HTMLCanvasElement;
    if (!this.qubitVisualizer) return;

    const ctx = this.qubitVisualizer.getContext('2d');
    if (!ctx) return;

    this.drawBlochSphere(ctx);
    this.startQubitAnimation();
  }

  private drawBlochSphere(ctx: CanvasRenderingContext2D): void {
    const centerX = this.qubitVisualizer!.width / 2;
    const centerY = this.qubitVisualizer!.height / 2;
    const radius = 150;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, this.qubitVisualizer!.width, this.qubitVisualizer!.height);

    // Draw sphere outline
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw equator
    ctx.strokeStyle = '#00ff9f';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw vertical meridian
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw axes labels
    ctx.fillStyle = '#39ff14';
    ctx.font = '16px "Share Tech Mono"';
    ctx.fillText('|0⟩', centerX - 10, centerY - radius - 10);
    ctx.fillText('|1⟩', centerX - 10, centerY + radius + 25);
    ctx.fillText('X', centerX + radius + 10, centerY + 5);
    ctx.fillText('Y', centerX - radius - 25, centerY + 5);

    // Draw qubit state vector (initially pointing to |0⟩)
    this.drawQubitVector(ctx, centerX, centerY, radius, 0, 0);
  }

  private drawQubitVector(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, theta: number, phi: number): void {
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);

    // Convert 3D to 2D projection
    const projX = centerX + x;
    const projY = centerY - z; // Negative because canvas Y increases downward

    // Draw vector arrow
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(projX, projY);
    ctx.stroke();

    // Draw arrowhead
    const arrowLength = 15;
    const arrowAngle = Math.atan2(projY - centerY, projX - centerX);
    
    ctx.beginPath();
    ctx.moveTo(projX, projY);
    ctx.lineTo(
      projX - arrowLength * Math.cos(arrowAngle - Math.PI / 6),
      projY - arrowLength * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.moveTo(projX, projY);
    ctx.lineTo(
      projX - arrowLength * Math.cos(arrowAngle + Math.PI / 6),
      projY - arrowLength * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw state point
    ctx.fillStyle = '#ff0080';
    ctx.beginPath();
    ctx.arc(projX, projY, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  private startQubitAnimation(): void {
    let time = 0;
    let isInSuperposition = false;
    
    const animate = () => {
      if (!this.qubitVisualizer) return;
      
      const ctx = this.qubitVisualizer.getContext('2d');
      if (!ctx) return;

      this.drawBlochSphere(ctx);
      
      if (isInSuperposition) {
        // Animate superposition as rotation around the equator
        const phi = time * 0.05;
        this.drawQubitVector(ctx, 200, 200, 150, Math.PI / 2, phi);
      } else {
        // Static state at |0⟩
        this.drawQubitVector(ctx, 200, 200, 150, 0, 0);
      }
      
      time++;
      this.animationId = requestAnimationFrame(animate);
    };

    // Control animation state
    const superpositionBtn = document.getElementById('superposition-btn');
    const measureBtn = document.getElementById('measure-btn');
    const resetBtn = document.getElementById('reset-btn');

    superpositionBtn?.addEventListener('click', () => {
      isInSuperposition = true;
      this.updateQuantumState('|ψ⟩ = (|0⟩ + |1⟩)/√2', 50, 50);
    });

    measureBtn?.addEventListener('click', () => {
      isInSuperposition = false;
      const result = Math.random() < 0.5 ? 0 : 1;
      if (result === 0) {
        this.updateQuantumState('|ψ⟩ = |0⟩', 100, 0);
      } else {
        this.updateQuantumState('|ψ⟩ = |1⟩', 0, 100);
      }
    });

    resetBtn?.addEventListener('click', () => {
      isInSuperposition = false;
      time = 0;
      this.updateQuantumState('|ψ⟩ = |0⟩', 100, 0);
    });

    animate();
  }

  private setupInteractiveDemo(): void {
    let classicalBit = 0;
    let quantumState = 0; // 0 = |0⟩, 1 = |+⟩ (superposition), 2 = |1⟩
    let measurementCount = 0;

    // Classical bit controls
    const classicalBitEl = document.getElementById('classical-bit');
    const flipClassicalBtn = document.getElementById('flip-classical');

    flipClassicalBtn?.addEventListener('click', () => {
      classicalBit = 1 - classicalBit;
      if (classicalBitEl) {
        classicalBitEl.textContent = classicalBit.toString();
        classicalBitEl.style.color = classicalBit === 0 ? '#ff0040' : '#39ff14';
      }
    });

    // Quantum controls
    const quantumStateEl = document.getElementById('quantum-state');
    const hadamardBtn = document.getElementById('hadamard-gate');
    const measureBtn = document.getElementById('measure-quantum');

    hadamardBtn?.addEventListener('click', () => {
      if (quantumState === 0) {
        quantumState = 1; // Create superposition
        this.updateQuantumState('|ψ⟩ = (|0⟩ + |1⟩)/√2', 50, 50);
      } else if (quantumState === 1) {
        quantumState = 0; // Back to |0⟩
        this.updateQuantumState('|ψ⟩ = |0⟩', 100, 0);
      }
    });

    measureBtn?.addEventListener('click', () => {
      measurementCount++;
      const measurementCountEl = document.getElementById('measurement-count');
      if (measurementCountEl) {
        measurementCountEl.textContent = `Measurements: ${measurementCount}`;
      }

      const resultEl = document.getElementById('measurement-result');
      if (quantumState === 1) { // Superposition
        const result = Math.random() < 0.5 ? 0 : 1;
        quantumState = result === 0 ? 0 : 2;
        if (resultEl) {
          resultEl.textContent = result.toString();
          resultEl.style.color = result === 0 ? '#ff0040' : '#39ff14';
        }
        this.updateQuantumState(
          result === 0 ? '|ψ⟩ = |0⟩' : '|ψ⟩ = |1⟩',
          result === 0 ? 100 : 0,
          result === 0 ? 0 : 100
        );
      } else {
        // Already in definite state
        const result = quantumState === 0 ? 0 : 1;
        if (resultEl) {
          resultEl.textContent = result.toString();
          resultEl.style.color = result === 0 ? '#ff0040' : '#39ff14';
        }
      }
    });
  }

  private updateQuantumState(stateText: string, prob0: number, prob1: number): void {
    const stateEl = document.getElementById('quantum-state');
    const prob0El = document.getElementById('prob-0');
    const prob1El = document.getElementById('prob-1');

    if (stateEl) stateEl.textContent = stateText;
    if (prob0El) prob0El.textContent = `${prob0}%`;
    if (prob1El) prob1El.textContent = `${prob1}%`;
  }

  private setupEventListeners(): void {
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');

    nextBtn?.addEventListener('click', () => {
      this.onNextStep();
    });

    prevBtn?.addEventListener('click', () => {
      this.onPrevStep();
    });
  }

  private onNextStep(): void {
    // This will be handled by the main QuantumExperience class
    const event = new CustomEvent('stepTransition', { detail: { step: 3 } });
    window.dispatchEvent(event);
  }

  private onPrevStep(): void {
    const event = new CustomEvent('stepTransition', { detail: { step: 1 } });
    window.dispatchEvent(event);
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
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    this.isInitialized = false;
  }

  public getStepData(): StepData {
    return {
      id: 2,
      title: "Quantum Computing Fundamentals",
      description: "Understanding qubits, superposition, and quantum measurement",
      completed: false,
      progress: 0
    };
  }
}
