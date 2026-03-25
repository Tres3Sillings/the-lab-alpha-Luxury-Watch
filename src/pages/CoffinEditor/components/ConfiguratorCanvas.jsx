import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment, ContactShadows, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Model as CoffinModel } from './Coffin';
import { COLORS, METAL_COLORS } from '../constants';

function Panel3D({ position, width, height, scale = 1, children }) {
  return (
    <group position={position} scale={scale}>
      <RoundedBox 
        args={[width, height, 0.02]} 
        radius={0.05} 
        smoothness={4} 
        position={[0, 0, -0.02]} 
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
        onPointerOut={(e) => e.stopPropagation()}
      >
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.2} metalness={0.1} />
      </RoundedBox>
      {children}
    </group>
  );
}

function ColorSwatch3D({ position, color, active, onClick, name }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <mesh 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {(active || hovered) && (
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.095, 32]} />
          <meshBasicMaterial color={active ? "#3b82f6" : "#9ca3af"} />
        </mesh>
      )}
      {hovered && (
        <Text raycast={() => null} position={[0, -0.15, 0]} fontSize={0.05} color="#374151" anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#ffffff">
          {name}
        </Text>
      )}
    </group>
  );
}

function TextButton3D({ position, text, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <mesh 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[0.4, 0.12]} />
        <meshStandardMaterial color={active ? "#3b82f6" : (hovered ? "#e5e7eb" : "#ffffff")} />
      </mesh>
      <Text raycast={() => null} position={[0, 0, 0.01]} fontSize={0.04} color={active ? "#ffffff" : "#374151"} anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  );
}

