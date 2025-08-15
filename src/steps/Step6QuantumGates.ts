import { StepData } from '../types';

export class Step6QuantumGates {
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;
  private animationId: number | null = null;
  private gateAnimations: Map<string, Animation> = new Map();
  private currentGate: string = 'h';
  private qubitState = { alpha: 1, beta: 0, theta: 0, phi: 0 }; // |0⟩ initial state
  private circuitSteps: Array<{ gate: string; name: string; matrix?: number[][] }> = [];
  private isPlayingCircuit = false;
  private circuitPlaybackIndex = 0;

  private template = `
    <div class="min-h-screen bg-black text-green-400 p-8 font-mono">
      <!-- Background Effects -->
      <div class="fixed inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20"></div>
        <div class="scan-lines"></div>
      </div>

      <!-- Header -->
      <div class="relative z-10 max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 glitch-text">
            QUANTUM GATES
          </h1>
          <p class="text-xl text-cyan-300 mb-6 cyber-glow">How We Control Qubits</p>
          <div class="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded cyber-glow"></div>
        </div>

        <!-- Progress Indicators -->
        <div class="flex justify-center mb-12">
          <div class="flex space-x-4">
            <div id="step-1" class="w-4 h-4 rounded-full bg-green-400 cursor-pointer hover:scale-110 transition-transform cyber-glow"></div>
            <div id="step-2" class="w-4 h-4 rounded-full bg-green-400 cursor-pointer hover:scale-110 transition-transform cyber-glow"></div>
            <div id="step-3" class="w-4 h-4 rounded-full bg-green-400 cursor-pointer hover:scale-110 transition-transform cyber-glow"></div>
            <div id="step-4" class="w-4 h-4 rounded-full bg-green-400 cursor-pointer hover:scale-110 transition-transform cyber-glow"></div>
            <div id="step-5" class="w-4 h-4 rounded-full bg-green-400 cursor-pointer hover:scale-110 transition-transform cyber-glow"></div>
            <div id="step-6" class="w-6 h-6 rounded-full bg-purple-400 border-2 border-cyan-400 cyber-glow"></div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          <!-- LEFT PANEL - LARGE BLOCH SPHERE VISUALIZATION -->
          <div class="space-y-6">
            
            <!-- Enhanced Bloch Sphere Visualization -->
            <div class="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-6 rounded-xl border border-cyan-400/50 backdrop-blur">
              <h2 class="text-xl font-bold text-cyan-400 mb-4 text-center">🌟 3D BLOCH SPHERE</h2>
              <div id="bloch-sphere" class="w-full h-80 lg:h-96 bg-black rounded-xl border-4 border-cyan-400/50 relative overflow-hidden shadow-2xl">
                <canvas id="bloch-canvas" class="w-full h-full rounded-xl"></canvas>
              </div>
              
              <!-- Bloch Sphere Controls -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <button id="apply-gate" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all transform hover:scale-105 cyber-glow">
                  ⚡ APPLY GATE
                </button>
                <button id="reset-state" class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg text-white font-bold transition-all transform hover:scale-105">
                  🔄 RESET
                </button>
              </div>
              <div class="mt-3 text-center">
                <div class="text-cyan-400 font-bold mb-1">Current State</div>
                <div id="state-vector" class="text-sm font-mono bg-black/50 p-2 rounded border border-cyan-400/30">
                  |ψ⟩ = 1.000|0⟩ + 0.000|1⟩
                </div>
              </div>
              </div>
              
              <!-- Probability Display -->
              <div class="mt-6 grid grid-cols-2 gap-6">
                <div class="bg-black/50 p-4 rounded-lg border border-blue-400/30">
                  <div class="text-blue-400 font-bold mb-2 text-center">P(|0⟩) Probability</div>
                  <div class="text-center">
                    <div id="prob-0" class="text-3xl font-bold text-blue-400">100%</div>
                    <div class="mt-2 h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div class="prob-bar h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700" style="width: 100%"></div>
                    </div>
                  </div>
                </div>
                <div class="bg-black/50 p-4 rounded-lg border border-red-400/30">
                  <div class="text-red-400 font-bold mb-2 text-center">P(|1⟩) Probability</div>
                  <div class="text-center">
                    <div id="prob-1" class="text-3xl font-bold text-red-400">0%</div>
                    <div class="mt-2 h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div class="prob-bar h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-700" style="width: 0%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL - GATE SELECTION & CONTROLS -->
          <div class="space-y-6">
            <!-- Theory Introduction -->
            <div class="bg-gray-900/80 p-4 rounded-lg border border-cyan-400/30 backdrop-blur">
              <h3 class="text-lg font-bold text-cyan-400 mb-3 glitch-text">QUANTUM GATES</h3>
              <div class="space-y-2 text-gray-300 text-sm">
                <p>Quantum gates <span class="text-purple-400">rotate</span> and <span class="text-cyan-400">transform</span> qubits on the Bloch sphere.</p>
                <div class="bg-black/50 p-3 rounded border-l-4 border-red-400">
                  <p class="text-red-300 text-xs"><strong>Key:</strong> Gates change <span class="text-purple-400">probabilities and phases</span> unlike classical bits</p>
                </div>
              </div>
            </div>

            <!-- Gate Selector -->
            <div class="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 rounded-lg border border-purple-400/50 backdrop-blur">
              <h3 class="text-xl font-bold text-purple-400 mb-4 text-center">🎛️ SELECT QUANTUM GATE</h3>
              <div class="grid grid-cols-2 gap-3">
                <button id="gate-h" class="gate-btn active" data-gate="h">
                  <span class="text-xl font-bold">H</span>
                  <span class="text-xs">Hadamard</span>
                </button>
                <button id="gate-x" class="gate-btn" data-gate="x">
                  <span class="text-xl font-bold">X</span>
                  <span class="text-xs">Pauli-X</span>
                </button>
                <button id="gate-y" class="gate-btn" data-gate="y">
                  <span class="text-xl font-bold">Y</span>
                  <span class="text-xs">Pauli-Y</span>
                </button>
                <button id="gate-z" class="gate-btn" data-gate="z">
                  <span class="text-xl font-bold">Z</span>
                  <span class="text-xs">Pauli-Z</span>
                </button>
                <button id="gate-s" class="gate-btn" data-gate="s">
                  <span class="text-xl font-bold">S</span>
                  <span class="text-xs">Phase</span>
                </button>
                <button id="gate-t" class="gate-btn" data-gate="t">
                  <span class="text-xl font-bold">T</span>
                  <span class="text-xs">π/8</span>
                </button>
              </div>
            </div>

            <!-- Gate Information -->
            <div id="gate-info" class="bg-gray-900/80 p-4 rounded-lg border border-yellow-400/30 backdrop-blur">
              <h3 class="text-lg font-bold text-yellow-400 mb-3">HADAMARD GATE (H)</h3>
              <div class="space-y-2 text-gray-300 text-sm">
                <p><strong class="text-cyan-400">Function:</strong> Creates superposition</p>
                <p><strong class="text-cyan-400">Effect:</strong> |0⟩ → (|0⟩ + |1⟩)/√2</p>
                
                <!-- Gate Matrix Display -->
                <div class="bg-black/50 p-3 rounded border border-yellow-400/30 mt-3">
                  <div class="text-yellow-400 text-xs font-bold mb-2">Matrix:</div>
                  <div id="matrix-content" class="text-center text-cyan-400 font-mono text-xs">
                    <div class="grid grid-cols-2 gap-1 max-w-20 mx-auto">
                      <span id="m00" class="transition-all duration-500 border border-cyan-400/30 p-1 rounded">1/√2</span>
                      <span id="m01" class="transition-all duration-500 border border-cyan-400/30 p-1 rounded">1/√2</span>
                      <span id="m10" class="transition-all duration-500 border border-cyan-400/30 p-1 rounded">1/√2</span>
                      <span id="m11" class="transition-all duration-500 border border-cyan-400/30 p-1 rounded">-1/√2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantum State Display -->
            <div class="bg-gray-900/80 p-6 rounded-lg border border-green-400/30 backdrop-blur">
              <h3 class="text-xl font-bold text-green-400 mb-4">CURRENT QUBIT STATE</h3>
              <div class="space-y-3">
                <div class="text-gray-300">
                  <p><strong>State Vector:</strong> <span id="state-vector" class="text-cyan-400 font-mono">|ψ⟩ = 1|0⟩ + 0|1⟩</span></p>
                  <p><strong>Probabilities:</strong></p>
                  <div class="flex space-x-4 mt-2">
                    <div class="bg-blue-600/30 p-2 rounded">
                      <span class="text-blue-300">|0⟩: </span><span id="prob-0" class="text-white font-bold">100%</span>
                    </div>
                    <div class="bg-red-600/30 p-2 rounded">
                      <span class="text-red-300">|1⟩: </span><span id="prob-1" class="text-white font-bold">0%</span>
                    </div>
                  </div>
                </div>
                <button id="reset-state" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors">
                  Reset to |0⟩
                </button>
              </div>
            </div>
          </div>

          <!-- Right Panel - Visualization -->
          <div class="space-y-8">
            
            <!-- Bloch Sphere Visualization -->
            <div class="bg-gray-900/80 p-6 rounded-lg border border-cyan-400/30 backdrop-blur">
              <h3 class="text-xl font-bold text-cyan-400 mb-4">BLOCH SPHERE VISUALIZATION</h3>
              <div id="bloch-sphere" class="w-full h-80 bg-black rounded border border-gray-600 relative overflow-hidden">
                <canvas id="bloch-canvas" class="w-full h-full"></canvas>
              </div>
              <div class="mt-4 text-center">
                <button id="apply-gate" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105 cyber-glow">
                  APPLY GATE
                </button>
              </div>
            </div>

            <!-- Gate Matrix Visualization -->
            <div class="bg-gray-900/80 p-6 rounded-lg border border-purple-400/30 backdrop-blur">
              <h3 class="text-xl font-bold text-purple-400 mb-4">GATE MATRIX ANIMATION</h3>
              <div id="matrix-display" class="bg-black p-4 rounded">
                <div class="text-center text-cyan-400 font-mono text-lg" id="matrix-content">
                  <div class="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <span id="m00" class="transition-all duration-500">1/√2</span>
                    <span id="m01" class="transition-all duration-500">1/√2</span>
                    <span id="m10" class="transition-all duration-500">1/√2</span>
                    <span id="m11" class="transition-all duration-500">-1/√2</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Circuit Builder -->
            <div class="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 p-6 rounded-lg border border-yellow-400/50 backdrop-blur">
              <h3 class="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                ⚡ QUANTUM CIRCUIT BUILDER
                <span class="ml-2 text-sm text-yellow-300">(Build quantum algorithms step by step)</span>
              </h3>
              
              <!-- Circuit Visualization -->
              <div id="circuit-display" class="bg-black/70 p-6 rounded-lg mb-4 border border-yellow-400/30">
                <div class="circuit-header mb-4 flex justify-between items-center">
                  <span class="text-cyan-400 font-mono text-lg">|ψ₀⟩ = |0⟩</span>
                  <span class="text-yellow-400 text-sm">Circuit Depth: <span id="circuit-depth">0</span></span>
                </div>
                
                <!-- Circuit Line -->
                <div class="circuit-line flex items-center min-h-16 bg-gray-800/50 rounded-lg p-4 border-l-4 border-cyan-400">
                  <div class="qubit-wire flex-1 flex items-center">
                    <span class="qubit-label text-cyan-400 font-mono mr-4">|q₀⟩</span>
                    <div class="wire-line flex-1 h-0.5 bg-cyan-400 relative">
                      <!-- Gates will be added here dynamically -->
                      <div id="circuit-gates" class="circuit-gates flex absolute top-0 left-0 h-full items-center space-x-4">
                      </div>
                    </div>
                    <span class="measurement-box ml-4 px-3 py-1 bg-purple-600 rounded text-white font-mono">📊</span>
                  </div>
                </div>
                
                <!-- Current State Display -->
                <div class="mt-4 p-3 bg-gray-700/50 rounded-lg">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-300">Current State:</span>
                    <span id="circuit-current-state" class="text-cyan-400 font-mono">|ψ⟩ = 1.000|0⟩ + 0.000|1⟩</span>
                  </div>
                  <div class="flex justify-between items-center text-sm mt-1">
                    <span class="text-gray-300">Probabilities:</span>
                    <span class="text-sm">
                      <span class="text-blue-400">P(|0⟩) = <span id="circuit-prob-0">100.0%</span></span>
                      <span class="text-red-400 ml-4">P(|1⟩) = <span id="circuit-prob-1">0.0%</span></span>
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Circuit Controls -->
              <div class="flex flex-wrap gap-3">
                <button id="add-to-circuit" class="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-lg text-white font-bold transition-all transform hover:scale-105 shadow-lg">
                  🔧 Add Selected Gate
                </button>
                <button id="play-circuit" class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-bold transition-all transform hover:scale-105 shadow-lg">
                  ▶️ Execute Circuit
                </button>
                <button id="step-circuit" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white font-bold transition-all transform hover:scale-105 shadow-lg">
                  👣 Step Through
                </button>
                <button id="clear-circuit" class="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all transform hover:scale-105 shadow-lg">
                  🗑️ Clear Circuit
                </button>
              </div>
              
              <!-- Popular Circuit Templates -->
              <div class="mt-4 p-4 bg-black/30 rounded-lg border border-yellow-400/20">
                <h4 class="text-yellow-300 font-bold mb-2">🚀 Quick Circuit Templates:</h4>
                <div class="flex flex-wrap gap-2">
                  <button class="template-btn px-3 py-1 bg-purple-600/70 hover:bg-purple-500 rounded text-white text-sm transition-colors" data-template="bell">
                    Bell State (H + CNOT)
                  </button>
                  <button class="template-btn px-3 py-1 bg-purple-600/70 hover:bg-purple-500 rounded text-white text-sm transition-colors" data-template="superposition">
                    Superposition (H)
                  </button>
                  <button class="template-btn px-3 py-1 bg-purple-600/70 hover:bg-purple-500 rounded text-white text-sm transition-colors" data-template="flip">
                    Bit Flip (X)
                  </button>
                  <button class="template-btn px-3 py-1 bg-purple-600/70 hover:bg-purple-500 rounded text-white text-sm transition-colors" data-template="random">
                    Random Circuit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Section -->
        <div class="mb-12">
          <div class="bg-gray-900/80 p-8 rounded-lg border border-red-400/30 backdrop-blur">
            <h2 class="text-3xl font-bold text-red-400 mb-6 text-center glitch-text">ADVANCED: MULTI-QUBIT GATES</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- CNOT Gate -->
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-cyan-400">CNOT GATE (CONTROLLED-X)</h3>
                <div class="bg-black/50 p-4 rounded">
                  <p class="text-gray-300 mb-3">The CNOT gate flips the target qubit ONLY if the control qubit is |1⟩.</p>
                  <div class="text-yellow-300">
                    <p>• |00⟩ → |00⟩ (no flip)</p>
                    <p>• |01⟩ → |01⟩ (no flip)</p>
                    <p>• |10⟩ → |11⟩ (flip target)</p>
                    <p>• |11⟩ → |10⟩ (flip target)</p>
                  </div>
                  <button id="cnot-demo" class="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white transition-colors">
                    Demonstrate CNOT
                  </button>
                </div>
              </div>

              <!-- Entanglement Creation -->
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-purple-400">CREATING ENTANGLEMENT</h3>
                <div class="bg-black/50 p-4 rounded">
                  <p class="text-gray-300 mb-3">H + CNOT creates Bell states (maximally entangled):</p>
                  <div class="text-pink-300 font-mono text-sm">
                    <p>|00⟩ → H⊗I → (|0⟩+|1⟩)|0⟩/√2</p>
                    <p>→ CNOT → (|00⟩+|11⟩)/√2</p>
                  </div>
                  <button id="bell-state-demo" class="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white transition-colors">
                    Create Bell State
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Insights -->
        <div class="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-green-900/50 p-8 rounded-lg border border-cyan-400/30 backdrop-blur mb-12">
          <h2 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
            WHY QUANTUM GATES MATTER
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="space-y-3">
              <div class="text-4xl">🔄</div>
              <h3 class="text-xl font-bold text-cyan-400">REVERSIBLE</h3>
              <p class="text-gray-300">All quantum gates are reversible - no information is lost, following the laws of quantum mechanics.</p>
            </div>
            <div class="space-y-3">
              <div class="text-4xl">🌊</div>
              <h3 class="text-xl font-bold text-purple-400">UNITARY</h3>
              <p class="text-gray-300">Gates preserve the total probability (normalization) while transforming quantum states.</p>
            </div>
            <div class="space-y-3">
              <div class="text-4xl">⚡</div>
              <h3 class="text-xl font-bold text-yellow-400">POWERFUL</h3>
              <p class="text-gray-300">By combining gates in sequences, we build quantum circuits that solve problems exponentially faster.</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center">
          <button id="prev-step" class="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105 cyber-glow">
            ← STEP 5: ENTANGLEMENT
          </button>
          
          <div class="text-center">
            <div class="text-cyan-400 font-bold text-lg">STEP 6 OF 9</div>
            <div class="text-gray-400">QUANTUM GATES</div>
          </div>
          
          <button id="next-step" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105 cyber-glow">
            STEP 7: THERMODYNAMICS →
          </button>
        </div>
      </div>
    </div>
  `;

