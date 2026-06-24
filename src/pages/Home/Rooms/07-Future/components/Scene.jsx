import React, { Suspense } from 'react';
import { Environment, ContactShadows, PresentationControls, Float } from '@react-three/drei';

// We will dynamically load the component based on the AI's recommendation
export default function Scene({ recommendedModel }) {
  return (
    <>
      {/* 1. STUDIO LIGHTING */}
      {/* Ambient light provides a soft base */}
      <ambientLight intensity={0.5} color="#ffffff" />
      {/* A soft directional light to cast subtle highlights */}
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" castShadow />

      {/* 2. ENVIRONMENT & REFLECTIONS */}
      {/* 'city' or 'studio' presets give excellent, clean reflections for glass and metal */}
      <Environment preset="studio" environmentIntensity={0.8} />

      {/* 3. INTERACTIVE CAMERA CONTROLS */}
      {/* PresentationControls allows the user to spin the furniture gently */}
      <PresentationControls 
        global={false} 
        cursor={true} 
        snap={true} 
        speed={1} 
        zoom={1} 
        rotation={[0, 0, 0]} 
        polar={[-Math.PI / 4, Math.PI / 4]} 
        azimuth={[-Math.PI / 2, Math.PI / 2]}
      >
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
          
          {/* 4. DYNAMIC MODEL LOADING */}
          {/* If the AI has made a recommendation, render that specific model */}
          <Suspense fallback={null}>
             {/* Note: In a real app, you'd have a switch statement or dynamic import here. 
                 For now, we render a placeholder box if a model is selected. */}
            {recommendedModel ? (
               <mesh castShadow receiveShadow position={[0, 0, 0]}>
                 <boxGeometry args={[1, 1, 1]} />
                 <meshStandardMaterial color="#eeeeee" roughness={0.1} metalness={0.2} />
               </mesh>
            ) : null}
          </Suspense>

        </Float>
      </PresentationControls>

      {/* 5. CONTACT SHADOWS */}
      {/* This creates that premium, grounded look on a white floor */}
      <ContactShadows 
        position={[0, -0.6, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
        color="#000000" 
      />
    </>
  );
}