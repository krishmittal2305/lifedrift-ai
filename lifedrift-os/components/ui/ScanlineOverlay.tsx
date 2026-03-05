'use client'

export function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-30" />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)'
        }}
      />
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 opacity-20 pointer-events-none"
        style={{ animation: 'scan-line 8s linear infinite' }}
      />
    </div>
  )
}
