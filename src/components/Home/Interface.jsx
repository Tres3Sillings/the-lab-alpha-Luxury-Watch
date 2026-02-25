import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- 🔧 CONFIGURATION ---
const DEV_MODE = false  // Set to true to enable the developer overlay with rotation info
const PI_2 = Math.PI * 2

// YOUR CALIBRATED SLOTS
const SLOTS = [

  { name: 'NIKE LAB',      rad: -0.085 },  // Index 0
  { name: 'CHRONOS WATCH', rad: 0.72 }, // Index 1
  { name: 'EXPLORE',       rad: 1.52 }, // Index 2
  { name: 'EXPLORE',       rad: 2.30 }, // Index 3
  { name: 'COMING SOON',   rad: 3.08 }, // Index 4
  { name: 'EXPLORE',       rad: 3.87 }, // Index 5
  { name: 'SECRET ROOM',   rad: 4.65 }, // Index 6
  { name: 'EXPLORE',       rad: 5.43 }, // Index 7
]

const PROJECT_DATA = {
  shoe: {
    title: 'Nike Air Max',
    subtitle: 'Alpha Configurator',
    overview: 'The goal was to build a high-fidelity, interactive 3D product configurator for a custom sneaker ("Nike Air Max Alpha"). The experience mimics high-end brand configurators with a focus on sleek UI, real-time interactivity, and premium visual fidelity.',
    approach: [
      { title: 'Modeling (Blender)', text: 'Real-world scale (0.3m), segmented mesh parts (Swoosh, Sole, Laces) for independent coloring, and optimization (Scale 1.0) to prevent distortion.' },
      { title: 'Development (React & R3F)', text: 'Built with React/Vite/Tailwind. Used React Three Fiber for rendering, custom state management for part colors, and color.lerp for smooth transitions.' },
      { title: 'UI/UX Design', text: 'Split-screen layout with category tabs for 9+ customizable zones. Solved client-side routing for seamless hub-to-project navigation.' }
    ],
    tech: ['React Three Fiber', 'Blender', 'Tailwind CSS v4', 'React Router', 'gltfjsx', 'Vite'],
    credits: 'Model by DeezVertz (modified from assets by makoto & samplemem).'
  },
  watch: {
    title: 'Chronos Watch',
    subtitle: 'S-Tier Storytelling',
    overview: 'The goal was to create a cinematic, scroll-driven "storytelling" experience for a luxury skeleton watch. The project focuses on high-end visual transitions, utilizing "exploded view" mechanics to showcase internal engineering.',
    approach: [
      { title: 'Modeling (Blender)', text: 'Centered pivot points for in-place rotation. Organized hierarchy (Sapphire, Dial, Mechanism) for Z-axis explosion. Emissive mapping for digital pulse effects.' },
      { title: 'Development (React & R3F)', text: 'Implemented physics-based damping (MathUtils.damp) for fluid animation. Built a "state capture" system to record position/rotation at scroll thresholds.' },
      { title: 'UI/UX Design', text: 'Minimalist hero transition, scroll-synced text overlays with visibility gaps, and interactive e-commerce CTA without disrupting 3D flow.' }
    ],
    tech: ['React Three Fiber', 'Blender', 'MathUtils.damp', 'ScrollControls', 'Tailwind CSS', 'Vite'],
    credits: 'Model by The Vipron.'
  }
}

