'use client'

import { useEffect, useRef } from 'react'
import { useOSStore } from '@/store/useOSStore'
import { MOOD_COLORS } from '@/lib/constants'

interface Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; opacity: number; phase: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { mood } = useOSStore()
  const moodRef = useRef(mood)
  moodRef.current = mood

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let raf: number

    const N = 80
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, W, H)

      const m = moodRef.current
      const speedMult = m === 'Low' ? 0.5 : m === 'Moderate' ? 1.2 : 2.6
      const moodColor = MOOD_COLORS[m]
      const connectDist = m === 'Low' ? 120 : m === 'Moderate' ? 100 : 80

      for (const p of particles) {
        // Add sinusoidal drift on Low
        if (m === 'Low') {
          p.x += p.vx * speedMult + Math.sin(t + p.phase) * 0.3
          p.y += p.vy * speedMult + Math.cos(t + p.phase) * 0.2
        } else if (m === 'High') {
          // Chaotic random direction changes
          if (Math.random() < 0.02) {
            p.vx = (Math.random() - 0.5) * 4
            p.vy = (Math.random() - 0.5) * 4
          }
          p.x += p.vx * speedMult
          p.y += p.vy * speedMult
        } else {
          p.x += p.vx * speedMult
          p.y += p.vy * speedMult
        }

        // Wrap edges
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = moodColor + Math.round(p.opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()
      }

      // Connection lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.12
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = moodColor + Math.round(alpha * 255).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    // Pause on hidden tab
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-50"
    />
  )
}
