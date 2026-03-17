// Game rendering/drawing functions - Handles all canvas drawing

import { GAME_CONFIG, OBJECT_TYPES } from './gameConfig.js';

export function drawBackground(ctx, canvasWidth, canvasHeight, timeLeft) {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, GAME_CONFIG.COLORS.SKY_TOP);
  gradient.addColorStop(1, GAME_CONFIG.COLORS.SKY_BOTTOM);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  const cloudY = 50 + Math.sin(timeLeft) * 10;
  ctx.beginPath();
  ctx.arc(100, cloudY, 30, 0, Math.PI * 2);
  ctx.arc(140, cloudY, 35, 0, Math.PI * 2);
  ctx.arc(180, cloudY, 30, 0, Math.PI * 2);
  ctx.fill();
}

export function drawChef(ctx, gameState, canvasHeight) {
  const { chef } = gameState;
  const { CHEF } = GAME_CONFIG;

  ctx.save();
  ctx.translate(chef.x + CHEF.WIDTH / 2, chef.y + CHEF.HEIGHT / 2);

  // Chef hat - improved design
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-CHEF.WIDTH / 2 - 8, -CHEF.HEIGHT / 2 - 25, CHEF.WIDTH + 16, 25);
  ctx.fillStyle = '#FF6B6B';
  ctx.fillRect(-CHEF.WIDTH / 2 - 8, -CHEF.HEIGHT / 2 - 28, CHEF.WIDTH + 16, 3);
  // Hat shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(-CHEF.WIDTH / 2 + 10, -CHEF.HEIGHT / 2 - 20, 20, 8);

  // Head
  ctx.fillStyle = '#F4A460';
  ctx.beginPath();
  ctx.arc(0, -CHEF.HEIGHT / 4, CHEF.WIDTH / 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Chef body - shoulders and torso
  ctx.fillStyle = '#FF9800';
  ctx.fillRect(-CHEF.WIDTH / 2, -CHEF.HEIGHT / 4 + 5, CHEF.WIDTH, CHEF.HEIGHT / 2 - 10);

  // Neck connector
  ctx.fillStyle = '#F4A460';
  ctx.fillRect(-8, -CHEF.HEIGHT / 4, 16, 8);

  // Buttons on apron
  ctx.fillStyle = '#CD5C5C';
  ctx.beginPath();
  ctx.arc(-15, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(15, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Apron with gradient effect
  ctx.fillStyle = 'rgba(255, 107, 107, 0.95)';
  ctx.fillRect(-CHEF.WIDTH / 3, 0, (CHEF.WIDTH / 3) * 2, CHEF.HEIGHT / 2.5);

  // Emotion expressions
  drawChefEmotion(ctx, chef, CHEF);

  // Arms - animated on catch
  const armRotation = chef.catchAnimation > 0 ? Math.sin(chef.catchAnimation * Math.PI) * 0.5 : 0;

  ctx.fillStyle = '#F4A460';
  ctx.lineWidth = 0;
  ctx.save();
  ctx.translate(-CHEF.WIDTH / 2.5, -CHEF.HEIGHT / 8);
  ctx.rotate(armRotation);
  ctx.fillRect(-6, -6, 12, 45);
  ctx.beginPath();
  ctx.arc(0, 45, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(CHEF.WIDTH / 2.5, -CHEF.HEIGHT / 8);
  ctx.rotate(-armRotation);
  ctx.fillRect(-6, -6, 12, 45);
  ctx.beginPath();
  ctx.arc(0, 45, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

export function drawChefEmotion(ctx, chef, CHEF) {
  const emotion = chef.emotion;

  // Eyebrows - express emotion
  ctx.fillStyle = '#8B7355';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  if (emotion === 'happy') {
    // Happy eyebrows - raised, curved
    ctx.beginPath();
    ctx.arc(-CHEF.WIDTH / 6, -CHEF.HEIGHT / 4 - 15, 8, 0, Math.PI, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(CHEF.WIDTH / 6, -CHEF.HEIGHT / 4 - 15, 8, 0, Math.PI, true);
    ctx.stroke();
  } else if (emotion === 'sad') {
    // Sad eyebrows - lowered, angled down toward center
    ctx.beginPath();
    ctx.moveTo(-CHEF.WIDTH / 6 - 8, -CHEF.HEIGHT / 4 - 10);
    ctx.lineTo(-CHEF.WIDTH / 6 + 8, -CHEF.HEIGHT / 4 - 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CHEF.WIDTH / 6 + 8, -CHEF.HEIGHT / 4 - 10);
    ctx.lineTo(CHEF.WIDTH / 6 - 8, -CHEF.HEIGHT / 4 - 14);
    ctx.stroke();
  } else {
    // Neutral eyebrows - straight
    ctx.beginPath();
    ctx.moveTo(-CHEF.WIDTH / 6 - 8, -CHEF.HEIGHT / 4 - 12);
    ctx.lineTo(-CHEF.WIDTH / 6 + 8, -CHEF.HEIGHT / 4 - 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CHEF.WIDTH / 6 - 8, -CHEF.HEIGHT / 4 - 12);
    ctx.lineTo(CHEF.WIDTH / 6 + 8, -CHEF.HEIGHT / 4 - 12);
    ctx.stroke();
  }

  // Eyes - white background
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(-CHEF.WIDTH / 6, -CHEF.HEIGHT / 4, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(CHEF.WIDTH / 6, -CHEF.HEIGHT / 4, 6, 0, Math.PI * 2);
  ctx.fill();

  // Pupils - express emotion through pupil direction/size
  ctx.fillStyle = '#000';
  if (emotion === 'happy') {
    // Happy eyes - normal pupils, smiling
    ctx.beginPath();
    ctx.arc(-CHEF.WIDTH / 6, -CHEF.HEIGHT / 4 - 1, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CHEF.WIDTH / 6, -CHEF.HEIGHT / 4 - 1, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (emotion === 'sad') {
    // Sad eyes - pupils down, eyes looking down
    ctx.beginPath();
    ctx.arc(-CHEF.WIDTH / 6, -CHEF.HEIGHT / 4 + 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CHEF.WIDTH / 6, -CHEF.HEIGHT / 4 + 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Neutral eyes
    ctx.beginPath();
    ctx.arc(-CHEF.WIDTH / 6, -CHEF.HEIGHT / 4, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CHEF.WIDTH / 6, -CHEF.HEIGHT / 4, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eye shine for life
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(-CHEF.WIDTH / 6 + 2, -CHEF.HEIGHT / 4 - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(CHEF.WIDTH / 6 + 2, -CHEF.HEIGHT / 4 - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Mouth - primary emotion indicator
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  if (emotion === 'happy') {
    // Big happy smile
    ctx.beginPath();
    ctx.arc(0, -CHEF.HEIGHT / 6 + 3, 12, 0, Math.PI, false);
    ctx.stroke();
    // Smile crease/nose
    ctx.beginPath();
    ctx.moveTo(0, -CHEF.HEIGHT / 6 - 8);
    ctx.lineTo(0, -CHEF.HEIGHT / 6 - 2);
    ctx.stroke();
  } else if (emotion === 'sad') {
    // Sad frown
    ctx.beginPath();
    ctx.arc(0, -CHEF.HEIGHT / 6 - 2, 12, Math.PI, 0, false);
    ctx.stroke();
  } else {
    // Neutral smile
    ctx.beginPath();
    ctx.arc(0, -CHEF.HEIGHT / 6, 8, 0, Math.PI, false);
    ctx.stroke();
  }
}

export function drawFallingObject(ctx, obj) {
  const { OBJECT } = GAME_CONFIG;

  ctx.save();
  ctx.translate(obj.x + OBJECT.SIZE / 2, obj.y + OBJECT.SIZE / 2);
  ctx.rotate(obj.rotation);

  ctx.fillStyle = obj.color;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  if (obj.type === 'tomato') {
    ctx.beginPath();
    ctx.arc(0, -5, OBJECT.SIZE / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(0, -OBJECT.SIZE / 2, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (obj.type === 'lettuce') {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = OBJECT.SIZE / 2.2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  } else if (obj.type === 'cheese') {
    ctx.fillRect(-OBJECT.SIZE / 2, -OBJECT.SIZE / 2, OBJECT.SIZE, OBJECT.SIZE);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-8, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, 5, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (obj.type === 'bomb') {
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(0, 0, OBJECT.SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF4747';
    ctx.fillRect(-3, -OBJECT.SIZE / 2 - 5, 6, 8);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-5, -5, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (obj.type === 'clock') {
    ctx.fillStyle = '#DDA0DD';
    ctx.beginPath();
    ctx.arc(0, 0, OBJECT.SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -OBJECT.SIZE / 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(OBJECT.SIZE / 4, 0);
    ctx.stroke();
  }

  ctx.shadowColor = 'transparent';
  ctx.restore();
  obj.rotation += obj.rotationSpeed;
}

export function drawFallingObjects(ctx, gameState) {
  gameState.fallingObjects.forEach((obj) => {
    drawFallingObject(ctx, obj);
  });
}

export function drawParticles(ctx, gameState) {
  gameState.particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function drawUI(ctx, gameState, canvasWidth, canvasHeight, recipeName) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvasWidth, 80);
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`Score: ${gameState.score}`, 20, 35);
  ctx.fillText(`Time: ${Math.ceil(gameState.timeLeft)}s`, canvasWidth / 2 - 60, 35);
  ctx.font = 'bold 14px Arial';
  ctx.fillText(`Recipe: ${recipeName}`, 20, 60);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(canvasWidth - 220, 45, 200, 12);
  ctx.fillStyle = gameState.health > 50 ? '#4CAF50' : '#F44336';
  ctx.fillRect(canvasWidth - 220, 45, (gameState.health / 100) * 200, 12);
}

export function drawGameOver(ctx, gameState, canvasWidth, canvasHeight) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvasWidth / 2, canvasHeight / 2 - 50);
  ctx.font = '30px Arial';
  ctx.fillText(`Final Score: ${gameState.score}`, canvasWidth / 2, canvasHeight / 2 + 20);
  ctx.textAlign = 'left';
}

export function drawFrame(ctx, gameState, canvasWidth, canvasHeight, recipeName) {
  drawBackground(ctx, canvasWidth, canvasHeight, gameState.timeLeft);
  drawChef(ctx, gameState, canvasHeight);
  drawParticles(ctx, gameState);
  drawFallingObjects(ctx, gameState);
  drawUI(ctx, gameState, canvasWidth, canvasHeight, recipeName);

  if (gameState.gameOver) {
    drawGameOver(ctx, gameState, canvasWidth, canvasHeight);
  }
}
