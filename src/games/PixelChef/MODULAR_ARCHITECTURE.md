# Pixel Chef Game - Modular Architecture Guide

## Overview
The Pixel Chef game has been refactored into modular chunks for easier troubleshooting and maintenance. Each module handles a specific aspect of the game.

## Module Structure

```
src/games/PixelChef/
├── index.jsx              # Main React component (orchestrator)
├── modules/
│   ├── gameConfig.js      # Constants and configuration
│   ├── gameState.js       # State management and updates
│   ├── gameDrawing.js     # All rendering/drawing functions
│   ├── gameInput.js       # Keyboard and touch input handling
│   └── gameLogic.js       # Game update logic and collisions
└── styles/
    └── PixelChef.css      # Styling (responsive design)
```

## Module Descriptions

### 1. **gameConfig.js** (Constants & Configuration)
**Purpose**: Centralized configuration for all game constants

**Key Exports**:
- `GAME_CONFIG`: Object containing all game constants
  - Canvas dimensions (800x600 logical size)
  - Chef dimensions and speed
  - Object (falling items) configuration
  - Health and scoring settings
  - Animation timings
  - Color definitions

- `OBJECT_TYPES`: Array of object types (tomato, lettuce, cheese, bomb, clock)
- `RECIPES`: Function to generate recipes based on selected time

**Troubleshooting**:
- To adjust difficulty, modify `CHEF.SPEED`, `OBJECT.FALL_SPEED`, or `OBJECT.SPAWN_RATE`
- To change colors, update the `COLORS` object
- To modify game dimensions, change `CANVAS_WIDTH` and `CANVAS_HEIGHT`

---

### 2. **gameState.js** (State Management)
**Purpose**: Initialize and manage game state without rendering

**Key Functions**:
- `initializeGameState(selectedTime)`: Creates initial game state
- `updateChefPosition(gameState, canvasWidth)`: Updates chef based on input
- `updateFallingObjects(gameState, canvasHeight, onCollision)`: Updates object positions and collision detection
- `updateParticles(particles)`: Updates particle positions with gravity
- `updateEmotionDecay(chef)`: Handles emotion state decay
- `setChefEmotion(chef, emotion)`: Sets chef's emotional state
- `addScore()`, `damageChef()`, `addTime()`: Helper functions for state changes

**Troubleshooting**:
- Debug object positions and boundaries in `updateFallingObjects()`
- Check collision detection logic for accuracy
- Modify particle behavior in `updateParticles()`

---

### 3. **gameDrawing.js** (Rendering Functions)
**Purpose**: Handle all canvas drawing operations

**Key Functions**:
- `drawBackground()`: Draws sky gradient and clouds
- `drawChef()`: Draws the chef character
- `drawChefEmotion()`: Draws facial expressions based on emotion
- `drawFallingObject()`: Draws individual falling objects (tomato, lettuce, cheese, bomb, clock)
- `drawFallingObjects()`: Batch rendering of all falling objects
- `drawParticles()`: Renders particle effects
- `drawUI()`: Renders score, time, health bar
- `drawGameOver()`: Renders game over screen
- `drawFrame()`: Main rendering function (calls all above in order)

**Troubleshooting**:
- To change object appearance, modify drawing code in `drawFallingObject()`
- To adjust chef appearance, modify `drawChef()` or `drawChefEmotion()`
- To change UI layout, modify `drawUI()`
- All coordinates use logical canvas size (800x600), not display size

---

### 4. **gameInput.js** (Input Handling) ⭐ FIXED
**Purpose**: Handle keyboard and touch input with proper responsiveness

**Key Functions**:
- `setupKeyboardInput(gameState)`: Sets up arrow key listeners
- `setupTouchInput(canvas, gameState, canvasLogicalWidth)`: Sets up touch input with responsive scaling
- `cleanupInput()`: Removes event listeners

**Fixes Applied**:
1. **Responsive Touch Scaling**: Properly calculates touch position relative to canvas display size and scales to logical coordinates
2. **Canvas Position Tracking**: Gets `canvas.getBoundingClientRect()` to handle canvas position on screen
3. **Scale Factor Calculation**: `scaleFactor = canvasLogicalWidth / displayWidth` ensures touch coordinates match game logic
4. **Passive Event Listeners**: Uses `{ passive: false }` to enable `preventDefault()` for smooth touch movement

**Troubleshooting**:
- If touch input isn't working, check browser console for touch event logs
- Verify `canvasLogicalWidth` is correctly passed to `setupTouchInput()`
- Test on different screen sizes to ensure scale factor is correct

---

### 5. **gameLogic.js** (Game Update Logic)
**Purpose**: Game mechanics and update logic

**Key Functions**:
- `spawnFallingObject(gameState, canvasWidth)`: Creates new falling objects
- `createParticles()`: Generates particle effects on object catch
- `handleObjectCollision()`: Processes collision results (score, health, time bonuses)
- `updateGameLogic()`: Main update function that coordinates all game logic
  - Updates chef position
  - Updates falling objects + collision detection
  - Updates particles
  - Spawns new objects
  - Updates time countdown
  - Checks game over conditions

