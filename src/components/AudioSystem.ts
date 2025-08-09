// Audio System Component
import { AudioOptions } from '../types';

export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
      this.audioContext = null;
    }
  }

  public playGlitchSound(): void {
    if (!this.audioContext) return;
    
    const options: AudioOptions = {
      frequency: 800,
      duration: 0.1,
      volume: 0.1
    };

    this.playTone(options, (oscillator, gainNode, currentTime) => {
      oscillator.frequency.setValueAtTime(options.frequency, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, currentTime + options.duration);
      
      gainNode.gain.setValueAtTime(options.volume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + options.duration);
    });
  }

  public playSuccessSound(): void {
    if (!this.audioContext) return;
    
    const options: AudioOptions = {
      frequency: 200,
      duration: 0.4,
      volume: 0.1
    };

    this.playTone(options, (oscillator, gainNode, currentTime) => {
      oscillator.frequency.setValueAtTime(200, currentTime);
      oscillator.frequency.linearRampToValueAtTime(400, currentTime + 0.2);
      oscillator.frequency.linearRampToValueAtTime(600, currentTime + 0.4);
      
      gainNode.gain.setValueAtTime(options.volume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + options.duration);
    });
  }

  private playTone(
    options: AudioOptions, 
    modifyTone: (oscillator: OscillatorNode, gainNode: GainNode, currentTime: number) => void
  ): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    const currentTime = this.audioContext.currentTime;
    modifyTone(oscillator, gainNode, currentTime);
    
    oscillator.start();
    oscillator.stop(currentTime + options.duration);
    
    // Clean up
    oscillator.addEventListener('ended', () => {
      const index = this.oscillators.indexOf(oscillator);
      if (index > -1) {
        this.oscillators.splice(index, 1);
      }
    });
    
    this.oscillators.push(oscillator);
  }

  public playCustomSound(options: Partial<AudioOptions>): void {
    const fullOptions: AudioOptions = {
      frequency: 440,
      duration: 0.2,
      volume: 0.1,
      ...options
    };

    this.playTone(fullOptions, (oscillator, gainNode, currentTime) => {
      oscillator.frequency.setValueAtTime(fullOptions.frequency, currentTime);
      gainNode.gain.setValueAtTime(fullOptions.volume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + fullOptions.duration);
    });
  }

  public stopAllSounds(): void {
    this.oscillators.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    this.oscillators = [];
  }

  public destroy(): void {
    this.stopAllSounds();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }

  public isSupported(): boolean {
    return this.audioContext !== null;
  }
}
