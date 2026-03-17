/**
 * Stats Manager - Handles game statistics and persistence with localStorage
 */

class StatsManager {
  constructor() {
    this.storageKey = 'scratchRevealStats'
    this.stats = this.loadStats()
  }

  /**
   * Load stats from localStorage
   */
  loadStats() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      return saved
        ? JSON.parse(saved)
        : {
            totalGames: 0,
            completedGames: 0,
            totalTimeSpent: 0, // in milliseconds
            fastestCompletion: null, // milliseconds
            slowestCompletion: null, // milliseconds
            gameHistory: [], // Array of game records
            lastPlayDate: null
          }
    } catch (error) {
      console.error('Error loading stats:', error)
      return this.getDefaultStats()
    }
  }

  /**
   * Get default stats structure
   */
  getDefaultStats() {
    return {
      totalGames: 0,
      completedGames: 0,
      totalTimeSpent: 0,
      fastestCompletion: null,
      slowestCompletion: null,
      gameHistory: [],
      lastPlayDate: null
    }
  }

  /**
   * Save stats to localStorage
   */
  saveStats() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stats))
    } catch (error) {
      console.error('Error saving stats:', error)
    }
  }

  /**
   * Record a completed game
   */
  recordGameCompletion(imageCount, completionTimeMs) {
    const now = new Date().toISOString()

    this.stats.totalGames++
    this.stats.completedGames++
    this.stats.totalTimeSpent += completionTimeMs
    this.stats.lastPlayDate = now

    // Update fastest/slowest times
    if (!this.stats.fastestCompletion || completionTimeMs < this.stats.fastestCompletion) {
      this.stats.fastestCompletion = completionTimeMs
    }
    if (!this.stats.slowestCompletion || completionTimeMs > this.stats.slowestCompletion) {
      this.stats.slowestCompletion = completionTimeMs
    }

    // Add to history (keep last 50 games)
    this.stats.gameHistory.unshift({
      id: Date.now(),
      date: now,
      imageCount,
      completionTimeMs,
      completedAt: now
    })

    if (this.stats.gameHistory.length > 50) {
      this.stats.gameHistory = this.stats.gameHistory.slice(0, 50)
    }

    this.saveStats()
  }

  /**
   * Record a game start (abandoned game)
   */
  recordGameStart() {
    if (!this.stats.lastPlayDate) {
      this.stats.totalGames++
      this.stats.lastPlayDate = new Date().toISOString()
      this.saveStats()
    }
  }

  /**
   * Get formatted time string (MM:SS or HH:MM:SS)
   */
  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  /**
   * Get stats summary for display
   */
  getStats() {
    return {
      ...this.stats,
      averageCompletionTime: this.stats.completedGames
        ? Math.round(this.stats.totalTimeSpent / this.stats.completedGames)
        : 0,
      completionRate: this.stats.totalGames > 0
        ? Math.round((this.stats.completedGames / this.stats.totalGames) * 100)
        : 0
    }
  }

  /**
   * Get recent games (last N games)
   */
  getRecentGames(count = 10) {
    return this.stats.gameHistory.slice(0, count)
  }

  /**
   * Reset all stats
   */
  resetStats() {
    this.stats = this.getDefaultStats()
    this.saveStats()
  }

  /**
   * Delete specific game from history
   */
  deleteGameRecord(gameId) {
    this.stats.gameHistory = this.stats.gameHistory.filter((g) => g.id !== gameId)
    this.saveStats()
  }
}

// Create singleton instance
export const statsManager = new StatsManager()

export default statsManager
