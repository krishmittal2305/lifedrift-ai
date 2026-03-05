'use client'

import { useEffect, useState } from 'react'
import { useOSStore } from '@/store/useOSStore'
import { MOOD_COLORS } from '@/lib/constants'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [target, setTarget] = useState({ x: 0, y: 0 })
  const { mood } = useOSStore()
  const moodColor = MOOD_COLORS[mood]

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setTarget({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useEffect(() => {
    let raf: number
    const animate = () => {
      setPos(prev => ({
        x: prev.x + (target.x - prev.x) * 0.15,
        y: prev.y + (target.y - prev.y) * 0.15
      }))
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [target])

  return (
    <>
      {/* Follower dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000]"
        style={{
          transform: `translate(${target.x - 3}px, ${target.y - 3}px)`,
          background: moodColor,
          boxShadow: `0 0 10px ${moodColor}`,
        }}
      />
      {/* Ring */}
      <div
        className="fixed top-0 left-0 w-6 h-6 border rounded-full pointer-events-none z-[10000]"
        style={{
          transform: `translate(${pos.x - 12}px, ${pos.y - 12}px)`,
          borderColor: moodColor,
          opacity: 0.3,
          transition: 'width 0.2s, height 0.2s, transform 0.1s linear'
        }}
      />
    </>
  )
}