// --- 📱 MOBILE DETECTOR ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// --- 🧩 ACCORDION ITEM ---
function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div style={{ marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <button 
        onClick={onClick}
        style={{ width: '100%', padding: '10px 0', background: 'none', border: 'none', color: isOpen ? '#00f2ff' : 'white', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}
      >
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: '15px', color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- 📄 PROJECT INFO COMPONENT (RESPONSIVE) ---
function ProjectInfo({ activeProject, onBack }) {
  const data = PROJECT_DATA[activeProject]
  const [openSection, setOpenSection] = useState('overview')
  const isMobile = useIsMobile()

  // --- MOBILE STYLES ---
  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', 
          overflowY: 'auto', padding: '80px 20px 40px 20px', pointerEvents: 'auto', zIndex: 50 
        }}
      >
        {/* Mobile Header */}
        <button onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#666', fontSize: '1rem' }}>← BACK</button>
        
        <h2 style={{ color: 'white', fontSize: '2.5rem', fontFamily: 'Impact, sans-serif', textTransform: 'uppercase', lineHeight: 0.9 }}>{data.title}</h2>
        <h2 style={{ color: '#00f2ff', fontSize: '1.2rem', margin: '5px 0 20px 0', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '2px' }}>{data.subtitle}</h2>

        {/* Mobile Actions */}
        <a href={activeProject === 'shoe' ? '/shoe' : '/watch'} style={{ textDecoration: 'none', width: '100%', display: 'block', marginBottom: '30px' }}>
          <button style={{ width: '100%', padding: '15px 0', background: '#00f2ff', border: 'none', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Open Project
          </button>
        </a>

        {/* Mobile Accordion */}
        <div style={{ paddingBottom: '50px' }}>
          <AccordionItem title="OVERVIEW" isOpen={openSection === 'overview'} onClick={() => setOpenSection(openSection === 'overview' ? null : 'overview')}>
            {data.overview}
          </AccordionItem>
          <AccordionItem title="APPROACH" isOpen={openSection === 'approach'} onClick={() => setOpenSection(openSection === 'approach' ? null : 'approach')}>
            <ul style={{ paddingLeft: '15px', margin: 0 }}>
              {data.approach.map((item, i) => (
                <li key={i} style={{ marginBottom: '10px' }}><strong style={{ color: 'white' }}>{item.title}:</strong> {item.text}</li>
              ))}
            </ul>
          </AccordionItem>
          <AccordionItem title="TECH STACK" isOpen={openSection === 'tech'} onClick={() => setOpenSection(openSection === 'tech' ? null : 'tech')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.tech.map(t => (<span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>{t}</span>))}
            </div>
          </AccordionItem>
          <AccordionItem title="CREDITS" isOpen={openSection === 'credits'} onClick={() => setOpenSection(openSection === 'credits' ? null : 'credits')}>
            {data.credits}
          </AccordionItem>
        </div>
      </motion.div>
    )
  }

  // --- DESKTOP STYLES (Original Split Layout) ---
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', pointerEvents: 'none' }}>
      
      {/* LEFT: TITLE & CTA */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        style={{ position: 'absolute', top: '15%', left: '5%', width: '350px', pointerEvents: 'auto' }}
      >
        <h2 style={{ color: 'white', fontSize: '3.5rem', margin: 0, fontFamily: 'Impact, sans-serif', textTransform: 'uppercase', lineHeight: 0.9 }}>{data.title}</h2>
        <h2 style={{ color: '#00f2ff', fontSize: '2rem', margin: '5px 0 20px 0', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '2px' }}>{data.subtitle}</h2>
        
        <a href={activeProject === 'shoe' ? '/shoe' : '/watch'} style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ scale: 1.05, background: '#00f2ff', color: '#000' }} whileTap={{ scale: 0.95 }}
            style={{ padding: '15px 40px', background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}
          >
            OPEN PROJECT ↗
          </motion.button>
        </a>

        <button onClick={onBack} style={{ marginTop: '30px', background: 'none', border: 'none', color: '#666', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>←</span> RETURN TO HUB
        </button>
      </motion.div>

      {/* RIGHT: DETAILS ACCORDION */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ position: 'absolute', top: '15%', right: '5%', width: '400px', maxHeight: '70vh', overflowY: 'auto', pointerEvents: 'auto', background: 'rgba(0,0,0,0.8)', padding: '30px', borderRadius: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '1.2rem' }}>PROJECT SPECS</h3>
        
        <AccordionItem title="PROJECT OVERVIEW" isOpen={openSection === 'overview'} onClick={() => setOpenSection(openSection === 'overview' ? null : 'overview')}>
          {data.overview}
        </AccordionItem>

        <AccordionItem title="OUR APPROACH" isOpen={openSection === 'approach'} onClick={() => setOpenSection(openSection === 'approach' ? null : 'approach')}>
          <ul style={{ paddingLeft: '15px', margin: 0 }}>
            {data.approach.map((item, i) => (
              <li key={i} style={{ marginBottom: '10px' }}><strong style={{ color: 'white' }}>{item.title}:</strong> {item.text}</li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem title="TECH STACK" isOpen={openSection === 'tech'} onClick={() => setOpenSection(openSection === 'tech' ? null : 'tech')}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.tech.map(t => (<span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace' }}>{t}</span>))}
          </div>
        </AccordionItem>

        <AccordionItem title="CREDITS" isOpen={openSection === 'credits'} onClick={() => setOpenSection(openSection === 'credits' ? null : 'credits')}>
          {data.credits}
        </AccordionItem>
      </motion.div>
    </div>
  )
}

// --- MAIN COMPONENT ---
export default function Interface({ isStarted, onStart, activeProject, onBack, rotationY, setRotationY }) {
  
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0)

  // --- LOGIC: SYNC SCROLL ---
  useEffect(() => {
    if (activeProject || !isStarted) return
    const normalizedRotation = (rotationY % PI_2 + PI_2) % PI_2
    let closestIndex = 0
    let minDiff = Infinity
    SLOTS.forEach((slot, index) => {
      let diff = Math.abs(normalizedRotation - slot.rad)
      if (diff > Math.PI) diff = PI_2 - diff
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = index
      }
    })
    setCurrentSlotIndex(closestIndex)
  }, [rotationY, activeProject, isStarted])

  // --- HANDLERS ---
  const handleNext = () => rotateToSlot((currentSlotIndex + 1) % SLOTS.length)
  const handlePrev = () => rotateToSlot((currentSlotIndex - 1 + SLOTS.length) % SLOTS.length)

  const rotateToSlot = (targetIndex) => {
    const targetRad = SLOTS[targetIndex].rad
    const currentRot = rotationY
    const currentMod = (currentRot % PI_2 + PI_2) % PI_2
    const targetMod = (targetRad % PI_2 + PI_2) % PI_2
    let delta = targetMod - currentMod
    if (delta > Math.PI) delta -= PI_2
    if (delta < -Math.PI) delta += PI_2
    setRotationY(currentRot + delta)
  }

  return (
    <div className="interface-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
      
      {DEV_MODE && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,0,0,0.8)', padding: '15px', color: 'white', fontFamily: 'monospace', zIndex: 9999, pointerEvents: 'none', borderRadius: '8px' }}>
          <div style={{ fontWeight: 'bold', color: '#00f2ff', marginBottom: '5px' }}>🔧 DEV MODE</div>
          <div>ROTATION: {rotationY.toFixed(3)} rad</div>
          <div>INDEX: {currentSlotIndex}</div>
        </div>
      )}

      <AnimatePresence mode="wait">
        
{/* PHASE 1: START SCREEN */}
{!isStarted && (
  <motion.div 
    key="start-screen"
    initial={{ opacity: 0 }} // Start invisible
    animate={{ opacity: 1 }} // Fade in once loader is gone
    exit={{ 
      opacity: 0, 
      y: -100, // Slide the whole screen up as it vanishes
      transition: { 
        duration: 0.5, // Much faster exit
        ease: "easeIn" 
      } 
    }}
    transition={{ duration: 0.8, delay: 2.5 }} // Wait 1.5s for Loader to start fading
    style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)', 
      pointerEvents: 'auto' 
    }}
  >
    {/* TITLE: Wait longer to ensure Loader is 100% gone */}
    <motion.h1 
      initial={{ y: -120, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ 
        duration: 1.2, 
        delay: 2.5, // Increased delay to beat the Loader
        ease: [0.22, 1, 0.36, 1] 
      }}
      style={{ 
        color: 'white', 
        fontFamily: 'Inter, sans-serif', 
        fontSize: 'clamp(2rem, 8vw, 4rem)', 
        letterSpacing: '10px', 
        margin: 0, 
        textAlign: 'center',
        textTransform: 'uppercase'
      }}
    >
        THE LAB ALPHA
    </motion.h1>

    {/* VERSION TAG */}
    <motion.p
      initial={{ opacity: 0 }} 
      animate={{ opacity: 0.4 }} 
      transition={{ duration: 1, delay: 0.8 }} // Staggered after Title
      style={{ 
        color: '#00f2ff', 
        fontFamily: 'monospace', 
        letterSpacing: '5px', 
        marginTop: '10px',
        fontSize: '0.8rem' 
      }}
    >
      Version 1.0
    </motion.p>

    {/* BUTTON */}
    <motion.button 
      onClick={onStart}
      initial={{ y: 60, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ 
        duration: 1, 
        delay: 2.7, // Staggered slightly after Title
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 0 30px rgba(0,242,255,0.4)", 
        borderColor: "#fff",
        color: "#fff"
      }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        marginTop: '60px', 
        padding: '15px 45px', 
        background: 'transparent', 
        border: '1px solid #00f2ff', 
        color: '#00f2ff', 
        fontFamily: 'Inter, sans-serif', 
        fontWeight: 'bold', 
        cursor: 'pointer', 
        letterSpacing: '4px', 
        textTransform: 'uppercase',
        transition: 'all 0.3s ease'
      }}
    >
      Enter The Lab
    </motion.button>
  </motion.div>
)}

        {/* PHASE 2: ACTIVE PROJECT UI (Responsive) */}
        {activeProject && (
          <motion.div key="project-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', height: '100%' }}>
            <ProjectInfo activeProject={activeProject} onBack={onBack} />
          </motion.div>
        )}

        {/* PHASE 3: HUB CONTROLS */}
        {!activeProject && isStarted && (
          <motion.div
            key="hub-controls"
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            style={{ position: 'absolute', bottom: '40px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', pointerEvents: 'auto', background: 'rgba(0, 0, 0, 0.85)', padding: '12px 40px', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handlePrev} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</motion.button>
              <div style={{ width: '180px', textAlign: 'center' }}>
                <div style={{ color: '#666', fontSize: '0.6rem', letterSpacing: '3px', marginBottom: '2px', fontFamily: 'monospace' }}>CURRENT TARGET</div>
                <motion.div key={currentSlotIndex} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ color: SLOTS[currentSlotIndex].name === 'EXPLORE' ? 'white' : '#00f2ff', fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>{SLOTS[currentSlotIndex].name}</motion.div>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleNext} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}