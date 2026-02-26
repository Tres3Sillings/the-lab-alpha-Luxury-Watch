import React from 'react'

const ProjectSection = ({ title, url, specs, align = "right" }) => {
  const isMobile = window.innerWidth < 768;

  return (
    <section style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : (align === "right" ? "flex-end" : "flex-start"),
      padding: '0 5%',
      // Pointer-events: none on the section ensures we can still grab the 3D scene 
      // in the empty space between the HUD and the planets
      pointerEvents: 'none',
    }}>
      <div 
        style={{
          width: isMobile ? '95%' : '650px',
          background: 'rgba(0, 20, 40, 0.85)',
          backdropFilter: 'blur(20px)',
          borderLeft: align === "right" ? 'none' : '4px solid #CC3333',
          borderRight: align === "right" ? '4px solid #CC3333' : 'none',
          padding: isMobile ? '25px' : '40px',
          textAlign: align,
          // Pointer-events: all allows the user to click buttons and scroll the iframe
          pointerEvents: 'all',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          position: 'relative',
          borderRadius: '2px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <h3 style={{ color: '#CC3333', letterSpacing: '6px', margin: 0, fontSize: '0.7rem', fontWeight: 'bold' }}>
          INTEL_NODE_v.2026
        </h3>
        <h2 style={{ color: 'white', fontSize: isMobile ? '2.2rem' : '4rem', margin: '10px 0', fontWeight: '900' }}>
          {title}
        </h2>
        
        {/* IMPROVED IFRAME VIEWPORT */}
        <div style={{ 
          width: '100%', 
          height: isMobile ? '280px' : '350px', 
          background: '#000', 
          margin: '25px 0', 
          overflow: 'hidden', 
          border: '1px solid rgba(255,255,255,0.15)',
          position: 'relative',
          borderRadius: '4px'
        }}>
          {/* Note: For the iframe to be truly interactable, we remove 'pointer-events: none'.
            However, this means scrolling over the iframe will scroll the website INSIDE, 
            not your main page. Users must scroll on the dark background to continue the flight.
          */}
          <iframe 
            src={url} 
            style={{ 
              width: isMobile ? '1200px' : '1920px', 
              height: isMobile ? '1600px' : '1080px', 
              transform: `scale(${isMobile ? 0.23 : 0.33})`, 
              transformOrigin: '0 0', 
              border: 'none',
              background: 'white'
            }} 
            title={title} 
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', flexDirection: isMobile ? 'column' : 'row' }}>
          <button 
            className="animate-cta" 
            onClick={() => window.open(url, '_blank')}
            style={{ flex: 1, fontWeight: 'bold' }}
          >
            OPEN FULL SITE
          </button>
        </div>

        <div style={{ 
          color: '#8db9e2', 
          fontSize: '0.85rem', 
          textAlign: 'left', 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '20px',
          marginTop: '25px'
        }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#CC3333', marginRight: '12px' }}>▶</span>
              <span style={{ fontFamily: 'monospace', opacity: 0.9 }}>{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Overlay() {
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ width: '100vw', fontFamily: '"Courier New", Courier, monospace', color: 'white' }}>
      {/* HERO SECTION */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%' }}>
        <h1 style={{ fontSize: isMobile ? '4.5rem' : '10rem', color: 'white', margin: 0, fontWeight: '900', lineHeight: 0.9 }}>
          AWEBCO
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ width: isMobile ? '30px' : '60px', height: '3px', background: '#CC3333', marginRight: '20px' }} />
          <p style={{ color: '#CC3333', letterSpacing: isMobile ? '4px' : '12px', fontSize: isMobile ? '1rem' : '1.5rem', margin: 0, fontWeight: 'bold' }}>
            EST. 2026 // ILLINOIS
          </p>
        </div>
      </section>

      {/* PROJECT NODES */}
      <ProjectSection 
        title="SABREBATS" 
        url="https://www.sabrebats.com/" 
        align="right" 
        specs={["React Deployment", "3D Asset Management", "Custom UI Architecture"]} 
      />
      
      <ProjectSection 
        title="ATLAS" 
        url="https://atlastotalhome.com/" 
        align="left" 
        specs={["Lead Generation Hub", "High-Performance SEO", "Conversion Optimization"]} 
      />
      
      <ProjectSection 
        title="SENTRY" 
        url="https://sentryroofing.com/" 
        align="right" 
        specs={["Industrial SEO Strategy", "Legacy Brand Refresh", "Scalable Performance"]} 
      />
      
      {/* Spacer for final scroll clearance */}
      <section style={{ height: '50vh' }} />
    </div>
  )
}