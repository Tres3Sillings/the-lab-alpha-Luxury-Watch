import React from 'react';
import { Decal } from '@react-three/drei';
import { useTexture } from '@react-three/drei';

export default function CoffinDecal({ url }) {
  const texture = useTexture(url);
  
  // The parent mesh (nodes.Metal) is heavily scaled: [0.807, 0.009, 0.194].
  // We must project straight down onto the Y axis (Math.PI / 2) and counteract the parent 
  // scales so the 846x200 image retains its exact aspect ratio without stretching!
  return (
    <Decal 
      position={[0, 0, 0]} 
      rotation={[Math.PI / 2, 0, 0]} 
      scale={[0.846 / 0.807, 0.200 / 0.194, 10]}
    >
      <meshPhysicalMaterial map={texture} transparent polygonOffset polygonOffsetFactor={-1} />
    </Decal>
  );
}