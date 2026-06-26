import React from 'react'
import { editable as e } from '@theatre/r3f'
import { useTexture } from '@react-three/drei'
import bgImageUrl from './Workshop-BG.png'

// Sky Plane background component for Chapter 02 (Workshop Room)
export default function WorkshopBackground() {
  const texture = useTexture(bgImageUrl)

  return (
    <e.mesh theatreKey="Workshop Sky Plane" position={[0, 2.5, -6]} scale={[16, 9, 1]}>
      <planeGeometry />
      {/* depthWrite={false} keeps the plane from blocking render buffers; toneMapped={false} preserves original image colors */}
      <meshBasicMaterial map={texture} depthWrite={false} toneMapped={false} />
    </e.mesh>
  )
}
