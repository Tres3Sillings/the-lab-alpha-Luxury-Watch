import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

import Scene from "./components/Scene";
import Terminal from "./components/Terminal";

// Initialize the Theatre.js studio ONLY in development mode
// This keeps your final Awwwards build lightweight and fast
if (process.env.NODE_ENV === 'development') {
  studio.initialize();
  studio.extend(extension);
}

// Create a Theatre.js project and sheet
const project = getProject("Forbidden_Archive");
const mainSheet = project.sheet("Main_Stylist_Scene");

export default function Experience() {
  // activeOutfit starts empty (or with a base layer) so Mr. Whisper starts bare
  const [activeOutfit, setActiveOutfit] = useState([]);
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <div className="lab-container" style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      
      {/* 1. The Terminal handles the AI logic and updates state */}
      <Terminal onOutfitChange={setActiveOutfit} setGlitch={setIsGlitching} />
      
      {/* 2. The Canvas renders the 3D environment */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <SheetProvider sheet={mainSheet}>
          <Suspense fallback={null}>
            {/* 3. Pass the state down so the Scene knows what to render */}
            <Scene activeOutfit={activeOutfit} isGlitching={isGlitching} />
          </Suspense>
        </SheetProvider>
      </Canvas>
    </div>
  );
}