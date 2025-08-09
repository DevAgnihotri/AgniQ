// Preloader Component
export class PreloaderComponent {
  private element: HTMLElement;

  constructor(elementId: string) {
    const el = document.getElementById(elementId);
    if (!el) {
      throw new Error(`Preloader element with id "${elementId}" not found`);
    }
    this.element = el;
  }

  public show(): void {
    this.element.style.display = 'flex';
    
    // Add glitch effect to project name
    setTimeout(() => {
      const projectName = this.element.querySelector('.project-name') as HTMLElement;
      if (projectName) {
        projectName.style.animation = 'glitch 0.5s ease-in-out 3';
      }
    }, 2000);
  }

  public hide(callback?: () => void): void {
    this.element.style.opacity = '0';
    this.element.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      this.element.style.display = 'none';
      if (callback) callback();
    }, 500);
  }

  public isVisible(): boolean {
    return this.element.style.display !== 'none';
  }
}