**Troubleshooting**:
- To debug collisions, add console logs in `handleObjectCollision()`
- Adjust spawn rate by modifying `GAME_CONFIG.OBJECT.SPAWN_RATE` in gameConfig.js
- Check game over conditions: time <= 0 or health <= 0

---

### 6. **index.jsx** (Main Component)
**Purpose**: React component orchestration

**Key Features**:
- Imports all game modules
- Manages page states (timeSelection, instructions, game, gameOver)
- Handles canvas resizing for responsiveness
- Sets up game loop using `requestAnimationFrame`
- Manages input cleanup

**Responsive Sizing**:
```javascript
// Canvas logical size always 800x600
const canvas.width = GAME_CONFIG.CANVAS_WIDTH
const canvas.height = GAME_CONFIG.CANVAS_HEIGHT

// Display size responsive to viewport
style={{
  width: `${canvasSize.width}px`,
  height: `${canvasSize.height}px`
}}
```

---

## Game Flow Diagram

```
User Input (Keyboard/Touch)
    ↓
setGameState.keys / setGameState.chef.x
    ↓
updateGameLogic() [Each frame]
    ├→ updateChefPosition()
    ├→ updateFallingObjects() + collisions
    ├→ updateParticles()
    ├→ spawnFallingObject()
    └→ Check game over
    ↓
drawFrame() [Render]
    ├→ drawBackground()
    ├→ drawChef()
    ├→ drawParticles()
    ├→ drawFallingObjects()
    └→ drawUI()
```

## Responsive Design Implementation

**Canvas Scaling Strategy**:
1. **Logical Canvas**: Always 800x600 (all game math uses this)
2. **Display Canvas**: Scales based on window size while maintaining aspect ratio
3. **Touch Scaling**: Touch input converted from display coordinates to logical coordinates using scale factor

**Window Sizes Supported**:
- ✅ Laptops (1024px and up)
- ✅ Tablets (768px - 1024px)
- ✅ Mobile (320px - 768px)
- ✅ iPad (1024px and up)

**CSS Breakpoints** (in PixelChef.css):
- `@media (max-width: 768px)`: Tablet and below
- `@media (max-width: 480px)`: Mobile handsets

---

## Troubleshooting Guide

| Issue | Location | Solution |
|-------|----------|----------|
| Game not responsive | gameConfig.js, index.jsx | Check `canvasSize` calculation in useEffect |
| Touch not working | gameInput.js | Verify `setupTouchInput()` is called with correct params |
| Chef moving wrong distance | gameInput.js | Adjust `diff * 0.5` multiplier or check scale factor |
| Objects falling too fast/slow | gameConfig.js | Adjust `OBJECT.FALL_SPEED` |
| Collision detection wrong | gameState.js | Debug `updateFallingObjects()` collision logic |
| Particles not showing | gameDrawing.js | Check `drawParticles()` rendering logic |
| Chef appearance wrong | gameDrawing.js | Modify `drawChef()` function |
| Score/Health not updating | gameLogic.js | Debug `handleObjectCollision()` |

---

## How to Debug

### 1. Add Console Logs
```javascript
// In gameInput.js - Debug touch input
const handleTouchMove = (e) => {
  console.log('Touch position:', touchX, currentX);
  console.log('Chef new position:', gameState.chef.x);
  // ... rest of code
}
```

### 2. Check Canvas Size
```javascript
// In index.jsx
console.log('Canvas display size:', canvasSize);
console.log('Canvas logical size:', GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
console.log('Scale factor:', GAME_CONFIG.CANVAS_WIDTH / canvasSize.width);
```

### 3. Test Collision Detection
```javascript
// In gameState.js - updateFallingObjects
const isColliding = obj.x < chef.x + CHEF_WIDTH && ... (rest of condition)
if (isColliding) {
  console.log('Collision detected!', obj.type, 'at', obj.x, obj.y);
}
```

---

## Performance Tips

1. **Particle Count**: Reduce `ANIMATION.PARTICLE_COUNT` if experiencing lag
2. **Spawn Rate**: Lower `OBJECT.SPAWN_RATE` for easier gameplay
3. **Canvas Size**: Game maintains 60 FPS with proper scaling

---

## Code Architecture Benefits

✅ **Modularity**: Each module has single responsibility
✅ **Reusability**: Functions can be tested independently
✅ **Maintainability**: Changes isolated to specific modules
✅ **Debugging**: Problems easier to locate in specific modules
✅ **Responsiveness**: Touch and keyboard handling separated for clarity
✅ **Scalability**: Easy to add new features (new object types, power-ups, etc.)

---

## Next Steps for Enhancement

1. Add sound effects control in gameConfig.js
2. Add difficulty levels with different configs
3. Add combo system using gameLogic.js
4. Add leaderboard using existing statsManager
5. Add new object types in gameConfig.js and gameDrawing.js
