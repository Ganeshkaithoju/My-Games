import ScratchReveal from '../games/ScratchReveal'
import MemoryMatch from '../games/MemoryMatch'

/**
 * Game Registry: Centralized configuration for all available games
 * Add new games here to make them available in the launcher
 */
export const GAMES = {
  SCRATCH_REVEAL: {
    id: 'scratch-reveal',
    title: 'Scratch-to-Reveal',
    description: 'Upload images and scratch them to reveal the hidden content',
    icon: '🎮',
    emoji: '✨',
    component: ScratchReveal,
    active: true
  },
  MEMORY_MATCH: {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Find matching pairs and test your memory skills',
    icon: '🧠',
    emoji: '🎯',
    component: MemoryMatch,
    active: false
  }
  // Add more games here:
  // WORD_GAME: { ... },
  // TRIVIA_QUIZ: { ... },
  // etc.
}

/**
 * Get all active games for the launcher
 */
export const getActiveGames = () => {
  return Object.values(GAMES).filter(game => game.active)
}

/**
 * Get a specific game by ID
 */
export const getGameById = (gameId) => {
  return Object.values(GAMES).find(game => game.id === gameId)
}

/**
 * Get total number of games
 */
export const getTotalGames = () => {
  return Object.values(GAMES).length
}

export default GAMES
