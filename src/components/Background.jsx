import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const Background = () => {
  const mesh = useRef();
  // We use the viewport to make sure it covers the screen width/height
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColorA: { value: new THREE.Color('#1a1a1a') }, 
      uColorB: { value: new THREE.Color('#384c6c') }, 
    }),
    []
  );

  useFrame((state) => {
    const { clock, pointer } = state;
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
      mesh.current.material.uniforms.uMouse.value.set(pointer.x, pointer.y);
    }
  });

  return (
    <mesh 
      ref={mesh} 
      // Place it far behind the watch (z = -5)
      position={[0, 0, -5]} 
      // Make it HUGE. The viewport changes based on depth, 
      // so we multiply by a safe factor to ensure coverage.
      scale={[viewport.width * 2, viewport.height * 2, 1]} 
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        // These are critical for single-scene backgrounds:
        depthWrite={false} // Don't block the watch
      />
    </mesh>
  );
};

export default Background;