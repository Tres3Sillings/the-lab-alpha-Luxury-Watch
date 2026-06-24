import React from 'react'
import { editable as e } from '@theatre/r3f'
import { useTexture } from '@react-three/drei'
import bgImageUrl from '../BG-Image.webp'

// Sky Plane background component using the new BG-Image.webp asset
export default function EnvironmentBackground() {
  const texture = useTexture(bgImageUrl)

  return (
    <e.mesh theatreKey="Sky Plane" position={[-0.5, 1.8, -8]} scale={[16, 9, 1]}>
      <planeGeometry />
      {/* depthWrite={false} keeps the plane from blocking render buffers; toneMapped={false} preserves original image colors */}
      <meshBasicMaterial map={texture} depthWrite={false} toneMapped={false} />
    </e.mesh>
  )
}
