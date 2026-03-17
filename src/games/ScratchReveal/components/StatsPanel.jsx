import { useState, useEffect } from 'react'
import { statsManager } from '../../../utils/statsManager'
import '../styles/StatsPanel.css'

function StatsPanel() {
  const [stats, setStats] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Load and update stats
  useEffect(() => {
    const loadStats = () => {
      const currentStats = statsManager.getStats()
      setStats(currentStats)
    }

    loadStats()

    // Listen for storage changes to sync across tabs
    const handleStorageChange = () => {
      loadStats()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Refresh stats when stats are updated
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(statsManager.getStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!stats) return null

  return (
    <div className={`stats-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle Button */}
      <button
        className="stats-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse stats' : 'Expand stats'}
      >
        📊
      </button>

      {/* Stats Content */}
      {isExpanded && (
        <div className="stats-content">
          <div className="stats-header">
            <h3>Your Stats</h3>
            <button
              className="stats-close"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>

          <div className="stats-grid">
            {/* Main Stats */}
            <div className="stat-item">
              <span className="stat-label">Total Games</span>
              <span className="stat-value">{stats.totalGames}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{stats.completedGames}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Completion Rate</span>
              <span className="stat-value">{stats.completionRate}%</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Avg. Time</span>
              <span className="stat-value">
                {stats.averageCompletionTime > 0
                  ? statsManager.formatTime(stats.averageCompletionTime)
                  : '-'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Fastest</span>
              <span className="stat-value">
                {stats.fastestCompletion
                  ? statsManager.formatTime(stats.fastestCompletion)
                  : '-'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Slowest</span>
              <span className="stat-value">
                {stats.slowestCompletion
                  ? statsManager.formatTime(stats.slowestCompletion)
                  : '-'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Total Time</span>
              <span className="stat-value">
                {statsManager.formatTime(stats.totalTimeSpent)}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Last Played</span>
              <span className="stat-value">
                {stats.lastPlayDate
                  ? new Date(stats.lastPlayDate).toLocaleDateString()
                  : '-'}
              </span>
            </div>
          </div>

          {/* Recent Games */}
          {stats.gameHistory.length > 0 && (
            <div className="recent-games">
              <h4>Recent Games</h4>
              <div className="games-list">
                {stats.gameHistory.slice(0, 5).map((game) => (
                  <div key={game.id} className="game-record">
                    <span className="game-info">
                      {game.imageCount} image{game.imageCount > 1 ? 's' : ''} •{' '}
                      {statsManager.formatTime(game.completionTimeMs)}
                    </span>
                    <span className="game-date">
                      {new Date(game.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button
            className="reset-stats-button"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to reset all statistics? This cannot be undone.'
                )
              ) {
                statsManager.resetStats()
                setStats(statsManager.getStats())
              }
            }}
          >
            Reset Stats
          </button>
        </div>
      )}
    </div>
  )
}

export default StatsPanel
