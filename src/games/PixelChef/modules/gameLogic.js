// Game update logic - Handles spawning, collisions, and game rules

import { GAME_CONFIG, OBJECT_TYPES } from './gameConfig.js';
import {
  updateChefPosition,
  updateFallingObjects,
  updateParticles,
  updateEmotionDecay,
  updateCatchAnimation,
  addTime,
  damageChef,
  addScore,
  setChefEmotion,
} from './gameState.js';

export function spawnFallingObject(gameState, canvasWidth) {
  const randomType = OBJECT_TYPES[Math.floor(Math.random() * OBJECT_TYPES.length)];
  gameState.fallingObjects.push({
    x: Math.random() * (canvasWidth - GAME_CONFIG.OBJECT.SIZE),
    y: -GAME_CONFIG.OBJECT.SIZE,
    type: randomType.type,
    color: randomType.color,
    points: randomType.points,
    isIngredient: randomType.isIngredient,
    isPowerUp: randomType.isPowerUp,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.1,
  });
}

export function createParticles(gameState, x, y, color) {
  for (let i = 0; i < GAME_CONFIG.ANIMATION.PARTICLE_COUNT; i++) {
    const angle = (Math.random() - 0.5) * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    gameState.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: Math.random() * 4 + 2,
      life: GAME_CONFIG.ANIMATION.PARTICLE_LIFE,
      maxLife: GAME_CONFIG.ANIMATION.PARTICLE_LIFE,
    });
  }
}

export function handleObjectCollision(obj, gameState, audioManager) {
  audioManager.playScratchSound();
  gameState.chef.catchAnimation = GAME_CONFIG.ANIMATION.CATCH_DURATION;
  createParticles(gameState, obj.x + GAME_CONFIG.OBJECT.SIZE / 2, obj.y + GAME_CONFIG.OBJECT.SIZE / 2, obj.color);

  // Set emotion based on what was caught
  if (obj.isPowerUp) {
    if (obj.type === 'clock') {
      addTime(gameState, 5);
      setChefEmotion(gameState.chef, 'happy');
    }
  } else if (obj.isIngredient) {
    addScore(gameState, obj.points);
    gameState.recipeProgress[obj.type]++;
    setChefEmotion(gameState.chef, 'happy');
  } else {
    // Bomb hit
    addScore(gameState, obj.points);
    damageChef(gameState, GAME_CONFIG.HEALTH.BOMB_DAMAGE);
    setChefEmotion(gameState.chef, 'sad');
  }
}

export function updateGameLogic(gameState, canvasWidth, canvasHeight, audioManager) {
  // Update positions
  updateChefPosition(gameState, canvasWidth);

  // Update falling objects and check collisions
  updateFallingObjects(gameState, canvasHeight, (obj) => {
    handleObjectCollision(obj, gameState, audioManager);
  });

  // Update particles
  gameState.particles = updateParticles(gameState.particles);

  // Spawn objects randomly
  if (Math.random() < GAME_CONFIG.OBJECT.SPAWN_RATE) {
    spawnFallingObject(gameState, canvasWidth);
  }

  // Update time
  gameState.timeLeft -= 0.016;

  // Check game over conditions
  if (gameState.timeLeft <= 0) {
    gameState.gameRunning = false;
    gameState.gameOver = true;
    audioManager.playCompletionSound();
  }

  if (gameState.health <= 0) {
    gameState.gameRunning = false;
    gameState.gameOver = true;
  }

  // Update animations
  updateEmotionDecay(gameState.chef);
  updateCatchAnimation(gameState.chef);
}
