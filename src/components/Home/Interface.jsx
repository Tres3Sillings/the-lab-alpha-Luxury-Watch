import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Interface({ isStarted, onStart, activeProject, onBack }) {
  return (
    <div className="interface-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: START SCREEN */}
        {!isStarted && (
          <motion.div 
            key="start-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            style={{ 
              width: '100%', height: '100%', 
              display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)'
            }}
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ 
                color: 'white', fontFamily: 'Inter, sans-serif', 
                fontSize: '4rem', letterSpacing: '10px', margin: 0, textAlign: 'center' 
              }}
            >
                THE LAB ALPHA
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4 }}
              style={{ 
                color: '#00f2ff', fontFamily: 'monospace', 
                letterSpacing: '5px', marginTop: '10px' 
              }}
            >
              Version 1.0
            </motion.p>
            
            <motion.button 
              onClick={onStart}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 25px #00f2ff", textShadow: "0 0 10px #00f2ff" }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                pointerEvents: 'auto', marginTop: '50px', padding: '15px 40px',
                background: 'transparent', border: '2px solid #00f2ff', color: '#00f2ff',
                fontFamily: 'Inter, sans-serif', fontWeight: 'bold', cursor: 'pointer',
                letterSpacing: '3px', textTransform: 'uppercase'
              }}
            >
              Enter The Lab
            </motion.button>
          </motion.div>
        )}

        {/* PHASE 2: PROJECT DETAILS (When Zoomed In) */}
        {activeProject && (
          <motion.div 
            key="project-details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            style={{ 
              position: 'absolute', top: '20%', right: '5%', 
              width: '350px', padding: '40px', 
              background: 'rgba(0, 0, 0, 0.85)', 
              borderLeft: '4px solid #00f2ff', color: 'white', 
              backdropFilter: 'blur(10px)', pointerEvents: 'auto'
            }}
          >
            <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
              {activeProject === 'shoe' ? 'Nike Lab // Alpha' : 'Chronos Watch'}
            </h2>
            <p style={{ lineHeight: '1.6', color: '#ccc' }}>
              {activeProject === 'shoe' 
                ? 'A 3D configurator built for high-performance footwear. Features real-time material swapping and WebGL physics.' 
                : 'Luxury timepiece showcase using scroll-driven animation and ray-traced reflections.'}
            </p>
            <button 
              onClick={onBack}
              style={{ 
                marginTop: '20px', padding: '10px 20px', 
                background: '#00f2ff', color: 'black', border: 'none', 
                fontWeight: 'bold', cursor: 'pointer' 
              }}
            >
              BACK TO HUB
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}