  private styles = `
    <style>
      .glitch-text {
        animation: glitch 2s infinite;
      }
      
      @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-1px, 1px); }
        40% { transform: translate(-1px, -1px); }
        60% { transform: translate(1px, 1px); }
        80% { transform: translate(1px, -1px); }
      }
      
      .cyber-glow {
        box-shadow: 0 0 10px currentColor;
      }
      
      .scan-lines {
        background: linear-gradient(transparent 50%, rgba(0, 255, 255, 0.03) 50%);
        background-size: 100% 4px;
        animation: scan 0.1s linear infinite;
      }
      
      @keyframes scan {
        0% { background-position: 0 0; }
        100% { background-position: 0 4px; }
      }
      
      .gate-btn {
        display: flex;
        flex-direction: column;
        items-center: center;
        justify-content: center;
        padding: 1rem;
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
        border: 1px solid #4b5563;
        border-radius: 0.5rem;
        color: #9ca3af;
        cursor: pointer;
        transition: all 0.3s ease;
        min-height: 80px;
      }
      
      .gate-btn:hover {
        background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
        border-color: #06b6d4;
        color: #06b6d4;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
      }
      
      .gate-btn.active {
        background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        border-color: #06b6d4;
        color: white;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
      }
      
      #bloch-canvas {
        background: radial-gradient(circle at center, #001122 0%, #000000 100%);
      }
      
      .matrix-element {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        margin: 0.125rem;
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 0.25rem;
        transition: all 0.5s ease;
      }
      
      .matrix-element.highlight {
        background: rgba(168, 85, 247, 0.3);
        border-color: rgba(168, 85, 247, 0.6);
        transform: scale(1.1);
      }
      
      .circuit-step {
        display: inline-flex;
        align-items: center;
        margin: 0 0.25rem;
        padding: 0.25rem 0.5rem;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 0.25rem;
        font-family: monospace;
        font-size: 0.875rem;
      }
      
      @keyframes gate-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .gate-applying {
        animation: gate-pulse 0.5s ease-in-out;
      }
      
      /* Enhanced Quantum Animations */
      @keyframes quantum-pulse {
        0% { transform: scale(1); box-shadow: 0 0 10px rgba(6, 182, 212, 0.5); }
        50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(6, 182, 212, 0.8); }
        100% { transform: scale(1); box-shadow: 0 0 10px rgba(6, 182, 212, 0.5); }
      }
      
      @keyframes energy-wave {
        0% { width: 0; height: 0; opacity: 1; }
        50% { width: 100px; height: 100px; opacity: 0.6; }
        100% { width: 200px; height: 200px; opacity: 0; }
      }
      
      @keyframes transformation-text {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
      
      @keyframes state-update {
        0% { color: #06b6d4; text-shadow: 0 0 10px rgba(6, 182, 212, 0.8); }
        50% { color: #f59e0b; text-shadow: 0 0 20px rgba(245, 158, 11, 1); }
        100% { color: #06b6d4; text-shadow: 0 0 5px rgba(6, 182, 212, 0.5); }
      }
      
      @keyframes probability-grow {
        0% { width: 0%; }
        100% { width: var(--target-width); }
      }
      
      @keyframes matrix-flash {
        0% { background: rgba(6, 182, 212, 0.1); }
        50% { background: rgba(6, 182, 212, 0.3); }
        100% { background: rgba(6, 182, 212, 0.1); }
      }
      
      @keyframes bloch-glow {
        0%, 100% { filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.5)); }
        50% { filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.8)); }
      }
      
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      /* Enhanced UI Elements */
      .gate-btn {
        position: relative;
        overflow: hidden;
      }
      
      .gate-btn:active {
        animation: quantum-pulse 0.6s ease-out;
      }
      
      .prob-bar {
        height: 8px;
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
        border-radius: 4px;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .prob-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: shimmer 2s infinite;
      }
      
      .probability-visualization {
        background: linear-gradient(90deg, #ef4444, #f59e0b);
        height: 6px;
        border-radius: 3px;
        transition: width 0.6s ease-out;
      }
      
      .bloch-sphere-container {
        animation: bloch-glow 3s ease-in-out infinite;
      }
      
      .circuit-step {
        transition: all 0.3s ease;
      }
      
      .circuit-step:hover {
        transform: scale(1.05);
        background: rgba(6, 182, 212, 0.1);
      }
      
      .quantum-state-display {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));
        border: 1px solid rgba(6, 182, 212, 0.3);
        backdrop-filter: blur(10px);
      }
      
      .gate-matrix {
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid rgba(6, 182, 212, 0.3);
        backdrop-filter: blur(5px);
      }
      
      .gate-active {
        background: rgba(6, 182, 212, 0.2) !important;
        border-color: #06b6d4 !important;
        box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
      }
      
      .particle-effect {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #06b6d4;
        border-radius: 50%;
        animation: particle-float 3s infinite ease-in-out;
      }
      
      @keyframes particle-float {
        0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
        25% { transform: translateY(-20px) translateX(10px) scale(1.2); opacity: 1; }
        50% { transform: translateY(-40px) translateX(-5px) scale(0.8); opacity: 0.6; }
        75% { transform: translateY(-20px) translateX(-15px) scale(1.1); opacity: 0.9; }
      }
      
      @keyframes gate-appear {
        0% { transform: scale(0) rotate(180deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(90deg); opacity: 0.8; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      
      @keyframes wire-glow {
        0%, 100% { box-shadow: 0 0 5px rgba(6, 182, 212, 0.5); }
        50% { box-shadow: 0 0 15px rgba(6, 182, 212, 1); }
      }
      
      @keyframes notification-slide {
        0% { transform: translateX(400px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      
      .circuit-gate {
        position: relative;
        overflow: hidden;
      }
      
      .circuit-gate::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
      }
      
      .circuit-gate:hover::before {
        left: 100%;
      }
      
      @media (max-width: 768px) {
        .transformation-text {
          font-size: 16px !important;
          padding: 10px 20px !important;
        }
      }
    </style>
  `;