export default function ConfiguratorCanvas({
  coffinMaterial, setCoffinMaterial,
  metalColor, setMetalColor,
  handles, setHandles,
  handleColor, setHandleColor,
  ornament, setOrnament,
  nameplate, setNameplate,
  nameplateColor, setNameplateColor,
  ornamentColor, setOrnamentColor,
  decalImage,
  editorMode, glRef, cameraRef, sceneRef, controlsRef,
  activeHotspot, setActiveHotspot, isExporting
}) {

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Smooth camera animations to focus on the active hotspot
  useEffect(() => {
    if (!controlsRef.current || editorMode !== 'main') return;
    const controls = controlsRef.current;

    if (activeHotspot === 'material') {
      controls.setLookAt(0, 1.5, isMobile ? 3.2 : 2.5, 0, 0, 0, true);
    } else if (activeHotspot === 'metal') {
      controls.setLookAt(0, 0.59, isMobile ? 2.6 : 2.27, 0, 0, 0.5, true);
    } else if (activeHotspot === 'handles') {
      controls.setLookAt(isMobile ? 1.2 : 0.933, isMobile ? 0.6 : 0.471, isMobile ? 1.1 : 0.788, 0.508, 0.258, 0.363, true);
    } else if (activeHotspot === 'nameplate') {
      controls.setLookAt(isMobile ? -0.526 : -0.315, isMobile ? 0.8 : 0.650, isMobile ? 1.2 : 0.942, -0.665, 0.218, 0.654, true);
    } else if (activeHotspot === 'ornament') {
      controls.setLookAt(isMobile ? 0 : 0.572, isMobile ? 1.5 : 0.475, isMobile ? 1.3 : 1.0, 0.3, 0.1, 0.49, true);
    } else {
      controls.setLookAt(isMobile ? 2.5 : 2.02, isMobile ? 1.1 : 0.86, isMobile ? 2.4 : 1.68, 0, 0, 0, true);
    }
  }, [activeHotspot, editorMode, controlsRef]);

  // --- 3D Popup UIs ---
  const materialOptions = (
    <Panel3D position={isMobile ? [0, 0.25, 0] : [0.2, 0, 0]} width={0.5} height={0.25} scale={isMobile ? 0.8 : 1}>
      <ColorSwatch3D position={[-0.12, 0, 0]} color="#FFFFFF" name="White Marble" active={coffinMaterial === 'White Marble'} onClick={() => setCoffinMaterial('White Marble')} />
      <ColorSwatch3D position={[0.12, 0, 0]} color="#111111" name="Black Marble" active={coffinMaterial === 'Black Marble'} onClick={() => setCoffinMaterial('Black Marble')} />
    </Panel3D>
  );

  const metalOptions = (
    <Panel3D position={isMobile ? [0, 0.25, 0] : [0.3, -0.2, 0]} width={0.7} height={0.25} scale={isMobile ? 0.8 : 1}>
      <ColorSwatch3D position={[-0.22, 0, 0]} color={METAL_COLORS['Bronze']} name="Bronze" active={metalColor === 'Bronze'} onClick={() => setMetalColor('Bronze')} />
      <ColorSwatch3D position={[0, 0, 0]} color={METAL_COLORS['Stainless Steel']} name="Stainless Steel" active={metalColor === 'Stainless Steel'} onClick={() => setMetalColor('Stainless Steel')} />
      <ColorSwatch3D position={[0.22, 0, 0]} color={METAL_COLORS['Copper']} name="Copper" active={metalColor === 'Copper'} onClick={() => setMetalColor('Copper')} />
    </Panel3D>
  );

  const handleOptions = (
    <Panel3D position={isMobile ? [0, 0.25, 0] : [-0.1, 0, 0]} width={handles !== 'none' ? 0.9 : 0.45} height={0.7} scale={isMobile ? 0.35 : 0.25}>
      <group position={handles !== 'none' ? [-0.2, 0, 0] : [0, 0, 0]}>
        <TextButton3D position={[0, 0.2, 0]} text="No Handles" active={handles === 'none'} onClick={() => setHandles('none')} />
        <TextButton3D position={[0, 0.05, 0]} text="Standard" active={handles === 'standard'} onClick={() => setHandles('standard')} />
        <TextButton3D position={[0, -0.1, 0]} text="Ornate" active={handles === 'ornate'} onClick={() => setHandles('ornate')} />
        <TextButton3D position={[0, -0.25, 0]} text="Plastic" active={handles === 'plastic'} onClick={() => setHandles('plastic')} />
      </group>
      
      {handles !== 'none' && (
        <group position={[0.2, 0, 0]}>
          <ColorSwatch3D position={[0, 0.2, 0]} color={METAL_COLORS['Bronze']} name="Bronze" active={handleColor === 'Bronze'} onClick={() => setHandleColor('Bronze')} />
          <ColorSwatch3D position={[0, 0, 0]} color={METAL_COLORS['Stainless Steel']} name="Stainless Steel" active={handleColor === 'Stainless Steel'} onClick={() => setHandleColor('Stainless Steel')} />
          <ColorSwatch3D position={[0, -0.2, 0]} color={METAL_COLORS['Copper']} name="Copper" active={handleColor === 'Copper'} onClick={() => setHandleColor('Copper')} />
        </group>
      )}
    </Panel3D>
  );

  const nameplateOptions = (
    <Panel3D position={isMobile ? [0, 0.25, 0] : [-0.476, 0, 0]} width={nameplate !== 'none' ? 0.9 : 0.45} height={0.55} scale={isMobile ? 0.35 : 0.25}>
      <group position={nameplate !== 'none' ? [-0.2, 0, 0] : [0, 0, 0]}>
        <TextButton3D position={[0, 0.15, 0]} text="No Nameplate" active={nameplate === 'none'} onClick={() => setNameplate('none')} />
        <TextButton3D position={[0, 0, 0]} text="Standard" active={nameplate === 'standard'} onClick={() => setNameplate('standard')} />
        <TextButton3D position={[0, -0.15, 0]} text="Ornate" active={nameplate === 'ornate'} onClick={() => setNameplate('ornate')} />
      </group>
      {nameplate !== 'none' && (
        <group position={[0.2, 0, 0]}>
          <ColorSwatch3D position={[0, 0.15, 0]} color={METAL_COLORS['Bronze']} name="Bronze" active={nameplateColor === 'Bronze'} onClick={() => setNameplateColor('Bronze')} />
          <ColorSwatch3D position={[0, 0, 0]} color={METAL_COLORS['Stainless Steel']} name="Stainless Steel" active={nameplateColor === 'Stainless Steel'} onClick={() => setNameplateColor('Stainless Steel')} />
          <ColorSwatch3D position={[0, -0.15, 0]} color={METAL_COLORS['Copper']} name="Copper" active={nameplateColor === 'Copper'} onClick={() => setNameplateColor('Copper')} />
        </group>
      )}
    </Panel3D>
  );

  const ornamentOptions = (
    <Panel3D position={isMobile ? [0, 0.25, 0] : [0.25, 0.02, 0]} width={ornament !== 'none' ? 0.9 : 0.45} height={0.7} scale={isMobile ? 0.35 : 0.25}>
      <group position={ornament !== 'none' ? [-0.2, 0, 0] : [0, 0, 0]}>
        <TextButton3D position={[0, 0.2, 0]} text="No Ornament" active={ornament === 'none'} onClick={() => setOrnament('none')} />
        <TextButton3D position={[0, 0.05, 0]} text="Cross" active={ornament === 'cross'} onClick={() => setOrnament('cross')} />
        <TextButton3D position={[0, -0.1, 0]} text="Rose" active={ornament === 'rose'} onClick={() => setOrnament('rose')} />
        <TextButton3D position={[0, -0.25, 0]} text="Wreath" active={ornament === 'wreath'} onClick={() => setOrnament('wreath')} />
      </group>
      {ornament !== 'none' && (
        <group position={[0.2, 0, 0]}>
          <ColorSwatch3D position={[0, 0.2, 0]} color={METAL_COLORS['Bronze']} name="Bronze" active={ornamentColor === 'Bronze'} onClick={() => setOrnamentColor('Bronze')} />
          <ColorSwatch3D position={[0, 0, 0]} color={METAL_COLORS['Stainless Steel']} name="Stainless Steel" active={ornamentColor === 'Stainless Steel'} onClick={() => setOrnamentColor('Stainless Steel')} />
          <ColorSwatch3D position={[0, -0.2, 0]} color={METAL_COLORS['Copper']} name="Copper" active={ornamentColor === 'Copper'} onClick={() => setOrnamentColor('Copper')} />
        </group>
      )}
    </Panel3D>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: isMobile ? [2.696, 0.924, 3.395] : [2.02, 0.86, 1.68], fov: 45 }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl, camera, scene }) => {
          glRef.current = gl;
          cameraRef.current = camera;
          sceneRef.current = scene;
        }}
        onPointerMissed={() => setActiveHotspot(null)} // Clicking empty space closes popups
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
            nameplate={nameplate}
            nameplateColor={METAL_COLORS[nameplateColor] || METAL_COLORS['Bronze']}
            ornamentColor={METAL_COLORS[ornamentColor] || METAL_COLORS['Bronze']}
            decalImage={decalImage}
            activeHotspot={activeHotspot}
            setActiveHotspot={setActiveHotspot}
            isExporting={isExporting}
            materialOptions={materialOptions}
            metalOptions={metalOptions}
            handleOptions={handleOptions}
            nameplateOptions={nameplateOptions}
            ornamentOptions={ornamentOptions}
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
          onChange={(e) => {
            const cam = e.target.camera.position;
            const tar = e.target._target;
            console.log(`controls.setLookAt(${cam.x.toFixed(3)}, ${cam.y.toFixed(3)}, ${cam.z.toFixed(3)}, ${tar.x.toFixed(3)}, ${tar.y.toFixed(3)}, ${tar.z.toFixed(3)}, true);`);
          }}
        />
      </Canvas>
    </div>
  );
}