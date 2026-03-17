import { useState, useEffect, useRef } from 'react'
import ScratchCanvas from './ScratchCanvas'
import { statsManager } from '../../../utils/statsManager'
import '../styles/GameBoard.css'

function GameBoard({ images, onResetGame }) {
  // Track completed scratches
  const [completedCount, setCompletedCount] = useState(0)
  const gameStartTimeRef = useRef(Date.now())

  // Track game start in stats
  useEffect(() => {
    statsManager.recordGameStart()
  }, [])

  // Handle when a canvas is fully scratched
  const handleScratchComplete = () => {
    setCompletedCount((prev) => {
      const newCount = prev + 1

      // Check if this is the final image - record stats if so
      if (newCount === images.length) {
        const completionTimeMs = Date.now() - gameStartTimeRef.current
        statsManager.recordGameCompletion(images.length, completionTimeMs)
      }

      return newCount
    })
  }

  // Reset all scratches - start new game
  const handlePlayAgain = () => {
    setCompletedCount(0)
    onResetGame()
  }

  // Check if all scratches are complete
  const allComplete = completedCount === images.length && images.length > 0

  return (
    <div className="game-board">
      {/* Game Title */}
      <div className="game-header">
        <h2>Scratch the cards to reveal the images!</h2>
        <p className="progress">
          Revealed: {completedCount} / {images.length}
        </p>
      </div>

      {/* Canvas Grid */}
      <div className="canvas-grid">
        {images.map((image) => (
          <div key={image.id} className="canvas-container">
            <ScratchCanvas
              imageDataUrl={image.dataUrl}
              imageName={image.name}
              onScratchComplete={handleScratchComplete}
            />
          </div>
        ))}
      </div>

      {/* Completion Message and Reset Button */}
      {allComplete && (
        <div className="completion-section">
          <div className="completion-message">
            <h3>🎉 You revealed all the images!</h3>
            <p>Great job! Want to play again?</p>
          </div>
          <button className="play-again-button" onClick={handlePlayAgain}>
            🔄 Play Again
          </button>
        </div>
      )}

      {/* Reset Button (always visible) */}
      <div className="reset-section">
        <button className="reset-button" onClick={onResetGame}>
          ← Change Images
        </button>
      </div>
    </div>
  )
}

export default GameBoard
