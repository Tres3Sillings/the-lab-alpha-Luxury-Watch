import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const Background = () => {
  const mesh = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uColorA: { value: new THREE.Color('#080808') }, // Deep Black
    uColorB: { value: new THREE.Color('#202020') }, // Subtle Grey
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      // 1. Update Time
      mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // 2. Smoothly lerp mouse position for "Fluid" feel
      // state.mouse is already normalized (-1 to 1)
      mesh.current.material.uniforms.uMouse.value.lerp(state.mouse, 0.05);
    }
  });

  return (
    <mesh 
      ref={mesh} 
      position={[0, 0, -5]} // Sits behind the watch
      scale={[viewport.width * 2, viewport.height * 2, 1]} 
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Background;