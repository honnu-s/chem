"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

export interface InteractiveGridPatternProps {
  className?: string
  children?: React.ReactNode
  cellSize?: number
  glowColor?: string
  borderColor?: string
  proximity?: number
}

export function InteractiveGridPattern({
  className,
  children,
  cellSize = 50,
  glowColor = "rgba(16, 185, 129, 0.6)", // emerald
  borderColor = "rgba(0, 0, 0, 0.08)",
  proximity = 120,
}: InteractiveGridPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState({ rows: 0, cols: 0, scale: 1 })
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 })

  const updateGrid = useCallback(() => {
    if (!containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()

    const scale = Math.max(1, Math.min(width, height) / 800)
    const scaledCell = cellSize * scale

    setGrid({
      rows: Math.ceil(height / scaledCell) + 1,
      cols: Math.ceil(width / scaledCell) + 1,
      scale,
    })
  }, [cellSize])

  useEffect(() => {
    updateGrid()
    const ro = new ResizeObserver(updateGrid)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [updateGrid])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const onLeave = () =>
      setMousePos({ x: -9999, y: -9999 })

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  const scaledCell = cellSize * grid.scale
  const scaledProximity = proximity * grid.scale

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden bg-white pointer-events-auto",
        className
      )}
    >
      {/* Grid */}
      <div className="absolute inset-0">
        {Array.from({ length: grid.rows }).map((_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: grid.cols }).map((_, col) => {
              const cx = col * scaledCell + scaledCell / 2
              const cy = row * scaledCell + scaledCell / 2

              const dx = mousePos.x - cx
              const dy = mousePos.y - cy
              const dist = Math.sqrt(dx * dx + dy * dy)

              const proximityFactor = Math.max(
                0,
                1 - dist / scaledProximity
              )

              const isActive = proximityFactor > 0.9

              return (
                <div
                  key={`${row}-${col}`}
                  className="shrink-0 border transition-all duration-700 ease-out"
                  style={{
                    width: scaledCell,
                    height: scaledCell,
                    borderColor,
                    backgroundColor: isActive
                      ? glowColor
                      : proximityFactor > 0
                      ? glowColor.replace(
                          /[\d.]+\)$/,
                          `${proximityFactor * 0.6})`
                        )
                      : "transparent",
                    boxShadow: isActive
                      ? `0 0 ${20 * grid.scale}px ${glowColor}`
                      : "none",
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          width: "60vmin",
          height: "60vmin",
          background: `radial-gradient(circle, ${glowColor.replace(
            /[\d.]+\)$/,
            "0.3)"
          )} 0%, transparent 70%)`,
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.04) 100%)",
        }}
      />

      {/* Foreground content */}
      {children && (
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      )}
    </div>
  )
}
