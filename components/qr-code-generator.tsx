"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  value: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
  includeMargin?: boolean
}

export function QRCodeGenerator({ value, size = 256, level = "H", includeMargin = true }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Simple QR code generation using canvas
    // For production, consider using a library like qrcode.react or qr-code-styling
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create a simple pattern-based QR representation
    // This is a placeholder that creates a visual QR-like pattern
    const moduleCount = 25
    const moduleSize = size / moduleCount
    const margin = includeMargin ? 2 : 0

    canvas.width = size
    canvas.height = size

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Generate pattern based on value hash
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }

    // Draw modules
    ctx.fillStyle = "#000000"
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Create position detection patterns (corners)
        const isCorner =
          (row < 7 && col < 7) || (row < 7 && col >= moduleCount - 7) || (row >= moduleCount - 7 && col < 7)

        if (isCorner) {
          // Draw corner patterns
          if ((row < 6 && col < 6) || (row < 6 && col >= moduleCount - 6) || (row >= moduleCount - 6 && col < 6)) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
          }
        } else {
          // Generate pseudo-random pattern based on hash
          const seed = (hash ^ (row * 31 + col)) >>> 0
          if (seed % 2 === 0) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
          }
        }
      }
    }
  }, [value, size, includeMargin])

  return <canvas ref={canvasRef} className="rounded-lg border border-border" />
}
