// Game configuration constants - centralized for easy troubleshooting

export const GAME_CONFIG = {
  // Canvas dimensions (logical size, always used for game logic)
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  // Chef dimensions and movement
  CHEF: {
    WIDTH: 80,
    HEIGHT: 100,
    SPEED: 6,
  },

  // Falling objects
  OBJECT: {
    SIZE: 40,
    FALL_SPEED: 2.5,
    SPAWN_RATE: 0.025, // Probability per frame
  },

  // Health and scoring
  HEALTH: {
    INITIAL: 100,
    BOMB_DAMAGE: 10,
  },

  // UI and animation
  ANIMATION: {
    CATCH_DURATION: 0.3,
    EMOTION_DURATION: 1.0,
    PARTICLE_LIFE: 30,
    PARTICLE_COUNT: 15,
  },

  // Colors
  COLORS: {
    TOMATO: '#FF6B6B',
    LETTUCE: '#4ECDC4',
    CHEESE: '#FFE66D',
    BOMB: '#FF4757',
    CLOCK: '#DDA0DD',
    SKY_TOP: '#87CEEB',
    SKY_BOTTOM: '#E0F6FF',
  },
};

export const OBJECT_TYPES = [
  { type: 'tomato', color: '#FF6B6B', points: 10, isIngredient: true, isPowerUp: false },
  { type: 'lettuce', color: '#4ECDC4', points: 10, isIngredient: true, isPowerUp: false },
  { type: 'cheese', color: '#FFE66D', points: 10, isIngredient: true, isPowerUp: false },
  { type: 'bomb', color: '#FF4757', points: -20, isIngredient: false, isPowerUp: false },
  { type: 'clock', color: '#DDA0DD', points: 0, isIngredient: false, isPowerUp: true },
];

export const RECIPES = (selectedTime) => [
  { name: 'Basic Salad', ingredients: { tomato: 3, lettuce: 3, cheese: 3 }, time: selectedTime },
  { name: 'Veggie Burger', ingredients: { tomato: 4, lettuce: 4, cheese: 4 }, time: selectedTime },
  { name: 'Deluxe Sandwich', ingredients: { tomato: 5, lettuce: 5, cheese: 5 }, time: selectedTime },
];
