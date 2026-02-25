import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, OrbitControls, useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// --- 1. RESTORED SWOOSH LOADER ---
function ShoeLoader() {
  const { active } = useProgress()
  if (!active) return null

  return (
    <div className="loader-shoe-container" style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
      <svg width="200" viewBox="0 0 1000 356" className="overflow-visible">
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="nike-swoosh-path" 
          fill="none"
          stroke="#00f2ff"
          strokeWidth="5"
          d="M 125.35 356.00 L 116.80 356.00 C 107.86 355.71 96.04 355.19 86.77 353.25 Q 80.64 351.97 73.81 350.00 Q 56.93 345.13 42.85 335.64 Q 36.94 331.66 31.71 326.45 Q 25.76 320.52 21.70 315.76 C 14.87 307.78 8.98 297.61 5.62 286.64 Q 2.69 277.06 1.87 272.93 Q 0.35 265.18 0.00 253.36 L 0.00 244.80 C 0.67 239.10 0.97 233.03 1.83 227.77 Q 5.44 205.70 13.33 184.81 Q 25.78 151.86 45.33 121.57 Q 54.76 106.97 59.22 100.97 Q 83.44 68.41 102.61 46.59 Q 115.31 32.14 144.21 0.39 A 0.09 0.09 0.0 0 1 144.36 0.49 C 138.93 9.86 133.52 19.16 128.77 29.47 Q 118.06 52.77 112.37 73.30 Q 105.72 97.30 106.41 120.99 Q 106.85 135.83 112.37 150.96 Q 118.45 167.63 131.56 180.98 Q 141.89 191.49 154.51 197.20 C 157.03 198.34 162.19 200.71 166.10 201.83 Q 179.98 205.77 190.00 206.75 C 200.43 207.77 214.20 207.95 226.32 206.79 Q 242.39 205.25 254.75 203.02 Q 263.94 201.36 282.65 196.40 Q 559.52 122.95 997.91 6.58 A 0.32 0.17 -21.9 0 1 998.16 6.61 Q 998.19 6.64 998.21 6.66 A 0.08 0.06 -22.8 0 1 998.16 6.75 Q 482.94 227.10 298.40 305.93 Q 280.26 313.68 252.10 325.05 Q 225.13 335.95 197.12 343.85 Q 161.90 353.78 125.35 356.00 Z"
        />
      </svg>
    </div>
  )
}

// --- 2. MODEL (With Tap-to-Select Logic) ---
function Shoethelab({ partColors, onPartClick, ...props }) {
  const { nodes, materials } = useGLTF('/Shoethelab.glb')
  const meshRefs = useRef({})

  useFrame((state, delta) => {
    Object.keys(partColors).forEach((partName) => {
      const mesh = meshRefs.current[partName]
      if (mesh) {
        mesh.material.color.lerp(new THREE.Color(partColors[partName]), delta * 4)
      }
    })
  })

  const setRef = (name) => (el) => {
    meshRefs.current[name] = el
  }

  return (
    <group {...props} dispose={null} 
      onClick={(e) => {
        e.stopPropagation()
        // Find which part was clicked based on material/geometry names
        // Mapping internal names to our UI names
        const map = {
            'Swoosh_R': 'Swoosh', 'Base_R': 'Base', 'High_Top_R': 'Collar', 
            'Leather_1_R': 'Overlay', 'Straps_R': 'Straps', 'Laces_R': 'Laces', 
            'Sole_R': 'Sole', 'Lace_Holder_R': 'Eyelets'
        }
        // Try to match the clicked mesh name to our parts
        const foundPart = map[e.object.geometry.name] || map[e.object.name]
        if (foundPart) onPartClick(foundPart)
      }}
    >
      <mesh geometry={nodes.Sole_R.geometry} ref={setRef('Sole')} name="Sole_R"><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Sole_Inside_R.geometry} ref={setRef('Insole')} name="Insole_R"><meshStandardMaterial {...materials.MAT_Sole_R} /></mesh>
      <mesh geometry={nodes.Base_R.geometry} ref={setRef('Base')} name="Base_R"><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.High_Top_R.geometry} ref={setRef('Collar')} name="High_Top_R"><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Leather_1_R.geometry} ref={setRef('Overlay')} name="Leather_1_R"><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Straps_R.geometry} ref={setRef('Straps')} name="Straps_R"><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Swoosh_R.geometry} ref={setRef('Swoosh')} name="Swoosh_R"><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Lace_Holder_R.geometry} ref={setRef('Eyelets')} name="Lace_Holder_R"><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Laces_R.geometry} ref={setRef('Laces')} name="Laces_R"><meshStandardMaterial {...materials.MAT_Laces_R} /></mesh>
    </group>
  )
}

