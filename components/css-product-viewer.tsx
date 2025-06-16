"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, ZoomIn, ZoomOut, Move3D } from "lucide-react"

interface CSSProductViewerProps {
  productName: string
  productImage?: string
  className?: string
}

export function CSSProductViewer({ productName, productImage, className }: CSSProductViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  useEffect(() => {
    let animationId: number

    if (isAutoRotating) {
      const animate = () => {
        setRotation((prev) => ({ ...prev, y: prev.y + 0.5 }))
        animationId = requestAnimationFrame(animate)
      }
      animationId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isAutoRotating])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setIsAutoRotating(false)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y

    setRotation((prev) => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }))

    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((prev) => Math.max(0.5, Math.min(3, prev * delta)))
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0 })
    setScale(1)
    setIsAutoRotating(true)
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(3, prev * 1.2))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev * 0.8))
  }

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating)
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center perspective-1000"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          className="relative transition-transform duration-100 ease-out preserve-3d"
          style={{
            transform: `scale(${scale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main product cube */}
          <div className="relative w-48 h-48 preserve-3d">
            {/* Front face */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center"
              style={{ transform: "translateZ(96px)" }}
            >
              {productImage ? (
                <img
                  src={productImage || "/placeholder.svg"}
                  alt={productName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-white font-bold text-center p-4">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="text-sm">{productName}</div>
                </div>
              )}
            </div>

            {/* Back face */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg shadow-lg flex items-center justify-center"
              style={{ transform: "translateZ(-96px) rotateY(180deg)" }}
            >
              <div className="text-white font-bold text-center p-4">
                <div className="text-2xl mb-2">🔙</div>
                <div className="text-sm">Back View</div>
              </div>
            </div>

            {/* Right face */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg shadow-lg flex items-center justify-center"
              style={{ transform: "rotateY(90deg) translateZ(96px)" }}
            >
              <div className="text-white font-bold text-center p-4">
                <div className="text-2xl mb-2">➡️</div>
                <div className="text-sm">Side View</div>
              </div>
            </div>

            {/* Left face */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg flex items-center justify-center"
              style={{ transform: "rotateY(-90deg) translateZ(96px)" }}
            >
              <div className="text-white font-bold text-center p-4">
                <div className="text-2xl mb-2">⬅️</div>
                <div className="text-sm">Side View</div>
              </div>
            </div>

            {/* Top face */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center"
              style={{ transform: "rotateX(90deg) translateZ(96px)" }}
            >
              <div className="text-white font-bold text-center p-4">
                <div className="text-2xl mb-2">⬆️</div>
                <div className="text-sm">Top View</div>
              </div>
            </div>

            {/* Bottom face */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg shadow-lg flex items-center justify-center"
              style={{ transform: "rotateX(-90deg) translateZ(96px)" }}
            >
              <div className="text-white font-bold text-center p-4">
                <div className="text-2xl mb-2">⬇️</div>
                <div className="text-sm">Bottom</div>
              </div>
            </div>
          </div>

          {/* Floating elements for enhanced 3D effect */}
          <div
            className="absolute -top-8 -right-8 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"
            style={{ transform: "translateZ(120px)" }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-4 h-4 bg-green-400 rounded-full animate-pulse"
            style={{ transform: "translateZ(80px)" }}
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Button size="sm" variant="secondary" onClick={resetView} title="Reset view">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={zoomIn} title="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={zoomOut} title="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={isAutoRotating ? "default" : "secondary"}
          onClick={toggleAutoRotate}
          title="Toggle auto-rotation"
        >
          <Move3D className="h-4 w-4" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom • Click 3D to toggle auto-rotation
      </div>

      {/* Loading indicator */}
      <div className="absolute top-2 left-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          3D Ready
        </div>
      </div>
    </Card>
  )
}
