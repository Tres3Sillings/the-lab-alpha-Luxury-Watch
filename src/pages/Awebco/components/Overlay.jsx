import React, { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './Awebco.css'
import { PROJECTS } from '../Experience' // Import the configuration array

// Array holding the text data for each project
const PROJECT_TEXT = [
  { title: 'ATLAS TOTAL HOME', features: ['+ 3D WEB DESIGN', '+ REACT INTEGRATION', '+ CUSTOM BRANDING'] },
  { title: 'VILLAGE OF TILTON', features: ['+ CIVIC PORTAL', '+ CMS INTEGRATION', '+ ACCESSIBILITY'] },
  { title: 'FETCH & FIX DIGITAL', features: ['+ AGENCY BRANDING', '+ SEO OPTIMIZATION', '+ LEAD GENERATION'] }
]

export default function Overlay() {
  const scroll = useScroll()
  const heroRef = useRef()
  
  // We use an array of refs to control the 3 different text panels
  const panelRefs = useRef([])

  useFrame(() => {
    const offset = scroll.offset

    // 1. Hero Text Fade
    if (heroRef.current) {
      heroRef.current.style.opacity = 1 - THREE.MathUtils.smoothstep(offset, 0.1, 0.25)
      heroRef.current.style.transform = `translate(-50%, ${-50 - offset * 50}%)`
    }

    // 2. Map through text panels and apply slide logic
    PROJECTS.forEach((proj, index) => {
      const panel = panelRefs.current[index]
      if (panel) {
        const isActive = offset >= proj.start && offset <= proj.end
        panel.style.opacity = isActive ? 1 : 0
        
        // Slide text in from Left (-50%), stop at Left Edge (10%), exit Left (-50%)
        let textSlide = '-50%' 
        if (isActive) textSlide = '8%' 
        
        panel.style.left = textSlide
      }
    })
  })

  return (
    <div style={{ width: '100vw', height: '800vh', position: 'relative' }}>
      
      {/* HERO TEXT */}
      <div 
        ref={heroRef}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 1000 }}
      >
        <h1 className="font-heading" style={{ fontSize: '8vw', margin: 0 }}>AWEBCO</h1>
        <p className="font-mono" style={{ fontSize: '1.2vw', letterSpacing: '0.5em', color: '#CC3333' }}>DIGITAL SOLUTIONS</p>
      </div>

      {/* RENDER THE 3 FEATURE PANELS */}
      {PROJECTS.map((proj, index) => (
        <div 
          key={proj.id}
          ref={(el) => (panelRefs.current[index] = el)}
          style={{
            position: 'fixed',
            top: '50%',
            left: '-50%', // Starts hidden on the left
            transform: 'translateY(-50%)',
            width: '25vw',
            zIndex: 1001,
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease'
          }}
        >
          <div className="project-section" style={{ background: 'rgba(5, 5, 5, 0.95)', padding: '30px', borderLeft: '4px solid #CC3333', borderRadius: '8px' }}>
            <h2 className="font-heading" style={{ fontSize: '2vw', marginBottom: '10px' }}>
              {PROJECT_TEXT[index].title}
            </h2>
            <ul className="font-mono" style={{ listStyle: 'none', padding: 0, color: '#aaa', lineHeight: '2' }}>
              {PROJECT_TEXT[index].features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
            <button 
              className="animate-cta" 
              style={{ marginTop: '20px' }}
              onClick={() => window.open(proj.url, '_blank')}
            >
              VISIT LIVE SITE
            </button>
          </div>
        </div>
      ))}

    </div>
  )
}