import { useState, useEffect } from 'react'
import { audioManager } from '../../../utils/audioManager'
import '../styles/SoundControls.css'

function SoundControls() {
  const [isMuted, setIsMuted] = useState(audioManager.isSoundMuted())
  const [volume, setVolume] = useState(audioManager.getVolume())
  const [isExpanded, setIsExpanded] = useState(false)

  // Update local state when audio manager changes (from other tabs/storage)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsMuted(audioManager.isSoundMuted())
      setVolume(audioManager.getVolume())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleToggleMute = () => {
    const newMutedState = audioManager.toggleMute()
    setIsMuted(newMutedState)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    audioManager.setVolume(newVolume)
    setVolume(newVolume)
  }

  const getSoundIcon = () => {
    if (isMuted) return '🔇'
    if (volume < 0.33) return '🔈'
    if (volume < 0.66) return '🔉'
    return '🔊'
  }

  return (
    <div className={`sound-controls ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Main Sound Button */}
      <button
        className="sound-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isMuted ? 'Sound is muted' : 'Sound is enabled'}
      >
        {getSoundIcon()}
      </button>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="sound-controls-panel">
          {/* Mute Toggle */}
          <button
            className={`mute-button ${isMuted ? 'muted' : 'enabled'}`}
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>

          {/* Volume Slider */}
          <div className="volume-container">
            <label htmlFor="volume-slider" className="volume-label">
              Volume
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              disabled={isMuted}
            />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>

          {/* Info Text */}
          <p className="sound-info">
            {isMuted
              ? 'Sound effects are disabled'
              : `Sounds: scratching, completion (${Math.round(volume * 100)}%)`}
          </p>

          {/* Close Button */}
          <button
            className="close-button"
            onClick={() => setIsExpanded(false)}
            title="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default SoundControls
