import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectUI from './ProjectUI'

// --- CONFIGURATION ---
const DEV_MODE = false 
const PI_2 = Math.PI * 2
const SLOTS = [
  { name: 'NIKE LAB',      rad: -0.085 }, 
  { name: 'CHRONOS WATCH', rad: 0.72 }, 
  { name: 'EXPLORE',       rad: 1.52 }, 
  { name: 'EXPLORE',       rad: 2.30 }, 
  { name: 'COMING SOON',   rad: 3.08 }, 
  { name: 'EXPLORE',       rad: 3.87 }, 
  { name: 'SECRET ROOM',   rad: 4.65 }, 
  { name: 'EXPLORE',       rad: 5.43 }, 
]

export default function Interface({ isStarted, onStart, activeProject, onBack, rotationY, setRotationY }) {
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0)

  // --- SYNC ROTATION TO SLOT NAME ---
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

  // --- NAV HANDLERS ---
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
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,0,0,0.8)', padding: '15px', color: 'white', fontFamily: 'monospace', zIndex: 9999 }}>
          <div>ROTATION: {rotationY.toFixed(3)}</div>
          <div>INDEX: {currentSlotIndex}</div>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: START SCREEN */}
        {!isStarted && (
          <motion.div 
            key="start-screen"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            exit={{ opacity: 0, y: -100, transition: { duration: 0.5, ease: "easeIn" }}}
            transition={{ duration: 0.8, delay: 2.5 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)', pointerEvents: 'auto' }}
          >
            <motion.h1 initial={{ y: -120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 2.5 }} style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 8vw, 4rem)', letterSpacing: '10px', margin: 0 }}>THE LAB ALPHA</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ duration: 1, delay: 0.8 }} style={{ color: '#00f2ff', fontFamily: 'monospace', letterSpacing: '5px', marginTop: '10px', fontSize: '0.8rem' }}>Version 1.0</motion.p>
            <motion.button onClick={onStart} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 2.7 }} whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,242,255,0.4)", borderColor: "#fff", color: "#fff" }} whileTap={{ scale: 0.95 }} style={{ marginTop: '60px', padding: '15px 45px', background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '4px', textTransform: 'uppercase', transition: 'all 0.3s ease' }}>Enter The Lab</motion.button>
          </motion.div>
        )}

        {/* PHASE 2: ACTIVE PROJECT UI (Imported Component) */}
        {activeProject && (
          <motion.div key="project-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            <ProjectUI activeProject={activeProject} onBack={onBack} />
          </motion.div>
        )}

        {/* PHASE 3: HUB CONTROLS */}
        {!activeProject && isStarted && (
          <motion.div key="hub-controls" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} style={{ position: 'absolute', bottom: '40px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', pointerEvents: 'auto', background: 'rgba(0, 0, 0, 0.85)', padding: '12px 40px', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => rotateToSlot((currentSlotIndex - 1 + SLOTS.length) % SLOTS.length)} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</motion.button>
              <div style={{ width: '180px', textAlign: 'center' }}>
                <div style={{ color: '#666', fontSize: '0.6rem', letterSpacing: '3px', marginBottom: '2px', fontFamily: 'monospace' }}>CURRENT TARGET</div>
                <motion.div key={currentSlotIndex} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ color: SLOTS[currentSlotIndex].name === 'EXPLORE' ? 'white' : '#00f2ff', fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>{SLOTS[currentSlotIndex].name}</motion.div>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => rotateToSlot((currentSlotIndex + 1) % SLOTS.length)} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}