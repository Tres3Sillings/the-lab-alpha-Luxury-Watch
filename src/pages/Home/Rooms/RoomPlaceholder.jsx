import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './RoomPlaceholder.css'
import PerformanceHUD from '../../../components/PerformanceHUD'

// ── Shared chapter navigation order ─────────────────────────────────────────
export const JOURNEY = [
  { id: '01', label: 'Curiosity',   path: '/curiosity' },
  { id: '02', label: 'Experiments', path: '/experiments' },
  { id: '03', label: 'Building',    path: '/building' },
  { id: '04', label: 'Freelance',   path: '/freelance' },
  { id: '05', label: 'Agency',      path: '/agency' },
  { id: '06', label: 'Playground',  path: '/playground' },
  { id: '07', label: 'The Future',  path: '/future' },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function RoomPlaceholder({ chapter, IntroComponent }) {
  const navigate = useNavigate()
  const [dismissed, setDismissed]             = useState(false)
  const [scrollProgress, setScrollProgress]   = useState(0)  // 0–100 forward
  const [backProgress, setBackProgress]       = useState(0)  // 0–100 backward
  const [lastScrollDirection, setLastScrollDirection] = useState('forward')

  const idx      = JOURNEY.findIndex(s => s.id === chapter.id)
  const nextStep = JOURNEY[(idx + 1) % JOURNEY.length]
  const prevStep = JOURNEY[(idx - 1 + JOURNEY.length) % JOURNEY.length]

  // Auto-dismiss intro after 12 s
  useEffect(() => {
    const t = setTimeout(() => setDismissed(true), 12000)
    return () => clearTimeout(t)
  }, [])

  // Scroll navigation — forward + backward with wrap-around
  useEffect(() => {
    let fwd = 0
    let bwd = 0

    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        fwd = Math.min(100, fwd + e.deltaY * 0.18)
        bwd = Math.max(0, bwd - 4)
        setLastScrollDirection('forward')
      } else {
        bwd = Math.min(100, bwd + Math.abs(e.deltaY) * 0.18)
        fwd = Math.max(0, fwd - 4)
        setLastScrollDirection('backward')
      }
      setScrollProgress(fwd)
      setBackProgress(bwd)
      if (fwd >= 100) navigate(nextStep.path)
      if (bwd >= 100) navigate(prevStep.path)
    }

    let touchStartY = 0
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const handleTouchMove  = (e) => {
      const diff = touchStartY - e.touches[0].clientY
      if (diff > 0) {
        fwd = Math.min(100, fwd + diff * 0.5)
        bwd = Math.max(0, bwd - 4)
        setLastScrollDirection('forward')
      } else {
        bwd = Math.min(100, bwd + Math.abs(diff) * 0.5)
        fwd = Math.max(0, fwd - 4)
        setLastScrollDirection('backward')
      }
      setScrollProgress(fwd)
      setBackProgress(bwd)
      touchStartY = e.touches[0].clientY
      if (fwd >= 100) navigate(nextStep.path)
      if (bwd >= 100) navigate(prevStep.path)
    }

    const decay = setInterval(() => {
      fwd = Math.max(0, fwd - 1.5)
      bwd = Math.max(0, bwd - 1.5)
      setScrollProgress(fwd)
      setBackProgress(bwd)
    }, 100)

    window.addEventListener('wheel',      handleWheel,      { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove',  handleTouchMove,  { passive: true })
    return () => {
      window.removeEventListener('wheel',      handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove',  handleTouchMove)
      clearInterval(decay)
    }
  }, [dismissed, nextStep.path, prevStep.path])

  return (
    <div className="rp-container" style={{ '--accent': chapter.color }}>

      {/* Ambient glow blob */}
      <div className="rp-glow" />

      {/* Giant background chapter number */}
      <div className="rp-bg-number">{chapter.id}</div>

      {/* ── Timeline Nav ─────────────────────────── */}
      <header className="timeline-header">
        <div className="timeline-line" />
        {JOURNEY.map((step) => (
          <button
            key={step.id}
            className={`timeline-node ${step.id === chapter.id ? 'active' : ''}`}
            onClick={() => navigate(step.path)}
          >
            <div className="node-circle">{step.id}</div>
            <span className="node-label">{step.label}</span>
          </button>
        ))}
      </header>

      {/* ── Intro Overlay ────────────────────────── */}
      <div className={`rp-intro-overlay ${dismissed ? 'dismissed' : ''}`}>
        {IntroComponent ? (
          <IntroComponent onBegin={() => setDismissed(true)} />
        ) : (
          <div className="rp-intro-content">
            <div className="rp-chapter-tag">CHAPTER {chapter.id}</div>
            <h1>{chapter.title.toUpperCase()}</h1>
            <h2>{chapter.theme}</h2>
            <p>{chapter.story}</p>
            <button className="rp-begin-btn" onClick={() => setDismissed(true)}>
              ENTER CHAPTER {chapter.id}
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content (visible after dismiss) ── */}
      <main className={`rp-main ${dismissed ? 'visible' : ''}`}>
        <div className="rp-chapter-id-tag">
          <span>{chapter.id}</span> / 07
        </div>
        <h1 className="rp-title">{chapter.title}</h1>
        <p className="rp-theme-quote">"{chapter.theme}"</p>

        {chapter.highlights && (
          <div className="rp-highlights">
            {chapter.highlights.map((h) => (
              <span key={h} className="rp-highlight-tag">{h}</span>
            ))}
          </div>
        )}

        <div className="rp-coming-soon">
          <span className="rp-cs-dot" />
          3D ENVIRONMENT IN PROGRESS
        </div>
      </main>

      {/* Unified Scroll Indicator (Top) */}
      <button
        className="unified-scroll-indicator"
        style={{
          opacity: (lastScrollDirection === 'forward' ? scrollProgress : backProgress) > 0 ? 1 : 0.45
        }}
        onClick={() => navigate(lastScrollDirection === 'forward' ? nextStep.path : prevStep.path)}
      >
        <span className="unified-scroll-text">
          {lastScrollDirection === 'forward'
            ? `↓ CONTINUE — ${nextStep.label.toUpperCase()}`
            : `↑ BACK — ${prevStep.label.toUpperCase()}`}
        </span>
        <div className="unified-progress-wrap">
          <div
            className="unified-progress-bar"
            style={{
              width: `${lastScrollDirection === 'forward' ? scrollProgress : backProgress}%`
            }}
          />
        </div>
      </button>

      {/* Performance Stats HUD Overlay */}
      <PerformanceHUD />

    </div>
  )
}
