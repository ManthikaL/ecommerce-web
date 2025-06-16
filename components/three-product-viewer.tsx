"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

interface ThreeProductViewerProps {
  productName: string
  modelUrl?: string
  className?: string
}

export function ThreeProductViewer({ productName, modelUrl, className }: ThreeProductViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const controlsRef = useRef<OrbitControls>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.set(0, 0, 5)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(400, 400)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = true
    controlsRef.current = controls

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(-10, -10, -5)
    scene.add(pointLight)

    // Create a default 3D object (cube with product texture)
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      shininess: 100,
    })

    const cube = new THREE.Mesh(geometry, material)
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube)

    // Add product text
    const loader = new THREE.FontLoader()

    // Create a simple rotating animation
    const animate = () => {
      requestAnimationFrame(animate)

      if (cube) {
        cube.rotation.y += 0.005
      }

      controls.update()
      renderer.render(scene, camera)
    }

    setIsLoading(false)
    animate()

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth
        const height = mountRef.current.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [productName, modelUrl])

  const resetView = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset()
      cameraRef.current.position.set(0, 0, 5)
    }
  }

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.8)
    }
  }

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.2)
    }
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D view...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <p className="text-sm text-destructive mb-2">Failed to load 3D model</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 flex gap-1">
        <Button size="sm" variant="secondary" onClick={resetView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </Card>
  )
}
