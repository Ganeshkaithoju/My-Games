// Input handling for keyboard and touch - Fixes responsive input handling

export function setupKeyboardInput(gameState) {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') gameState.keys.left = true;
    if (e.key === 'ArrowRight') gameState.keys.right = true;
  };

  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft') gameState.keys.left = false;
    if (e.key === 'ArrowRight') gameState.keys.right = false;
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}

export function setupTouchInput(canvas, gameState, canvasLogicalWidth) {
  const handleTouchStart = (e) => {
    if (!canvas) return;

    // Get canvas position relative to viewport
    const rect = canvas.getBoundingClientRect();
    gameState.touch.canvasLeft = rect.left;
    gameState.touch.canvasWidth = rect.width;

    // Get touch position in canvas logical coordinates
    const touchX = e.touches[0].clientX - rect.left;
    const scaleFactor = canvasLogicalWidth / rect.width; // Logical size / display size
    gameState.touch.startX = touchX * scaleFactor;
    gameState.touch.isDragging = true;
  };

  const handleTouchMove = (e) => {
    if (!gameState.touch.isDragging || !canvas) return;

    e.preventDefault(); // Prevent scrolling while moving chef

    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const scaleFactor = canvasLogicalWidth / rect.width;
    const currentX = touchX * scaleFactor;
    const diff = currentX - gameState.touch.startX;

    gameState.chef.x += diff * 0.5;
    gameState.chef.x = Math.max(0, Math.min(canvasLogicalWidth - 80, gameState.chef.x)); // 80 is CHEF_WIDTH
    gameState.touch.startX = currentX;
  };

  const handleTouchEnd = () => {
    gameState.touch.isDragging = false;
  };

  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd);

  return () => {
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
  };
}

export function cleanupInput(keyboardCleanup, touchCleanup) {
  keyboardCleanup();
  touchCleanup();
}
