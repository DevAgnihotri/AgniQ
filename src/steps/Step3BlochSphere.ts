// Step 3: The Bloch Sphere
import { StepData } from '../types/index.js';

export class Step3BlochSphere {
  private container: HTMLElement | null = null;
  private blochCanvas: HTMLCanvasElement | null = null;
  private animationId: number | null = null;
  private isInitialized: boolean = false;
  private theta: number = 0; // Polar angle
  private phi: number = 0; // Azimuthal angle
  private isAnimating: boolean = false;

  constructor() {
    this.createStep3Content();
  }

  private createStep3Content(): void {
    this.container = document.createElement('div');
    this.container.id = 'step-3-container';
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
      <!-- Step 3 Header -->
      <div class="step-header text-center mb-12">
        <h1 class="main-title text-6xl md:text-8xl font-cyber font-bold mb-4 glitch-text" data-text="BLOCH_SPHERE">
          BLOCH_SPHERE
        </h1>
        <div class="section-header text-2xl md:text-3xl font-bold text-cyber-blue mb-8">
          STEP_03: Visualizing Quantum States in 3D Space
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        
        <!-- Bloch Sphere Visualization -->
        <div class="cyber-box p-8">
          <h3 class="text-3xl font-cyber font-bold text-cyber-green mb-6 text-center">
            INTERACTIVE BLOCH SPHERE
          </h3>
          
          <div class="bloch-container relative">
            <canvas id="bloch-sphere-canvas" width="400" height="400" 
                    class="border border-cyber-green rounded-lg w-full bg-black"></canvas>
            
            <div class="bloch-controls mt-6 space-y-4">
              <div class="control-group">
                <label class="text-cyber-blue font-mono mb-2 block">Theta (θ) - Polar Angle:</label>
                <div class="flex items-center space-x-4">
                  <input id="theta-slider" type="range" min="0" max="180" value="0" 
                         class="flex-1 accent-cyber-blue">
                  <span id="theta-value" class="text-cyber-green font-mono w-16">0°</span>
                </div>
              </div>
              
              <div class="control-group">
                <label class="text-cyber-blue font-mono mb-2 block">Phi (φ) - Azimuthal Angle:</label>
                <div class="flex items-center space-x-4">
                  <input id="phi-slider" type="range" min="0" max="360" value="0" 
                         class="flex-1 accent-cyber-blue">
                  <span id="phi-value" class="text-cyber-green font-mono w-16">0°</span>
                </div>
              </div>
              
              <div class="button-group grid grid-cols-2 gap-4 mt-6">
                <button id="animate-btn" class="cyber-btn bg-cyber-blue text-black px-4 py-2 rounded">
                  ANIMATE ROTATION
                </button>
                <button id="reset-btn" class="cyber-btn bg-gray-600 text-white px-4 py-2 rounded">
                  RESET TO |0⟩
                </button>
              </div>
            </div>
          </div>

          <!-- State Information -->
          <div class="state-info mt-6 p-4 bg-gray-900 rounded border border-gray-700">
            <h4 class="text-lg font-cyber text-cyber-green mb-3">Current Quantum State:</h4>
            <div id="state-equation" class="text-center text-lg font-mono text-white mb-2">
              |ψ⟩ = |0⟩
            </div>
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <span class="text-cyber-red">P(|0⟩): </span>
                <span id="prob-0-display" class="text-white font-bold">100%</span>
              </div>
              <div>
                <span class="text-cyber-blue">P(|1⟩): </span>
                <span id="prob-1-display" class="text-white font-bold">0%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Theory Explanation -->
        <div class="cyber-box p-8">
          <h3 class="text-3xl font-cyber font-bold text-cyber-green mb-6">
            UNDERSTANDING THE BLOCH SPHERE
          </h3>
          
          <div class="theory-content space-y-6">
            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">🌐 What is the Bloch Sphere?</h4>
              <p class="text-gray-300 text-sm leading-relaxed">
                Think of the Bloch sphere as a globe for a qubit. Every point on this sphere 
                represents a possible quantum state that a qubit can be in.
              </p>
            </div>

            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">📍 Key Positions</h4>
              <ul class="text-gray-300 text-sm space-y-2">
                <li><span class="text-cyber-red">• North Pole:</span> State |0⟩</li>
                <li><span class="text-cyber-blue">• South Pole:</span> State |1⟩</li>
                <li><span class="text-cyber-green">• Equator:</span> Superposition states</li>
                <li><span class="text-cyber-pink">• Any Point:</span> Unique quantum state</li>
              </ul>
            </div>

            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">🧮 Mathematical Representation</h4>
              <div class="math-box bg-black p-4 rounded border border-cyber-green">
                <div class="text-center text-cyber-green font-mono">
                  |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup>sin(θ/2)|1⟩
                </div>
                <div class="text-xs text-gray-400 mt-2 text-center">
                  Where θ is polar angle, φ is azimuthal angle
                </div>
              </div>
            </div>

            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">⚡ The Phase Factor</h4>
              <p class="text-gray-300 text-sm leading-relaxed">
                The φ (phi) angle represents the <span class="text-cyber-green">quantum phase</span> - 
                invisible to classical measurements but crucial for quantum interference and algorithms.
              </p>
            </div>

            <div class="concept-block">
              <h4 class="text-xl font-bold text-cyber-blue mb-3">🔄 Quantum Gates as Rotations</h4>
              <p class="text-gray-300 text-sm leading-relaxed">
                Every quantum gate can be visualized as a <span class="text-cyber-blue">rotation</span> 
                on the Bloch sphere. Moving the point = changing the qubit's state.
              </p>
            </div>
          </div>

          <!-- Quick Gate Examples -->
          <div class="gate-examples mt-8">
            <h4 class="text-lg font-cyber text-cyber-green mb-4">Common Gate Rotations:</h4>
            <div class="grid grid-cols-1 gap-3">
              <button class="gate-btn bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-blue transition-colors text-left"
                      data-gate="hadamard">
                <span class="text-cyber-blue font-mono">H Gate:</span> 
                <span class="text-gray-300 text-sm">|0⟩ → Equator (superposition)</span>
              </button>
              <button class="gate-btn bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-red transition-colors text-left"
                      data-gate="pauli-x">
                <span class="text-cyber-red font-mono">X Gate:</span> 
                <span class="text-gray-300 text-sm">North ↔ South (bit flip)</span>
              </button>
              <button class="gate-btn bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-green transition-colors text-left"
                      data-gate="pauli-z">
                <span class="text-cyber-green font-mono">Z Gate:</span> 
                <span class="text-gray-300 text-sm">Phase flip around Z-axis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Demonstration -->
      <div class="max-w-7xl mx-auto mb-12">
        <div class="cyber-box p-8">
          <h3 class="text-3xl font-cyber font-bold text-cyber-green mb-6 text-center">
            BLOCH SPHERE PHYSICS SIMULATOR
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Preset States -->
            <div class="preset-states">
              <h4 class="text-lg font-bold text-cyber-blue mb-4">Preset Quantum States</h4>
              <div class="space-y-2">
                <button class="state-btn w-full bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-red transition-colors"
                        data-theta="0" data-phi="0">
                  |0⟩ State (North Pole)
                </button>
                <button class="state-btn w-full bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-blue transition-colors"
                        data-theta="180" data-phi="0">
                  |1⟩ State (South Pole)
                </button>
                <button class="state-btn w-full bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-green transition-colors"
                        data-theta="90" data-phi="0">
                  |+⟩ State (X-axis)
                </button>
                <button class="state-btn w-full bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyber-pink transition-colors"
                        data-theta="90" data-phi="90">
                  |i⟩ State (Y-axis)
                </button>
              </div>
            </div>

            <!-- Measurement Simulation -->
            <div class="measurement-sim">
              <h4 class="text-lg font-bold text-cyber-blue mb-4">Measurement Simulation</h4>
              <div class="measurement-display bg-black p-4 rounded border border-gray-700 mb-4">
                <div class="text-center">
                  <div id="measurement-result" class="text-2xl font-mono mb-2 text-white">Ready</div>
                  <div id="measurement-stats" class="text-xs text-gray-400">
                    Measurements: 0
                  </div>
                </div>
              </div>
              <button id="measure-bloch" class="cyber-btn bg-cyber-red text-white px-4 py-2 rounded w-full mb-2">
                MEASURE QUBIT
              </button>
              <button id="measure-1000" class="cyber-btn bg-gray-700 text-white px-4 py-2 rounded w-full text-sm">
                Measure 1000x (Statistics)
              </button>
            </div>

            <!-- Real-time Stats -->
            <div class="stats-display">
              <h4 class="text-lg font-bold text-cyber-blue mb-4">Quantum Properties</h4>
              <div class="stats-grid space-y-3">
                <div class="stat-item p-3 bg-gray-900 rounded">
                  <div class="text-xs text-gray-400">Superposition</div>
                  <div id="superposition-level" class="text-lg font-mono text-cyber-green">0%</div>
                </div>
                <div class="stat-item p-3 bg-gray-900 rounded">
                  <div class="text-xs text-gray-400">Phase (φ)</div>
                  <div id="phase-display" class="text-lg font-mono text-cyber-blue">0°</div>
                </div>
                <div class="stat-item p-3 bg-gray-900 rounded">
                  <div class="text-xs text-gray-400">Bloch Vector</div>
                  <div id="bloch-vector" class="text-sm font-mono text-white">(0, 0, 1)</div>
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
            <div id="step-1" class="step-indicator completed cursor-pointer hover:scale-110 transition-transform">01</div>
            <div class="progress-line"></div>
            <div id="step-2" class="step-indicator completed cursor-pointer hover:scale-110 transition-transform">02</div>
            <div class="progress-line"></div>
            <div id="step-3" class="step-indicator active cursor-pointer hover:scale-110 transition-transform">03</div>
            <div class="progress-line"></div>
            <div id="step-4" class="step-indicator cursor-pointer hover:scale-110 transition-transform">04</div>
            <div class="progress-line"></div>
            <div id="step-5" class="step-indicator cursor-pointer hover:scale-110 transition-transform">05</div>
          </div>
        </div>
        
        <div class="navigation-buttons space-x-4">
          <button id="prev-step" class="cyber-btn bg-gray-700 text-white px-6 py-3 rounded-lg">
            ← STEP_02
          </button>
          <button id="next-step" class="cyber-btn bg-cyber-green text-black px-6 py-3 rounded-lg font-bold">
            CONTINUE TO STEP_04 →
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

    this.setupBlochSphere();
    this.setupControls();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  private setupBlochSphere(): void {
    this.blochCanvas = document.getElementById('bloch-sphere-canvas') as HTMLCanvasElement;
    if (!this.blochCanvas) return;

    this.drawBlochSphere();
    this.startAnimation();
  }

  private drawBlochSphere(): void {
    if (!this.blochCanvas) return;
    
    const ctx = this.blochCanvas.getContext('2d');
    if (!ctx) return;

    const centerX = this.blochCanvas.width / 2;
    const centerY = this.blochCanvas.height / 2;
    const radius = 150;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.blochCanvas.width, this.blochCanvas.height);

    // Draw sphere outline
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw equator
    ctx.strokeStyle = '#00ff9f';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw meridians
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw axes
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    
    // Z-axis (vertical)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#39ff14';
    ctx.font = '16px "Share Tech Mono"';
    ctx.textAlign = 'center';
    ctx.fillText('|0⟩', centerX, centerY - radius - 15);
    ctx.fillText('|1⟩', centerX, centerY + radius + 25);
    ctx.fillText('|+⟩', centerX + radius + 20, centerY + 5);
    ctx.fillText('|-⟩', centerX - radius - 20, centerY + 5);

    // Draw state vector
    this.drawStateVector(ctx, centerX, centerY, radius);
  }

