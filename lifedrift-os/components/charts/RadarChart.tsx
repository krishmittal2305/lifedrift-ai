'use client'

import { useEffect, useRef } from 'react'
import { MOOD_COLORS, SLIDER_CONFIGS } from '@/lib/constants'

interface Props {
  values: Record<string, number>
  color: string
}

export function RadarChart({ values, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configs = SLIDER_CONFIGS

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const size = canvas.width
    const center = size / 2
    const radius = center * 0.7
    
    let raf: number
    
    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      
      // Draw 6 axes
      configs.forEach((config, i) => {
        const angle = (Math.PI * 2 * i) / configs.length - Math.PI / 2
        const x = center + Math.cos(angle) * radius
        const y = center + Math.sin(angle) * radius
        
        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.lineTo(x, y)
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)'
        ctx.stroke()
        
        // Axis label
        ctx.fillStyle = 'rgba(0, 200, 255, 0.4)'
        ctx.font = '8px Orbitron'
        ctx.textAlign = 'center'
        const lx = center + Math.cos(angle) * (radius + 20)
        const ly = center + Math.sin(angle) * (radius + 20)
        ctx.fillText(config.label.toUpperCase(), lx, ly)
      })

      // Draw radar shape
      ctx.beginPath()
      configs.forEach((config, i) => {
        const val = values[config.key] as number
        const normalized = (val - config.min) / (config.max - config.min)
        const angle = (Math.PI * 2 * i) / configs.length - Math.PI / 2
        const x = center + Math.cos(angle) * radius * normalized
        const y = center + Math.sin(angle) * radius * normalized
        
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
      
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = `color-mix(in srgb, ${color} 20%, transparent)`
      ctx.fill()
      
      // Draw glow
      ctx.shadowBlur = 15
      ctx.shadowColor = color
      ctx.stroke()
      ctx.shadowBlur = 0

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [values, color, configs])

  return (
    <canvas 
      ref={canvasRef} 
      width={320} 
      height={320} 
      className="mx-auto"
    />
  )
}
