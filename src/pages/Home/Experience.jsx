import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { SheetProvider, PerspectiveCamera, editable as e } from '@theatre/r3f'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { Model as CuriosityModel } from './Components/01-CURIOSITY.jsx'
import bgImageUrl from './Components/BG-Image.webp'
import { Environment, useTexture } from '@react-three/drei'
import './Home.css'

// Initialize Theatre.js studio only in development environment
if (import.meta.env.DEV) {
  studio.initialize()
  studio.extend(extension)
}

const project = getProject('Curiosity Project')
const sheet = project.sheet('Curiosity Scene')

// Sky Plane background component using the new BG-Image.webp asset
function EnvironmentBackground() {
  const texture = useTexture(bgImageUrl)
  
  return (
    <e.mesh theatreKey="Sky Plane" position={[-0.5, 1.8, -8]} scale={[16, 9, 1]}>
      <planeGeometry />
      {/* depthWrite={false} keeps the plane from blocking render buffers; toneMapped={false} preserves original image colors */}
      <meshBasicMaterial map={texture} depthWrite={false} toneMapped={false} />
    </e.mesh>
  )
}

// Camera Rig component to apply subtle camera parallax tracking the mouse cursor
function CameraRig({ children }) {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Calculate target horizontal and vertical offsets based on mouse position (-1 to 1)
      const targetX = state.pointer.x * 0.15
      const targetY = state.pointer.y * 0.1
      
      // Smoothly interpolate rig positions using linear interpolation (lerp)
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 4)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 4)
      
      // Add subtle camera rotation offsets (pan and tilt) matching cursor direction
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -state.pointer.x * 0.05, delta * 4)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.04, delta * 4)
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

