import { useEffect, useRef, useState } from 'react';
import './styles/PixelChef.css';
import { audioManager } from '../../utils/audioManager';
import { statsManager } from '../../utils/statsManager';

// Import game modules
import { GAME_CONFIG, RECIPES } from './modules/gameConfig.js';
import { initializeGameState } from './modules/gameState.js';
import { drawFrame } from './modules/gameDrawing.js';
import { setupKeyboardInput, setupTouchInput, cleanupInput } from './modules/gameInput.js';
import { updateGameLogic } from './modules/gameLogic.js';

function PixelChef({ onBack }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const inputCleanupRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('timeSelection');
  const [selectedTime, setSelectedTime] = useState(30);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [finalScore, setFinalScore] = useState(0);

  // Handle canvas resizing for responsiveness
  useEffect(() => {
    const updateCanvasSize = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 800);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      const aspectRatio = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.CANVAS_HEIGHT;

      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Main game loop
  useEffect(() => {
    if (currentPage !== 'game') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize game state
    let gameState = initializeGameState(selectedTime);
    const recipes = RECIPES(selectedTime);

    // Setup input handlers
    const keyboardCleanup = setupKeyboardInput(gameState);
    const touchCleanup = setupTouchInput(canvas, gameState, GAME_CONFIG.CANVAS_WIDTH);
    inputCleanupRef.current = () => cleanupInput(keyboardCleanup, touchCleanup);

    statsManager.recordGameStart();

    // Game loop
    const gameLoop = () => {
      if (gameState.gameRunning) {
        updateGameLogic(gameState, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT, audioManager);
      }

      // Draw the frame
      drawFrame(ctx, gameState, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT, recipes[0].name);

      if (!gameState.gameOver) {
        gameRef.current = requestAnimationFrame(gameLoop);
      } else {
        setFinalScore(gameState.score);
        statsManager.recordGameCompletion(1, selectedTime * 1000);
        setTimeout(() => setCurrentPage('timeSelection'), 2000);
      }
    };

    gameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      if (inputCleanupRef.current) {
        inputCleanupRef.current();
      }
      if (gameRef.current) {
        cancelAnimationFrame(gameRef.current);
      }
    };
  }, [currentPage, selectedTime]);

  return (
    <div className="pixel-chef-game">
      {currentPage === 'timeSelection' && (
        <div className="page-container time-selection">
          <h1>🎮 Pixel Chef</h1>
          <p className="subtitle">Catch ingredients & complete recipes!</p>
          <div className="time-options">
            <button
              className="time-button"
              onClick={() => {
                setSelectedTime(30);
                setCurrentPage('instructions');
              }}
            >
              <span className="time-value">30</span>
              <span className="time-label">Easy (30s)</span>
            </button>
            <button
              className="time-button"
              onClick={() => {
                setSelectedTime(60);
                setCurrentPage('instructions');
              }}
            >
              <span className="time-value">60</span>
              <span className="time-label">Medium (1m)</span>
            </button>
            <button
              className="time-button"
              onClick={() => {
                setSelectedTime(90);
                setCurrentPage('instructions');
              }}
            >
              <span className="time-value">90</span>
              <span className="time-label">Hard (1.5m)</span>
            </button>
          </div>
          <button className="back-button" onClick={onBack}>
            ← Back to Launcher
          </button>
        </div>
      )}

      {currentPage === 'instructions' && (
        <div className="page-container instructions">
          <h2>📖 How to Play</h2>
          <div className="instructions-content">
            <div className="instruction-item">
              <span className="instruction-number">1</span>
              <p>🎮 Move the chef left and right using arrow keys or swipe</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">2</span>
              <p>🥗 Catch falling vegetables to complete recipes</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">3</span>
              <p>⚠️ Avoid bombs - they hurt!</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">4</span>
              <p>⏰ Catch clocks to gain extra time</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">5</span>
              <p>⭐ Score as high as possible!</p>
            </div>
          </div>
          <div className="button-group">
            <button className="play-button" onClick={() => setCurrentPage('game')}>
              🎮 Start Game
            </button>
            <button className="back-button" onClick={() => setCurrentPage('timeSelection')}>
              ⬅️ Back
            </button>
          </div>
        </div>
      )}

      {currentPage === 'game' && (
        <div className="page-container game-page">
          <canvas ref={canvasRef} width={GAME_CONFIG.CANVAS_WIDTH} height={GAME_CONFIG.CANVAS_HEIGHT} className="game-canvas" style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }} />
          <p className="game-hint">🎮 Arrow Keys or Swipe to Move • Catch All Ingredients!</p>
        </div>
      )}

      {finalScore > 0 && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>🎉 Excellent Work!</h2>
            <p className="final-score-label">Final Score</p>
            <p className="final-score">{finalScore}</p>
            <div className="button-group">
              <button
                className="play-button"
                onClick={() => {
                  setFinalScore(0);
                  setCurrentPage('timeSelection');
                }}
              >
                🎮 Play Again
              </button>
              <button className="back-button" onClick={onBack}>
                ← Back to Launcher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PixelChef;
