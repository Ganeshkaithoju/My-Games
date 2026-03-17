# Pixel Chef Game - Module Dependencies & Flow

## Visual Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.jsx                               │
│                    (React Component)                            │
│  - Manages pages (timeSelection, instructions, game)            │
│  - Handles window resize for responsive canvas                 │
│  - Orchestrates game loop                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   gameConfig.js   │ │  gameState.js    │ │  gameInput.js    │
│                   │ │                  │ │                  │
│ - Constants       │ │ - State setup    │ │ - Keyboard input │
│ - Game settings   │ │ - Updates chef   │ │ - Touch input    │
│ - Colors/sizes    │ │ - Updates objs   │ │ - Coordinates    │
│ - Object types    │ │ - Particles      │ │   scaling ✅     │
└───────────────────┘ └──────────────────┘ └──────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   gameLogic.js     │
                    │                    │
                    │ - Collision check  │
                    │ - Spawn objects    │
                    │ - Handle catches   │
                    │ - Game state rules │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────────┐
                    │  gameDrawing.js        │
                    │                        │
                    │ - Draw background      │
                    │ - Draw chef            │
                    │ - Draw objects         │
                    │ - Draw particles       │
                    │ - Draw UI/HUD          │
                    │ - Composite frame      │
                    └────────────────────────┘
```

## Data Flow (Each Frame)

```
1. INPUT CAPTURE
   User presses Key/Touches screen
   ↓
   gameInput.js stores in gameState.keys or gameState.chef.x

2. GAME UPDATE
   updateGameLogic() called
   ↓
   ├─ Update chef position (from input)
   ├─ Update falling objects (move down)
   ├─ Check collisions (gameState → gameLogic)
   ├─ Update particles (gravity, fade)
   ├─ Spawn new objects randomly
   ├─ Decrement time
   └─ Check game over condition

3. RENDERING
   drawFrame() called
   ↓
   ├─ drawBackground()
   ├─ drawChef(gameState)
   ├─ drawParticles(gameState.particles)
   ├─ drawFallingObjects(gameState.fallingObjects)
   ├─ drawUI(gameState)
   └─ If game over: drawGameOver()

4. NEXT FRAME
   requestAnimationFrame → Loop back to step 1
```

## Component Communication Map

### Input → State Update
```
gameInput.js
  - Keyboard: gameState.keys.left/right = true/false
  - Touch: gameState.chef.x = calculated position
```

### State Update → Logic
```
gameState → gameLogic.js
  - Chef position for collision checks
  - Falling objects for position updates
  - Health/score for game over check
```

### Logic → State Update (Feedback)
```
gameLogic.js → gameState.js
  - Call updateChefPosition()
  - Call updateFallingObjects()
  - Modify score, health, time
  - Set chef emotion
```

### State → Drawing
```
gameState → gameDrawing.js
  - Chef position, emotion → drawChef()
  - Objects array → drawFallingObjects()
  - Particles array → drawParticles()
  - Score, health, time → drawUI()
```

## Module Dependencies

```
index.jsx depends on:
  ✓ gameConfig.js (GAME_CONFIG, RECIPES)
  ✓ gameState.js (initializeGameState)
  ✓ gameDrawing.js (drawFrame)
  ✓ gameInput.js (setupKeyboardInput, setupTouchInput)
  ✓ gameLogic.js (updateGameLogic)

gameLogic.js depends on:
  ✓ gameConfig.js (GAME_CONFIG, OBJECT_TYPES)
  ✓ gameState.js (state update functions)

gameDrawing.js depends on:
  ✓ gameConfig.js (GAME_CONFIG for sizes/colors)

gameInput.js depends on:
  ✓ gameConfig.js (GAME_CONFIG.CANVAS_WIDTH)

gameState.js depends on:
  ✓ gameConfig.js (GAME_CONFIG)
