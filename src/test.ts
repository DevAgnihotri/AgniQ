import { QuantumExperience } from './QuantumExperience';

class QuantumStepTester {
    private quantumExperience!: QuantumExperience;
    private container!: HTMLElement;
    private currentStep: number = 1;

    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        // Create the main container
        this.container = document.createElement('div');
        this.container.id = 'quantum-container';
        this.container.className = 'min-h-screen bg-black text-white relative overflow-hidden';
        document.body.appendChild(this.container);

        // Initialize the quantum experience
        this.quantumExperience = new QuantumExperience();
        await this.quantumExperience.init();

        // Create the test interface
        this.createTestInterface();
        
        // Load the first step by default
        this.loadStep(1);
    }

    private createTestInterface(): void {
        // Create test panel overlay
        const testPanel = document.createElement('div');
        testPanel.id = 'test-panel';
        testPanel.className = `
            fixed top-4 right-4 z-50 bg-gray-900/95 backdrop-blur-sm 
            border border-cyan-400/50 rounded-lg p-4 min-w-[280px]
            shadow-2xl shadow-cyan-400/20
        `;

        testPanel.innerHTML = `
            <div class="mb-4">
                <h2 class="text-xl font-bold text-cyan-400 mb-2">🧪 QUANTUM STEP TESTER</h2>
                <div class="text-sm text-gray-400 mb-3">Current Step: <span id="current-step-display" class="text-cyan-400 font-bold">${this.currentStep}</span></div>
            </div>

            <!-- Step Navigation Grid -->
            <div class="grid grid-cols-3 gap-2 mb-4">
                ${this.createStepButtons()}
            </div>

            <!-- Quick Actions -->
            <div class="space-y-2 mb-4">
                <button id="prev-step" class="w-full px-3 py-2 bg-orange-600/30 hover:bg-orange-600/50 border border-orange-400/50 rounded text-orange-400 font-bold transition-all duration-200">
                    ← PREVIOUS
                </button>
                <button id="next-step" class="w-full px-3 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 rounded text-cyan-400 font-bold transition-all duration-200">
                    NEXT →
                </button>
            </div>

            <!-- Status Panel -->
            <div class="bg-gray-800/50 rounded p-3">
                <div class="text-xs text-gray-400 mb-1">STATUS:</div>
                <div id="status-text" class="text-sm text-green-400 font-mono">Ready for testing</div>
            </div>

            <!-- Toggle Panel -->
            <button id="toggle-panel" class="absolute -left-8 top-2 w-6 h-8 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 rounded-l text-cyan-400 font-bold">
                ←
            </button>
        `;

        document.body.appendChild(testPanel);
        this.attachEventListeners();
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
            <button 
                class="step-btn px-2 py-2 bg-${step.color}-600/30 hover:bg-${step.color}-600/50 
                       border border-${step.color}-400/50 rounded text-${step.color}-400 
                       font-bold text-xs transition-all duration-200" 
                data-step="${step.num}">
                ${step.num}
                <div class="text-xs opacity-75">${step.name}</div>
            </button>
        `).join('');
    }

    private attachEventListeners(): void {
        // Step buttons
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stepNum = parseInt((e.currentTarget as HTMLElement).dataset.step!);
                this.loadStep(stepNum);
            });
        });

        // Previous/Next buttons
        document.getElementById('prev-step')?.addEventListener('click', () => {
            if (this.currentStep > 1) {
                this.loadStep(this.currentStep - 1);
            }
        });

        document.getElementById('next-step')?.addEventListener('click', () => {
            if (this.currentStep < 7) {
                this.loadStep(this.currentStep + 1);
            }
        });

        // Toggle panel visibility
        let panelVisible = true;
        document.getElementById('toggle-panel')?.addEventListener('click', () => {
            const panel = document.getElementById('test-panel')!;
            const toggleBtn = document.getElementById('toggle-panel')!;
            
            if (panelVisible) {
                panel.style.transform = 'translateX(calc(100% + 16px))';
                toggleBtn.textContent = '→';
                toggleBtn.style.left = '-32px';
            } else {
                panel.style.transform = 'translateX(0)';
                toggleBtn.textContent = '←';
                toggleBtn.style.left = '-32px';
            }
            panelVisible = !panelVisible;
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) return; // Ignore ctrl/cmd combinations
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.currentStep > 1) this.loadStep(this.currentStep - 1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (this.currentStep < 7) this.loadStep(this.currentStep + 1);
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    e.preventDefault();
                    this.loadStep(parseInt(e.key));
                    break;
                case 'h':
                    e.preventDefault();
                    this.showHelp();
                    break;
            }
        });
    }

    private async loadStep(stepNumber: number): Promise<void> {
        try {
            this.updateStatus(`Loading Step ${stepNumber}...`, 'loading');
            
            // Navigate to the step
            await this.quantumExperience.goToStep(stepNumber);
            
            this.currentStep = stepNumber;
            this.updateCurrentStepDisplay();
            this.updateStepButtons();
            this.updateStatus(`Step ${stepNumber} loaded successfully`, 'success');
            
            console.log(`✅ Loaded Step ${stepNumber}`);
        } catch (error) {
            this.updateStatus(`Error loading Step ${stepNumber}: ${error}`, 'error');
            console.error(`❌ Error loading Step ${stepNumber}:`, error);
        }
    }

    private updateCurrentStepDisplay(): void {
        const display = document.getElementById('current-step-display');
        if (display) {
            display.textContent = this.currentStep.toString();
        }
    }

    private updateStepButtons(): void {
        document.querySelectorAll('.step-btn').forEach(btn => {
            const stepNum = parseInt((btn as HTMLElement).dataset.step!);
            if (stepNum === this.currentStep) {
                btn.classList.add('ring-2', 'ring-white', 'ring-opacity-50');
            } else {
                btn.classList.remove('ring-2', 'ring-white', 'ring-opacity-50');
            }
        });
    }

    private updateStatus(message: string, type: 'success' | 'error' | 'loading' = 'success'): void {
        const statusElement = document.getElementById('status-text');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `text-sm font-mono ${
                type === 'success' ? 'text-green-400' :
                type === 'error' ? 'text-red-400' :
                'text-yellow-400'
            }`;
        }
    }

    private showHelp(): void {
        const helpMessage = `
🧪 QUANTUM STEP TESTER HELP

KEYBOARD SHORTCUTS:
• 1-7: Jump to specific step
• ← →: Navigate between steps
• H: Show this help

MOUSE CONTROLS:
• Click step buttons to navigate
• Use PREVIOUS/NEXT buttons
• Toggle panel with ← button

TESTING FEATURES:
• Real-time step loading
• Error reporting
• Status monitoring
• Quick navigation
        `;
        
        alert(helpMessage);
    }
}

// Initialize the tester when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuantumStepTester();
});

// Export for potential external use
export { QuantumStepTester };
