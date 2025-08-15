export class Step7Thermodynamics {
  private temperature: number = 300; // Kelvin
  private entropy: number = 0;
  private container!: HTMLElement;
  private isInitialized: boolean = false;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  getHTML(): string {
    return `
    <div class="min-h-screen bg-black text-green-400 p-8 font-mono">
      <!-- Animated Background -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20"></div>
        <div class="heat-particles"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 glitch-text">
            QUANTUM THERMODYNAMICS
          </h1>
          <p class="text-xl text-orange-300 mb-6">Where Heat Meets Quantum Mechanics</p>
          
          <!-- Progress indicator -->
          <div class="flex justify-center items-center space-x-4 mb-8">
            <div class="text-sm text-gray-400">STEP 7 OF 7</div>
            <div id="step-7" class="w-6 h-6 rounded-full bg-orange-400 border-2 border-red-400"></div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          <!-- LEFT PANEL - THERMODYNAMIC VISUALIZATION -->
          <div class="space-y-6">
            
            <!-- Heat Engine Visualization -->
            <div class="bg-gradient-to-br from-red-900/40 to-orange-900/40 p-6 rounded-xl border border-red-400/50 backdrop-blur">
              <h2 class="text-xl font-bold text-red-400 mb-4 text-center">🔥 QUANTUM HEAT ENGINE</h2>
              <div id="heat-engine" class="w-full h-80 lg:h-96 bg-black rounded-xl border-2 border-orange-400/50 relative overflow-hidden">
                <canvas id="thermo-canvas" class="w-full h-full rounded-xl"></canvas>
                <div class="absolute top-4 left-4 text-orange-400 text-sm">
                  <p>• Hot reservoir transfers energy to quantum working substance</p>
                  <p>• Work is extracted as the system cycles between energy states</p>
                  <p>• Excess heat flows to cold reservoir, completing the cycle</p>
                </div>
              </div>
              
              <!-- Engine Controls -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <button id="start-engine" class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg text-white font-bold transition-all transform hover:scale-105">
                  🔥 START ENGINE
                </button>
                <button id="cool-down" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white font-bold transition-all transform hover:scale-105">
                  ❄️ COOL DOWN
                </button>
                <button id="open-framework" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all transform hover:scale-105">
                  📊 FRAMEWORK
                </button>
              </div>
              <div class="mt-3 text-center">
                <div class="text-orange-400 font-bold mb-1">Temperature</div>
                <div id="temperature-display" class="text-sm font-mono bg-black/50 p-2 rounded border border-orange-400/30">
                  T = 300 K
                </div>
              </div>
            </div>

            <!-- Entropy Visualization -->
            <div class="bg-gradient-to-br from-orange-900/40 to-yellow-900/40 p-6 rounded-xl border border-yellow-400/50 backdrop-blur">
              <h3 class="text-lg font-bold text-yellow-400 mb-4 text-center">📊 ENTROPY EVOLUTION</h3>
              <div class="space-y-4">
                <!-- Entropy Bar -->
                <div class="bg-black/50 p-4 rounded border border-yellow-400/30">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-yellow-400">Entropy (S)</span>
                    <span id="entropy-value" class="text-orange-400 font-mono">0.00 J/K</span>
                  </div>
                  <div class="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                    <div id="entropy-bar" class="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-1000" style="width: 0%"></div>
                  </div>
                </div>
                
                <!-- Energy Distribution -->
                <div class="bg-black/50 p-4 rounded border border-orange-400/30">
                  <div class="text-sm text-orange-400 mb-2">Energy Distribution</div>
                  <div id="energy-chart" class="h-24 flex items-end space-x-1">
                    <!-- Energy bars will be generated here -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL - THEORY & CONTROLS -->
          <div class="space-y-6">
            
            <!-- Theory Introduction -->
            <div class="bg-gray-900/80 p-4 rounded-lg border border-orange-400/30 backdrop-blur">
              <h3 class="text-lg font-bold text-orange-400 mb-3">QUANTUM THERMODYNAMICS</h3>
              <div class="space-y-2 text-gray-300 text-sm">
                <p>Quantum mechanics meets <span class="text-red-400">thermodynamics</span> at the microscopic scale.</p>
                <div class="bg-black/50 p-3 rounded border-l-4 border-orange-400">
                  <p class="text-orange-300 text-xs"><strong>Key:</strong> Heat engines can work at the <span class="text-red-400">quantum level</span> with single particles</p>
                </div>
              </div>
            </div>

            <!-- Thermodynamic Cycles -->
            <div class="bg-gradient-to-br from-red-900/40 to-yellow-900/40 p-6 rounded-lg border border-red-400/50 backdrop-blur">
              <h3 class="text-xl font-bold text-red-400 mb-4 text-center">🌡️ THERMODYNAMIC CYCLES</h3>
              <div class="grid grid-cols-1 gap-3">
                <button id="cycle-carnot" class="cycle-btn active" data-cycle="carnot">
                  <div class="text-left">
                    <div class="font-bold text-red-400">CARNOT CYCLE</div>
                    <div class="text-xs text-gray-400">Ideal reversible heat engine</div>
                  </div>
                </button>
                <button id="cycle-otto" class="cycle-btn" data-cycle="otto">
                  <div class="text-left">
                    <div class="font-bold text-orange-400">OTTO CYCLE</div>
                    <div class="text-xs text-gray-400">Quantum internal combustion</div>
                  </div>
                </button>
                <button id="cycle-diesel" class="cycle-btn" data-cycle="diesel">
                  <div class="text-left">
                    <div class="font-bold text-yellow-400">DIESEL CYCLE</div>
                    <div class="text-xs text-gray-400">Quantum compression ignition</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Laws of Thermodynamics -->
            <div class="bg-gray-900/80 p-4 rounded-lg border border-yellow-400/30 backdrop-blur">
              <h3 class="text-lg font-bold text-yellow-400 mb-3">⚖️ THERMODYNAMIC LAWS</h3>
              <div class="space-y-2 text-gray-300 text-sm">
                <div class="bg-black/50 p-3 rounded border border-red-400/30">
                  <div class="text-red-400 font-bold">0th Law:</div>
                  <div class="text-xs">Thermal equilibrium is transitive</div>
                </div>
                <div class="bg-black/50 p-3 rounded border border-orange-400/30">
                  <div class="text-orange-400 font-bold">1st Law:</div>
                  <div class="text-xs">Energy conservation: ΔU = Q - W</div>
                </div>
                <div class="bg-black/50 p-3 rounded border border-yellow-400/30">
                  <div class="text-yellow-400 font-bold">2nd Law:</div>
                  <div class="text-xs">Entropy always increases: ΔS ≥ 0</div>
                </div>
                <div class="bg-black/50 p-3 rounded border border-red-300/30">
                  <div class="text-red-300 font-bold">3rd Law:</div>
                  <div class="text-xs">Absolute zero: S(T=0) = 0</div>
                </div>
              </div>
            </div>

            <!-- Real World Applications -->
            <div class="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-6 rounded-lg border border-orange-400/50 backdrop-blur">
              <h3 class="text-lg font-bold text-orange-400 mb-4">🌍 REAL WORLD APPLICATIONS</h3>
              <div class="space-y-3">
                <div class="flex items-center space-x-3 text-sm">
                  <div class="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <span><strong class="text-red-400">Quantum Refrigerators:</strong> Ultra-precise cooling systems</span>
                </div>
                <div class="flex items-center space-x-3 text-sm">
                  <div class="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  <span><strong class="text-orange-400">Quantum Batteries:</strong> Energy storage at quantum scale</span>
                </div>
                <div class="flex items-center space-x-3 text-sm">
                  <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span><strong class="text-yellow-400">Quantum Computing:</strong> Heat management in qubits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-12">
          <button id="prev-step" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white font-bold transition-all transform hover:scale-105">
            ← Step 6: Quantum Gates
          </button>
          <div class="text-center">
            <div class="text-orange-400 font-bold mb-2">QUANTUM UNIVERSE UNLOCKED!</div>
            <div class="text-sm text-gray-400">You've mastered the quantum-thermal frontier</div>
          </div>
          <button id="restart-journey" class="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg text-white font-bold transition-all transform hover:scale-105">
            🔄 Restart Journey
          </button>
        </div>
      </div>
    </div>

    <style>
      .heat-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
        animation: heatFlow 8s ease-in-out infinite;
      }
      
      @keyframes heatFlow {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-20px) scale(1.1); }
      }

      .cycle-btn {
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.8));
        border: 1px solid rgba(251, 146, 60, 0.3);
        padding: 12px;
        border-radius: 8px;
        text-align: left;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .cycle-btn:hover {
        border-color: rgba(251, 146, 60, 0.6);
        background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(239, 68, 68, 0.1));
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(251, 146, 60, 0.3);
      }

      .cycle-btn.active {
        border-color: #f97316;
        background: linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(239, 68, 68, 0.2));
        box-shadow: 0 0 20px rgba(251, 146, 60, 0.4);
      }

      .glitch-text {
        animation: glitchHeat 2s infinite;
      }

      @keyframes glitchHeat {
        0%, 100% { text-shadow: 0 0 5px #f97316, 0 0 10px #ef4444, 0 0 15px #eab308; }
        25% { text-shadow: 2px 0 #f97316, -2px 0 #ef4444; }
        50% { text-shadow: -2px 0 #f97316, 2px 0 #ef4444; }
        75% { text-shadow: 0 2px #f97316, 0 -2px #ef4444; }
      }
    </style>
    `;
  }

  initialize(): void {
    if (this.isInitialized) return;
    
    // Create container element
    this.container = document.createElement('div');
    this.container.innerHTML = this.getHTML();
    
    this.setupCanvas();
    this.setupEventListeners();
    this.updateDisplay();
    this.drawSimpleEngine();
    
    this.isInitialized = true;
  }

  private setupCanvas(): void {
    this.canvas = this.container?.querySelector('#thermo-canvas') as HTMLCanvasElement;
    
    if (!this.canvas) {
      console.error('Canvas element not found!');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d')!;
    
    // Set canvas size
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
      this.drawSimpleEngine();
    });
  }

  private drawSimpleEngine(): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear with simple gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a0000');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw hot reservoir (simple circle)
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 120, 50, 0, 2 * Math.PI);
    ctx.fill();
    
    // Hot reservoir label
    ctx.fillStyle = '#ff6b35';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HOT', centerX, centerY - 160);
    ctx.fillText(`${Math.round(this.temperature * 1.5)} K`, centerX, centerY - 145);

    // Draw working substance (simple pulsing circle)
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    // Working substance label
    ctx.fillStyle = '#ffb84d';
    ctx.fillText('QUANTUM', centerX, centerY - 5);
    ctx.fillText('SYSTEM', centerX, centerY + 10);

    // Draw cold reservoir
    ctx.fillStyle = '#00bfff';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 120, 50, 0, 2 * Math.PI);
    ctx.fill();
    
    // Cold reservoir label
    ctx.fillStyle = '#87ceeb';
    ctx.fillText('COLD', centerX, centerY + 160);
    ctx.fillText(`${Math.round(this.temperature * 0.5)} K`, centerX, centerY + 175);

    // Draw simple arrows
    ctx.strokeStyle = '#ff4500';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 70);
    ctx.lineTo(centerX, centerY - 40);
    ctx.stroke();
    
    ctx.strokeStyle = '#00bfff';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 40);
    ctx.lineTo(centerX, centerY + 70);
    ctx.stroke();
    
    // Draw work output circle
    ctx.strokeStyle = '#32cd32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Work label
    ctx.fillStyle = '#90ee90';
    ctx.textAlign = 'left';
    ctx.fillText('WORK OUT', centerX + 90, centerY);
  }

  private setupEventListeners(): void {
    // Engine controls
    this.container?.querySelector('#start-engine')?.addEventListener('click', () => {
      this.startEngine();
    });

    this.container?.querySelector('#cool-down')?.addEventListener('click', () => {
      this.coolDown();
    });

    this.container?.querySelector('#open-framework')?.addEventListener('click', () => {
      this.openThermodynamicFramework();
    });

    // Cycle selection
    this.container?.querySelectorAll('.cycle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container?.querySelectorAll('.cycle-btn').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        
        const cycle = (e.currentTarget as HTMLElement).dataset.cycle;
        this.changeCycle(cycle!);
      });
    });

    // Navigation
    this.container?.querySelector('#prev-step')?.addEventListener('click', () => {
      window.location.href = '#step-6';
    });

    this.container?.querySelector('#restart-journey')?.addEventListener('click', () => {
      window.location.href = '#step-1';
    });
  }

  private updateDisplay(): void {
    // Update temperature display
    const tempDisplay = this.container?.querySelector('#temperature-display');
    if (tempDisplay) {
      tempDisplay.textContent = `T = ${Math.round(this.temperature)} K`;
    }
    
    // Update entropy display
    const entropyValue = this.container?.querySelector('#entropy-value');
    const entropyBar = this.container?.querySelector('#entropy-bar') as HTMLElement;
    if (entropyValue && entropyBar) {
      entropyValue.textContent = `${this.entropy.toFixed(2)} J/K`;
      entropyBar.style.width = `${Math.min(100, this.entropy * 2)}%`;
    }
    
    // Update energy chart
    this.updateEnergyChart();
  }

  private updateEnergyChart(): void {
    const chart = this.container?.querySelector('#energy-chart');
    if (!chart) return;
    
    // Create simple energy distribution visualization
    const bars = Math.floor(this.temperature / 50);
    
    chart.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const bar = document.createElement('div');
      const height = i < bars ? Math.random() * 80 + 20 : 10;
      bar.style.cssText = `
        width: 8px;
        height: ${height}%;
        background: linear-gradient(to top, #ef4444, #f97316, #eab308);
        border-radius: 2px;
        transition: height 0.3s ease;
      `;
      chart.appendChild(bar);
    }
  }

  private startEngine(): void {
    this.temperature = Math.min(1000, this.temperature + 100);
    this.entropy += 5;
    this.updateDisplay();
    this.drawSimpleEngine();
  }

  private coolDown(): void {
    this.temperature = Math.max(100, this.temperature - 100);
    this.entropy = Math.max(0, this.entropy - 3);
    this.updateDisplay();
    this.drawSimpleEngine();
  }

  private openThermodynamicFramework(): void {
    // Open the thermodynamic framework in a new tab
    window.open('./thermodynamic-quantum-framework/index.html', '_blank');
  }

  private changeCycle(cycle: string): void {
    switch (cycle) {
      case 'carnot':
        this.temperature = 400;
        break;
      case 'otto':
        this.temperature = 600;
        break;
      case 'diesel':
        this.temperature = 800;
        break;
    }
    this.updateDisplay();
    this.drawSimpleEngine();
  }

  public async show(): Promise<void> {
    console.log('Step7Thermodynamics: show() called');
    
    // Add to main app container
    const mainApp = document.getElementById('main-app');
    if (mainApp && this.container) {
      // Clear existing content and add step 7
      mainApp.innerHTML = '';
      mainApp.appendChild(this.container);
      
      if (!this.isInitialized) {
        console.log('Step7: Initializing...');
        await this.initialize();
      }
    } else {
      console.error('Step7: Container or main-app not found!');
    }
  }

  public hide(): void {
    // Step will be hidden when another step takes over the main-app
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  public destroy(): void {
    this.isInitialized = false;
  }
}