  private drawStateVector(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void {
    // Convert spherical to Cartesian coordinates
    const thetaRad = (this.theta * Math.PI) / 180;
    const phiRad = (this.phi * Math.PI) / 180;
    
    const x = radius * Math.sin(thetaRad) * Math.cos(phiRad);
    const y = radius * Math.sin(thetaRad) * Math.sin(phiRad);
    const z = radius * Math.cos(thetaRad);

    // Project to 2D (simple orthographic projection)
    const projX = centerX + x;
    const projY = centerY - z; // Negative because canvas Y increases downward

    // Draw vector arrow
    ctx.strokeStyle = '#ff0080';
    ctx.fillStyle = '#ff0080';
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
    ctx.lineTo(
      projX - arrowLength * Math.cos(arrowAngle + Math.PI / 6),
      projY - arrowLength * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Draw state point
    ctx.beginPath();
    ctx.arc(projX, projY, 8, 0, 2 * Math.PI);
    ctx.fill();
  }

  private startAnimation(): void {
    const animate = () => {
      if (!this.blochCanvas) return;
      
      this.drawBlochSphere();
      this.updateStateDisplay();
      
      if (this.isAnimating) {
        this.phi = (this.phi + 2) % 360;
        this.updateSliders();
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private setupControls(): void {
    const thetaSlider = document.getElementById('theta-slider') as HTMLInputElement;
    const phiSlider = document.getElementById('phi-slider') as HTMLInputElement;
    const thetaValue = document.getElementById('theta-value');
    const phiValue = document.getElementById('phi-value');

    thetaSlider?.addEventListener('input', (e) => {
      this.theta = parseInt((e.target as HTMLInputElement).value);
      if (thetaValue) thetaValue.textContent = `${this.theta}°`;
      this.updateStateDisplay();
    });

    phiSlider?.addEventListener('input', (e) => {
      this.phi = parseInt((e.target as HTMLInputElement).value);
      if (phiValue) phiValue.textContent = `${this.phi}°`;
      this.updateStateDisplay();
    });
  }

  private updateSliders(): void {
    const thetaSlider = document.getElementById('theta-slider') as HTMLInputElement;
    const phiSlider = document.getElementById('phi-slider') as HTMLInputElement;
    const thetaValue = document.getElementById('theta-value');
    const phiValue = document.getElementById('phi-value');

    if (thetaSlider) thetaSlider.value = this.theta.toString();
    if (phiSlider) phiSlider.value = this.phi.toString();
    if (thetaValue) thetaValue.textContent = `${this.theta}°`;
    if (phiValue) phiValue.textContent = `${this.phi}°`;
  }

  private updateStateDisplay(): void {
    const thetaRad = (this.theta * Math.PI) / 180;
    const phiRad = (this.phi * Math.PI) / 180;
    
    const alpha = Math.cos(thetaRad / 2);
    const beta = Math.sin(thetaRad / 2);
    
    const prob0 = Math.round(alpha * alpha * 100);
    const prob1 = Math.round(beta * beta * 100);
    
    // Update state equation
    const stateEq = document.getElementById('state-equation');
    if (stateEq) {
      if (this.theta === 0) {
        stateEq.innerHTML = '|ψ⟩ = |0⟩';
      } else if (this.theta === 180) {
        stateEq.innerHTML = '|ψ⟩ = |1⟩';
      } else {
        const alphaStr = alpha.toFixed(3);
        const betaStr = beta.toFixed(3);
        stateEq.innerHTML = `|ψ⟩ = ${alphaStr}|0⟩ + ${betaStr}e<sup>i${this.phi}°</sup>|1⟩`;
      }
    }
    
    // Update probabilities
    const prob0El = document.getElementById('prob-0-display');
    const prob1El = document.getElementById('prob-1-display');
    if (prob0El) prob0El.textContent = `${prob0}%`;
    if (prob1El) prob1El.textContent = `${prob1}%`;
    
    // Update other displays
    const superpositionLevel = document.getElementById('superposition-level');
    const phaseDisplay = document.getElementById('phase-display');
    const blochVector = document.getElementById('bloch-vector');
    
    if (superpositionLevel) {
      const superposition = Math.round(2 * alpha * beta * 100);
      superpositionLevel.textContent = `${superposition}%`;
    }
    
    if (phaseDisplay) phaseDisplay.textContent = `${this.phi}°`;
    
    if (blochVector) {
      const x = Math.sin(thetaRad) * Math.cos(phiRad);
      const y = Math.sin(thetaRad) * Math.sin(phiRad);
      const z = Math.cos(thetaRad);
      blochVector.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`;
    }
  }

  private setupEventListeners(): void {
    // Animation control
    const animateBtn = document.getElementById('animate-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    animateBtn?.addEventListener('click', () => {
      this.isAnimating = !this.isAnimating;
      if (animateBtn) {
        animateBtn.textContent = this.isAnimating ? 'STOP ANIMATION' : 'ANIMATE ROTATION';
      }
    });
    
    resetBtn?.addEventListener('click', () => {
      this.theta = 0;
      this.phi = 0;
      this.isAnimating = false;
      this.updateSliders();
      this.updateStateDisplay();
      if (animateBtn) animateBtn.textContent = 'ANIMATE ROTATION';
    });

    // Preset states
    const stateButtons = document.querySelectorAll('.state-btn');
    stateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theta = parseInt(btn.getAttribute('data-theta') || '0');
        const phi = parseInt(btn.getAttribute('data-phi') || '0');
        this.theta = theta;
        this.phi = phi;
        this.updateSliders();
        this.updateStateDisplay();
      });
    });

    // Gate demonstrations
    const gateButtons = document.querySelectorAll('.gate-btn');
    gateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const gate = btn.getAttribute('data-gate');
        this.applyGate(gate || '');
      });
    });

    // Measurement
    const measureBtn = document.getElementById('measure-bloch');
    const measure1000Btn = document.getElementById('measure-1000');
    
    measureBtn?.addEventListener('click', () => {
      this.performMeasurement();
    });
    
    measure1000Btn?.addEventListener('click', () => {
      this.performStatisticalMeasurement();
    });

    // Navigation
    console.log('Step3: Setting up navigation event listeners');
    
    // Step indicator navigation
    for (let i = 1; i <= 5; i++) {
      const stepIndicator = this.container?.querySelector(`#step-${i}`) as HTMLElement;
      if (stepIndicator) {
        stepIndicator.addEventListener('click', () => {
          console.log(`Step3: Jumping to step ${i}`);
          this.jumpToStep(i);
        });
      }
    }
    
    const nextBtn = this.container?.querySelector('#next-step') as HTMLElement;
    const prevBtn = this.container?.querySelector('#prev-step') as HTMLElement;

    console.log('Step3: Next button found:', !!nextBtn);
    console.log('Step3: Prev button found:', !!prevBtn);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        console.log('Step3: Next button clicked');
        this.onNextStep();
      });
    } else {
      console.error('Step3: Next button not found!');
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        console.log('Step3: Prev button clicked');
        this.onPrevStep();
      });
    } else {
      console.error('Step3: Prev button not found!');
    }
  }

