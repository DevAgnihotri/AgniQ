// Performance Monitor Component
import { PerformanceMetrics } from '../types';

export class PerformanceMonitor {
  private fps: number = 0;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private monitorElement: HTMLElement | null = null;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;

  constructor() {
    this.createMonitorElement();
    this.setupKeyboardShortcuts();
    this.startMonitoring();
  }

  private createMonitorElement(): void {
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
      min-width: 150px;
    `;
    
    document.body.appendChild(monitor);
    this.monitorElement = monitor;
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  public toggle(): void {
    if (!this.monitorElement) return;
    
    const isVisible = this.monitorElement.style.display !== 'none';
    this.monitorElement.style.display = isVisible ? 'none' : 'block';
  }

  public show(): void {
    if (this.monitorElement) {
      this.monitorElement.style.display = 'block';
    }
  }

  public hide(): void {
    if (this.monitorElement) {
      this.monitorElement.style.display = 'none';
    }
  }

  private startMonitoring(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.updateStats();
  }

  private updateStats(): void {
    if (!this.isRunning) return;

    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      this.updateDisplay();
    }
    
    this.animationFrameId = requestAnimationFrame(() => this.updateStats());
  }

  private updateDisplay(): void {
    if (!this.monitorElement) return;
    
    const metrics = this.getMetrics();
    this.monitorElement.innerHTML = `
      <div><strong>Performance Monitor</strong></div>
      <div>FPS: ${metrics.fps}</div>
      <div>Memory: ${metrics.memory.used}/${metrics.memory.total}MB</div>
      <div>Time: ${new Date().toLocaleTimeString()}</div>
      <div>Timestamp: ${metrics.timestamp}ms</div>
    `;
  }

  public getMetrics(): PerformanceMetrics {
    const memory = this.getMemoryUsage();
    
    return {
      fps: this.fps,
      memory,
      timestamp: Math.round(performance.now())
    };
  }

  private getMemoryUsage(): { used: number; total: number } {
    if ((performance as any).memory) {
      const used = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
      const total = Math.round((performance as any).memory.totalJSHeapSize / 1048576);
      return { used, total };
    }
    return { used: 0, total: 0 };
  }

  public destroy(): void {
    this.isRunning = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.monitorElement && this.monitorElement.parentNode) {
      this.monitorElement.parentNode.removeChild(this.monitorElement);
      this.monitorElement = null;
    }
  }

  public isVisible(): boolean {
    return this.monitorElement?.style.display !== 'none';
  }
}
