import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const Background = () => {
  const mesh = useRef();
  
  const uniforms = useMemo(() => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#0a0a0a') }, // Darker black/grey
      uColorB: { value: new THREE.Color('#1a1a1a') }, // Subtle variation
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh 
      ref={mesh} 
      position={[0, 0, -10]} // Placed behind the watch
      scale={[100, 100, 1]}  // Huge scale to cover the screen
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false} // Don't mess with depth buffer
      />
    </mesh>
  );
};

export default Background;