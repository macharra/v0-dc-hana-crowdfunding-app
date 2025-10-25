"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isScanning) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        setError("Unable to access camera. Please check permissions.")
        setIsScanning(false)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isScanning])

  const handleSimulatedScan = () => {
    // Simulate QR code scan for demo purposes
    onScan("TRANS-2025-001-VERIFIED")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-background p-6">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-foreground">Scan QR Code</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Point your camera at the QR code to verify your transaction
        </p>

        {isScanning ? (
          <div className="mt-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-64 w-full rounded-lg border border-border bg-black object-cover"
            />
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <Button onClick={() => setIsScanning(false)} variant="outline" className="mt-4 w-full">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Camera access required to scan QR codes</p>
            </div>
            <Button onClick={() => setIsScanning(true)} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            <Button onClick={handleSimulatedScan} variant="outline" className="w-full bg-transparent">
              Simulate Scan (Demo)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