```

## Responsive Canvas Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Physical Canvas Element                     │
│                  (HTML)                                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Canvas Width (attribute):  800px                         │
│  Canvas Height (attribute): 600px                         │
│  Canvas Width (CSS style):  60-800px (responsive)        │
│  Canvas Height (CSS style): 45-600px (responsive)        │
│                                                           │
│  Maintains 4:3 aspect ratio on all screen sizes          │
│                                                           │
└─────────────────────────────────────────────────────────┘

Game Logic Always Uses:
  GAME_CONFIG.CANVAS_WIDTH = 800
  GAME_CONFIG.CANVAS_HEIGHT = 600

Touch Input Conversion:
  Display Coordinates (screen pixels)
       ↓ (scaled by: 800 / displayWidth)
  Logical Coordinates (game pixels, 0-800)
       ↓ (used in all game logic)
  Chef movement calculated correctly
```

## Example: What Happens When Chef Catches an Object

```
1. PHYSICS
   ├─ Object falls: obj.y += FALL_SPEED
   ├─ Chef position: chef.x (from input)
   └─ Distance check: collision box overlap?

2. COLLISION DETECTED (gameState.js)
   ├─ Remove object from fallingObjects array
   └─ Call handleObjectCollision() callback

3. HANDLE COLLISION (gameLogic.js)
   ├─ Create particles (visual effect)
   ├─ Play sound (audioManager)
   ├─ Update chef emotion (happy)
   ├─ Update score +10
   └─ If bomb: reduce health -10

4. RENDER FRAME (gameDrawing.js)
   ├─ Draw old chef (still animating)
   ├─ Draw new particles
   ├─ Draw falling objects (one less)
   └─ Draw updated score in UI

5. NEXT FRAME
   ├─ Chef animation decays: catchAnimation -= 0.1
   ├─ Particles fade: life--
   ├─ Emotion stays 1 second: emotionTimer -= 0.016
   └─ Return to normal
```

## Debugging Strategy by Module

```
Problem: Game doesn't scale on mobile
└─ Look in: index.jsx (canvasSize calculation)
           gameInput.js (touch scale factor)

Problem: Chef moving weird on touch
└─ Look in: gameInput.js (setupTouchInput)
           gameState.js (updateChefPosition)

Problem: Objects falling through chef
└─ Look in: gameState.js (collision detection)
           gameConfig.js (object sizes)

Problem: Particles look wrong
└─ Look in: gameDrawing.js (drawParticles)
           gameLogic.js (createParticles)

Problem: Score not updating
└─ Look in: gameLogic.js (handleObjectCollision)
           gameState.js (addScore)

Problem: Chef looks different
└─ Look in: gameDrawing.js (drawChef, drawChefEmotion)

Problem: Game too easy/hard
└─ Look in: gameConfig.js (CHEF.SPEED, OBJECT.FALL_SPEED)
           gameLogic.js (SPAWN_RATE)
```

## File Size Comparison

### Before Refactoring
```
index.jsx: 632 lines (HUGE - all logic in one file)
```

### After Refactoring
```
index.jsx:              100 lines (Clean orchestration)
gameConfig.js:          45 lines  (Constants)
gameState.js:           90 lines  (State management)
gameDrawing.js:         380 lines (Rendering)
gameInput.js:           65 lines  (Input handling)
gameLogic.js:           110 lines (Game logic)
────────────────────────────────
Total code:             790 lines (Same logic, better organized)
```

**Benefits**: Much easier to find issues, test components, and make changes!

---

## Quick Fix Reference

If you encounter issues on a specific device:

**Mobile (320px-480px)**
- Check: gameInput.js touch scaling
- Check: CSS media query @media (max-width: 480px)

**Tablet (481px-768px)**
- Check: gameInput.js touch scaling
- Check: CSS media query @media (max-width: 768px)

**Laptop (769px+)**
- Check: gameConfig.js constants

**All Devices**
- Check: index.jsx responsive canvas sizing
- Check: gameInput.js scale factor calculation
