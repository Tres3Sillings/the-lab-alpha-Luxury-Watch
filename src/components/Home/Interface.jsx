import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- 🔧 CONFIGURATION ---
const DEV_MODE = true 
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

export default function Interface({ isStarted, onStart, activeProject, onBack, rotationY, setRotationY }) {
  
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0)

  // --- LOGIC: SYNC SCROLL TO SLOTS (With Circular Distance Fix) ---
  useEffect(() => {
    if (activeProject || !isStarted) return

    // 1. Normalize current rotation to 0 - 6.28
    const normalizedRotation = (rotationY % PI_2 + PI_2) % PI_2

    let closestIndex = 0
    let minDiff = Infinity

    SLOTS.forEach((slot, index) => {
      // 2. Calculate distance
      let diff = Math.abs(normalizedRotation - slot.rad)

      // 3. FIX: Handle the "Wrap Around" (The 0.0 vs 6.28 problem)
      if (diff > Math.PI) {
        diff = PI_2 - diff
      }

      if (diff < minDiff) {
        minDiff = diff
        closestIndex = index
      }
    })

    setCurrentSlotIndex(closestIndex)
  }, [rotationY, activeProject, isStarted])

  // --- NAVIGATION HANDLERS ---
  const handleNext = () => {
    const nextIndex = (currentSlotIndex + 1) % SLOTS.length
    rotateToSlot(nextIndex)
  }

  const handlePrev = () => {
    const prevIndex = (currentSlotIndex - 1 + SLOTS.length) % SLOTS.length
    rotateToSlot(prevIndex)
  }

  const rotateToSlot = (targetIndex) => {
    const targetRad = SLOTS[targetIndex].rad
    const currentRot = rotationY
    
    // Normalize current rotation to 0-360
    const currentMod = (currentRot % PI_2 + PI_2) % PI_2
    
    let delta = targetRad - currentMod
    
    // SMART PATHING: Take the shortest route
    if (delta > Math.PI) delta -= PI_2
    if (delta < -Math.PI) delta += PI_2

    setRotationY(currentRot + delta)
  }

  return (
    <div className="interface-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
      
      {/* DEV OVERLAY */}
      {DEV_MODE && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,0,0,0.8)', padding: '15px', color: 'white', fontFamily: 'monospace', zIndex: 9999, pointerEvents: 'none', borderRadius: '8px' }}>
          <div style={{ fontWeight: 'bold', color: '#00f2ff', marginBottom: '5px' }}>🔧 DEV MODE</div>
          <div>ROTATION: {rotationY.toFixed(3)} rad</div>
          <div>INDEX: {currentSlotIndex}</div>
          <div>TARGET: {SLOTS[currentSlotIndex].name}</div>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: START SCREEN */}
        {!isStarted && (
          <motion.div 
            key="start-screen"
            initial={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'auto' }}
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '4rem', letterSpacing: '10px', margin: 0, textAlign: 'center' }}
            >
                THE LAB ALPHA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.4 }}
              style={{ color: '#00f2ff', fontFamily: 'monospace', letterSpacing: '5px', marginTop: '10px' }}
            >
              Version 1.0
            </motion.p>
            <motion.button 
              onClick={onStart}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 25px #00f2ff", textShadow: "0 0 10px #00f2ff" }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: '50px', padding: '15px 40px', background: 'transparent', border: '2px solid #00f2ff', color: '#00f2ff', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '3px', textTransform: 'uppercase' }}
            >
              Enter The Lab
            </motion.button>
          </motion.div>
        )}

        {/* PHASE 2: ACTIVE PROJECT UI */}
        {activeProject && (
          <motion.div key="project-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* LEFT CONTAINER: Main Info */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              style={{ position: 'absolute', top: '20%', left: '5%', width: '300px', pointerEvents: 'auto' }}
            >
              <h2 style={{ color: 'white', fontSize: '3rem', margin: 0, fontFamily: 'Impact, sans-serif', textTransform: 'uppercase', lineHeight: 0.9 }}>
                {activeProject === 'shoe' ? 'Nike' : 'Chronos'}
              </h2>
              <h2 style={{ color: '#00f2ff', fontSize: '3rem', margin: 0, fontFamily: 'Impact, sans-serif', textTransform: 'uppercase', lineHeight: 0.9 }}>
                {activeProject === 'shoe' ? 'Air Max' : 'S-Tier'}
              </h2>
              <p style={{ color: '#aaa', marginTop: '20px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' }}>
                {activeProject === 'shoe' 
                  ? 'A fully immersive 3D configurator featuring real-time leather physics and color swapping.' 
                  : 'High-fidelity watch showcase utilizing ray-traced reflections and scroll-driven mechanics.'}
              </p>
              
              <a href={activeProject === 'shoe' ? '/shoe' : '/watch'} style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05, background: '#00f2ff', color: '#000' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginTop: '30px', padding: '15px 30px', background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}
                >
                  OPEN PROJECT ↗
                </motion.button>
              </a>
            </motion.div>

            {/* RIGHT CONTAINER: Tech Stack */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              style={{ position: 'absolute', top: '20%', right: '5%', width: '250px', textAlign: 'right', pointerEvents: 'auto' }}
            >
               <h3 style={{ color: '#fff', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', fontFamily: 'monospace' }}>RESOURCES</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
                 {['React Three Fiber', 'WebGL Shaders', 'Blender', 'Tailwind CSS'].map((tech) => (
                   <div key={tech} style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '4px', color: '#ccc', fontSize: '0.8rem', fontFamily: 'monospace', backdropFilter: 'blur(5px)' }}>
                     {tech}
                   </div>
                 ))}
               </div>
            </motion.div>

            {/* BACK BUTTON */}
            <button 
              onClick={onBack}
              style={{ position: 'absolute', top: '50px', left: '50px', pointerEvents: 'auto', background: 'none', border: 'none', color: '#666', fontSize: '1rem', cursor: 'pointer', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <span style={{ fontSize: '1.5rem' }}>←</span> RETURN TO HUB
            </button>
          </motion.div>
        )}

        {/* PHASE 3: HUB CONTROLS (Infinite Scroll) */}
        {!activeProject && isStarted && (
          <motion.div
            key="hub-controls"
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            style={{ position: 'absolute', bottom: '40px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', pointerEvents: 'auto', background: 'rgba(0, 0, 0, 0.85)', padding: '12px 40px', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              
              {/* LEFT ARROW (Goes to Previous Slot) */}
              <motion.button
                whileTap={{ scale: 0.9 }} onClick={handlePrev} 
                style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              > ← </motion.button>

              {/* CENTER LABEL (Reads from SLOTS array) */}
              <div style={{ width: '180px', textAlign: 'center' }}>
                <div style={{ color: '#666', fontSize: '0.6rem', letterSpacing: '3px', marginBottom: '2px', fontFamily: 'monospace' }}>CURRENT TARGET</div>
                <motion.div
                  key={currentSlotIndex} 
                  initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  style={{ 
                    color: SLOTS[currentSlotIndex].name === 'EXPLORE' ? 'white' : '#00f2ff', 
                    fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' 
                  }}
                >
                  {SLOTS[currentSlotIndex].name}
                </motion.div>
              </div>

              {/* RIGHT ARROW (Goes to Next Slot) */}
              <motion.button
                whileTap={{ scale: 0.9 }} onClick={handleNext} 
                style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              > → </motion.button>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}