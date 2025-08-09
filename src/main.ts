// Main entry point for Quantum Computing Experience
import { QuantumExperience } from './QuantumExperience.js';
import { AudioSystem } from './components/AudioSystem.js';
import { PerformanceMonitor } from './components/PerformanceMonitor.js';

// Global application instance
let app: QuantumExperience | null = null;
let audio: AudioSystem | null = null;
let monitor: PerformanceMonitor | null = null;

// Initialize application when DOM is loaded
function initializeApp(): void {
  try {
    // Initialize main application
    app = new QuantumExperience({
      preloaderDuration: 3000,
      particleCount: 50,
      audioEnabled: true,
      performanceMonitoring: false
    });

    // Initialize audio system
    audio = new AudioSystem();

    // Initialize performance monitor (hidden by default)
    monitor = new PerformanceMonitor();

    // Setup global error handling
    setupErrorHandling();

    // Setup easter eggs
    setupEasterEggs();

    // Console greeting for developers
    showDeveloperMessage();

  } catch (error) {
    console.error('Failed to initialize Quantum Experience:', error);
    showErrorMessage('Failed to initialize application. Please refresh the page.');
  }
}

function setupErrorHandling(): void {
  window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // Could send to error tracking service
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

function setupEasterEggs(): void {
  let konamiCode: string[] = [];
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);

    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
      triggerEasterEgg();
      konamiCode = [];
    }
  });
}

function triggerEasterEgg(): void {
  // Hue rotation effect
  document.body.style.filter = 'hue-rotate(180deg)';
  
  if (audio) {
    audio.playSuccessSound();
  }

  setTimeout(() => {
    document.body.style.filter = '';
  }, 3000);

  console.log('🎉 Konami Code activated! Reality.exe has encountered a quantum entanglement...');
}

function showDeveloperMessage(): void {
  const message = `
%c┌─────────────────────────────────────────┐
│     QUANTUM COMPUTING EXPERIENCE        │
│           Step 1: Initialized           │
│                                         │
│  Press Ctrl+Shift+P for debug monitor  │
│  Konami code for easter egg            │
│                                         │
│  Technologies: TypeScript + Tailwind   │
│  Effects: WebGL + WebAudio + Canvas    │
└─────────────────────────────────────────┘
  `;

  console.log(message, 'color: #00ff41; font-family: monospace; font-size: 12px;');
}

function showErrorMessage(message: string): void {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 20px;
    border-radius: 5px;
    font-family: monospace;
    z-index: 10000;
    text-align: center;
  `;
  errorDiv.innerHTML = `
    <h3>System Error</h3>
    <p>${message}</p>
    <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">Reload</button>
  `;
  document.body.appendChild(errorDiv);
}

// Cleanup function
function cleanup(): void {
  if (app) {
    app.destroy();
    app = null;
  }
  
  if (audio) {
    audio.destroy();
    audio = null;
  }
  
  if (monitor) {
    monitor.destroy();
    monitor = null;
  }
}

// Expose global functions for debugging
(window as any).quantumApp = {
  getApp: () => app,
  getAudio: () => audio,
  getMonitor: () => monitor,
  cleanup,
  restart: () => {
    cleanup();
    initializeApp();
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
