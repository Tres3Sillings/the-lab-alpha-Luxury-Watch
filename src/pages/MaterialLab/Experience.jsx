import React, { Suspense, useRef, useState, useEffect } from "react"; // Added useEffect
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  MeshTransmissionMaterial, 
  Float,
  Grid,
  PositionalAudio // Moved import to top for clarity
} from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { useControls, Leva } from "leva";

import Overlay from "./components/Overlay";
import Loader from "./components/Loader";

import "./components/SlimeMaterial"; 
import "./components/MaterialLab.css";

function SlimeSphere() {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  const slimeConfig = useControls("Bio-Slime", {
    color: "#00ff88",
    glowColor: "#003311",
  });

  return (
    <mesh position={[1.5, 0, 0]}>
      <sphereGeometry args={[1, 128, 128]} /> 
      <slimeMaterialImpl 
        ref={materialRef} 
        uColor={slimeConfig.color} 
        uGlowColor={slimeConfig.glowColor} 
      />
    </mesh>
  );
}

function IceCrystal() {
  const glassConfig = useControls("Ice Crystal", {
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.05, min: 0, max: 1 },
    thickness: { value: 4, min: 0, max: 10 },
    ior: { value: 1.31, min: 1, max: 2.3 }, 
    chromaticAberration: { value: 0.2, min: 0, max: 1 },
    color: "#e0f7fa",
  });

  return (
    <mesh position={[-1.5, 0, 0]}>
      <icosahedronGeometry args={[1, 0]} /> 
      <MeshTransmissionMaterial 
        {...glassConfig} 
        backside 
        samples={16} 
        resolution={512}
      />
    </mesh>
  );
}

const Scanner = React.forwardRef(({ isGlitching }, ref) => {
  const soundRef = useRef();

  // Play sound only when the glitch starts
  useEffect(() => {
    if (isGlitching && soundRef.current) {
      soundRef.current.stop(); 
      soundRef.current.play();
    }
  }, [isGlitching]);

  return (
    <mesh ref={ref} rotation-x={Math.PI / 2}>
      <torusGeometry args={[4, 0.01, 16, 100]} />
      <meshBasicMaterial 
        color={isGlitching ? "#fff" : "#00ff88"} 
        transparent 
        opacity={isGlitching ? 0.8 : 0.5} 
      />
      <Suspense fallback={null}>
        <PositionalAudio
          ref={soundRef}
          url="/glitch.mp3" 
         distance={0.1}    // Lowered from 10: makes it quieter as it moves away
         volume={0.01}    // Sets the base volume to 20%
         loop={false}
        />
      </Suspense>
    </mesh>
  );
});

function Scene({ onScannerHit, isGlitching }) {
  const scannerRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const yPos = Math.sin(t * 0.5) * 2.5;
    
    if (scannerRef.current) {
      scannerRef.current.position.y = yPos;

      if (Math.abs(yPos) < 0.2) {
        if (!isGlitching) onScannerHit(true);
      } else {
        if (isGlitching) onScannerHit(false);
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#030303"]} />
      <OrbitControls makeDefault enablePan={false} maxDistance={10} minDistance={3} />
      <Environment preset="studio" />
      
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        color="#00ff88" 
        castShadow 
      />
      
      {/* Fixed: Pass isGlitching here so the audio knows when to trigger */}
      <Scanner ref={scannerRef} isGlitching={isGlitching} />

      <Grid 
        position={[0, -2, 0]} 
        args={[10, 10]} 
        sectionColor="#00ff88" 
        cellColor="#050505" 
        sectionSize={2} 
        fadeDistance={20} 
        infiniteGrid 
      />

      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <IceCrystal />
        <SlimeSphere />
      </Float>

      <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2} far={4.5} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.2} radius={0.4} />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </>
  );
}

export default function Experience() {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <div className="lab-container" style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Leva 
        style={{ top: '80px', right: '20px' }}
        theme={{
          colors: {
            accent1: '#00ff88',
            accent2: '#003311',
            accent3: '#004422',
            elevation1: '#050505',
            elevation2: '#0a0a0a',
            elevation3: '#111111',
            highlight1: '#00ff88',
            text_main: '#00ff88',
            text_secondary: '#004422',
          },
          fonts: {
            mono: '"Courier New", Courier, monospace',
            sans: '"Courier New", Courier, monospace',
          },
          sizes: {
            rootWidth: '280px',
            controlWidth: '100px',
          }
        }}
      />
      <Overlay isGlitching={isGlitching}/> 
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={<Loader />}>
          <Scene onScannerHit={setIsGlitching} isGlitching={isGlitching} />
        </Suspense>
      </Canvas>
    </div>
  );
}