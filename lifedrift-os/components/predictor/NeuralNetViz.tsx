'use client'

import { useEffect, useRef } from 'react'
import { MOOD_COLORS } from '@/lib/constants'

interface Props { 
  predicting: boolean
  result?: 'Low' | 'Moderate' | 'High'
}

export function NeuralNetViz({ predicting, result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf: number
    
    const layers = [4, 6, 6, 3]
    const nodes: { x: number, y: number, layer: number }[] = []
    
    const padding = 40
    const w = canvas.width
    const h = canvas.height
    
    layers.forEach((count, l) => {
      const x = padding + (w - 2 * padding) * (l / (layers.length - 1))
      for (let i = 0; i < count; i++) {
        const y = padding + (h - 2 * padding) * (i / (count - 1 || 1))
        nodes.push({ x, y, layer: l })
      }
    })

    const particles: { x: number, y: number, tx: number, ty: number, progress: number, speed: number, color: string }[] = []

    const spawnParticle = () => {
      const startNode = nodes.filter(n => n.layer === 0)[Math.floor(Math.random() * layers[0])]
      const nextNode = nodes.filter(n => n.layer === 1)[Math.floor(Math.random() * layers[1])]
      particles.push({
        x: startNode.x,
        y: startNode.y,
        tx: nextNode.x,
        ty: nextNode.y,
        progress: 0,
        speed: 0.01 + Math.random() * 0.02,
        color: 'var(--cyan)'
      })
    }

    let t = 0
    const draw = () => {
      t++
      ctx.clearRect(0, 0, w, h)
      
      // Draw connections
      ctx.lineWidth = 0.5
      nodes.forEach(n1 => {
        nodes.forEach(n2 => {
          if (n2.layer === n1.layer + 1) {
            ctx.beginPath()
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.strokeStyle = 'rgba(0, 200, 255, 0.05)'
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 200, 255, 0.2)'
        ctx.fill()
      })

      // Update and draw particles
      if (predicting && t % 2 === 0) spawnParticle()
      else if (Math.random() < 0.1) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.progress += p.speed * (predicting ? 3 : 1)
        
        const x = p.x + (p.tx - p.x) * p.progress
        const y = p.y + (p.ty - p.y) * p.progress
        
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = MOOD_COLORS[result || 'Low']
        ctx.fill()

        if (p.progress >= 1) {
          const currentNode = nodes.find(n => n.x === p.tx && n.y === p.ty)!
          if (currentNode.layer < layers.length - 1) {
            const nextNodes = nodes.filter(n => n.layer === currentNode.layer + 1)
            const nextNode = nextNodes[Math.floor(Math.random() * nextNodes.length)]
            p.x = p.tx
            p.y = p.ty
            p.tx = nextNode.x
            p.ty = nextNode.y
            p.progress = 0
          } else {
            particles.splice(i, 1)
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [predicting, result])

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={240} 
      className="w-full h-auto mx-auto"
    />
  )
}
