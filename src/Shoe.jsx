import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Shoethelab({ partColors, ...props }) {
  // Assuming you re-ran: npx gltfjsx public/Shoethelab.glb
  // and now have nodes.Swoosh_R
  const { nodes, materials } = useGLTF('/Shoethelab.glb')
  
  const shoeRef = useRef()
  const soleRef = useRef()
  const lacesRef = useRef()
  const swooshRef = useRef()

  useFrame((state, delta) => {
    // Smoothly lerp each part to its specific assigned color
    shoeRef.current.color.lerp(new THREE.Color(partColors.Upper), delta * 4)
    soleRef.current.color.lerp(new THREE.Color(partColors.Sole), delta * 4)
    lacesRef.current.color.lerp(new THREE.Color(partColors.Laces), delta * 4)
    if (swooshRef.current) {
        swooshRef.current.color.lerp(new THREE.Color(partColors.Swoosh), delta * 4)
    }
  })

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Laces_R.geometry}>
        <meshStandardMaterial ref={lacesRef} {...materials.MAT_Laces_R} />
      </mesh>
      <mesh geometry={nodes.Shoe_R.geometry}>
        <meshStandardMaterial ref={shoeRef} {...materials.MAT_Shoe_R} />
      </mesh>
      <mesh geometry={nodes.Sole_R.geometry}>
        <meshStandardMaterial ref={soleRef} {...materials.MAT_Sole_R} />
      </mesh>
      {/* New Swoosh Mesh */}
      {nodes.Swoosh_R && (
        <mesh geometry={nodes.Swoosh_R.geometry}>
          <meshStandardMaterial ref={swooshRef} />
        </mesh>
      )}
    </group>
  )
}

const COLOR_PALETTE = [
  { name: 'Midnight', hex: '#1a1a1a' },
  { name: 'Crimson', hex: '#C8102E' },
  { name: 'Volt', hex: '#DFFF00' },
  { name: 'Royal', hex: '#4169E1' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Silver', hex: '#C0C0C0' },
]

export default function Shoe() {
  const [activePart, setActivePart] = useState('Upper')
  
  // Object to track color for EVERY part independently
  const [partColors, setPartColors] = useState({
    Upper: '#1a1a1a',
    Sole: '#ffffff',
    Laces: '#1a1a1a',
    Swoosh: '#C8102E'
  })

  // Helper to find the name of the hex color for the UI display
  const currentColorName = COLOR_PALETTE.find(c => c.hex === partColors[activePart])?.name || 'Custom'

  const handleColorChange = (hex) => {
    setPartColors(prev => ({
      ...prev,
      [activePart]: hex // Update only the currently active part
    }))
  }

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* LEFT: 3D Section */}
      <div className="relative w-full md:w-3/4 h-[60vh] md:h-full bg-[#050505]">
        <div className="absolute top-8 left-8 z-10">
          <Link to="/home" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">
            ← THE LAB / ALPHA
          </Link>
          <h1 className="text-5xl font-black italic uppercase mt-2 tracking-tighter leading-none">
            NIKE AIR <br /> <span className="text-zinc-800">LAB-01</span>
          </h1>
        </div>

        <Canvas shadows camera={{ position: [0, 0, 0.8], fov: 35 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow />
          <React.Suspense fallback={null}>
            <Shoethelab 
              partColors={partColors} 
              rotation={[0, -Math.PI / 4, 0]} 
              position={[0, -0.05, 0]}
            />
            <Environment preset="studio" />
            <ContactShadows position={[0, -0.12, 0]} opacity={0.5} scale={2} blur={2} />
          </React.Suspense>
          <OrbitControls makeDefault enablePan={false} />
        </Canvas>

        <div className="absolute bottom-10 left-10">
           <p className="text-4xl font-black">$190.00</p>
           <p className="text-[10px] tracking-widest uppercase text-zinc-500">
             Editing: <span className="text-white">{activePart}</span> — {currentColorName}
           </p>
        </div>
      </div>

      {/* RIGHT: UI Section */}
      <div className="w-full md:w-1/4 bg-zinc-950 p-10 flex flex-col justify-between border-l border-white/5">
        <div>
          <header className="mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 mb-2">Configurator</h2>
            <div className="h-[1px] w-12 bg-blue-600"></div>
          </header>

          <section className="mb-12">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Select Part</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(partColors).map(part => (
                <button
                  key={part}
                  onClick={() => setActivePart(part)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activePart === part ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">{activePart} Color</p>
            <div className="grid grid-cols-5 gap-3">
              {COLOR_PALETTE.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.hex)}
                  className={`w-full aspect-square rounded-xl border-2 transition-transform active:scale-90 ${
                    partColors[activePart] === color.hex ? 'border-blue-600 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </section>
        </div>

        <button className="w-full bg-white text-black py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}