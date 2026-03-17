import { useEffect, useRef, useState } from 'react'
import './styles/PixelChef.css'
import { audioManager } from '../../utils/audioManager'
import { statsManager } from '../../utils/statsManager'

function PixelChef({ onBack }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [currentPage, setCurrentPage] = useState('timeSelection')
  const [selectedTime, setSelectedTime] = useState(30)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [finalScore, setFinalScore] = useState(0)

  useEffect(() => {
    const updateCanvasSize = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 800)
      const maxHeight = Math.min(window.innerHeight - 200, 600)
      const aspectRatio = 800 / 600
      let width = maxWidth
      let height = width / aspectRatio
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }
      setCanvasSize({ width, height })
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    if (currentPage !== 'game') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const CANVAS_WIDTH = 800
    const CANVAS_HEIGHT = 600
    const CHEF_WIDTH = 80
    const CHEF_HEIGHT = 100
    const OBJECT_SIZE = 40
    const CHEF_SPEED = 6
    const FALL_SPEED = 2.5

    let gameState = {
      chef: { x: CANVAS_WIDTH / 2 - CHEF_WIDTH / 2, y: CANVAS_HEIGHT - CHEF_HEIGHT - 20, catchAnimation: 0, emotion: 'neutral', emotionTimer: 0 },
      fallingObjects: [],
      particles: [],
      score: 0,
      health: 100,
      recipeProgress: { tomato: 0, lettuce: 0, cheese: 0 },
      timeLeft: selectedTime,
      gameRunning: true,
      gameOver: false,
      keys: { left: false, right: false },
      touch: { isDragging: false, startX: 0 },
    }

    const recipes = [
      { name: 'Basic Salad', ingredients: { tomato: 3, lettuce: 3, cheese: 3 }, time: selectedTime },
      { name: 'Veggie Burger', ingredients: { tomato: 4, lettuce: 4, cheese: 4 }, time: selectedTime },
      { name: 'Deluxe Sandwich', ingredients: { tomato: 5, lettuce: 5, cheese: 5 }, time: selectedTime },
    ]

    const objectTypes = [
      { type: 'tomato', color: '#FF6B6B', points: 10, isIngredient: true },
      { type: 'lettuce', color: '#4ECDC4', points: 10, isIngredient: true },
      { type: 'cheese', color: '#FFE66D', points: 10, isIngredient: true },
      { type: 'bomb', color: '#FF4757', points: -20, isIngredient: false },
      { type: 'clock', color: '#DDA0DD', points: 0, isIngredient: false, isPowerUp: true },
    ]

    function spawnFallingObject() {
      const randomType = objectTypes[Math.floor(Math.random() * objectTypes.length)]
      gameState.fallingObjects.push({
        x: Math.random() * (CANVAS_WIDTH - OBJECT_SIZE),
        y: -OBJECT_SIZE,
        type: randomType.type,
        color: randomType.color,
        points: randomType.points,
        isIngredient: randomType.isIngredient,
        isPowerUp: randomType.isPowerUp,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }

    function drawChef() {
      ctx.save()
      ctx.translate(gameState.chef.x + CHEF_WIDTH / 2, gameState.chef.y + CHEF_HEIGHT / 2)

      // Chef hat - improved design
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(-CHEF_WIDTH / 2 - 8, -CHEF_HEIGHT / 2 - 25, CHEF_WIDTH + 16, 25)
      ctx.fillStyle = '#FF6B6B'
      ctx.fillRect(-CHEF_WIDTH / 2 - 8, -CHEF_HEIGHT / 2 - 28, CHEF_WIDTH + 16, 3)
      // Hat shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.fillRect(-CHEF_WIDTH / 2 + 10, -CHEF_HEIGHT / 2 - 20, 20, 8)

      // Head
      ctx.fillStyle = '#F4A460'
      ctx.beginPath()
      ctx.arc(0, -CHEF_HEIGHT / 4, CHEF_WIDTH / 2.5, 0, Math.PI * 2)
      ctx.fill()

      // Chef body - shoulders and torso
      ctx.fillStyle = '#FF9800'
      ctx.fillRect(-CHEF_WIDTH / 2, -CHEF_HEIGHT / 4 + 5, CHEF_WIDTH, CHEF_HEIGHT / 2 - 10)

      // Neck connector
      ctx.fillStyle = '#F4A460'
      ctx.fillRect(-8, -CHEF_HEIGHT / 4, 16, 8)

      // Buttons on apron
      ctx.fillStyle = '#CD5C5C'
      ctx.beginPath()
      ctx.arc(-15, 0, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, 5, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(15, 0, 3, 0, Math.PI * 2)
      ctx.fill()

      // Apron with gradient effect
      ctx.fillStyle = 'rgba(255, 107, 107, 0.95)'
      ctx.fillRect(-CHEF_WIDTH / 3, 0, (CHEF_WIDTH / 3) * 2, CHEF_HEIGHT / 2.5)

      // Determine emotional state
      const emotion = gameState.chef.emotion
      const armRotation = gameState.chef.catchAnimation > 0 ? Math.sin(gameState.chef.catchAnimation * Math.PI) * 0.5 : 0

      // Eyebrows - express emotion
      ctx.fillStyle = '#8B7355'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'

      if (emotion === 'happy') {
        // Happy eyebrows - raised, curved
        ctx.beginPath()
        ctx.arc(-CHEF_WIDTH / 6, -CHEF_HEIGHT / 4 - 15, 8, 0, Math.PI, true)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(CHEF_WIDTH / 6, -CHEF_HEIGHT / 4 - 15, 8, 0, Math.PI, true)
        ctx.stroke()
      } else if (emotion === 'sad') {
        // Sad eyebrows - lowered, angled down toward center
        ctx.beginPath()
        ctx.moveTo(-CHEF_WIDTH / 6 - 8, -CHEF_HEIGHT / 4 - 10)
        ctx.lineTo(-CHEF_WIDTH / 6 + 8, -CHEF_HEIGHT / 4 - 14)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(CHEF_WIDTH / 6 + 8, -CHEF_HEIGHT / 4 - 10)
        ctx.lineTo(CHEF_WIDTH / 6 - 8, -CHEF_HEIGHT / 4 - 14)
        ctx.stroke()
      } else {
        // Neutral eyebrows - straight
        ctx.beginPath()
        ctx.moveTo(-CHEF_WIDTH / 6 - 8, -CHEF_HEIGHT / 4 - 12)
        ctx.lineTo(-CHEF_WIDTH / 6 + 8, -CHEF_HEIGHT / 4 - 12)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(CHEF_WIDTH / 6 - 8, -CHEF_HEIGHT / 4 - 12)
        ctx.lineTo(CHEF_WIDTH / 6 + 8, -CHEF_HEIGHT / 4 - 12)
        ctx.stroke()
      }

      // Eyes - white background
      ctx.fillStyle = '#FFF'
      ctx.beginPath()
      ctx.arc(-CHEF_WIDTH / 6, -CHEF_HEIGHT / 4, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(CHEF_WIDTH / 6, -CHEF_HEIGHT / 4, 6, 0, Math.PI * 2)
      ctx.fill()

      // Pupils - express emotion through pupil direction/size
      ctx.fillStyle = '#000'
      if (emotion === 'happy') {
        // Happy eyes - normal pupils, smiling
        ctx.beginPath()
        ctx.arc(-CHEF_WIDTH / 6, -CHEF_HEIGHT / 4 - 1, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(CHEF_WIDTH / 6, -CHEF_HEIGHT / 4 - 1, 3.5, 0, Math.PI * 2)
        ctx.fill()
      } else if (emotion === 'sad') {
        // Sad eyes - pupils down, eyes looking down
        ctx.beginPath()
        ctx.arc(-CHEF_WIDTH / 6, -CHEF_HEIGHT / 4 + 2, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(CHEF_WIDTH / 6, -CHEF_HEIGHT / 4 + 2, 3.5, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Neutral eyes
        ctx.beginPath()
        ctx.arc(-CHEF_WIDTH / 6, -CHEF_HEIGHT / 4, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(CHEF_WIDTH / 6, -CHEF_HEIGHT / 4, 3.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Eye shine for life
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.beginPath()
      ctx.arc(-CHEF_WIDTH / 6 + 2, -CHEF_HEIGHT / 4 - 2, 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(CHEF_WIDTH / 6 + 2, -CHEF_HEIGHT / 4 - 2, 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Mouth - primary emotion indicator
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'

      if (emotion === 'happy') {
        // Big happy smile
        ctx.beginPath()
        ctx.arc(0, -CHEF_HEIGHT / 6 + 3, 12, 0, Math.PI, false)
        ctx.stroke()
        // Smile crease/nose
        ctx.beginPath()
        ctx.moveTo(0, -CHEF_HEIGHT / 6 - 8)
        ctx.lineTo(0, -CHEF_HEIGHT / 6 - 2)
        ctx.stroke()
      } else if (emotion === 'sad') {
        // Sad frown
        ctx.beginPath()
        ctx.arc(0, -CHEF_HEIGHT / 6 - 2, 12, Math.PI, 0, false)
        ctx.stroke()
      } else {
        // Neutral smile
        ctx.beginPath()
        ctx.arc(0, -CHEF_HEIGHT / 6, 8, 0, Math.PI, false)
        ctx.stroke()
      }

      // Arms - animated on catch
      ctx.fillStyle = '#F4A460'
      ctx.lineWidth = 0
      ctx.save()
      ctx.translate(-CHEF_WIDTH / 2.5, -CHEF_HEIGHT / 8)
      ctx.rotate(armRotation)
      ctx.fillRect(-6, -6, 12, 45)
      // Hand
      ctx.beginPath()
      ctx.arc(0, 45, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.translate(CHEF_WIDTH / 2.5, -CHEF_HEIGHT / 8)
      ctx.rotate(-armRotation)
      ctx.fillRect(-6, -6, 12, 45)
      // Hand
      ctx.beginPath()
      ctx.arc(0, 45, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.restore()
      if (gameState.chef.catchAnimation > 0) gameState.chef.catchAnimation -= 0.1
    }

    function drawFallingObjects() {
      gameState.fallingObjects.forEach((obj) => {
        ctx.save()
        ctx.translate(obj.x + OBJECT_SIZE / 2, obj.y + OBJECT_SIZE / 2)
        ctx.rotate(obj.rotation)

        ctx.fillStyle = obj.color
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        if (obj.type === 'tomato') {
          ctx.beginPath()
          ctx.arc(0, -5, OBJECT_SIZE / 2.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#228B22'
          ctx.beginPath()
          ctx.ellipse(0, -OBJECT_SIZE / 2, 8, 5, 0, 0, Math.PI * 2)
          ctx.fill()
        } else if (obj.type === 'lettuce') {
          ctx.beginPath()
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            const radius = OBJECT_SIZE / 2.2
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
        } else if (obj.type === 'cheese') {
          ctx.fillRect(-OBJECT_SIZE / 2, -OBJECT_SIZE / 2, OBJECT_SIZE, OBJECT_SIZE)
          ctx.fillStyle = '#FFD700'
          ctx.beginPath()
          ctx.arc(-8, -5, 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(8, 5, 4, 0, Math.PI * 2)
          ctx.fill()
        } else if (obj.type === 'bomb') {
          ctx.fillStyle = '#333'
          ctx.beginPath()
          ctx.arc(0, 0, OBJECT_SIZE / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#FF4747'
          ctx.fillRect(-3, -OBJECT_SIZE / 2 - 5, 6, 8)
          ctx.fillStyle = '#FFD700'
          ctx.beginPath()
          ctx.arc(-5, -5, 3, 0, Math.PI * 2)
          ctx.fill()
        } else if (obj.type === 'clock') {
          ctx.fillStyle = '#DDA0DD'
          ctx.beginPath()
          ctx.arc(0, 0, OBJECT_SIZE / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#333'
          ctx.lineWidth = 2
          ctx.stroke()
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, -OBJECT_SIZE / 4)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(OBJECT_SIZE / 4, 0)
          ctx.stroke()
        }

        ctx.shadowColor = 'transparent'
        ctx.restore()
        obj.rotation += obj.rotationSpeed
      })
    }

    function drawParticles() {
      gameState.particles = gameState.particles.filter((p) => p.life > 0)
      gameState.particles.forEach((p) => {
        ctx.save()
        ctx.globalAlpha = p.life / p.maxLife
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        p.x += p.vx
        p.y += p.vy
        p.life--
        p.vy += 0.2
      })
    }

    function createParticles(x, y, color) {
      for (let i = 0; i < 15; i++) {
        const angle = (Math.random() - 0.5) * Math.PI * 2
        const speed = Math.random() * 4 + 2
        gameState.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 4 + 2,
          life: 30,
          maxLife: 30,
        })
      }
    }

    function drawUI() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, 80)
      ctx.fillStyle = '#FFF'
      ctx.font = 'bold 24px Arial'
      ctx.fillText(`Score: ${gameState.score}`, 20, 35)
      ctx.fillText(`Time: ${Math.ceil(gameState.timeLeft)}s`, CANVAS_WIDTH / 2 - 60, 35)
      ctx.font = 'bold 14px Arial'
      ctx.fillText(`Recipe: ${recipes[0].name}`, 20, 60)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(CANVAS_WIDTH - 220, 45, 200, 12)
      ctx.fillStyle = gameState.health > 50 ? '#4CAF50' : '#F44336'
      ctx.fillRect(CANVAS_WIDTH - 220, 45, (gameState.health / 100) * 200, 12)
    }

    function updateGame() {
      if (gameState.keys.left && gameState.chef.x > 0) gameState.chef.x -= CHEF_SPEED
      if (gameState.keys.right && gameState.chef.x < CANVAS_WIDTH - CHEF_WIDTH) gameState.chef.x += CHEF_SPEED

      gameState.fallingObjects = gameState.fallingObjects.filter((obj) => {
        obj.y += FALL_SPEED
        return obj.y < CANVAS_HEIGHT
      })

      gameState.fallingObjects = gameState.fallingObjects.filter((obj) => {
        const isColliding =
          obj.x < gameState.chef.x + CHEF_WIDTH &&
          obj.x + OBJECT_SIZE > gameState.chef.x &&
          obj.y < gameState.chef.y + CHEF_HEIGHT &&
          obj.y + OBJECT_SIZE > gameState.chef.y

        if (!isColliding) return true
        audioManager.playScratchSound()
        gameState.chef.catchAnimation = 0.3
        createParticles(obj.x + OBJECT_SIZE / 2, obj.y + OBJECT_SIZE / 2, obj.color)

        // Set emotion based on what was caught
        if (obj.isPowerUp) {
          if (obj.type === 'clock') {
            gameState.timeLeft += 5
            gameState.chef.emotion = 'happy'
          }
        } else if (obj.isIngredient) {
          gameState.score += obj.points
          gameState.recipeProgress[obj.type]++
          gameState.chef.emotion = 'happy'
        } else {
          // Bomb hit
          gameState.score += obj.points
          gameState.health -= 10
          gameState.chef.emotion = 'sad'
        }
        gameState.chef.emotionTimer = 1.0

        return false
      })

      if (Math.random() < 0.025) spawnFallingObject()
      gameState.timeLeft -= 0.016

      if (gameState.timeLeft <= 0) {
        gameState.gameRunning = false
        gameState.gameOver = true
        audioManager.playCompletionSound()
      }
      if (gameState.health <= 0) {
        gameState.gameRunning = false
        gameState.gameOver = true
      }

      // Decay emotion over time
      if (gameState.chef.emotionTimer > 0) {
        gameState.chef.emotionTimer -= 0.016
        if (gameState.chef.emotionTimer <= 0) {
          gameState.chef.emotion = 'neutral'
          gameState.chef.emotionTimer = 0
        }
      }
    }

    function drawGame() {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, '#87CEEB')
      gradient.addColorStop(1, '#E0F6FF')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      const cloudY = 50 + Math.sin(gameState.timeLeft) * 10
      ctx.beginPath()
      ctx.arc(100, cloudY, 30, 0, Math.PI * 2)
      ctx.arc(140, cloudY, 35, 0, Math.PI * 2)
      ctx.arc(180, cloudY, 30, 0, Math.PI * 2)
      ctx.fill()

      drawChef()
      drawParticles()
      drawFallingObjects()
      drawUI()

      if (gameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.fillStyle = '#FFF'
        ctx.font = 'bold 50px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50)
        ctx.font = '30px Arial'
        ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
        ctx.textAlign = 'left'
      }
    }

    function gameLoop() {
      if (gameState.gameRunning) updateGame()
      drawGame()
      if (!gameState.gameOver) {
        gameRef.current = requestAnimationFrame(gameLoop)
      } else {
        setFinalScore(gameState.score)
        statsManager.recordGameCompletion(1, selectedTime * 1000)
        setTimeout(() => setCurrentPage('timeSelection'), 2000)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') gameState.keys.left = true
      if (e.key === 'ArrowRight') gameState.keys.right = true
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') gameState.keys.left = false
      if (e.key === 'ArrowRight') gameState.keys.right = false
    }
    const handleTouchStart = (e) => {
      gameState.touch.isDragging = true
      gameState.touch.startX = e.touches[0].clientX
    }
    const handleTouchMove = (e) => {
      if (!gameState.touch.isDragging) return
      const currentX = e.touches[0].clientX
      const diff = currentX - gameState.touch.startX
      gameState.chef.x += diff * 0.5
      gameState.chef.x = Math.max(0, Math.min(CANVAS_WIDTH - CHEF_WIDTH, gameState.chef.x))
      gameState.touch.startX = currentX
    }
    const handleTouchEnd = () => {
      gameState.touch.isDragging = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    gameState.timeLeft = recipes[0].time
    statsManager.recordGameStart()
    gameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      if (gameRef.current) cancelAnimationFrame(gameRef.current)
    }
  }, [currentPage, selectedTime])

  return (
    <div className="pixel-chef-game">
      {currentPage === 'timeSelection' && (
        <div className="page-container time-selection">
          <h1>🎮 Pixel Chef</h1>
          <p className="subtitle">Catch ingredients & complete recipes!</p>
          <div className="time-options">
            <button className="time-button" onClick={() => { setSelectedTime(30); setCurrentPage('instructions') }}>
              <span className="time-value">30</span>
              <span className="time-label">Easy (30s)</span>
            </button>
            <button className="time-button" onClick={() => { setSelectedTime(60); setCurrentPage('instructions') }}>
              <span className="time-value">60</span>
              <span className="time-label">Medium (1m)</span>
            </button>
            <button className="time-button" onClick={() => { setSelectedTime(90); setCurrentPage('instructions') }}>
              <span className="time-value">90</span>
              <span className="time-label">Hard (1.5m)</span>
            </button>
          </div>
          <button className="back-button" onClick={onBack}>← Back to Launcher</button>
        </div>
      )}

      {currentPage === 'instructions' && (
        <div className="page-container instructions">
          <h2>📖 How to Play</h2>
          <div className="instructions-content">
            <div className="instruction-item">
              <span className="instruction-number">1</span>
              <p>🎮 Move the chef left and right using arrow keys or touch</p>
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
            <button className="play-button" onClick={() => setCurrentPage('game')}>🎮 Start Game</button>
            <button className="back-button" onClick={() => setCurrentPage('timeSelection')}>← Back</button>
          </div>
        </div>
      )}

      {currentPage === 'game' && (
        <div className="page-container game-page">
          <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="game-canvas" />
          <p className="game-hint">🎮 Arrow Keys or Touch to Move • Catch All Ingredients!</p>
        </div>
      )}

      {finalScore > 0 && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>🎉 Excellent Work!</h2>
            <p className="final-score-label">Final Score</p>
            <p className="final-score">{finalScore}</p>
            <button onClick={() => setCurrentPage('timeSelection')}>🎮 Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PixelChef
