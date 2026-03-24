import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Model as CoffinModel } from './Coffin';
import { COLORS, METAL_COLORS } from '../constants';

export default function ConfiguratorCanvas({
  coffinMaterial, metalColor, handles, handleColor, ornament, decalImage,
  editorMode, glRef, cameraRef, sceneRef, controlsRef
}) {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <Canvas
        camera={{ position: [2.02, 0.86, 1.68], fov: 45 }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl, camera, scene }) => {
          glRef.current = gl;
          cameraRef.current = camera;
          sceneRef.current = scene;
        }}
      >
        <color attach="background" args={[COLORS.lightGray]} />
        <Environment preset="city" environmentIntensity={1} />
        
        <Suspense fallback={null}>
          <CoffinModel 
            coffinMaterial={coffinMaterial} 
            metalColor={METAL_COLORS[metalColor] || METAL_COLORS['Bronze']} 
            handleColor={METAL_COLORS[handleColor] || METAL_COLORS['Bronze']}
            handles={handles} 
            ornament={ornament} 
            decalImage={decalImage}
          />
        </Suspense>
        
        <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={10} blur={2} far={4} />
        <CameraControls 
          ref={controlsRef}
          enabled={editorMode === 'main'}
          makeDefault 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          mouseButtons={{ left: 1, right: 2, wheel: 16, middle: 2 }}
          touches={{ one: 64, two: 4096, three: 4096 }}
          onChange={() => {
            // Optional: You could log camera coordinates here if needed for debugging
          }}
        />
      </Canvas>
    </div>
  );
}