// --- 3. DATA ---
const SECTIONS = {
  'Base': ['Base', 'Collar', 'Insole'],
  'Overlays': ['Overlay', 'Straps'],
  'Accents': ['Swoosh', 'Laces', 'Eyelets'],
  'Sole': ['Sole']
}

// Helper to find which section a part belongs to
const findSectionForPart = (part) => {
    for (const [section, parts] of Object.entries(SECTIONS)) {
        if (parts.includes(part)) return section
    }
    return 'Base'
}

const PRESET_COLORS = [
  { name: 'Midnight', hex: '#1a1a1a' },
  { name: 'Phantom', hex: '#f0f0f0' },
  { name: 'Crimson', hex: '#C8102E' },
  { name: 'Volt', hex: '#DFFF00' },
  { name: 'Royal', hex: '#4169E1' },
  { name: 'Orange', hex: '#FF5F00' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Gold', hex: '#FFD700' },
]

// --- 4. TUTORIAL OVERLAY COMPONENT ---
function TutorialOverlay({ onComplete }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
        >
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900 border border-white/10 p-8 rounded-2xl max-w-sm w-full shadow-2xl"
            >
                <div className="flex justify-center mb-6">
                    {/* Hand Icon Animation */}
                    <motion.div 
                        animate={{ x: [-20, 20, -20], rotate: [-10, 10, -10] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-6xl"
                    >
                        👆
                    </motion.div>
                </div>
                
                <h2 className="text-2xl font-black italic uppercase text-white mb-2">Welcome to the Lab</h2>
                <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                    Rotate the shoe with one finger.<br/>
                    Tap any part directly to edit it.<br/>
                    Use the HUD below to swap colors.
                </p>

                <button 
                    onClick={onComplete}
                    className="w-full py-4 bg-[#00f2ff] text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-transform"
                >
                    Start Creating
                </button>
            </motion.div>
        </motion.div>
    )
}

// --- 5. MAIN COMPONENT ---
export default function Shoe() {
  const [activeSection, setActiveSection] = useState('Base')
  const [activePart, setActivePart] = useState('Base')
  const [showTutorial, setShowTutorial] = useState(true) // Start with Tutorial ON
  const colorPickerRef = useRef()

  const [partColors, setPartColors] = useState({
    Base: '#f0f0f0',
    Collar: '#f0f0f0',
    Insole: '#1a1a1a',
    Overlay: '#1a1a1a',
    Straps: '#1a1a1a',
    Swoosh: '#C8102E',
    Eyelets: '#C8102E',
    Laces: '#1a1a1a',
    Sole: '#ffffff'
  })

  const handleColorChange = (hex) => {
    setPartColors(prev => ({ ...prev, [activePart]: hex }))
  }

  // Handle 3D Click (Tap to Edit)
  const handlePartClick = (partName) => {
      const section = findSectionForPart(partName)
      setActiveSection(section)
      setActivePart(partName)
  }

  return (
    <div className="relative h-[100dvh] w-full bg-[#050505] text-white font-sans overflow-hidden">
      
      <ShoeLoader />
      
      {/* TUTORIAL OVERLAY */}
      <AnimatePresence>
        {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}
      </AnimatePresence>

      {/* --- LAYER 1: 3D CANVAS --- */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Canvas shadows camera={{ position: [0, 0, 0.6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow />
          <spotLight position={[-5, 5, -5]} angle={0.15} penumbra={1} intensity={0.5} />
          
          <React.Suspense fallback={null}>
            {/* CRITICAL UX FIX: 
                Moved Y position to 0.2 so the shoe floats ABOVE the bottom controls 
                This prevents the UI from covering the model on mobile.
            */}
            <Shoethelab 
                partColors={partColors} 
                onPartClick={handlePartClick}
                rotation={[0, -Math.PI / 4, 0]} 
                position={[0, 0.0, 0]} // <--- Set to 0.0 to lower it from the previous 0.2
            />
            <Environment preset="city" />
            <ContactShadows position={[0, 0.1, 0]} opacity={0.4} scale={2} blur={2.5} />
          </React.Suspense>
          
          <OrbitControls makeDefault enablePan={false} enableZoom={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>

      {/* --- LAYER 2: MINIMAL HEADER --- */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
         {/* Active Part Label (Top Left) */}
         <div className="pointer-events-auto">
             <p className="text-[8px] uppercase tracking-widest text-zinc-500 mb-1">Editing</p>
             <p className="text-3xl font-black text-white leading-none">{activePart}</p>
         </div>

         {/* Brand Logo (Top Right) */}
         <div className="text-right pointer-events-auto">
            <Link to="/home" state={{ from: 'shoe' }} className="text-[18px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors block mb-1">
            EXIT
            </Link>
            <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none text-zinc-700">
            NIKE LAB
            </h1>
         </div>
      </div>

      {/* --- LAYER 3: THE "HUD" CONTROL DECK (Mobile Optimized) --- */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        
        {/* Gradient fade so controls don't look like a hard box */}
        <div className="absolute bottom-0 w-full h-96 bg-gradient-to-t from-black via-black/90 to-transparent -z-10" />

        <div className="pointer-events-auto pb-safe px-4">
            
            {/* ROW 1: COLORS (Horizontal Scroll) */}
            <div className="mb-4">
                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x py-2 px-1">
                    {PRESET_COLORS.map(color => (
                        <button 
                        key={color.name} 
                        onClick={() => handleColorChange(color.hex)} 
                        className={`flex-none w-14 h-14 rounded-full border border-white/10 shadow-lg transform transition-all active:scale-90 ${partColors[activePart] === color.hex ? 'ring-2 ring-[#00f2ff] ring-offset-2 ring-offset-black scale-110' : ''}`} 
                        style={{ backgroundColor: color.hex }} 
                        />
                    ))}
                    <button onClick={() => colorPickerRef.current.click()} className="flex-none w-14 h-14 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center relative overflow-hidden active:scale-90">
                        <span className="text-xl text-white font-bold">+</span>
                        <input ref={colorPickerRef} type="color" className="opacity-0 absolute inset-0 w-full h-full" onChange={(e) => handleColorChange(e.target.value)} />
                    </button>
                </div>
            </div>

            {/* ROW 2: PARTS PILLS */}
            <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {SECTIONS[activeSection].map(part => (
                        <button 
                            key={part} 
                            onClick={() => setActivePart(part)} 
                            className={`flex-none px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${activePart === part ? 'border-[#00f2ff] bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.5)]' : 'border-zinc-800 text-zinc-400 bg-zinc-900/80 backdrop-blur-md'}`}
                        >
                        {part}
                        </button>
                    ))}
                </div>
            </div>

            {/* ROW 3: CATEGORY TABS (Bottom Bar) */}
            <div className="flex justify-between items-center border-t border-white/10 pt-2 pb-4">
                 <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {Object.keys(SECTIONS).map(section => (
                        <button 
                            key={section} 
                            onClick={() => { setActiveSection(section); setActivePart(SECTIONS[section][0]); }} 
                            className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeSection === section ? 'text-white' : 'text-zinc-600'}`}
                        >
                        {section}
                        </button>
                    ))}
                 </div>
                 
                 {/* Buy Button (Compact) */}
                 <button className="!bg-white !text-black px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#00f2ff] hover:shadow-[0_0_20px_rgba(0,242,255,0.8)] transition-all duration-300 ml-4 shadow-[0_0_15px_rgba(255,255,255,0.3)] pointer-events-auto">
                  $215 · BUY
                </button>
            </div>

        </div>
      </div>

    </div>
  )
}