  private applyGate(gate: string): void {
    switch (gate) {
      case 'hadamard':
        if (this.theta === 0) {
          this.theta = 90;
          this.phi = 0;
        } else if (this.theta === 90 && this.phi === 0) {
          this.theta = 0;
          this.phi = 0;
        }
        break;
      case 'pauli-x':
        this.theta = 180 - this.theta;
        break;
      case 'pauli-z':
        this.phi = (this.phi + 180) % 360;
        break;
    }
    this.updateSliders();
    this.updateStateDisplay();
  }

  private performMeasurement(): void {
    const thetaRad = (this.theta * Math.PI) / 180;
    const prob0 = Math.cos(thetaRad / 2) ** 2;
    
    const result = Math.random() < prob0 ? 0 : 1;
    
    const resultEl = document.getElementById('measurement-result');
    if (resultEl) {
      resultEl.textContent = result.toString();
      resultEl.style.color = result === 0 ? '#ff0040' : '#39ff14';
    }
    
    // Collapse to measured state
    this.theta = result === 0 ? 0 : 180;
    this.phi = 0;
    this.updateSliders();
    this.updateStateDisplay();
  }

  private performStatisticalMeasurement(): void {
    const thetaRad = (this.theta * Math.PI) / 180;
    const prob0 = Math.cos(thetaRad / 2) ** 2;
    
    let count0 = 0;
    for (let i = 0; i < 1000; i++) {
      if (Math.random() < prob0) count0++;
    }
    
    const statsEl = document.getElementById('measurement-stats');
    if (statsEl) {
      statsEl.textContent = `1000 measurements: ${count0} zeros, ${1000 - count0} ones (${Math.round(count0/10)}% vs ${Math.round(prob0*100)}% expected)`;
    }
  }

  private jumpToStep(stepNumber: number): void {
    const event = new CustomEvent('stepTransition', { detail: { step: stepNumber } });
    window.dispatchEvent(event);
  }

  private onNextStep(): void {
    console.log('Step 3: Transitioning to Step 4');
    const event = new CustomEvent('stepTransition', { detail: { step: 4 } });
    window.dispatchEvent(event);
  }

  private onPrevStep(): void {
    const event = new CustomEvent('stepTransition', { detail: { step: 2 } });
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
      id: 3,
      title: "The Bloch Sphere",
      description: "Visualizing quantum states in 3D space with interactive controls",
      completed: false,
      progress: 0
    };
  }
}
