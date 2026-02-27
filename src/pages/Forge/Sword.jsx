import React, { useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, OrbitControls, Html, useProgress } from '@react-three/drei'
import { SwordModel } from '../../components/SwordTheLab.jsx'
import './Forge.css'
// --- 1. LOADER ---
function Loader() {
  const { progress } = useProgress()
  return <Html center><div className="text-[#d4af37] font-serif text-xl animate-pulse">{progress.toFixed(0)}%</div></Html>
}

// --- 2. ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return <Html center>
        <div className="text-red-500 font-mono text-xs bg-black p-2 border border-red-500">
          Error: Model not found
        </div>
      </Html>
    }
    return this.props.children
  }
}

// --- 3. MAIN COMPONENT ---
export default function SwordBuilder() {
  const [activeTab, setActiveTab] = useState('blade')
  const [config, setConfig] = useState({
    blade: 1,
    hilt: 1,
    handle: 1,
    color: '#ffffff'
  })

  const colors = [
    { name: 'Steel', hex: '#ffffff' },
    { name: 'Void', hex: '#2a2a2a' },
    { name: 'Blood', hex: '#8a0b0b' },
    { name: 'Gold', hex: '#d4af37' },
    { name: 'Emerald', hex: '#0f5e36' },
  ]

  return (
    <div className="h-screen w-full bg-[#1a1a1a] text-[#d4af37] font-serif flex flex-col md:flex-row overflow-hidden selection:bg-[#d4af37] selection:text-black">
      
      {/* --- LEFT PANEL: 3D VIEWPORT --- */}
      {/* Changed h-[60vh] to h-[55vh] on mobile to give the UI slightly more room */}
      <div className="relative w-full h-[55vh] md:w-3/4 md:h-full bg-radial-gradient from-[#2e2e2e] to-[#000000]">
        
        {/* Header: Smaller text and padding on mobile */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 pointer-events-none">
          <Link to="/home" className="pointer-events-auto text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-white/40 hover:text-[#d4af37] transition-colors">
            ← THE LAB / FORGE
          </Link>
          <h1 className="text-4xl md:text-6xl font-black uppercase mt-1 md:mt-2 tracking-widest text-[#d4af37] drop-shadow-lg leading-none">
            King's <br /> <span className="text-white/10">Maker</span>
          </h1>
        </div>

        <Canvas shadows camera={{ position: [1, 0, 1.5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
          <Environment preset="city" />
          
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <SwordModel 
                activeBlade={config.blade}
                activeHilt={config.hilt}
                activeHandle={config.handle}
                customColor={config.color}
                position={[0, -0.1, 0]} // Slight offset to center visually on mobile
              />
              <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={1.5} far={0.8} />
            </Suspense>
          </ErrorBoundary>

          {/* Adjusted angles to prevent looking under the floor */}
          <OrbitControls minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} enablePan={false} enableZoom={true} />
        </Canvas>
      </div>

      {/* --- RIGHT PANEL: CONTROLS --- */}
      {/* Mobile: Rounded top corners, top border. Desktop: Left border, square corners. */}
      <div className="w-full h-[45vh] md:h-full md:w-1/4 bg-[#0f0c08]/95 
                      border-t-2 md:border-t-0 md:border-l-2 border-[#d4af37] 
                      rounded-t-3xl md:rounded-none
                      flex flex-col z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#444] px-2 md:px-0 mt-2 md:mt-0">
          {['blade', 'hilt', 'handle', 'color'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg md:rounded-none
                ${activeTab === tab 
                  ? 'text-[#d4af37] bg-white/5 shadow-[0_4px_0_#d4af37]' 
                  : 'text-zinc-500 hover:text-[#d4af37]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        {/* Mobile: p-4 padding. Desktop: p-8 padding. */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <p className="text-[10px] font-sans uppercase tracking-widest text-zinc-500 mb-4 md:mb-6">
            Select {activeTab}
          </p>
          
          {/* Responsive Grid: 4 columns on mobile (1 row), 2 columns on desktop */}
          <div className={`grid gap-3 md:gap-4 ${activeTab === 'color' ? 'grid-cols-5 md:grid-cols-4' : 'grid-cols-4 md:grid-cols-2'}`}>
            {activeTab !== 'color' ? (
              // PARTS SELECTOR
              [1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setConfig({ ...config, [activeTab]: num })}
                  className={`aspect-square border border-[#444] bg-[#222] hover:bg-[#2a2510] hover:border-[#d4af37] transition-all flex items-center justify-center rounded-lg
                    ${config[activeTab] === num ? 'border-[#d4af37] bg-gradient-to-br from-[#d4af37] to-[#8a7018] text-black font-bold shadow-lg scale-105' : 'text-[#888]'}
                  `}
                >
                  <span className="text-xl md:text-2xl font-serif">
                    {num === 1 ? 'I' : num === 2 ? 'II' : num === 3 ? 'III' : 'IV'}
                  </span>
                </button>
              ))
            ) : (
              // COLOR SELECTOR
              colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setConfig({ ...config, color: c.hex })}
                  className={`aspect-square rounded-full border-2 transition-transform hover:scale-105 
                    ${config.color === c.hex ? 'border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-[#444]'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        {/* Hidden on very small screens if height is constrained, or always visible */}
        <div className="p-4 md:p-8 border-t border-[#444] bg-black/40 md:bg-black/20 pb-8 md:pb-8">
          <div className="flex justify-between items-center md:items-end">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-widest text-zinc-500">Total Gold</p>
              <p className="text-2xl md:text-3xl font-bold text-[#d4af37]">500g</p>
            </div>
            <button className="bg-[#d4af37] text-black px-6 py-3 rounded md:rounded-none font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-lg active:scale-95">
              Forge It
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

useGLTF.preload('/SwordTheLab.glb')