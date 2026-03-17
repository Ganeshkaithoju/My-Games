import { useRef, useEffect, useState, useCallback } from 'react'
import '../styles/ScratchCanvas.css'
import { audioManager } from '../../../utils/audioManager'
import ParticleEffects from './ParticleEffects'

function ScratchCanvas({ imageDataUrl, imageName, onScratchComplete }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasCompleted, setHasCompleted] = useState(false)
  const drawingQueueRef = useRef([])
  const animationFrameRef = useRef(null)
  const lastConsiderableProgressRef = useRef(0) // Track last significant progress change
  const progressCheckCounterRef = useRef(0) // Counter for progress calculation throttling
  const lastTouchPointRef = useRef(null) // For point interpolation
  const isMobileRef = useRef(false) // Cache mobile detection
  const lastSoundTimeRef = useRef(0) // Track last scratch sound time

  // Configuration
  const BRUSH_RADIUS = 25
  const COMPLETION_THRESHOLD = 90 // 90% scratched to complete
  const CANVAS_SIZE = 250 // Fixed canvas size in pixels
  const OVERLAY_COLOR = '#333' // Dark overlay color
  const PROGRESS_CHECK_INTERVAL = 6 // Check progress every 6 frames (~100ms at 60fps)
  const TOUCH_THROTTLE_MS = 16 // ~60fps throttling for touch events
  const SOUND_THROTTLE_MS = 50 // Play scratch sound every 50ms max

  // Initialize canvas with dark overlay only (no image drawn on canvas)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Detect mobile for performance optimizations
    isMobileRef.current = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    // Set canvas size for crisp rendering on all devices
    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_SIZE * dpr
    canvas.height = CANVAS_SIZE * dpr

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    // Scale context to account for device pixel ratio
    ctx.scale(dpr, dpr)

    // Fill the entire canvas with dark overlay color
    ctx.fillStyle = OVERLAY_COLOR
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Optional: Add subtle texture pattern to the overlay for visual appeal
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < CANVAS_SIZE; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + CANVAS_SIZE, CANVAS_SIZE)
      ctx.stroke()
    }
  }, [])

  // Calculate scratched area percentage - ONLY when threshold is met
  const calculateProgress = useCallback((canvas) => {
    const ctx = canvas.getContext('2d')
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Count transparent pixels (scratched areas where alpha < 128)
      let transparentPixels = 0
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 128) { // Alpha channel
          transparentPixels++
        }
      }

      const totalPixels = data.length / 4
      const scratchPercentage = (transparentPixels / totalPixels) * 100

      return scratchPercentage
    } catch (e) {
      // Handle potential security errors
      return 0
    }
  }, [])

  // Interpolate between two points for smoother strokes
  const interpolatePoints = useCallback((p1, p2) => {
    const points = []
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Generate intermediate points every few pixels for smooth strokes
    const steps = Math.ceil(distance / 5)
    for (let i = 0; i <= steps; i++) {
      const t = steps > 0 ? i / steps : 0
      points.push({
        x: p1.x + dx * t,
        y: p1.y + dy * t
      })
    }

    return points
  }, [])

  // Perform scratch operation at the given coordinates
  const scratch = useCallback((x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    // Convert to canvas coordinates accounting for CSS scaling
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const canvasX = (x - rect.left) * scaleX
    const canvasY = (y - rect.top) * scaleY

    // Queue the drawing operation
    drawingQueueRef.current.push({ x: canvasX, y: canvasY })

    // Play scratch sound with throttling
    const now = Date.now()
    if (now - lastSoundTimeRef.current > SOUND_THROTTLE_MS) {
      audioManager.playScratchSound()
      lastSoundTimeRef.current = now
    }

    // Process drawing queue with animation frame for performance
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d')

        // Process all queued drawing operations
        while (drawingQueueRef.current.length > 0) {
          const point = drawingQueueRef.current.shift()

          // Use destination-out composite to erase the overlay
          // This makes the canvas transparent, revealing the image underneath
          ctx.globalCompositeOperation = 'destination-out'
          ctx.beginPath()
          ctx.arc(point.x, point.y, BRUSH_RADIUS, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(0, 0, 0, 1)' // Fully opaque black to erase
          ctx.fill()
        }

        // Calculate progress
        const newProgress = calculateProgress(canvas)
        setProgress(newProgress)

        // Check if scratching is complete
        if (newProgress >= COMPLETION_THRESHOLD && !hasCompleted) {
          setHasCompleted(true)
          // Play completion sound
          audioManager.playCompletionSound()
          onScratchComplete()
        }

        animationFrameRef.current = null
      })
    }
  }, [calculateProgress, hasCompleted, onScratchComplete])

  // Mouse event handlers for desktop
  const handleMouseDown = useCallback((e) => {
    if (hasCompleted) return
    setIsDrawing(true)
    scratch(e.clientX, e.clientY)
  }, [scratch, hasCompleted])

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || hasCompleted) return
    scratch(e.clientX, e.clientY)
  }, [isDrawing, scratch, hasCompleted])

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false)
  }, [])

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e) => {
    if (hasCompleted) return
    e.preventDefault() // Prevent page scroll
    setIsDrawing(true)

    const touch = e.touches[0]
    scratch(touch.clientX, touch.clientY)
  }, [scratch, hasCompleted])

  const handleTouchMove = useCallback((e) => {
    if (!isDrawing || hasCompleted) return
    e.preventDefault() // Prevent page scroll

    const touch = e.touches[0]
    scratch(touch.clientX, touch.clientY)
  }, [isDrawing, scratch, hasCompleted])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault() // Prevent page scroll
    setIsDrawing(false)
  }, [])

  // Attach event listeners to canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)

    // Touch events with passive: false to allow preventDefault
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)

      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <div className="scratch-canvas-wrapper">
      {/* Progress indicator */}
      <div className="scratch-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Image and Canvas Container with proper layering */}
      <div className="canvas-image-container">
        {/* Bottom layer: Static image (NOT drawn on canvas) */}
        <img
          src={imageDataUrl}
          alt={imageName}
          className="scratch-image"
        />

        {/* Particle effects layer */}
        <ParticleEffects isActive={isDrawing && !hasCompleted} />

        {/* Top layer: Canvas overlay that gets scratched */}
        <canvas
          ref={canvasRef}
          className={`scratch-canvas-overlay ${hasCompleted ? 'completed' : ''}`}
          style={{ cursor: hasCompleted ? 'default' : 'pointer' }}
        />

        {/* Completion badge - appears on top of canvas */}
        {hasCompleted && (
          <div className="scratch-complete-badge">
            ✓ Revealed!
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="canvas-info">
        <p className="image-name">{imageName}</p>
      </div>
    </div>
  )
}

export default ScratchCanvas
