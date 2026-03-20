import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Model as CoffinModel } from './components/Coffin';

// Color palette definitions
const COLORS = {
  white: '#FFFFFF',
  lightGray: '#EEEEEE',
  accentBlue: '#6FAFD7',
  darkBlue: '#2F3942',
  tanAccent: '#A1988A',
};

export default function Experience() {
  // Configuration states
  const [coffinMaterial, setCoffinMaterial] = useState('White Marble');
  const [metalColor, setMetalColor] = useState('#a06127');
  const [handles, setHandles] = useState('standard');
  const [ornament, setOrnament] = useState('none');

  useEffect(() => {
    console.log("Current Coffin Material selected:", coffinMaterial);
  }, [coffinMaterial]);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: COLORS.lightGray, margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {/* Editor Sidebar */}
      <div style={{
        width: '350px',
        backgroundColor: COLORS.darkBlue,
        color: COLORS.white,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        boxShadow: '2px 0 15px rgba(0,0,0,0.15)',
        zIndex: 10
      }}>
        <div>
          <h1 style={{ color: COLORS.accentBlue, margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>The Lab</h1>
          <p style={{ color: COLORS.tanAccent, margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Coffin Configurator Alpha</p>
        </div>

        {/* Coffin Material Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Coffin Material</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ColorSwatch color="#FFFFFF" name="White Marble" active={coffinMaterial === 'White Marble'} onClick={() => setCoffinMaterial('White Marble')} />
            <ColorSwatch color="#111111" name="Black Marble" active={coffinMaterial === 'Black Marble'} onClick={() => setCoffinMaterial('Black Marble')} />
          </div>
        </div>

        {/* Metal Cover Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Metal</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ColorSwatch color="#a06127" name="Bronze" active={metalColor === '#a06127'} onClick={() => setMetalColor('#a06127')} />
            <ColorSwatch color="#6b6b6b" name="Stainless Steel" active={metalColor === '#6b6b6b'} onClick={() => setMetalColor('#6b6b6b')} />
            <ColorSwatch color="#8B4513" name="Copper" active={metalColor === '#8B4513'} onClick={() => setMetalColor('#8B4513')} />
          </div>
        </div>

        {/* Handles Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Handles</h3>
          <select 
            value={handles} 
            onChange={(e) => setHandles(e.target.value)}
            style={selectStyles}
          >
            <option value="none">None</option>
            <option value="standard">Standard Brass</option>
            <option value="ornate">Ornate Premium</option>
          </select>
        </div>

        {/* Ornaments Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Ornaments</h3>
          <select 
            value={ornament} 
            onChange={(e) => setOrnament(e.target.value)}
            style={selectStyles}
          >
            <option value="none">None</option>
            <option value="cross">Classic Cross</option>
            <option value="rose">Bronze Rose</option>
          </select>
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: 'auto' }}>
          <button style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: COLORS.accentBlue,
            color: COLORS.white,
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s ease'
          }}>
            Save Configuration
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [2.02, 0.86, 1.68], fov: 45 }}>
          <color attach="background" args={[COLORS.lightGray]} />
          {/* <Environment preset="city" /> */}
          {<Environment preset="city" environmentIntensity={1} />}
          
          <Suspense fallback={null}>
            {/* Connecting UI State to the 3D Model Props */}
            <CoffinModel 
              coffinMaterial={coffinMaterial} 
              metalColor={metalColor} 
              handles={handles} 
              ornament={ornament} 
            />
          </Suspense>
          
          <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={10} blur={2} far={4} />
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.1} 
            onChange={(e) => console.log("Camera Position:", e.target.object.position.x.toFixed(2), e.target.object.position.y.toFixed(2), e.target.object.position.z.toFixed(2))}
          />
        </Canvas>
      </div>
    </div>
  );
}

// Custom Reusable Color Swatch Component
function ColorSwatch({ color, name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={name}
      style={{
        width: '45px', height: '45px', borderRadius: '50%',
        backgroundColor: color,
        border: active ? `3px solid ${COLORS.accentBlue}` : `2px solid ${COLORS.tanAccent}`,
        cursor: 'pointer',
        boxShadow: active ? `0 0 10px ${COLORS.accentBlue}` : 'none',
        transition: 'all 0.2s ease'
      }}
    />
  );
}

// Reusable styles for our dropdown selects
const selectStyles = { padding: '0.8rem', backgroundColor: COLORS.tanAccent, color: COLORS.darkBlue, border: 'none', borderRadius: '6px', outline: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' };