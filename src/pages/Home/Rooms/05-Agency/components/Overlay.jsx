import React, { useRef, useState, useEffect } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './Awebco.css'
import { PROJECTS } from '../Experience'

const PROJECT_TEXT = [
  { title: 'ATLAS TOTAL HOME', features: ['+ 3D WEB DESIGN', '+ REACT INTEGRATION', '+ CUSTOM BRANDING'] },
  { title: 'VILLAGE OF TILTON', features: ['+ CIVIC PORTAL', '+ CMS INTEGRATION', '+ ACCESSIBILITY'] },
  { title: 'FETCH & FIX DIGITAL', features: ['+ AGENCY BRANDING', '+ SEO OPTIMIZATION', '+ LEAD GENERATION'] }
]

export default function Overlay() {
  const scroll = useScroll()
  const heroRef = useRef()
  const panelRefs = useRef([])
  
  // Track mobile state for dynamic positioning
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useFrame(() => {
    const offset = scroll.offset

    if (heroRef.current) {
      heroRef.current.style.opacity = 1 - THREE.MathUtils.smoothstep(offset, 0.1, 0.25)
      heroRef.current.style.transform = `translate(-50%, ${-50 - offset * 50}%)`
    }

    PROJECTS.forEach((proj, index) => {
      const panel = panelRefs.current[index]
      if (panel) {
        const isActive = offset >= proj.start && offset <= proj.end
        panel.style.opacity = isActive ? 1 : 0
        
        if (isMobile) {
          // Mobile: Slide up from the bottom
          panel.style.left = '50%'
          panel.style.transform = isActive ? 'translate(-50%, -100%)' : 'translate(-50%, 50%)'
          panel.style.top = isActive ? '95%' : '120%'
        } else {
          // Desktop: Slide in from the left
          panel.style.left = isActive ? '4%' : '-50%'
          panel.style.top = '50%'
          panel.style.transform = 'translateY(-50%)'
        }
      }
    })
  })

  return (
    <div style={{ width: '100vw', height: '800vh', position: 'relative', pointerEvents: 'none' }}>
      
      {/* HERO TEXT - Responsive Font Sizes */}
      <div 
        ref={heroRef}
        style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 1000, width: '100%' }}
      >
        <h1 className="font-heading" style={{ fontSize: isMobile ? '15vw' : '8vw', margin: 0 }}>AWEBCO</h1>
        <p className="font-mono" style={{ fontSize: isMobile ? '3vw' : '1.2vw', letterSpacing: '0.5em', color: '#CC3333' }}>FEATURED PROJECTS</p>
      </div>

      {PROJECTS.map((proj, index) => (
        <div 
          key={proj.id}
          ref={(el) => (panelRefs.current[index] = el)}
          className="project-panel-container"
          style={{
            position: 'fixed',
            width: isMobile ? '90vw' : '25vw',
            zIndex: 1001,
            pointerEvents: 'auto',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease'
          }}
        >
          <div className="project-section" style={{ 
            background: 'rgba(5, 5, 5, 0.95)', 
            padding: isMobile ? '20px' : '30px', 
            borderLeft: '4px solid #CC3333', 
            borderRadius: '8px' 
          }}>
            <h2 className="font-heading" style={{ fontSize: isMobile ? '6vw' : '2vw', marginBottom: '10px' }}>
              {PROJECT_TEXT[index].title}
            </h2>
            <ul className="font-mono" style={{ listStyle: 'none', padding: 0, color: '#aaa', lineHeight: '2', fontSize: isMobile ? '3vw' : '1vw' }}>
              {PROJECT_TEXT[index].features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
            <button 
              className="animate-cta" 
              style={{ marginTop: '20px', width: isMobile ? '100%' : 'auto' }}
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