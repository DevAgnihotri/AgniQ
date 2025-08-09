// Cyberpunk Quantum Computing Experience - Step 1 JavaScript

class QuantumExperience {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.mainApp = document.getElementById('main-app');
        this.continueBtn = document.getElementById('continueBtn');
        this.particlesContainer = document.getElementById('particles-container');
        
        this.init();
    }

    init() {
        // Start preloader
        this.showPreloader();
        
        // Initialize after preloader
        setTimeout(() => {
            this.hidePreloader();
            this.initMainApp();
        }, 3000);
    }

    showPreloader() {
        this.preloader.style.display = 'flex';
        
        // Add glitch effect to project name
        setTimeout(() => {
            const projectName = document.querySelector('.project-name');
            if (projectName) {
                projectName.style.animation = 'glitch 0.5s ease-in-out 3';
            }
        }, 2000);
    }

    hidePreloader() {
        this.preloader.style.opacity = '0';
        this.preloader.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            this.preloader.style.display = 'none';
            this.mainApp.classList.remove('hidden');
            this.mainApp.style.opacity = '0';
            this.mainApp.style.transition = 'opacity 1s ease-in';
            
            requestAnimationFrame(() => {
                this.mainApp.style.opacity = '1';
            });
        }, 500);
    }

    initMainApp() {
        // Initialize glitch effects
        this.initGlitchEffects();
        
        // Initialize particles
        this.initParticles();
        
        // Initialize typewriter effect
        this.initTypewriter();
        
        // Initialize button interactions
        this.initButtonInteractions();
        
        // Initialize scroll effects
        this.initScrollEffects();
        
        // Add matrix rain effect
        this.initMatrixRain();
    }

    initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            // Store original text
            element.setAttribute('data-text', element.textContent);
            
            // Random glitch intervals
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance every interval
                    element.style.animation = 'none';
                    setTimeout(() => {
                        element.style.animation = 'glitch 0.3s ease-in-out';
                    }, 50);
                }
            }, 2000);
        });
    }

    initParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle();
        }
        
        // Create new particles periodically
        setInterval(() => {
            if (this.particlesContainer.children.length < particleCount) {
                this.createParticle();
            }
        }, 3000);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation duration
        const duration = Math.random() * 10 + 5;
        particle.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';
        
        this.particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }

    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        if (!typewriterElement) return;
        
        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        typewriterElement.style.borderRight = '3px solid #39ff14';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            typewriterElement.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
                // Keep cursor blinking
                setTimeout(() => {
                    typewriterElement.style.borderRight = 'none';
                }, 2000);
            }
        }, 100);
    }

    initButtonInteractions() {
        if (this.continueBtn) {
            // Hover effect
            this.continueBtn.addEventListener('mouseenter', () => {
                this.continueBtn.style.boxShadow = '0 0 20px #39ff14, inset 0 0 20px rgba(57, 255, 20, 0.1)';
                this.continueBtn.style.transform = 'translateY(-2px)';
            });
            
            this.continueBtn.addEventListener('mouseleave', () => {
                this.continueBtn.style.boxShadow = '';
                this.continueBtn.style.transform = '';
            });
            
            // Click effect
            this.continueBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleContinue();
            });
        }
    }

    handleContinue() {
        // Add click animation
        this.continueBtn.style.transform = 'scale(0.95)';
        this.continueBtn.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            this.continueBtn.style.transform = '';
        }, 100);
        
        // Show confirmation message
        this.showContinueMessage();
    }

    showContinueMessage() {
        const message = document.createElement('div');
        message.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border-2 border-cyber-green p-8 rounded-lg text-center z-50';
        message.innerHTML = `
            <div class="text-cyber-green text-2xl font-cyber mb-4">STEP_01_COMPLETE</div>
            <div class="text-gray-300 mb-6">Ready to proceed to Step 2: How Quantum Computing Works?</div>
            <div class="space-x-4">
                <button id="proceedBtn" class="bg-cyber-green text-black px-6 py-2 font-bold hover:bg-cyber-blue transition-colors">PROCEED</button>
                <button id="cancelBtn" class="bg-transparent border border-cyber-red text-cyber-red px-6 py-2 hover:bg-cyber-red hover:text-black transition-colors">CANCEL</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'fixed inset-0 bg-black bg-opacity-75 z-40';
        document.body.appendChild(backdrop);
        
        // Handle buttons
        document.getElementById('proceedBtn').addEventListener('click', () => {
            this.proceedToStep2();
        });
        
        document.getElementById('cancelBtn').addEventListener('click', () => {
            document.body.removeChild(message);
            document.body.removeChild(backdrop);
        });
        
        // Close on backdrop click
        backdrop.addEventListener('click', () => {
            document.body.removeChild(message);
            document.body.removeChild(backdrop);
        });
    }

    proceedToStep2() {
        // Create transition effect
        const transition = document.createElement('div');
        transition.className = 'fixed inset-0 bg-cyber-blue z-50 flex items-center justify-center';
        transition.style.opacity = '0';
        transition.style.transition = 'opacity 0.5s ease-in';
        transition.innerHTML = `
            <div class="text-white text-4xl font-cyber">LOADING_STEP_02...</div>
        `;
        
        document.body.appendChild(transition);
        
        requestAnimationFrame(() => {
            transition.style.opacity = '1';
        });
        
        // Simulate loading time
        setTimeout(() => {
            alert('Step 2 will be implemented next! This is where we\'ll dive into qubits and superposition.');
            document.body.removeChild(transition);
        }, 2000);
    }

    initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll('.cyber-box');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initMatrixRain() {
        // Create matrix rain effect in background
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.1';
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Matrix characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const charArray = chars.split('');
        
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(26, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 35);
    }
}

// Audio System
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.oscillators = [];
        this.init();
    }

    init() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playGlitchSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playSuccessSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
        oscillator.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.init();
    }

    init() {
        this.createMonitor();
        this.startMonitoring();
    }

    createMonitor() {
        const monitor = document.createElement('div');
        monitor.id = 'performance-monitor';
        monitor.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff41;
            padding: 10px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 12px;
            border: 1px solid #00ff41;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(monitor);
    }

    startMonitoring() {
        const monitor = document.getElementById('performance-monitor');
        
        const updateStats = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                if (monitor) {
                    monitor.innerHTML = `
                        FPS: ${this.fps}<br>
                        Memory: ${this.getMemoryUsage()}<br>
                        Time: ${new Date().toLocaleTimeString()}
                    `;
                }
            }
            
            requestAnimationFrame(updateStats);
        };
        
        updateStats();
        
        // Toggle monitor with Ctrl+Shift+P
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    getMemoryUsage() {
        if (performance.memory) {
            const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
            const total = Math.round(performance.memory.totalJSHeapSize / 1048576);
            return `${used}/${total}MB`;
        }
        return 'N/A';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    const app = new QuantumExperience();
    
    // Initialize audio system
    const audio = new AudioSystem();
    
    // Initialize performance monitor
    const monitor = new PerformanceMonitor();
    
    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
    });
    
    // Add some easter eggs
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            // Easter egg triggered
            document.body.style.filter = 'hue-rotate(180deg)';
            audio.playSuccessSound();
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
            konamiCode = [];
        }
    });
    
    // Console message for developers
    console.log(`
%c┌─────────────────────────────────────────┐
│     QUANTUM COMPUTING EXPERIENCE        │
│           Step 1: Initialized           │
│                                         │
│  Press Ctrl+Shift+P for debug monitor  │
│  Konami code for easter egg            │
└─────────────────────────────────────────┘
    `, 'color: #00ff41; font-family: monospace;');
});
