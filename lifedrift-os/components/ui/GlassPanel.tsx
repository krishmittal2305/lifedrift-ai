import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function GlassPanel({ children, className, style }: Props) {
  return (
    <div
      className={cn('glass-panel relative z-10', className)}
      style={style}
    >
      {children}
    </div>
  )
}
