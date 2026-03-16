import '../styles/GameView.css'

function GameView({ game, onBack }) {
  if (!game) {
    return <div>Loading game...</div>
  }

  // Get the game component
  const GameComponent = game.component

  return (
    <div className="game-view">
      {/* Game header with back button */}
      <header className="game-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Launcher
        </button>
        <h1>{game.title}</h1>
        <div className="header-spacer"></div>
      </header>

      {/* Game content */}
      <main className="game-content">
        <GameComponent onBack={onBack} />
      </main>
    </div>
  )
}

export default GameView
