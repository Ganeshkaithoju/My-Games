import { useRef, useEffect } from 'react'
import '../styles/ParticleEffects.css'

function ParticleEffects({ isActive }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationIdRef = useRef(null)

  const PARTICLE_COUNT = 8 // Particles per scratch event
  const PARTICLE_LIFETIME = 0.8 // seconds

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const handleMouseMove = (e) => {
      if (!isActive) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Add particles at cursor position
      createParticles(x, y)
    }

    const handleTouchMove = (e) => {
      if (!isActive) return

      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // Add particles at touch position
      createParticles(x, y)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true })

    // Animation loop
    const animate = () => {
      const ctx = canvas.getContext('2d')
      const now = Date.now() / 1000

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        const age = now - particle.birthTime
        if (age > PARTICLE_LIFETIME) return false

        const progress = age / PARTICLE_LIFETIME
        const easeOut = 1 - Math.pow(1 - progress, 3)

        // Calculate particle position with gravity
        const vx = particle.vx
        const vy = particle.vy + 9.81 * age * 50 // gravity effect

        const x = particle.x + vx * age * 60
        const y = particle.y + vy * age * 60 + 0.5 * 9.81 * age * age * 1000

        // Draw particle
        const opacity = 1 - easeOut
        ctx.fillStyle = `rgba(${particle.r}, ${particle.g}, ${particle.b}, ${opacity * 0.8})`
        ctx.beginPath()
        ctx.arc(x, y, particle.size * (1 - easeOut * 0.5), 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect
        ctx.strokeStyle = `rgba(${particle.r}, ${particle.g}, ${particle.b}, ${opacity * 0.3})`
        ctx.lineWidth = 1
        ctx.stroke()

        return true
      })

      if (particlesRef.current.length > 0) {
        animationIdRef.current = requestAnimationFrame(animate)
      }
    }

    const createParticles = (x, y) => {
      // Only create particles occasionally (every few pixels) to avoid performance issues
      if (Math.random() > 0.15) return

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5
        const speed = 2 + Math.random() * 3

        // Use gradient colors (indigo to pink)
        const colorChoice = Math.random()
        let r, g, b
        if (colorChoice < 0.5) {
          // Indigo
          r = 99 + Math.random() * 20
          g = 102 + Math.random() * 20
          b = 241 + Math.random() * 14
        } else {
          // Pink
          r = 236 + Math.random() * 19
          g = 72 + Math.random() * 40
          b = 153 + Math.random() * 18
        }

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          birthTime: Date.now() / 1000,
          size: 2 + Math.random() * 4,
          r: Math.round(r),
          g: Math.round(g),
          b: Math.round(b)
        })
      }

      // Start animation loop if not already running
      if (!animationIdRef.current) {
        animationIdRef.current = requestAnimationFrame(animate)
      }
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isActive])

  return (
    <canvas
      ref={canvasRef}
      className="particle-effects-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    />
  )
}

export default ParticleEffects
