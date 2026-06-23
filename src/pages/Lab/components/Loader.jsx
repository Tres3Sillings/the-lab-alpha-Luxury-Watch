import React, { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const { active, progress } = useProgress()
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    if (!active && progress === 100) {
      // Small delay to ensure the "SYSTEM READY" text is seen
      const timer = setTimeout(() => {
        setShouldShow(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [active, progress])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="loader-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // The background fades AFTER the text, so we delay this exit
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100dvh',
            background: '#050505',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          {/* CONTENT WRAPPER: This slides and fades out first */}
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h1 style={{ 
              color: 'white', 
              fontFamily: 'Impact', 
              letterSpacing: '10px',
              fontSize: '2.5rem',
              margin: 0
            }}>
              THE LAB
            </h1>

            <div style={{ width: '200px', height: '1px', background: '#111', marginTop: '30px', position: 'relative' }}>
              <motion.div 
                style={{ 
                  height: '100%', 
                  background: '#00f2ff', 
                  transformOrigin: 'left',
                  boxShadow: '0 0 10px #00f2ff' 
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </div>

            <p style={{ 
              color: '#00f2ff', 
              fontFamily: 'monospace', 
              marginTop: '20px', 
              fontSize: '0.7rem',
              letterSpacing: '3px',
              opacity: 0.5
            }}>
              {progress < 100 ? `SYNCING SYSTEM... ${Math.round(progress)}%` : "SYSTEM READY"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}