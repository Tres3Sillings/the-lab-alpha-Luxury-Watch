import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, OrbitControls, useProgress } from '@react-three/drei' // Added useProgress
import * as THREE from 'three'

// --- 1. The Loader Component ---
function ShoeLoader() {
  const { active } = useProgress()
  if (!active) return null

  return (
    <div className="loader-shoe-container">
      <svg 
        width="200"  // Controls the size on screen (adjust as needed)
        viewBox="0 0 1000 356" // Matches your new SVG's dimensions
        className="overflow-visible"
      >
        <path 
          className="nike-swoosh-path" 
          // I removed fill="#000" so CSS can control the color
          d="M 125.35 356.00 L 116.80 356.00 C 107.86 355.71 96.04 355.19 86.77 353.25 Q 80.64 351.97 73.81 350.00 Q 56.93 345.13 42.85 335.64 Q 36.94 331.66 31.71 326.45 Q 25.76 320.52 21.70 315.76 C 14.87 307.78 8.98 297.61 5.62 286.64 Q 2.69 277.06 1.87 272.93 Q 0.35 265.18 0.00 253.36 L 0.00 244.80 C 0.67 239.10 0.97 233.03 1.83 227.77 Q 5.44 205.70 13.33 184.81 Q 25.78 151.86 45.33 121.57 Q 54.76 106.97 59.22 100.97 Q 83.44 68.41 102.61 46.59 Q 115.31 32.14 144.21 0.39 A 0.09 0.09 0.0 0 1 144.36 0.49 C 138.93 9.86 133.52 19.16 128.77 29.47 Q 118.06 52.77 112.37 73.30 Q 105.72 97.30 106.41 120.99 Q 106.85 135.83 112.37 150.96 Q 118.45 167.63 131.56 180.98 Q 141.89 191.49 154.51 197.20 C 157.03 198.34 162.19 200.71 166.10 201.83 Q 179.98 205.77 190.00 206.75 C 200.43 207.77 214.20 207.95 226.32 206.79 Q 242.39 205.25 254.75 203.02 Q 263.94 201.36 282.65 196.40 Q 559.52 122.95 997.91 6.58 A 0.32 0.17 -21.9 0 1 998.16 6.61 Q 998.19 6.64 998.21 6.66 A 0.08 0.06 -22.8 0 1 998.16 6.75 Q 482.94 227.10 298.40 305.93 Q 280.26 313.68 252.10 325.05 Q 225.13 335.95 197.12 343.85 Q 161.90 353.78 125.35 356.00 Z"
        />
      </svg>
    </div>
  )
}

// --- 2. The Model Component (Unchanged) ---
function Shoethelab({ partColors, ...props }) {
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
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sole_R.geometry} ref={setRef('Sole')}><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Sole_Inside_R.geometry} ref={setRef('Insole')}><meshStandardMaterial {...materials.MAT_Sole_R} /></mesh>
      <mesh geometry={nodes.Base_R.geometry} ref={setRef('Base')}><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.High_Top_R.geometry} ref={setRef('Collar')}><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Leather_1_R.geometry} ref={setRef('Overlay')}><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Straps_R.geometry} ref={setRef('Straps')}><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Swoosh_R.geometry} ref={setRef('Swoosh')}><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Lace_Holder_R.geometry} ref={setRef('Eyelets')}><meshStandardMaterial {...materials.MAT_Shoe_R} /></mesh>
      <mesh geometry={nodes.Laces_R.geometry} ref={setRef('Laces')}><meshStandardMaterial {...materials.MAT_Laces_R} /></mesh>
    </group>
  )
}

// Logical Grouping
const SECTIONS = {
  'Base': ['Base', 'Collar', 'Insole'],
  'Overlays': ['Overlay', 'Straps'],
  'Accents': ['Swoosh', 'Laces', 'Eyelets'],
  'Sole': ['Sole']
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

export default function Shoe() {
  const [activeSection, setActiveSection] = useState('Base')
  const [activePart, setActivePart] = useState('Base')
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

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* --- ADD THE LOADER HERE --- */}
      <ShoeLoader />

      {/* LEFT: 3D Viewport */}
      <div className="relative w-full md:w-3/4 h-[60vh] md:h-full bg-[#050505]">
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <Link to="/home" className="pointer-events-auto text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">
            ← THE LAB / ALPHA
          </Link>
          <h1 className="text-6xl font-black italic uppercase mt-2 tracking-tighter leading-none">
            NIKE AIR <br /> <span className="text-zinc-800">LAB-01</span>
          </h1>
        </div>

        <Canvas shadows camera={{ position: [0, 0, 0.6], fov: 40 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow />
          <spotLight position={[-5, 5, -5]} angle={0.15} penumbra={1} intensity={0.5} />
          
          <React.Suspense fallback={null}>
            <Shoethelab partColors={partColors} rotation={[0, -Math.PI / 4, 0]} position={[0, -0.08, 0]} />
            <Environment preset="city" />
            <ContactShadows position={[0, -0.12, 0]} opacity={0.4} scale={2} blur={2.5} />
          </React.Suspense>
          
          <OrbitControls makeDefault enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </Canvas>

        <div className="absolute bottom-10 left-10 pointer-events-none">
           <p className="text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Editing</p>
           <p className="text-4xl font-black text-white">{activePart}</p>
           <p className="text-xs text-zinc-500 font-mono mt-1 uppercase">{partColors[activePart]}</p>
        </div>
      </div>

      {/* RIGHT: Configurator UI */}
      <div className="w-full md:w-1/4 bg-zinc-950 flex flex-col border-l border-white/5 shadow-2xl z-20">
        
        {/* Category Tabs */}
        <div className="flex border-b border-white/10">
          {Object.keys(SECTIONS).map(section => (
            <button
              key={section}
              onClick={() => { setActiveSection(section); setActivePart(SECTIONS[section][0]); }}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeSection === section ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Part Sub-Selection */}
        <div className="p-8 pb-0">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Select Part</p>
          <div className="flex flex-wrap gap-2">
            {SECTIONS[activeSection].map(part => (
              <button
                key={part}
                onClick={() => setActivePart(part)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                  activePart === part 
                    ? 'border-white bg-white/10 text-white' 
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        {/* Color Grid */}
        <div className="p-8 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Material Color</p>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_COLORS.map(color => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.hex)}
                className={`group relative w-full aspect-square rounded-xl transition-transform active:scale-95 flex items-center justify-center ${
                  partColors[activePart] === color.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}

            <button
              onClick={() => colorPickerRef.current.click()}
              className="relative w-full aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-white transition-colors flex items-center justify-center group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 opacity-20 group-hover:opacity-40 transition-opacity" />
              <span className="text-xl font-bold text-white z-10">+</span>
              <input 
                ref={colorPickerRef}
                type="color" 
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </button>
          </div>
        </div>

        <div className="p-8 border-t border-white/10 bg-zinc-900/50">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Total</p>
              <p className="text-2xl font-bold">$215.00</p>
            </div>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

useGLTF.preload('/Shoethelab.glb')