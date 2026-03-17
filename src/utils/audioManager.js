/**
 * Audio Manager - Handles all sound effects for the game
 * Uses Web Audio API for sound synthesis (no external files needed)
 */

class AudioManager {
  constructor() {
    this.audioContext = null
    this.isMuted = localStorage.getItem('gameSoundMuted') === 'true'
    this.volume = parseFloat(localStorage.getItem('gameSoundVolume') || '0.5')
    this.initAudioContext()
  }

  // Initialize Web Audio API context
  initAudioContext() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.audioContext = new AudioContext()
      }
    }
  }

  // Lazy initialize audio context on first user interaction
  ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext()
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  /**
   * Play scratch sound effect
   * Short, crisp sound with pitch variation based on intensity
   */
  playScratchSound() {
    if (this.isMuted || !this.audioContext) return

    this.ensureAudioContext()

    const now = this.audioContext.currentTime
    const duration = 0.05 // 50ms

    // Create oscillator for scratch effect
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.connect(gain)
    gain.connect(this.audioContext.destination)

    // Random frequency for variation (pitch variation between 150-300Hz)
    osc.frequency.setValueAtTime(150 + Math.random() * 150, now)
    osc.frequency.exponentialRampToValueAtTime(50, now + duration)

    // Quick fade out
    gain.gain.setValueAtTime(this.volume * 0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

    osc.type = 'sawtooth'
    osc.start(now)
    osc.stop(now + duration)
  }

  /**
   * Play completion/victory sound
   * Uplifting two-note sequence
   */
  playCompletionSound() {
    if (this.isMuted || !this.audioContext) return

    this.ensureAudioContext()

    const now = this.audioContext.currentTime
    const duration = 0.3

    // First note (lower)
    this.playNote(220, now, duration * 0.6, 0.5)

    // Second note (higher - octave up)
    this.playNote(440, now + duration * 0.3, duration * 0.8, 0.5)
  }

  /**
   * Helper to play a single note
   */
  playNote(frequency, startTime, duration, volumeMultiplier = 1) {
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.connect(gain)
    gain.connect(this.audioContext.destination)

    osc.frequency.setValueAtTime(frequency, startTime)
    osc.type = 'sine'

    // Fade in and out
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(this.volume * volumeMultiplier, startTime + duration * 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  /**
   * Toggle muted state
   */
  toggleMute() {
    this.isMuted = !this.isMuted
    localStorage.setItem('gameSoundMuted', this.isMuted)
    return this.isMuted
  }

  /**
   * Set volume (0 to 1)
   */
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level))
    localStorage.setItem('gameSoundVolume', this.volume)
  }

  /**
   * Get current mute status
   */
  isSoundMuted() {
    return this.isMuted
  }

  /**
   * Get current volume level
   */
  getVolume() {
    return this.volume
  }
}

// Create singleton instance
export const audioManager = new AudioManager()

export default audioManager