export default function Experience() {
  const navigate = useNavigate()
  const [selectedSticker, setSelectedSticker] = useState(null)

  // Sync selected element state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#notebook') {
        setSelectedSticker('Notebook')
      } else if (hash === '#cup') {
        setSelectedSticker('Cup')
      } else if (hash === '#calculator') {
        setSelectedSticker('Calculator')
      } else if (hash === '#pc') {
        setSelectedSticker('PC')
      } else {
        const match = hash.match(/^#sticker([1-5])$/i)
        if (match) {
          // Map back to Capitalized Sticker name for state consistency
          setSelectedSticker(`Sticker${match[1]}`)
        } else {
          setSelectedSticker(null)
        }
      }
    }

    // Run on initial mount (in case they deep-linked straight to a hash)
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Trigger navigation by changing hash
  const handleStickerClick = (stickerName) => {
    if (stickerName) {
      window.location.hash = stickerName.toLowerCase()
    }
  }

  // Clear hash and go back to base home view
  const handleBackToHome = () => {
    // Clear URL hash without trigger page layout scroll jumps
    window.history.pushState('', document.title, window.location.pathname + window.location.search)
    setSelectedSticker(null)
  }

  // Timeline configuration mapping portfolio items to their corresponding routes
  const timelineSteps = [
    { id: '01', label: 'Curiosity', path: '/home' },
    { id: '02', label: 'Experiments', path: '/workshop' },
    { id: '03', label: 'Building', path: '/lab' },
    { id: '04', label: 'Freelance', path: '/watch' },
    { id: '05', label: 'Agency', path: '/awebco' },
    { id: '06', label: 'Playground', path: '/editor-demo' },
    { id: '07', label: 'The Future', path: '/agenticai' }
  ]

  const handleNavigation = (path) => {
    if (path.startsWith('/')) {
      navigate(path)
    }
  }

  return (
    <div className="home-container">
      {/* Background subtle radial gradient to ensure text legibility over any scene colors */}
      <div className="gradient-overlay" />

      {/* R3F 3D Canvas with Theatre.js sheet connectivity */}
      <Canvas
        gl={{ toneMapping: THREE.AgXToneMapping, toneMappingExposure: 0.8 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <Suspense fallback={null}>
          <SheetProvider sheet={sheet}>
            {/* Camera Rig to apply subtle mouse coordinates parallax swaying */}
            <CameraRig>
              {/* Theatre.js editable Perspective Camera */}
              <PerspectiveCamera
                theatreKey="Camera"
                makeDefault
                position={[0.3, 0.4, 1.8]}
                fov={45}
              />
            </CameraRig>
            
            {/* Theatre.js editable Lighting */}
            <e.ambientLight theatreKey="Ambient Light" intensity={0.85} />
            <e.pointLight theatreKey="Point Light" position={[2, 4, 3]} intensity={3.5} />
            <e.spotLight theatreKey="Spot Light" position={[-4, 8, 4]} angle={0.3} penumbra={1} intensity={2.0} />
            <e.directionalLight theatreKey="Directional Light" position={[5, 10, 5]} intensity={2.0} />
            <Environment preset="city" />
            
            {/* 3D Background Plane */}
            <EnvironmentBackground />
            
            {/* Theatre.js editable Curiosity model group */}
            <e.group theatreKey="Curiosity Model" position={[0.5, -0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <CuriosityModel onStickerClick={handleStickerClick} />
            </e.group>
          </SheetProvider>
        </Suspense>
      </Canvas>

      {/* Modern overlays layer */}
      <div className="ui-overlay">
        {/* Top Timeline scrollbar header */}
        <header className="timeline-header">
          <div className="timeline-line" />
          {timelineSteps.map((step) => (
            <button
              key={step.id}
              className={`timeline-node ${step.id === '01' ? 'active' : ''}`}
              onClick={() => handleNavigation(step.path)}
            >
              <div className="node-circle">{step.id}</div>
              <span className="node-label">{step.label}</span>
            </button>
          ))}
        </header>

        {/* Outer content container mapping both left sections */}
        <div className="left-content-wrapper">
          {/* Main Narrative Copy Section */}
          <main className={`left-content ${selectedSticker ? 'fade-out-up' : ''}`}>
            <h1>01 / CURIOSITY</h1>
            <h2>The beginning of everything.</h2>
            <p>
              {`I was told I should become an accountant.
              So I studied it. I learned it.
              But technology was changing fast,
              and something else caught my attention.

              I stopped asking "What job should I get?"
              and started asking "What can I build?"`}
            </p>
            
            {/* Accent handwritten text block */}
            <div className="accent-text-container">
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 50 50" 
                fill="none" 
                className="accent-arrow"
              >
                <path 
                  d="M10,10 Q25,5 35,25 T40,40" 
                  stroke="#c5a880" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                <path 
                  d="M33,37 L40,40 L41,32" 
                  stroke="#c5a880" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="accent-text">this was the moment everything shifted.</span>
            </div>
          </main>

          {/* Sticker details sub-page section */}
          <div className={`sticker-page-container ${selectedSticker ? 'fade-in-up' : ''}`}>
            <h1>{selectedSticker ? `01 / ${selectedSticker.toUpperCase()}` : '01 / DETAIL'}</h1>
            <h2>Interactive Artifact</h2>
            <p>
              {selectedSticker === 'Sticker1' && "The primary badge representing coding principles, design logic, and structural planning frameworks. This is where execution starts."}
              {selectedSticker === 'Sticker2' && "The conceptual draft containing rough outlines, visual layouts, and spatial calculations. A snapshot of pure creative freedom."}
              {selectedSticker === 'Sticker3' && "The workspace coordinate guidelines. Specifying three-dimensional rotations, lights, environments, and mesh dimensions."}
              {selectedSticker === 'Sticker4' && "The database connector node. Managing data arrays, schema setups, and cloud integrations for SaaS products."}
              {selectedSticker === 'Sticker5' && "The business dev and cold outreach engine. Scaling client systems, marketing channels, and brand strategies."}
              
              {selectedSticker === 'Notebook' && "The idea sketching canvas. Used to draft wireframes, system diagrams, and outline project objectives before writing code."}
              {selectedSticker === 'Cup' && "The coffee container labeled 'Fuel the Dream'. Represents persistent effort, morning focus sessions, and night-time debugging cycles."}
              {selectedSticker === 'Calculator' && "The financial planning tool. Symbolizes the analytical transition from traditional bookkeeping constraints into software building freedom."}
              {selectedSticker === 'PC' && "The vintage CRT terminal screen. Booting the custom workspace terminal environment and processing creative code loops."}
            </p>
            
            <button className="back-button" onClick={handleBackToHome}>
              ← BACK TO CURIOSITY
            </button>
          </div>
        </div>

        {/* Bottom Scroll to Continue element (navigates to workshop/experiments page) */}
        <button className="scroll-continue" onClick={() => handleNavigation('/workshop')}>
          <span className="scroll-text">SCROLL TO CONTINUE</span>
          <div className="mouse-icon">
            <div className="mouse-wheel" />
          </div>
        </button>
      </div>
    </div>
  )
}
