// Game state management - Initialize and manage game state

import { GAME_CONFIG } from './gameConfig.js';

export function initializeGameState(selectedTime) {
  return {
    chef: {
      x: GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.CHEF.WIDTH / 2,
      y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.CHEF.HEIGHT - 20,
      catchAnimation: 0,
      emotion: 'neutral',
      emotionTimer: 0,
    },
    fallingObjects: [],
    particles: [],
    score: 0,
    health: GAME_CONFIG.HEALTH.INITIAL,
    recipeProgress: { tomato: 0, lettuce: 0, cheese: 0 },
    timeLeft: selectedTime,
    gameRunning: true,
    gameOver: false,
    keys: { left: false, right: false },
    touch: { isDragging: false, startX: 0, canvasLeft: 0 }, // canvasLeft tracks canvas position
  };
}

export function updateChefPosition(gameState, canvasWidth) {
  const { keys, chef } = gameState;
  const maxX = canvasWidth - GAME_CONFIG.CHEF.WIDTH;

  if (keys.left && chef.x > 0) {
    chef.x -= GAME_CONFIG.CHEF.SPEED;
  }
  if (keys.right && chef.x < maxX) {
    chef.x += GAME_CONFIG.CHEF.SPEED;
  }

  // Clamp position to bounds
  chef.x = Math.max(0, Math.min(maxX, chef.x));
}

export function updateFallingObjects(gameState, canvasHeight, onCollision) {
  const { fallingObjects, chef } = gameState;

  // Update positions and filter out fallen objects
  gameState.fallingObjects = fallingObjects
    .map((obj) => {
      obj.y += GAME_CONFIG.OBJECT.FALL_SPEED;
      return obj;
    })
    .filter((obj) => obj.y < canvasHeight);

  // Check collisions
  gameState.fallingObjects = gameState.fallingObjects.filter((obj) => {
    const isColliding =
      obj.x < chef.x + GAME_CONFIG.CHEF.WIDTH &&
      obj.x + GAME_CONFIG.OBJECT.SIZE > chef.x &&
      obj.y < chef.y + GAME_CONFIG.CHEF.HEIGHT &&
      obj.y + GAME_CONFIG.OBJECT.SIZE > chef.y;

    if (isColliding) {
      onCollision(obj, gameState);
      return false; // Remove collided object
    }
    return true;
  });
}

export function updateParticles(particles) {
  return particles
    .map((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity
      p.life--;
      return p;
    })
    .filter((p) => p.life > 0);
}

export function updateEmotionDecay(chef, deltaTime = 0.016) {
  if (chef.emotionTimer > 0) {
    chef.emotionTimer -= deltaTime;
    if (chef.emotionTimer <= 0) {
      chef.emotion = 'neutral';
      chef.emotionTimer = 0;
    }
  }
}

export function updateCatchAnimation(chef) {
  if (chef.catchAnimation > 0) {
    chef.catchAnimation -= 0.1;
  }
}

export function addTime(gameState, seconds) {
  gameState.timeLeft += seconds;
}

export function damageChef(gameState, amount) {
  gameState.health -= amount;
}

export function addScore(gameState, points) {
  gameState.score += points;
}

export function setChefEmotion(chef, emotion) {
  chef.emotion = emotion;
  chef.emotionTimer = GAME_CONFIG.ANIMATION.EMOTION_DURATION;
}
