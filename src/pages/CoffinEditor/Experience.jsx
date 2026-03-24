import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import Sidebar from './components/Sidebar';
import ConfiguratorCanvas from './components/ConfiguratorCanvas';
import { COLORS } from './constants';

export default function Experience() {
  const queryParams = new URLSearchParams(window.location.search);

  // Configuration states
  const [coffinMaterial, setCoffinMaterial] = useState(queryParams.get('material') || 'White Marble');
  const [metalColor, setMetalColor] = useState(queryParams.get('metal') || 'Bronze');
  const [handles, setHandles] = useState(queryParams.get('handles') || 'standard');
  const [handleColor, setHandleColor] = useState(queryParams.get('handleColor') || 'Bronze');
  const [ornament, setOrnament] = useState(queryParams.get('ornament') || 'none');
  const [decalImage, setDecalImage] = useState(null);
  const [editorMode, setEditorMode] = useState('main'); // Tracks which UI screen we are on

  const glRef = useRef(null);
  const cameraRef = useRef(null);
  const staticCameraRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('material', coffinMaterial);
    params.set('metal', metalColor);
    params.set('handles', handles);
    params.set('handleColor', handleColor);
    params.set('ornament', ornament);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [coffinMaterial, metalColor, handles, handleColor, ornament]);

  useEffect(() => {
    console.log("Current Coffin Material selected:", coffinMaterial);
  }, [coffinMaterial]);

  // Fluid camera animations between modes
  const handleEnterDecalMode = () => {
    setEditorMode('decal');
    if (controlsRef.current) {
      controlsRef.current.setLookAt(
          -0.01, 1.11, 1.36, // camera position
          -0.01, 0.00, 0.51,  // target position
        true               // enable smooth transition
      );
    }
  };

  const handleExitDecalMode = () => {
    setEditorMode('main');
    if (controlsRef.current) {
      controlsRef.current.setLookAt(
        2.02, 0.86, 1.68, // original camera position
        0, 0, 0,          // original target position
        true              // enable smooth transition
      );
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: COLORS.lightGray, margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      <Sidebar 
        coffinMaterial={coffinMaterial} setCoffinMaterial={setCoffinMaterial}
        metalColor={metalColor} setMetalColor={setMetalColor}
        handles={handles} setHandles={setHandles}
        handleColor={handleColor} setHandleColor={setHandleColor}
        ornament={ornament} setOrnament={setOrnament}
        decalImage={decalImage} setDecalImage={setDecalImage}
        editorMode={editorMode}
        handleEnterDecalMode={handleEnterDecalMode}
        glRef={glRef}
      />

      <ConfiguratorCanvas 
        coffinMaterial={coffinMaterial}
        metalColor={metalColor}
        handleColor={handleColor}
        handles={handles}
        ornament={ornament}
        decalImage={decalImage}
        editorMode={editorMode}
        glRef={glRef}
        cameraRef={cameraRef}
        sceneRef={sceneRef}
        controlsRef={controlsRef}
      />
    </div>
  );
}