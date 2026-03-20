import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three'; 
import { Model as CoffinModel } from './components/Coffin';

const COLORS = {
  white: '#FFFFFF',
  studioWhite: '#F3F3F3', 
  accentBlue: '#6FAFD7',
  darkBlue: '#2F3942',
  tanAccent: '#A1988A',
};

export default function Experience() {
  const [coffinMaterial, setCoffinMaterial] = useState('White Marble');
  // Use the specific hexes we found for Copper, Steel, and Bronze
  const [metalColor, setMetalColor] = useState('#2C2C2C'); 
  const [handles, setHandles] = useState('standard');
  const [ornament, setOrnament] = useState('none');

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: COLORS.studioWhite, margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '350px', backgroundColor: COLORS.darkBlue, color: COLORS.white, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 10 }}>
        <h1 style={{ color: COLORS.accentBlue, margin: 0 }}>The Lab</h1>
        
        {/* Coffin Body */}
        <div>
          <h3 style={{ marginBottom: '10px' }}>Body Material</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <ColorSwatch color="#FFFFFF" active={coffinMaterial === 'White Marble'} onClick={() => setCoffinMaterial('White Marble')} />
            <ColorSwatch color="#111111" active={coffinMaterial === 'Black Marble'} onClick={() => setCoffinMaterial('Black Marble')} />
          </div>
        </div>

        {/* Metal Swatches */}
        <div>
          <h3 style={{ marginBottom: '10px' }}>Metal Finish</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <ColorSwatch color="#2C2C2C" name="Steel" active={metalColor === '#2C2C2C'} onClick={() => setMetalColor('#2C2C2C')} />
            <ColorSwatch color="#8B4513" name="Copper" active={metalColor === '#8B4513'} onClick={() => setMetalColor('#8B4513')} />
            <ColorSwatch color="#B87333" name="Bronze" active={metalColor === '#B87333'} onClick={() => setMetalColor('#B87333')} />
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas 
          camera={{ position: [4, 2, 3.5], fov: 45 }} 
          shadows 
          gl={{ 
            antialias: true, 
            toneMapping: THREE.ACESFilmicToneMapping, 
            toneMappingExposure: 1.4 // Boosted for metallic brilliance
          }}
        >
          <color attach="background" args={[COLORS.studioWhite]} />
          <ambientLight intensity={0.5} />

          {/* Large overhead softbox */}
          <rectAreaLight width={10} height={10} intensity={4} color="white" position={[-5, 8, 5]} lookAt={[0, 0, 0]} />
          
          {/* Side fill to catch the front bevels */}
          <rectAreaLight width={5} height={5} intensity={2} color="white" position={[5, 2, 5]} lookAt={[0, 0, 0]} />

          <Suspense fallback={null}>
            {/* Low environment intensity prevents "muddy" reflections */}
            <Environment preset="studio" environmentIntensity={0.1} />
            
            <CoffinModel 
              coffinMaterial={coffinMaterial} 
              metalColor={metalColor} 
            />

            <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={15} blur={2.5} />
          </Suspense>
          
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} enableDamping />
        </Canvas>
      </div>
    </div>
  );
}

function ColorSwatch({ color, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '40px', height: '40px', borderRadius: '50%', backgroundColor: color,
      border: active ? `3px solid ${COLORS.accentBlue}` : '2px solid transparent',
      cursor: 'pointer', transition: 'all 0.2s'
    }} />
  );
}