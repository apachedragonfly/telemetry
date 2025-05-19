import { Howl } from 'howler';

// We'll use a generated sound for now since we don't have an actual audio file
// This avoids the need to include a real audio file in the project
class AlertSoundService {
  private alertSound: Howl | null = null;
  private isPlaying = false;
  private alertThrottleTimeout: ReturnType<typeof setTimeout> | null = null;
  
  constructor() {
    // Initialize with a fallback beep sound using the Web Audio API
    this.createBeepSound();
  }
  
  private createBeepSound() {
    // Create a simple beep sound using an audio data URI
    // This is a base64-encoded WAV file with a simple beep
    const soundSrc = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU';
    
    this.alertSound = new Howl({
      src: [soundSrc],
      volume: 0.5,
      loop: true,
      rate: 1.0,
      onend: () => {
        this.isPlaying = false;
      }
    });
  }
  
  /**
   * Play the alert sound if not already playing
   * @param throttleMs - Time in ms to wait before allowing the sound to play again
   */
  playAlert(throttleMs = 10000) {
    // Don't trigger sound too frequently
    if (this.alertThrottleTimeout) {
      return;
    }
    
    // Play the sound if it's not already playing
    if (this.alertSound && !this.isPlaying) {
      this.alertSound.play();
      this.isPlaying = true;
      
      // Set throttle timeout
      this.alertThrottleTimeout = setTimeout(() => {
        this.alertThrottleTimeout = null;
      }, throttleMs);
    }
  }
  
  /**
   * Stop the alert sound if it's playing
   */
  stopAlert() {
    if (this.alertSound && this.isPlaying) {
      this.alertSound.stop();
      this.isPlaying = false;
    }
    
    // Clear any throttle timeout
    if (this.alertThrottleTimeout) {
      clearTimeout(this.alertThrottleTimeout);
      this.alertThrottleTimeout = null;
    }
  }
}

// Create a singleton instance
export const alertSoundService = new AlertSoundService(); 