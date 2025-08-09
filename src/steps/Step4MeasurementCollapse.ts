// Step 4: Measurement & Collapse
import { StepData } from '../types/index.js';

export class Step4MeasurementCollapse {
  private container: HTMLElement | null = null;
  private animationId: number | null = null;
  private isInitialized: boolean = false;
  
  // Simulation state
  private measurementHistory: Array<{result: number, probability: number, timestamp: number}> = [];
  private currentQubitState: { alpha: number, beta: number, theta: number, phi: number } = {
    alpha: 1, beta: 0, theta: 0, phi: 0
  };
  private totalMeasurements: number = 0;
  private animatingCollapse: boolean = false;

  constructor() {
    this.createStep4Content();
  }

  private createStep4Content(): void {
    this.container = document.createElement('div');
    this.container.id = 'step-4-container';
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
      <!-- Step 4 Header -->
      <div class="step-header text-center mb-12">
        <h1 class="main-title text-6xl md:text-8xl font-cyber font-bold mb-4 glitch-text" data-text="MEASUREMENT">
          MEASUREMENT
        </h1>
        <div class="section-header text-2xl md:text-3xl font-bold text-cyber-blue mb-8">
          STEP_04: Quantum State Collapse & The Born Rule
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        
        <!-- Interactive Measurement Simulator -->
        <div class="cyber-box p-8">
          <h3 class="text-3xl font-cyber font-bold text-cyber-green mb-6 text-center">
            QUANTUM MEASUREMENT SIMULATOR
          </h3>
          
          <!-- Qubit State Preparation -->
          <div class="state-preparation mb-8">
            <h4 class="text-xl font-bold text-cyber-blue mb-4">1. Prepare Quantum State</h4>
            
            <div class="state-controls space-y-4">
              <div class="preset-states grid grid-cols-2 gap-3">
                <button class="preset-btn bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-red transition-colors"
                        data-state="zero">
                  |0⟩ State
                </button>
                <button class="preset-btn bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-blue transition-colors"
                        data-state="one">
                  |1⟩ State
                </button>
                <button class="preset-btn bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-green transition-colors"
                        data-state="plus">
                  |+⟩ = (|0⟩+|1⟩)/√2
                </button>
                <button class="preset-btn bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-pink transition-colors"
                        data-state="custom">
                  Custom State
                </button>
              </div>
              
              <!-- Custom State Controls -->
              <div id="custom-controls" class="custom-controls hidden space-y-3">
                <div class="control-group">
                  <label class="text-cyber-blue font-mono mb-2 block">Amplitude α (|0⟩ component):</label>
                  <input id="alpha-slider" type="range" min="0" max="100" value="100" 
                         class="w-full accent-cyber-blue">
                  <span id="alpha-value" class="text-cyber-green font-mono">1.000</span>
                </div>
                
                <div class="control-group">
                  <label class="text-cyber-blue font-mono mb-2 block">Phase φ (degrees):</label>
                  <input id="phase-slider" type="range" min="0" max="360" value="0" 
                         class="w-full accent-cyber-blue">
                  <span id="phase-value" class="text-cyber-green font-mono">0°</span>
                </div>
              </div>
            </div>

            <!-- Current State Display -->
            <div class="current-state mt-6 p-4 bg-black rounded border border-cyber-green">
              <h5 class="text-lg font-bold text-cyber-green mb-2">Current State:</h5>
              <div id="state-display" class="text-center text-lg font-mono text-white mb-3">
                |ψ⟩ = |0⟩
              </div>
              <div class="probabilities grid grid-cols-2 gap-4 text-center">
                <div>
                  <span class="text-cyber-red">P(|0⟩): </span>
                  <span id="prob-0" class="text-white font-bold">100%</span>
                </div>
                <div>
                  <span class="text-cyber-blue">P(|1⟩): </span>
                  <span id="prob-1" class="text-white font-bold">0%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Measurement Interface -->
          <div class="measurement-interface">
            <h4 class="text-xl font-bold text-cyber-blue mb-4">2. Perform Measurement</h4>
            
            <div class="measurement-display bg-gray-900 p-6 rounded border border-gray-700 mb-4">
              <div class="text-center">
                <div class="measurement-status mb-4">
                  <span class="text-cyber-green font-mono text-lg">READY TO MEASURE</span>
                </div>
                
                <div id="measurement-animation" class="measurement-viz hidden mb-4">
                  <div class="collapse-animation">
                    <div class="wavefunction-collapse"></div>
                  </div>
                </div>
                
                <div id="measurement-result" class="result-display hidden">
                  <div class="text-4xl font-mono mb-2" id="result-value">?</div>
                  <div class="text-sm text-gray-400" id="result-info">Click measure to collapse the wavefunction</div>
                </div>
              </div>
            </div>

            <div class="measurement-buttons grid grid-cols-2 gap-4 mb-4">
              <button id="single-measurement" class="cyber-btn bg-cyber-red text-white px-4 py-3 rounded-lg font-bold">
                MEASURE ONCE
              </button>
              <button id="multiple-measurements" class="cyber-btn bg-cyber-blue text-black px-4 py-3 rounded-lg font-bold">
                MEASURE 100x
              </button>
            </div>

            <button id="reset-state" class="cyber-btn bg-gray-700 text-white px-4 py-2 rounded w-full">
              RESET TO SUPERPOSITION
            </button>
          </div>
        </div>

        <!-- Theory & Statistics -->
        <div class="cyber-box p-8">
          <h3 class="text-3xl font-cyber font-bold text-cyber-green mb-6">
            THE BORN RULE & COLLAPSE
          </h3>
          
          <div class="theory-content space-y-6">
            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">🎯 What Happens During Measurement?</h4>
              <p class="text-gray-300 text-sm leading-relaxed mb-3">
                Before measurement, a qubit exists in <span class="text-cyber-green">superposition</span> - 
                multiple states simultaneously. The moment we measure it, quantum mechanics forces it to 
                <span class="text-cyber-red">collapse</span> into exactly one definite state.
              </p>
              <div class="math-equation bg-black p-3 rounded border border-cyber-green">
                <div class="text-center text-cyber-green font-mono text-lg">
                  |ψ⟩ = α|0⟩ + β|1⟩ → |0⟩ or |1⟩
                </div>
              </div>
            </div>

            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">📊 The Born Rule</h4>
              <p class="text-gray-300 text-sm leading-relaxed mb-3">
                The probability of measuring each outcome follows the <span class="text-cyber-blue">Born Rule</span>:
              </p>
              <ul class="text-gray-300 text-sm space-y-2 mb-3">
                <li><span class="text-cyber-red">• P(|0⟩) = |α|²</span> - Probability of measuring 0</li>
                <li><span class="text-cyber-blue">• P(|1⟩) = |β|²</span> - Probability of measuring 1</li>
                <li><span class="text-cyber-green">• |α|² + |β|² = 1</span> - Total probability = 100%</li>
              </ul>
            </div>

            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">🔄 Key Properties</h4>
              <ul class="text-gray-300 text-sm space-y-2">
                <li><span class="text-cyber-green">• Irreversible:</span> Can't "un-measure" a qubit</li>
                <li><span class="text-cyber-red">• Random:</span> Each measurement is probabilistic</li>
                <li><span class="text-cyber-blue">• Statistical:</span> Probabilities emerge over many measurements</li>
                <li><span class="text-cyber-pink">• Instantaneous:</span> Collapse happens immediately</li>
              </ul>
            </div>

            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">🎲 Schrödinger's Cat Analogy</h4>
              <p class="text-gray-300 text-sm leading-relaxed">
                Before measurement = Cat is both alive AND dead simultaneously<br>
                <span class="text-cyber-red">After measurement = Cat is definitely alive OR definitely dead</span><br>
                The act of "looking" forces a definite outcome!
              </p>
            </div>
          </div>

          <!-- Live Statistics -->
          <div class="statistics-panel mt-8">
            <h4 class="text-lg font-bold text-cyber-green mb-4">MEASUREMENT STATISTICS</h4>
            <div class="stats-grid space-y-3">
              <div class="stat-row p-3 bg-gray-900 rounded flex justify-between">
                <span class="text-gray-400">Total Measurements:</span>
                <span id="total-count" class="text-cyber-green font-mono">0</span>
              </div>
              <div class="stat-row p-3 bg-gray-900 rounded flex justify-between">
                <span class="text-gray-400">Measured |0⟩:</span>
                <span id="zero-count" class="text-cyber-red font-mono">0 (0%)</span>
              </div>
              <div class="stat-row p-3 bg-gray-900 rounded flex justify-between">
                <span class="text-gray-400">Measured |1⟩:</span>
                <span id="one-count" class="text-cyber-blue font-mono">0 (0%)</span>
              </div>
              <div class="stat-row p-3 bg-gray-900 rounded flex justify-between">
                <span class="text-gray-400">Expected vs Actual:</span>
                <span id="accuracy" class="text-cyber-green font-mono">-</span>
              </div>
            </div>
            
            <button id="clear-stats" class="cyber-btn bg-gray-600 text-white px-4 py-2 rounded w-full mt-4">
              Clear Statistics
            </button>
          </div>
        </div>
      </div>

      <!-- Advanced Demonstrations -->
      <div class="max-w-7xl mx-auto mb-12">
        <div class="cyber-box p-8">
          <h3 class="text-3xl font-cyber font-bold text-cyber-green mb-6 text-center">
            ADVANCED MEASUREMENT SCENARIOS
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Measurement Basis Selection -->
            <div class="measurement-basis">
              <h4 class="text-lg font-bold text-cyber-blue mb-4">Measurement Basis</h4>
              <p class="text-gray-300 text-sm mb-4">
                What you measure depends on your <span class="text-cyber-green">measurement basis</span>:
              </p>
              <div class="basis-options space-y-2">
                <button class="basis-btn w-full bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-red transition-colors active"
                        data-basis="z">
                  Z-basis (|0⟩, |1⟩)
                </button>
                <button class="basis-btn w-full bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-green transition-colors"
                        data-basis="x">
                  X-basis (|+⟩, |-⟩)
                </button>
                <button class="basis-btn w-full bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-blue transition-colors"
                        data-basis="y">
                  Y-basis (|i⟩, |-i⟩)
                </button>
              </div>
              <div class="basis-info mt-4 p-3 bg-black rounded border border-gray-700">
                <div id="basis-description" class="text-xs text-gray-400">
                  Standard computational basis
                </div>
              </div>
            </div>

            <!-- Quantum Zeno Effect -->
            <div class="zeno-effect">
              <h4 class="text-lg font-bold text-cyber-blue mb-4">Quantum Zeno Effect</h4>
              <p class="text-gray-300 text-sm mb-4">
                Frequent measurements can <span class="text-cyber-red">"freeze"</span> quantum evolution!
              </p>
              <div class="zeno-demo">
                <button id="zeno-demo" class="cyber-btn bg-cyber-pink text-black px-4 py-2 rounded w-full mb-3">
                  Start Zeno Demo
                </button>
                <div id="zeno-status" class="text-center text-sm">
                  <div class="text-gray-400">Click to see measurement freezing evolution</div>
                </div>
              </div>
            </div>

            <!-- Measurement Back-Action -->
            <div class="back-action">
              <h4 class="text-lg font-bold text-cyber-blue mb-4">Measurement Back-Action</h4>
              <p class="text-gray-300 text-sm mb-4">
                Measuring a quantum system <span class="text-cyber-green">disturbs</span> it irreversibly.
              </p>
              <div class="back-action-demo">
                <div class="original-state mb-3 p-3 bg-gray-900 rounded">
                  <div class="text-xs text-gray-400">Original State:</div>
                  <div id="original-state" class="font-mono text-cyber-green">|ψ⟩ = |+⟩</div>
                </div>
                <button id="measure-disturb" class="cyber-btn bg-cyber-red text-white px-4 py-2 rounded w-full mb-3">
                  Measure & Disturb
                </button>
                <div class="disturbed-state p-3 bg-gray-900 rounded">
                  <div class="text-xs text-gray-400">After Measurement:</div>
                  <div id="disturbed-state" class="font-mono text-cyber-red">Ready to measure</div>
                </div>
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
            <div class="step-indicator completed">02</div>
            <div class="progress-line"></div>
            <div class="step-indicator completed">03</div>
            <div class="progress-line"></div>
            <div class="step-indicator active">04</div>
            <div class="progress-line"></div>
            <div class="step-indicator">05</div>
          </div>
        </div>
        
        <div class="navigation-buttons space-x-4">
          <button id="prev-step" class="cyber-btn bg-gray-700 text-white px-6 py-3 rounded-lg">
            ← STEP_03
          </button>
          <button id="next-step" class="cyber-btn bg-cyber-green text-black px-6 py-3 rounded-lg font-bold">
            CONTINUE TO STEP_05 →
          </button>
        </div>
      </div>

      <!-- CSS Animations for Collapse Effect -->
      <style>
        .wavefunction-collapse {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.8) 0%, rgba(57, 255, 20, 0.2) 50%, transparent 100%);
          border-radius: 50%;
          animation: collapse-animation 2s ease-out;
        }

        @keyframes collapse-animation {
          0% {
            transform: scale(1);
            opacity: 1;
            background: radial-gradient(circle, rgba(57, 255, 20, 0.8) 0%, rgba(57, 255, 20, 0.4) 30%, rgba(255, 0, 64, 0.4) 60%, transparent 100%);
          }
          25% {
            transform: scale(1.5);
            opacity: 0.8;
            background: radial-gradient(circle, rgba(255, 0, 64, 0.9) 0%, rgba(255, 0, 64, 0.5) 40%, rgba(57, 255, 20, 0.3) 70%, transparent 100%);
          }
          50% {
            transform: scale(0.8);
            opacity: 0.9;
            background: radial-gradient(circle, rgba(0, 255, 159, 0.9) 0%, rgba(0, 255, 159, 0.6) 50%, transparent 100%);
          }
          75% {
            transform: scale(1.2);
            opacity: 0.6;
          }
          100% {
            transform: scale(0.5);
            opacity: 0.3;
            background: radial-gradient(circle, rgba(57, 255, 20, 1) 0%, rgba(57, 255, 20, 0.8) 20%, transparent 40%);
          }
        }

        .measurement-viz {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .basis-btn.active {
          border-color: #39ff14;
          background: rgba(57, 255, 20, 0.1);
        }

        .preset-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(57, 255, 20, 0.3);
        }
      </style>
    `;
  }

  public initialize(): void {
    if (this.isInitialized) return;
    
    // Add to main app container
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
      mainApp.appendChild(this.container!);
    }

    this.setupEventListeners();
    this.setupStateControls();
    this.updateStateDisplay();
    this.isInitialized = true;
  }

  private setupEventListeners(): void {
    // Preset state buttons
    const presetBtns = this.container!.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.getAttribute('data-state');
        this.setPresetState(state || '');
      });
    });

    // Measurement buttons
    const singleMeasureBtn = document.getElementById('single-measurement');
    const multipleMeasureBtn = document.getElementById('multiple-measurements');
    const resetStateBtn = document.getElementById('reset-state');

    singleMeasureBtn?.addEventListener('click', () => this.performSingleMeasurement());
    multipleMeasureBtn?.addEventListener('click', () => this.performMultipleMeasurements());
    resetStateBtn?.addEventListener('click', () => this.resetToSuperposition());

    // Statistics
    const clearStatsBtn = document.getElementById('clear-stats');
    clearStatsBtn?.addEventListener('click', () => this.clearStatistics());

    // Basis selection
    const basisBtns = this.container!.querySelectorAll('.basis-btn');
    basisBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        basisBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateBasisDescription(btn.getAttribute('data-basis') || 'z');
      });
    });

    // Advanced demos
    const zenoBtn = document.getElementById('zeno-demo');
    const measureDisturbBtn = document.getElementById('measure-disturb');

    zenoBtn?.addEventListener('click', () => this.demonstrateZenoEffect());
    measureDisturbBtn?.addEventListener('click', () => this.demonstrateBackAction());

    // Navigation
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');

    nextBtn?.addEventListener('click', () => this.onNextStep());
    prevBtn?.addEventListener('click', () => this.onPrevStep());
  }

  private setupStateControls(): void {
    const alphaSlider = document.getElementById('alpha-slider') as HTMLInputElement;
    const phaseSlider = document.getElementById('phase-slider') as HTMLInputElement;
    const alphaValue = document.getElementById('alpha-value');
    const phaseValue = document.getElementById('phase-value');

    alphaSlider?.addEventListener('input', (e) => {
      const alpha = parseInt((e.target as HTMLInputElement).value) / 100;
      const beta = Math.sqrt(1 - alpha * alpha);
      
      this.currentQubitState.alpha = alpha;
      this.currentQubitState.beta = beta;
      this.currentQubitState.theta = 2 * Math.acos(alpha) * 180 / Math.PI;
      
      if (alphaValue) alphaValue.textContent = alpha.toFixed(3);
      this.updateStateDisplay();
    });

    phaseSlider?.addEventListener('input', (e) => {
      const phi = parseInt((e.target as HTMLInputElement).value);
      this.currentQubitState.phi = phi;
      
      if (phaseValue) phaseValue.textContent = `${phi}°`;
      this.updateStateDisplay();
    });
  }

  private setPresetState(state: string): void {
    const customControls = document.getElementById('custom-controls');
    
    switch (state) {
      case 'zero':
        this.currentQubitState = { alpha: 1, beta: 0, theta: 0, phi: 0 };
        customControls?.classList.add('hidden');
        break;
      case 'one':
        this.currentQubitState = { alpha: 0, beta: 1, theta: 180, phi: 0 };
        customControls?.classList.add('hidden');
        break;
      case 'plus':
        this.currentQubitState = { alpha: Math.SQRT1_2, beta: Math.SQRT1_2, theta: 90, phi: 0 };
        customControls?.classList.add('hidden');
        break;
      case 'custom':
        customControls?.classList.remove('hidden');
        break;
    }
    
    this.updateStateDisplay();
    this.updateSliders();
  }

  private updateSliders(): void {
    const alphaSlider = document.getElementById('alpha-slider') as HTMLInputElement;
    const phaseSlider = document.getElementById('phase-slider') as HTMLInputElement;
    const alphaValue = document.getElementById('alpha-value');
    const phaseValue = document.getElementById('phase-value');

    if (alphaSlider) alphaSlider.value = (this.currentQubitState.alpha * 100).toString();
    if (phaseSlider) phaseSlider.value = this.currentQubitState.phi.toString();
    if (alphaValue) alphaValue.textContent = this.currentQubitState.alpha.toFixed(3);
    if (phaseValue) phaseValue.textContent = `${this.currentQubitState.phi}°`;
  }

  private updateStateDisplay(): void {
    const stateDisplay = document.getElementById('state-display');
    const prob0 = document.getElementById('prob-0');
    const prob1 = document.getElementById('prob-1');

    const { alpha, beta, phi } = this.currentQubitState;
    const prob0Val = Math.round(alpha * alpha * 100);
    const prob1Val = Math.round(beta * beta * 100);

    // Update state equation
    if (stateDisplay) {
      if (alpha === 1) {
        stateDisplay.innerHTML = '|ψ⟩ = |0⟩';
      } else if (beta === 1) {
        stateDisplay.innerHTML = '|ψ⟩ = |1⟩';
      } else {
        const alphaStr = alpha.toFixed(3);
        const betaStr = beta.toFixed(3);
        if (phi === 0) {
          stateDisplay.innerHTML = `|ψ⟩ = ${alphaStr}|0⟩ + ${betaStr}|1⟩`;
        } else {
          stateDisplay.innerHTML = `|ψ⟩ = ${alphaStr}|0⟩ + ${betaStr}e<sup>i${phi}°</sup>|1⟩`;
        }
      }
    }

    // Update probabilities
    if (prob0) prob0.textContent = `${prob0Val}%`;
    if (prob1) prob1.textContent = `${prob1Val}%`;
  }

  private async performSingleMeasurement(): Promise<void> {
    if (this.animatingCollapse) return;
    
    this.animatingCollapse = true;
    const { alpha, beta } = this.currentQubitState;
    const prob0 = alpha * alpha;
    
    // Show animation
    const measurementAnimation = document.getElementById('measurement-animation');
    const resultDisplay = document.getElementById('measurement-result');
    const resultValue = document.getElementById('result-value');
    const resultInfo = document.getElementById('result-info');
    
    measurementAnimation?.classList.remove('hidden');
    resultDisplay?.classList.add('hidden');
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Perform measurement
    const result = Math.random() < prob0 ? 0 : 1;
    
    // Record measurement
    this.measurementHistory.push({
      result,
      probability: result === 0 ? prob0 : (1 - prob0),
      timestamp: Date.now()
    });
    this.totalMeasurements++;
    
    // Collapse state
    this.currentQubitState = result === 0 ? 
      { alpha: 1, beta: 0, theta: 0, phi: 0 } : 
      { alpha: 0, beta: 1, theta: 180, phi: 0 };
    
    // Show result
    measurementAnimation?.classList.add('hidden');
    resultDisplay?.classList.remove('hidden');
    
    if (resultValue) {
      resultValue.textContent = result.toString();
      resultValue.style.color = result === 0 ? '#ff0040' : '#39ff14';
    }
    
    if (resultInfo) {
      resultInfo.textContent = `Wavefunction collapsed to |${result}⟩`;
    }
    
    this.updateStateDisplay();
    this.updateStatistics();
    this.animatingCollapse = false;
  }

  private async performMultipleMeasurements(): Promise<void> {
    const { alpha } = this.currentQubitState;
    const prob0 = alpha * alpha;
    
    let count0 = 0;
    for (let i = 0; i < 100; i++) {
      const result = Math.random() < prob0 ? 0 : 1;
      if (result === 0) count0++;
      
      this.measurementHistory.push({
        result,
        probability: result === 0 ? prob0 : (1 - prob0),
        timestamp: Date.now()
      });
    }
    
    this.totalMeasurements += 100;
    
    // Show summary
    const resultDisplay = document.getElementById('measurement-result');
    const resultValue = document.getElementById('result-value');
    const resultInfo = document.getElementById('result-info');
    
    resultDisplay?.classList.remove('hidden');
    
    if (resultValue) {
      resultValue.textContent = `${count0}/100`;
      resultValue.style.color = '#00ff9f';
    }
    
    if (resultInfo) {
      resultInfo.textContent = `Got ${count0} zeros, ${100-count0} ones (Expected: ${Math.round(prob0*100)}/100)`;
    }
    
    this.updateStatistics();
  }

  private resetToSuperposition(): void {
    this.setPresetState('plus');
    
    // Hide results
    const resultDisplay = document.getElementById('measurement-result');
    resultDisplay?.classList.add('hidden');
  }

  private updateStatistics(): void {
    const totalCount = document.getElementById('total-count');
    const zeroCount = document.getElementById('zero-count');
    const oneCount = document.getElementById('one-count');
    const accuracy = document.getElementById('accuracy');

    const zeros = this.measurementHistory.filter(m => m.result === 0).length;
    const ones = this.measurementHistory.filter(m => m.result === 1).length;
    
    const zeroPercent = this.totalMeasurements > 0 ? Math.round((zeros / this.totalMeasurements) * 100) : 0;
    const onePercent = this.totalMeasurements > 0 ? Math.round((ones / this.totalMeasurements) * 100) : 0;

    if (totalCount) totalCount.textContent = this.totalMeasurements.toString();
    if (zeroCount) zeroCount.textContent = `${zeros} (${zeroPercent}%)`;
    if (oneCount) oneCount.textContent = `${ones} (${onePercent}%)`;
    
    if (accuracy && this.totalMeasurements > 10) {
      const avgExpected = this.measurementHistory.reduce((sum, m) => sum + m.probability, 0) / this.measurementHistory.length;
      const actualZeroRate = zeros / this.totalMeasurements;
      const deviation = Math.abs(avgExpected - actualZeroRate);
      accuracy.textContent = `±${(deviation * 100).toFixed(1)}%`;
    }
  }

  private clearStatistics(): void {
    this.measurementHistory = [];
    this.totalMeasurements = 0;
    this.updateStatistics();
  }

  private updateBasisDescription(basis: string): void {
    const description = document.getElementById('basis-description');
    if (!description) return;

    switch (basis) {
      case 'z':
        description.textContent = 'Standard computational basis - measures |0⟩ vs |1⟩';
        break;
      case 'x':
        description.textContent = 'Hadamard basis - measures |+⟩ vs |-⟩ states';
        break;
      case 'y':
        description.textContent = 'Y-basis - measures |i⟩ vs |-i⟩ states';
        break;
    }
  }

  private demonstrateZenoEffect(): void {
    const zenoStatus = document.getElementById('zeno-status');
    if (zenoStatus) {
      zenoStatus.innerHTML = '<div class="text-cyber-red">Rapid measurements freezing evolution...</div>';
      
      setTimeout(() => {
        zenoStatus.innerHTML = '<div class="text-cyber-green">Evolution frozen! State preserved by frequent measurement.</div>';
      }, 3000);
    }
  }

  private demonstrateBackAction(): void {
    const disturbedState = document.getElementById('disturbed-state');
    if (disturbedState) {
      // Simulate measurement disturbing the original |+⟩ state
      const result = Math.random() < 0.5 ? '|0⟩' : '|1⟩';
      disturbedState.innerHTML = `<span style="color: #ff0040">${result}</span>`;
      disturbedState.style.color = '#ff0040';
    }
  }

  private onNextStep(): void {
    const event = new CustomEvent('stepTransition', { detail: { step: 5 } });
    window.dispatchEvent(event);
  }

  private onPrevStep(): void {
    const event = new CustomEvent('stepTransition', { detail: { step: 3 } });
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
      id: 4,
      title: "Measurement & Collapse",
      description: "Understanding quantum measurement and wavefunction collapse",
      completed: false,
      progress: 0
    };
  }
}
