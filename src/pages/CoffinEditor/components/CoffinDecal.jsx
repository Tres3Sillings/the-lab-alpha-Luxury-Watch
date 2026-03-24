import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function CoffinDecal({ url }) {
  // useTexture suspends the component until the image is fully loaded
  const texture = useTexture(url);
  texture.anisotropy = 16; // Ensures the massive high-res image stays sharp at extreme angles
  
  return (
    <mesh 
      position={[0, 0.006, 0]} // Just 0.006 units above the metal's center so it doesn't Z-fight
      rotation={[-Math.PI / 2, 0, 0]} // Lays perfectly flat inside its parent group
    >
      {/* Exact physical width and depth of the metal trim */}
      <planeGeometry args={[1.61, 0.38]} />
      <meshStandardMaterial
        key={url} // Forces a refresh if the user re-exports a new design
        map={texture}
        color="#ffffff" 
        transparent={true}
        polygonOffset={true}
        polygonOffsetFactor={-1} 
        roughness={0.4} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}