  constructor() {
    this.container = document.createElement('div');
    this.container.innerHTML = this.styles + this.template;
  }

  private async initializeBlochSphere(): Promise<void> {
    const canvas = this.container?.querySelector('#bloch-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Start continuous animation loop for engaging effects
    this.startBlochAnimation(ctx, canvas);
  }

  private startBlochAnimation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const animate = () => {
      this.drawBlochSphere(ctx, canvas.width, canvas.height);
      requestAnimationFrame(animate);
    };
    animate();
  }

  private drawBlochSphere(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38;

    // Clear canvas with slightly lighter animated background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
    gradient.addColorStop(0, '#001a2e');
    gradient.addColorStop(0.5, '#000a14');
    gradient.addColorStop(1, '#000408');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Animated grid effect
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 1;
    const time = Date.now() * 0.001;
    for (let i = 0; i < 10; i++) {
      const offset = Math.sin(time + i * 0.5) * 5;
      ctx.beginPath();
      ctx.moveTo(0, i * height / 10 + offset);
      ctx.lineTo(width, i * height / 10 + offset);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(i * width / 10 + offset, 0);
      ctx.lineTo(i * width / 10 + offset, height);
      ctx.stroke();
    }

    // Draw sphere outline with glow effect
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw animated equator
    ctx.shadowBlur = 10;
    ctx.strokeStyle = `rgba(75, 85, 99, ${0.8 + 0.2 * Math.sin(time * 2)})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw vertical meridian
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw animated axes with 3D perspective
    ctx.shadowBlur = 8;
    ctx.lineWidth = 5;
    
    // Z-axis (vertical) - MOST IMPORTANT for quantum states
    const pulseZ = 1 + 0.15 * Math.sin(time * 3);
    ctx.strokeStyle = '#e11d48'; // Red for Z-axis - makes it stand out
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius * pulseZ - 25);
    ctx.lineTo(centerX, centerY + radius * pulseZ + 25);
    ctx.stroke();
    
    // Add Z-axis arrow heads to show direction
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius * pulseZ - 25);
    ctx.lineTo(centerX - 6, centerY - radius * pulseZ - 15);
    ctx.lineTo(centerX + 6, centerY - radius * pulseZ - 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + radius * pulseZ + 25);
    ctx.lineTo(centerX - 6, centerY + radius * pulseZ + 15);
    ctx.lineTo(centerX + 6, centerY + radius * pulseZ + 15);
    ctx.closePath();
    ctx.fill();
    
    // X-axis with different color
    const pulseX = 1 + 0.1 * Math.sin(time * 3 + Math.PI/2);
    ctx.strokeStyle = '#22c55e'; // Green for X-axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius * pulseX - 20, centerY);
    ctx.lineTo(centerX + radius * pulseX + 20, centerY);
    ctx.stroke();
    
    // Y-axis (into the screen) - show with perspective
    ctx.strokeStyle = '#3b82f6'; // Blue for Y-axis
    ctx.lineWidth = 2;
    const yDepth = 15 * Math.sin(time * 2);
    ctx.beginPath();
    ctx.moveTo(centerX - yDepth, centerY - radius - 10);
    ctx.lineTo(centerX + yDepth, centerY + radius + 10);
    ctx.stroke();

    // Enhanced labels with better 3D positioning and color coding
    ctx.shadowBlur = 15;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    
    const labelPulse = 3 * Math.sin(time * 2);
    
    // |0⟩ at north pole (Z = +1) - RED to match Z-axis
    ctx.fillStyle = '#e11d48';
    ctx.fillText('|0⟩', centerX, centerY - radius - 35 - labelPulse);
    
    // |1⟩ at south pole (Z = -1) - RED to match Z-axis
    ctx.fillStyle = '#e11d48';
    ctx.fillText('|1⟩', centerX, centerY + radius + 50 + labelPulse);
    
    // |+⟩ and |-⟩ on equator (X-axis) - GREEN to match X-axis
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'left';
    ctx.fillText('|+⟩', centerX + radius + 30 + labelPulse, centerY + 5);
    ctx.textAlign = 'right';
    ctx.fillText('|-⟩', centerX - radius - 30 - labelPulse, centerY + 5);
    
    // |+i⟩ and |-i⟩ on Y-axis - BLUE to match Y-axis
    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'center';
    const yOffset = 20 * Math.sin(time * 1.5);
    ctx.fillText('|+i⟩', centerX + yOffset, centerY - 25);
    ctx.fillText('|-i⟩', centerX - yOffset, centerY + 25);
    
    // Add coordinate system legend
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e11d48';
    ctx.fillText('Z-axis: |0⟩ ↔ |1⟩', 10, height - 60);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('X-axis: |+⟩ ↔ |-⟩', 10, height - 40);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Y-axis: |+i⟩ ↔ |-i⟩', 10, height - 20);

    // Draw qubit state vector with trail effect
    this.drawAnimatedQubitVector(ctx, centerX, centerY, radius, time);
    
    // Add floating particles around the sphere
    this.drawFloatingParticles(ctx, centerX, centerY, radius, time);
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }

  private drawFloatingParticles(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number): void {
    const particles = 8;
    
    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * 2 * Math.PI + time * 0.5;
      const orbitRadius = radius + 50 + 20 * Math.sin(time * 2 + i);
      
      const x = centerX + orbitRadius * Math.cos(angle);
      const y = centerY + orbitRadius * Math.sin(angle);
      
      const size = 2 + Math.sin(time * 3 + i) * 1;
      const alpha = 0.3 + 0.4 * Math.sin(time * 2 + i * 0.7);
      
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
  }

  private drawAnimatedQubitVector(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number): void {
    const { theta, phi } = this.qubitState;
    
    // Convert spherical to Cartesian coordinates
    const x = radius * Math.sin(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180);
    const y = radius * Math.sin(theta * Math.PI / 180) * Math.sin(phi * Math.PI / 180);
    const z = radius * Math.cos(theta * Math.PI / 180);

    // Project onto 2D
    const screenX = centerX + x;
    const screenY = centerY - z;

    // Draw vector trail (fading effect)
    for (let i = 0; i < 5; i++) {
      const trailAlpha = (5 - i) / 5 * 0.3;
      const trailOffset = i * 2;
      
      ctx.strokeStyle = `rgba(245, 158, 11, ${trailAlpha})`;
      ctx.lineWidth = 4 - i * 0.5;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(screenX - trailOffset, screenY - trailOffset);
      ctx.stroke();
    }

    // Main vector with glow
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 4;
    
    // Vector line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();
    
    // Animated arrowhead
    const angle = Math.atan2(screenY - centerY, screenX - centerX);
    const arrowLength = 15;
    const arrowPulse = 1 + 0.2 * Math.sin(time * 4);
    
    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX - arrowLength * arrowPulse * Math.cos(angle - Math.PI/6), 
               screenY - arrowLength * arrowPulse * Math.sin(angle - Math.PI/6));
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX - arrowLength * arrowPulse * Math.cos(angle + Math.PI/6), 
               screenY - arrowLength * arrowPulse * Math.sin(angle + Math.PI/6));
    ctx.stroke();
    
    // Animated vector endpoint
    const endpointPulse = 3 + 2 * Math.sin(time * 5);
    ctx.beginPath();
    ctx.arc(screenX, screenY, endpointPulse, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add probability visualization around the endpoint
    const prob0 = this.qubitState.alpha * this.qubitState.alpha;
    const prob1 = this.qubitState.beta * this.qubitState.beta;
    
    // |0⟩ probability ring
    ctx.strokeStyle = `rgba(59, 130, 246, ${prob0})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 15, 0, 2 * Math.PI * prob0);
    ctx.stroke();
    
