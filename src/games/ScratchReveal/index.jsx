import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import GameBoard from './components/GameBoard'
import '../../styles/GlobalGameStyles.css'
import './styles/ScratchReveal.css'

function ScratchReveal({ onBack }) {
  // Store uploaded images as data URLs
  const [images, setImages] = useState([])
  // Track game state
  const [gameStarted, setGameStarted] = useState(false)

  // Handle image upload - convert files to data URLs
  const handleImagesUpload = (files) => {
    const newImages = []
    let loadedCount = 0

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.push({
          id: Math.random(),
          dataUrl: e.target.result,
          name: file.name
        })
        loadedCount++
        // Update state once all files are loaded
        if (loadedCount === files.length) {
          setImages([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Start the game
  const handleStartGame = () => {
    if (images.length > 0) {
      setGameStarted(true)
    }
  }

  // Reset game - go back to upload
  const handleResetGame = () => {
    setGameStarted(false)
    setImages([])
  }

  return (
    <div className="scratch-reveal-game">
      <div className="game-container">
        {!gameStarted ? (
          <ImageUpload
            onImagesUpload={handleImagesUpload}
            uploadedCount={images.length}
            onStartGame={handleStartGame}
          />
        ) : (
          <GameBoard
            images={images}
            onResetGame={handleResetGame}
          />
        )}
      </div>
    </div>
  )
}

export default ScratchReveal
