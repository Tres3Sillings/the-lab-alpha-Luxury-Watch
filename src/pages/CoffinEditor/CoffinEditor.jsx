import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ConfiguratorCanvas from './components/ConfiguratorCanvas';

export default function CoffinEditor() {
  // State for coffin configuration
  const [coffinMaterial, setCoffinMaterial] = useState('White Marble');
  const [metalColor, setMetalColor] = useState('Bronze');
  const [handles, setHandles] = useState('standard');
  const [handleColor, setHandleColor] = useState('Bronze');
  const [ornament, setOrnament] = useState('cross');
  const [nameplate, setNameplate] = useState('standard');
  const [decalImage, setDecalImage] = useState(null);

  // Refs for 3D scene
  const glRef = useRef();
  const cameraRef = useRef();
  const sceneRef = useRef();
  const controlsRef = useRef();

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <Sidebar
        coffinMaterial={coffinMaterial} setCoffinMaterial={setCoffinMaterial}
        metalColor={metalColor} setMetalColor={setMetalColor}
        handles={handles} setHandles={setHandles}
        handleColor={handleColor} setHandleColor={setHandleColor}
        ornament={ornament} setOrnament={setOrnament}
        nameplate={nameplate} setNameplate={setNameplate}
        decalImage={decalImage} setDecalImage={setDecalImage}
        glRef={glRef}
      />
      <ConfiguratorCanvas
        coffinMaterial={coffinMaterial}
        metalColor={metalColor}
        handles={handles}
        handleColor={handleColor}
        ornament={ornament}
        nameplate={nameplate}
        decalImage={decalImage}
        glRef={glRef}
        cameraRef={cameraRef}
        sceneRef={sceneRef}
        controlsRef={controlsRef}
        editorMode={'main'} // Keep camera controls enabled
      />
    </div>
  );
}