    // |1⟩ probability ring
    ctx.strokeStyle = `rgba(239, 68, 68, ${prob1})`;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 20, 0, 2 * Math.PI * prob1);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }

  private initializeEventListeners(): void {
    // Gate selection
    const gateButtons = this.container?.querySelectorAll('.gate-btn');
    gateButtons?.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        gateButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const gate = btn.getAttribute('data-gate');
        if (gate) {
          this.currentGate = gate;
          this.updateGateInfo(gate);
          this.updateMatrixDisplay(gate);
        }
      });
    });

    // Apply gate button
    const applyBtn = this.container?.querySelector('#apply-gate');
    applyBtn?.addEventListener('click', () => this.applyCurrentGate());

    // Reset state button
    const resetBtn = this.container?.querySelector('#reset-state');
    resetBtn?.addEventListener('click', () => this.resetQuantumState());

    // Circuit builder buttons
    const addToCircuitBtn = this.container?.querySelector('#add-to-circuit');
    addToCircuitBtn?.addEventListener('click', () => this.addGateToCircuit());

    const playCircuitBtn = this.container?.querySelector('#play-circuit');
    playCircuitBtn?.addEventListener('click', () => this.playQuantumCircuit());

    const clearCircuitBtn = this.container?.querySelector('#clear-circuit');
    clearCircuitBtn?.addEventListener('click', () => this.clearCircuit());

    // Enhanced circuit builder buttons
    const stepCircuitBtn = this.container?.querySelector('#step-circuit');
    stepCircuitBtn?.addEventListener('click', () => this.stepThroughCircuit());

    // Template buttons
    const templateBtns = this.container?.querySelectorAll('.template-btn');
    templateBtns?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const template = (e.target as HTMLElement).getAttribute('data-template');
        if (template) this.loadCircuitTemplate(template);
      });
    });

    // Advanced demos
    const cnotBtn = this.container?.querySelector('#cnot-demo');
    cnotBtn?.addEventListener('click', () => this.demonstrateCNOT());

    const bellBtn = this.container?.querySelector('#bell-state-demo');
    bellBtn?.addEventListener('click', () => this.demonstrateBellState());

    // Step indicator navigation
    console.log('Step6: Setting up step indicator navigation');
    for (let i = 1; i <= 5; i++) {
      const stepIndicator = this.container?.querySelector(`#step-${i}`) as HTMLElement;
      if (stepIndicator) {
        stepIndicator.addEventListener('click', () => {
          console.log(`Step6: Jumping to step ${i}`);
          this.jumpToStep(i);
        });
        console.log(`Step indicator ${i} found and listener attached`);
      } else {
        console.error(`Step indicator ${i} not found!`);
      }
    }

    // Navigation
    const nextBtn = this.container?.querySelector('#next-step');
    const prevBtn = this.container?.querySelector('#prev-step');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.onNextStep());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.onPrevStep());
    }
  }

  private updateGateInfo(gate: string): void {
    const gateInfoDiv = this.container?.querySelector('#gate-info');
    if (!gateInfoDiv) return;

    const gateData = this.getGateData(gate);
    
    gateInfoDiv.innerHTML = `
      <h3 class="text-xl font-bold text-purple-400 mb-4">${gateData.name}</h3>
      <div class="space-y-3 text-gray-300">
        <p><strong class="text-cyan-400">Function:</strong> ${gateData.function}</p>
        <p><strong class="text-cyan-400">Effect:</strong> ${gateData.effect}</p>
        <p><strong class="text-cyan-400">Matrix:</strong></p>
        <div class="bg-black/50 p-3 rounded font-mono text-sm">
          ${gateData.matrix}
        </div>
        <p class="text-yellow-300"><strong>Real World:</strong> ${gateData.realWorld}</p>
      </div>
    `;
  }

  private getGateData(gate: string): any {
    const gates: { [key: string]: any } = {
      'h': {
        name: 'HADAMARD GATE (H)',
        function: 'Creates superposition',
        effect: '|0⟩ → (|0⟩ + |1⟩)/√2',
        matrix: 'H = 1/√2 × [1  1]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1 -1]',
        realWorld: 'Like flipping a coin to make it land on its edge - creating a perfect 50/50 probability state.'
      },
      'x': {
        name: 'PAULI-X GATE (X)',
        function: 'Quantum NOT gate',
        effect: '|0⟩ → |1⟩, |1⟩ → |0⟩',
        matrix: 'X = [0  1]<br>&nbsp;&nbsp;&nbsp;&nbsp;[1  0]',
        realWorld: 'Like flipping a classical bit, but it can also flip superposition states.'
      },
      'y': {
        name: 'PAULI-Y GATE (Y)',
        function: 'Rotates around Y-axis',
        effect: '|0⟩ → i|1⟩, |1⟩ → -i|0⟩',
        matrix: 'Y = [0 -i]<br>&nbsp;&nbsp;&nbsp;&nbsp;[i  0]',
        realWorld: 'Adds a complex phase while flipping, like spinning while flipping a coin.'
      },
      'z': {
        name: 'PAULI-Z GATE (Z)',
        function: 'Phase flip',
        effect: '|0⟩ → |0⟩, |1⟩ → -|1⟩',
        matrix: 'Z = [1  0]<br>&nbsp;&nbsp;&nbsp;&nbsp;[0 -1]',
        realWorld: 'Flips the phase of |1⟩ state - invisible to measurement but affects interference.'
      },
      's': {
        name: 'S GATE (PHASE)',
        function: 'Quarter phase rotation',
        effect: '|0⟩ → |0⟩, |1⟩ → i|1⟩',
        matrix: 'S = [1  0]<br>&nbsp;&nbsp;&nbsp;&nbsp;[0  i]',
        realWorld: 'Adds a 90° phase rotation - like turning a gear by a quarter turn.'
      },
      't': {
        name: 'T GATE (π/8)',
        function: 'Eighth phase rotation',
        effect: '|0⟩ → |0⟩, |1⟩ → e^(iπ/4)|1⟩',
        matrix: 'T = [1    0   ]<br>&nbsp;&nbsp;&nbsp;&nbsp;[0  e^(iπ/4)]',
        realWorld: 'Fine-tuning phase like adjusting a precision instrument by small increments.'
      }
    };
    
    return gates[gate] || gates['h'];
  }

  private updateMatrixDisplay(gate: string): void {
    const matrixElements: { [key: string]: string[] } = {
      'h': ['1/√2', '1/√2', '1/√2', '-1/√2'],
      'x': ['0', '1', '1', '0'],
      'y': ['0', '-i', 'i', '0'],
      'z': ['1', '0', '0', '-1'],
      's': ['1', '0', '0', 'i'],
      't': ['1', '0', '0', 'e^(iπ/4)']
    };

    const elements = matrixElements[gate] || matrixElements['h'];
    
    const m00 = this.container?.querySelector('#m00');
    const m01 = this.container?.querySelector('#m01');
    const m10 = this.container?.querySelector('#m10');
    const m11 = this.container?.querySelector('#m11');

    if (m00) m00.textContent = elements[0];
    if (m01) m01.textContent = elements[1];
    if (m10) m10.textContent = elements[2];
    if (m11) m11.textContent = elements[3];

    // Animate matrix elements
    [m00, m01, m10, m11].forEach((el, index) => {
      if (el) {
        el.classList.add('highlight');
        setTimeout(() => el.classList.remove('highlight'), 500);
      }
    });
  }

  private applyCurrentGate(): void {
    const applyBtn = this.container?.querySelector('#apply-gate');
    applyBtn?.classList.add('gate-applying');
    
    setTimeout(() => {
      applyBtn?.classList.remove('gate-applying');
    }, 500);

    // Apply the quantum gate transformation
    this.applyGateToState(this.currentGate);
    this.updateStateDisplay();
    this.redrawBlochSphere();
  }

  private applyGateToState(gate: string): void {
    // Show gate application animation
    this.showGateAnimation(gate);
    
    const { alpha, beta } = this.qubitState;
    const oldState = { alpha, beta, theta: this.qubitState.theta, phi: this.qubitState.phi };
    
    let newAlpha = alpha;
    let newBeta = beta;
    
    switch (gate) {
      case 'h': // Hadamard
        newAlpha = (alpha + beta) / Math.sqrt(2);
        newBeta = (alpha - beta) / Math.sqrt(2);
        break;
      case 'x': // Pauli-X
        newAlpha = beta;
        newBeta = alpha;
        break;
      case 'y': // Pauli-Y (simplified, ignoring complex phases for visualization)
        newAlpha = beta;
        newBeta = -alpha;
        break;
      case 'z': // Pauli-Z
        newAlpha = alpha;
        newBeta = -beta;
        break;
      case 's': // S Gate (simplified)
        newAlpha = alpha;
        newBeta = beta;
        this.qubitState.phi = (this.qubitState.phi + 90) % 360;
        break;
      case 't': // T Gate (simplified)
        newAlpha = alpha;
        newBeta = beta;
        this.qubitState.phi = (this.qubitState.phi + 45) % 360;
        break;
    }
    
    // Animate the state transition
    this.animateStateTransition(oldState, newAlpha, newBeta, gate);
  }

  private showGateAnimation(gateName: string): void {
    // Find the gate button and animate it
    const gates = document.querySelectorAll('.gate-btn');
    gates.forEach(btn => {
      const btnText = btn.textContent?.toLowerCase();
      if (btnText === gateName.toLowerCase()) {
        this.createEnergyWave(btn as HTMLElement);
      }
    });

    // Show transformation text overlay
    this.showTransformationText(gateName);
  }

  private createEnergyWave(element: HTMLElement): void {
    const wave = document.createElement('div');
    wave.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border: 2px solid #06b6d4;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: energy-wave 1s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.appendChild(wave);
    
    setTimeout(() => wave.remove(), 1000);
  }

  private animateStateTransition(oldState: any, newAlpha: number, newBeta: number, gateName: string): void {
    const steps = 40;
    let currentStep = 0;
    
    const animate = () => {
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      
      // Interpolate between old and new state
      this.qubitState.alpha = oldState.alpha + (newAlpha - oldState.alpha) * easeProgress;
      this.qubitState.beta = oldState.beta + (newBeta - oldState.beta) * easeProgress;
      
      // Update spherical coordinates smoothly
      this.updateSphericalCoordinates();
      
      // Redraw with animation frame
      this.redrawBlochSphere();
      
      currentStep++;
      if (currentStep <= steps) {
        requestAnimationFrame(animate);
      } else {
        // Final state
        this.qubitState.alpha = newAlpha;
        this.qubitState.beta = newBeta;
        this.updateSphericalCoordinates();
        this.updateStateDisplay();
        this.redrawBlochSphere();
      }
    };
    
    animate();
  }

  private showTransformationText(gateName: string): void {
    const container = document.getElementById('step-content');
    if (!container) return;

    const textOverlay = document.createElement('div');
    textOverlay.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 15, 30, 0.95);
      color: #06b6d4;
      padding: 15px 30px;
      border-radius: 10px;
      border: 2px solid #06b6d4;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      z-index: 2000;
      animation: transformation-text 2s ease-out forwards;
      box-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
      backdrop-filter: blur(10px);
    `;
    
    const messages: { [key: string]: string } = {
      'h': '🌀 HADAMARD GATE\nCreating Superposition...',
      'x': '🔄 PAULI-X GATE\nBit Flip Operation...',
      'y': '🌪️ PAULI-Y GATE\nY-Axis Rotation...',
      'z': '⚡ PAULI-Z GATE\nPhase Flip...',
      's': '🔀 S GATE\nPhase Shift +90°...',
      't': '🎯 T GATE\nPhase Shift +45°...'
    };
    
    textOverlay.innerHTML = messages[gateName] || `🚀 APPLYING ${gateName.toUpperCase()} GATE`;
    
    document.body.appendChild(textOverlay);
    
    setTimeout(() => textOverlay.remove(), 2000);
  }

  private updateSphericalCoordinates(): void {
    const { alpha, beta } = this.qubitState;
    const probAlpha = alpha * alpha;
    const probBeta = beta * beta;
    
    // Calculate theta (inclination) from probabilities
    if (probAlpha + probBeta > 0) {
      this.qubitState.theta = 2 * Math.acos(Math.abs(alpha)) * 180 / Math.PI;
    }
    
    // Normalize
    const norm = Math.sqrt(probAlpha + probBeta);
    if (norm > 0) {
      this.qubitState.alpha = alpha / norm;
      this.qubitState.beta = beta / norm;
    }
  }

  private updateStateDisplay(): void {
    const { alpha, beta } = this.qubitState;
    const prob0 = alpha * alpha;
    const prob1 = beta * beta;
    
    const stateVector = this.container?.querySelector('#state-vector');
    const prob0El = this.container?.querySelector('#prob-0');
    const prob1El = this.container?.querySelector('#prob-1');
    
    if (stateVector) {
      const alphaStr = Math.abs(alpha) < 0.001 ? '0' : `${alpha.toFixed(3)}`;
      const betaStr = Math.abs(beta) < 0.001 ? '0' : `${beta.toFixed(3)}`;
      stateVector.innerHTML = `|ψ⟩ = <span class="text-blue-400">${alphaStr}</span>|0⟩ + <span class="text-red-400">${betaStr}</span>|1⟩`;
      
      // Add pulse animation to state vector
      const stateEl = stateVector as HTMLElement;
      stateEl.style.animation = 'none';
      stateEl.offsetHeight; // Trigger reflow
      stateEl.style.animation = 'state-update 0.5s ease-out';
    }
    
    if (prob0El) {
      prob0El.textContent = `${Math.round(prob0 * 100)}%`;
      // Animate probability bars
      this.animateProbabilityBar(prob0El.parentElement, prob0);
    }
    
    if (prob1El) {
      prob1El.textContent = `${Math.round(prob1 * 100)}%`;
      this.animateProbabilityBar(prob1El.parentElement, prob1);
    }
    
    // Update any additional probability displays
    this.updateProbabilityBars();
  }

  private animateProbabilityBar(container: Element | null, probability: number): void {
    if (!container) return;
    
    const bar = container.querySelector('.prob-bar');
    if (bar) {
      (bar as HTMLElement).style.width = '0%';
      setTimeout(() => {
        (bar as HTMLElement).style.transition = 'width 0.8s ease-out';
        (bar as HTMLElement).style.width = `${probability * 100}%`;
      }, 50);
    }
  }

  private updateProbabilityBars(): void {
    const prob0 = this.qubitState.alpha * this.qubitState.alpha;
    const prob1 = this.qubitState.beta * this.qubitState.beta;
    
    // Update all probability visualizations with smooth animations
    const probBars = this.container?.querySelectorAll('.probability-visualization');
    probBars?.forEach((bar, index) => {
      const targetWidth = index === 0 ? prob0 * 100 : prob1 * 100;
      (bar as HTMLElement).style.width = `${targetWidth}%`;
    });
  }

  private redrawBlochSphere(): void {
    const canvas = this.container?.querySelector('#bloch-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.drawBlochSphere(ctx, canvas.width, canvas.height);
  }

  private resetQuantumState(): void {
    this.qubitState = { alpha: 1, beta: 0, theta: 0, phi: 0 };
    this.updateStateDisplay();
    this.redrawBlochSphere();
  }

  private addGateToCircuit(): void {
    if (!this.currentGate) {
      this.showNotification('Please select a gate first!', 'warning');
      return;
    }

    const gateData = this.getGateData(this.currentGate);
    this.circuitSteps.push({
      gate: this.currentGate,
      name: gateData.name.split(' ')[0],
      matrix: gateData.matrix
    });

    this.updateCircuitDisplay();
    this.showNotification(`Added ${gateData.name} to circuit!`, 'success');
  }

  private updateCircuitDisplay(): void {
    const circuitGates = this.container?.querySelector('#circuit-gates');
    const circuitDepth = this.container?.querySelector('#circuit-depth');
    
    if (!circuitGates) return;

    // Update circuit depth
    if (circuitDepth) {
      circuitDepth.textContent = this.circuitSteps.length.toString();
    }

    // Clear and rebuild circuit visualization
    circuitGates.innerHTML = '';

    this.circuitSteps.forEach((step, index) => {
      const gateElement = document.createElement('div');
      gateElement.className = 'circuit-gate relative';
      gateElement.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        border: 2px solid #06b6d4;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: gate-appear 0.5s ease-out;
        animation-delay: ${index * 0.1}s;
        margin-right: 15px;
      `;
      
      gateElement.textContent = step.name;
      gateElement.title = `Gate ${index + 1}: ${step.name} (Click to remove)`;
      
      // Add hover effects
      gateElement.addEventListener('mouseenter', () => {
        gateElement.style.transform = 'scale(1.1) rotate(5deg)';
        gateElement.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.6)';
      });
      
      gateElement.addEventListener('mouseleave', () => {
        gateElement.style.transform = 'scale(1) rotate(0deg)';
        gateElement.style.boxShadow = 'none';
      });

      // Add click to remove functionality
      gateElement.addEventListener('click', () => {
        this.removeGateFromCircuit(index);
      });

      circuitGates.appendChild(gateElement);
    });

    // Update state display
    this.updateCircuitStateDisplay();
  }

  private removeGateFromCircuit(index: number): void {
    this.circuitSteps.splice(index, 1);
    this.updateCircuitDisplay();
    this.showNotification('Gate removed from circuit', 'info');
  }

  private updateCircuitStateDisplay(): void {
    const stateEl = this.container?.querySelector('#circuit-current-state');
    const prob0El = this.container?.querySelector('#circuit-prob-0');
    const prob1El = this.container?.querySelector('#circuit-prob-1');

    if (stateEl) {
      const { alpha, beta } = this.qubitState;
      const alphaStr = Math.abs(alpha) < 0.001 ? '0.000' : alpha.toFixed(3);
      const betaStr = Math.abs(beta) < 0.001 ? '0.000' : beta.toFixed(3);
      stateEl.innerHTML = `|ψ⟩ = <span class="text-blue-400">${alphaStr}</span>|0⟩ + <span class="text-red-400">${betaStr}</span>|1⟩`;
    }

    if (prob0El && prob1El) {
      const prob0 = (this.qubitState.alpha * this.qubitState.alpha * 100).toFixed(1);
      const prob1 = (this.qubitState.beta * this.qubitState.beta * 100).toFixed(1);
      prob0El.textContent = `${prob0}%`;
      prob1El.textContent = `${prob1}%`;
    }
  }

  private async playQuantumCircuit(): Promise<void> {
    if (this.circuitSteps.length === 0) {
      this.showNotification('Circuit is empty! Add some gates first.', 'warning');
      return;
    }

    if (this.isPlayingCircuit) {
      this.showNotification('Circuit is already playing!', 'warning');
      return;
    }

    this.isPlayingCircuit = true;
    this.circuitPlaybackIndex = 0;

    // Reset to initial state
    this.resetQuantumState();
    this.showNotification('🚀 Executing quantum circuit...', 'info');

    // Execute each gate with animation
    for (let i = 0; i < this.circuitSteps.length; i++) {
      this.circuitPlaybackIndex = i;
      
      // Highlight current gate
      this.highlightCurrentGate(i);
      
      // Apply the gate
      await this.executeGateStep(this.circuitSteps[i]);
      
      // Wait between steps
      await this.sleep(1200);
    }

    this.isPlayingCircuit = false;
    this.showNotification('✅ Circuit execution complete!', 'success');
    this.clearGateHighlights();
  }

  private async stepThroughCircuit(): Promise<void> {
    if (this.circuitSteps.length === 0) {
      this.showNotification('Circuit is empty!', 'warning');
      return;
    }

    if (this.circuitPlaybackIndex >= this.circuitSteps.length) {
      this.circuitPlaybackIndex = 0;
      this.resetQuantumState();
    }

    const step = this.circuitSteps[this.circuitPlaybackIndex];
    this.highlightCurrentGate(this.circuitPlaybackIndex);
    
    await this.executeGateStep(step);
    this.circuitPlaybackIndex++;

    if (this.circuitPlaybackIndex >= this.circuitSteps.length) {
      this.showNotification('✅ Reached end of circuit!', 'success');
      this.clearGateHighlights();
    }
  }

  private highlightCurrentGate(index: number): void {
    const gates = this.container?.querySelectorAll('.circuit-gate');
    gates?.forEach((gate, i) => {
      const gateEl = gate as HTMLElement;
      if (i === index) {
        gateEl.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        gateEl.style.animation = 'quantum-pulse 0.8s ease-out infinite';
      } else {
        gateEl.style.background = 'linear-gradient(135deg, #7c3aed, #a855f7)';
        gateEl.style.animation = 'none';
      }
    });
  }

  private clearGateHighlights(): void {
    const gates = this.container?.querySelectorAll('.circuit-gate');
    gates?.forEach(gate => {
      const gateEl = gate as HTMLElement;
      gateEl.style.background = 'linear-gradient(135deg, #7c3aed, #a855f7)';
      gateEl.style.animation = 'none';
    });
  }

  private async executeGateStep(step: { gate: string; name: string }): Promise<void> {
    // Set current gate and apply it
    this.currentGate = step.gate;
    this.updateGateInfo(step.gate);
    
    // Apply with animation
    this.applyGateToState(step.gate);
  }

  private loadCircuitTemplate(template: string): void {
    this.clearCircuit();

    switch (template) {
      case 'bell':
        this.circuitSteps = [
          { gate: 'h', name: 'H' },
          { gate: 'x', name: 'X' } // Simulate Bell-like preparation
        ];
        this.showNotification('🔔 Loaded Bell State-like circuit', 'success');
        break;
        
      case 'superposition':
        this.circuitSteps = [
          { gate: 'h', name: 'H' }
        ];
        this.showNotification('🌀 Loaded Superposition circuit', 'success');
        break;
        
      case 'flip':
        this.circuitSteps = [
          { gate: 'x', name: 'X' }
        ];
        this.showNotification('🔄 Loaded Bit Flip circuit', 'success');
        break;
        
      case 'random':
        const gates = ['h', 'x', 'y', 'z'];
        this.circuitSteps = [];
        for (let i = 0; i < 3; i++) {
          const randomGate = gates[Math.floor(Math.random() * gates.length)];
          this.circuitSteps.push({
            gate: randomGate,
            name: randomGate.toUpperCase()
          });
        }
        this.showNotification('🎲 Loaded Random circuit', 'success');
        break;
    }

    this.updateCircuitDisplay();
  }

  private showNotification(message: string, type: 'success' | 'warning' | 'info' | 'error'): void {
    const notification = document.createElement('div');
    const colors = {
      success: 'bg-green-600',
      warning: 'bg-yellow-600', 
      info: 'bg-blue-600',
      error: 'bg-red-600'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 3000;
      animation: notification-slide 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.className = colors[type];
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'notification-slide 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private clearCircuit(): void {
    this.circuitSteps = [];
    this.circuitPlaybackIndex = 0;
    this.updateCircuitDisplay();
  }

  private demonstrateCNOT(): void {
    alert('CNOT Gate Demonstration:\n\nThe CNOT gate operates on two qubits:\n- Control qubit: determines if operation happens\n- Target qubit: gets flipped if control is |1⟩\n\nThis creates entanglement and is fundamental to quantum computing!\n\n|00⟩ → |00⟩\n|01⟩ → |01⟩\n|10⟩ → |11⟩\n|11⟩ → |10⟩');
  }

  private demonstrateBellState(): void {
    alert('Bell State Creation:\n\n1. Start with |00⟩\n2. Apply H to first qubit: (|0⟩+|1⟩)|0⟩/√2\n3. Apply CNOT: (|00⟩+|11⟩)/√2\n\nResult: Maximum entanglement!\nMeasuring one qubit instantly determines the other.');
  }

  private jumpToStep(stepNumber: number): void {
    console.log(`Step6: jumpToStep called with stepNumber: ${stepNumber}`);
    const event = new CustomEvent('stepTransition', { detail: { step: stepNumber } });
    console.log(`Step6: Dispatching stepTransition event with step: ${stepNumber}`);
    window.dispatchEvent(event);
  }

  private onNextStep(): void {
    const event = new CustomEvent('stepTransition', { detail: { step: 7 } });
    window.dispatchEvent(event);
  }

  private onPrevStep(): void {
    const event = new CustomEvent('stepTransition', { detail: { step: 5 } });
    window.dispatchEvent(event);
  }

  public async show(): Promise<void> {
    console.log('Step6QuantumGates: show() called');
    
    // Add to main app container
    const mainApp = document.getElementById('main-app');
    if (mainApp && this.container) {
      // Clear existing content and add step 6
      mainApp.innerHTML = '';
      mainApp.appendChild(this.container);
      
      if (!this.isInitialized) {
        console.log('Step6: Initializing...');
        await this.initialize();
      }
    } else {
      console.error('Step6: Container or main-app not found!');
    }
  }

  public hide(): void {
    // Step will be hidden when another step takes over the main-app
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
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

  private async initialize(): Promise<void> {
    console.log('Step6: Starting initialization');
    
    this.initializeEventListeners();
    await this.initializeBlochSphere();
    this.updateStateDisplay();
    this.updateGateInfo('h'); // Default to Hadamard gate
    this.updateMatrixDisplay('h');
    this.updateCircuitDisplay();
    
    this.isInitialized = true;
    console.log('Step6: Initialization complete');
  }

  public getStepData(): StepData {
    return {
      id: 6,
      title: "Quantum Gates",
      description: "How we control and manipulate qubits",
      completed: false,
      progress: 0
    };
  }
}
