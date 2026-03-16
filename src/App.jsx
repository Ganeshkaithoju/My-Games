import { useState } from 'react'
import GameLauncher from './pages/GameLauncher'
import GameView from './pages/GameView'
import { getGameById } from './config/gameRegistry'

function App() {
  // State for tracking which game is currently running
  const [currentGameId, setCurrentGameId] = useState(null)
  const [isGameRunning, setIsGameRunning] = useState(false)

  // Start a game
  const handleStartGame = (gameId) => {
    setCurrentGameId(gameId)
    setIsGameRunning(true)
  }

  // Return to launcher
  const handleBackToLauncher = () => {
    setIsGameRunning(false)
    setCurrentGameId(null)
  }

  // Get the current game component
  const currentGame = currentGameId ? getGameById(currentGameId) : null

  return (
    <div className="app">
      {!isGameRunning ? (
        <GameLauncher onGameSelect={handleStartGame} />
      ) : (
        <GameView
          game={currentGame}
          onBack={handleBackToLauncher}
        />
      )}
    </div>
  )
}

export default App
