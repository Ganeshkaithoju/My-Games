import { getActiveGames } from '../config/gameRegistry'
import '../styles/GameLauncher.css'

function GameLauncher({ onGameSelect }) {
  const games = getActiveGames()

  return (
    <div className="launcher">
      <header className="launcher-header">
        <h1>🎮 My Games</h1>
        <p>Select a game to play</p>
      </header>

      <main className="launcher-main">
        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => onGameSelect(game.id)}
            >
              <div className="game-card-icon">
                {game.emoji}
              </div>
              <h2 className="game-card-title">{game.title}</h2>
              <p className="game-card-description">{game.description}</p>
              <button className="game-card-button">
                Play {game.icon}
              </button>
            </div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="no-games-message">
            <p>No games available yet. Check back soon!</p>
          </div>
        )}
      </main>

      <footer className="launcher-footer">
        <p>© 2024 My Games Platform | More games coming soon!</p>
      </footer>
    </div>
  )
}

export default GameLauncher
