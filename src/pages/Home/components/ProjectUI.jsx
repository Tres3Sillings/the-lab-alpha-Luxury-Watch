import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECT_DATA } from '../data/projectData'

// --- MOBILE DETECTOR HOOK ---
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

// --- ACCORDION ITEM COMPONENT ---
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

// --- MAIN PROJECT UI COMPONENT ---
export default function ProjectUI({ activeProject, onBack }) {
  const isMobile = useIsMobile()
  const [openSection, setOpenSection] = useState('overview')

  // 1. GET DATA (With Fallback)
  let content = PROJECT_DATA[activeProject]
  if (!content) {
     const id = activeProject.split('_')[1] || '00'
     content = {
       title: 'PROJECT',
       subtitle: `ALPHA ${id}`,
       overview: 'This confidential experiment is currently under construction. Access is restricted to authorized developers only.',
       approach: [],
       tech: [],
       credits: '',
       link: null
     }
  }

  // --- MOBILE VIEW ---
  if (isMobile) {
    return (
      <motion.div 
        key="mobile-ui"
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', overflowY: 'auto', padding: '80px 20px 40px 20px', pointerEvents: 'auto', zIndex: 50 }}
      >
        <button onClick={onBack} style={{ position: 'absolute', top: '20px', left: '0px', background: 'none', border: 'none', color: '#00f2ff', fontSize: '1rem' }}>← BACK</button>
        
        <h2 style={{ color: 'white', fontSize: '2.5rem', fontFamily: 'Impact, sans-serif', textTransform: 'uppercase', lineHeight: 0.9 }}>{content.title}</h2>
        <h2 style={{ color: '#00f2ff', fontSize: '1.2rem', margin: '5px 0 20px 0', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '2px' }}>{content.subtitle}</h2>

        {content.link && (
          <a href={content.link} style={{ textDecoration: 'none', width: '100%', display: 'block', marginBottom: '30px' }}>
            <button style={{ width: '100%', padding: '15px 0', background: '#00f2ff', border: 'none', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>OPEN PROJECT</button>
          </a>
        )}

        <div style={{ paddingBottom: '50px' }}>
          <AccordionItem title="OVERVIEW" isOpen={openSection === 'overview'} onClick={() => setOpenSection(openSection === 'overview' ? null : 'overview')}>
            {content.overview}
          </AccordionItem>
          {content.approach.length > 0 && (
            <AccordionItem title="APPROACH" isOpen={openSection === 'approach'} onClick={() => setOpenSection(openSection === 'approach' ? null : 'approach')}>
              <ul style={{ paddingLeft: '15px', margin: 0 }}>
                {content.approach.map((item, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}><strong style={{ color: 'white' }}>{item.title}:</strong> {item.text}</li>
                ))}
              </ul>
            </AccordionItem>
          )}
          {content.tech.length > 0 && (
            <AccordionItem title="TECH STACK" isOpen={openSection === 'tech'} onClick={() => setOpenSection(openSection === 'tech' ? null : 'tech')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {content.tech.map(t => (<span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>{t}</span>))}
              </div>
            </AccordionItem>
          )}
        </div>
      </motion.div>
    )
  }

  // --- DESKTOP VIEW ---
  return (
    <>
      {/* LEFT PANEL */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        style={{ position: 'absolute', top: '15%', left: '5%', width: '350px', pointerEvents: 'auto' }}
      >
        <h2 style={{ color: 'white', fontSize: '3.5rem', margin: 0, fontFamily: 'Impact, sans-serif', textTransform: 'uppercase', lineHeight: 0.9 }}>{content.title}</h2>
        <h2 style={{ color: '#00f2ff', fontSize: '1.8rem', margin: '5px 0 20px 0', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '2px' }}>{content.subtitle}</h2>
        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', borderLeft: '2px solid #00f2ff', paddingLeft: '15px' }}>{content.overview}</p>
        
        {content.link && (
          <a href={content.link} style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, background: '#00f2ff', color: '#000' }} whileTap={{ scale: 0.95 }}
              style={{ marginTop: '30px', padding: '12px 25px', background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px', fontSize: '0.8rem' }}
            >
              LAUNCH EXPERIENCE ↗
            </motion.button>
          </a>
        )}
      </motion.div>

      {/* RIGHT PANEL */}
      {(content.tech.length > 0 || content.approach.length > 0) && (
        <motion.div 
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ position: 'absolute', top: '15%', right: '5%', width: '300px', textAlign: 'right', pointerEvents: 'auto' }}
        >
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '10px', fontFamily: 'monospace' }}>TECH STACK</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '8px' }}>
              {content.tech.map((t) => (
                <span key={t} style={{ background: 'rgba(0, 242, 255, 0.1)', border: '1px solid rgba(0, 242, 255, 0.2)', color: '#00f2ff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{t}</span>
              ))}
            </div>
          </div>
          {content.approach.length > 0 && (
            <div>
              <h3 style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '15px', fontFamily: 'monospace' }}>DEVELOPMENT APPROACH</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {content.approach.map((item, i) => (
                  <div key={i} style={{ borderRight: '1px solid #333', paddingRight: '10px' }}>
                    <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ color: '#999', fontSize: '0.75rem', lineHeight: '1.4' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {content.credits && (
            <div style={{ marginTop: '30px', color: '#444', fontSize: '0.6rem', fontFamily: 'monospace' }}>CREDITS: {content.credits}</div>
          )}
        </motion.div>
      )}

      {/* BACK BUTTON */}
      <button 
        onClick={onBack}
        style={{ position: 'absolute', bottom: '40px', left: '50px', pointerEvents: 'auto', background: 'none', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
      >
        <span style={{ fontSize: '1.2rem', color: '#00f2ff' }}>←</span> Return to Hub
      </button>
    </>
  )
}