// Matrix Rain Effect Component
export class MatrixRain {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private drops: number[] = [];
  private isRunning: boolean = false;

  private readonly chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  private readonly charArray: string[];
  private readonly fontSize = 14;
  private columns = 0;

  constructor() {
    this.charArray = this.chars.split('');
    this.createCanvas();
    this.setupCanvas();
    this.setupEventListeners();
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.1;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  private setupCanvas(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.resizeCanvas();
    this.initializeDrops();
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.initializeDrops();
  }

  private initializeDrops(): void {
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = 1;
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  public start(): void {
    if (this.isRunning || !this.canvas || !this.ctx) return;
    
    this.isRunning = true;
    this.animate();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate(): void {
    if (!this.isRunning || !this.ctx || !this.canvas) return;

    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private draw(): void {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas with fade effect
    this.ctx.fillStyle = 'rgba(26, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Set text properties
    this.ctx.fillStyle = '#00ff41';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    // Draw characters
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.charArray[Math.floor(Math.random() * this.charArray.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;
      
      this.ctx.fillText(text, x, y);
      
      // Reset drop if it reaches bottom or randomly
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
  }

  public setOpacity(opacity: number): void {
    if (this.canvas) {
      this.canvas.style.opacity = opacity.toString();
    }
  }

  public setColors(color: string, backgroundColor: string = 'rgba(26, 0, 0, 0.05)'): void {
    // Colors will be applied in the next draw cycle
    // This is a simplified implementation
  }

  public destroy(): void {
    this.stop();
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }

  public isActive(): boolean {
    return this.isRunning;
  }
}
