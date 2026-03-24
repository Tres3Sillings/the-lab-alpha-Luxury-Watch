import React from 'react';
import { Decal } from '@react-three/drei';
import { useTexture } from '@react-three/drei';

export default function CoffinDecal({ url }) {
  const texture = useTexture(url);
  return (
    <Decal position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
      <meshPhysicalMaterial map={texture} transparent polygonOffset polygonOffsetFactor={-1} />
    </Decal>
  );
}