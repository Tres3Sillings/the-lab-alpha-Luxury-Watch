import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Activity, Gauge, Layers, Volume2, Code, Image, FileText, X, ShieldAlert } from 'lucide-react'
import './PerformanceHUD.css'

import HUD_DATABASE from '../data/performanceMetrics.json'

// Fallback default statistics when routing doesn't match
const DEFAULT_STATS = {
  chapter: 'SYSTEM',
  title: 'Portfolio Index',
  rating: 'A++',
  totalSize: '15 KB',
  accentColor: '#00f2ff',
  accentColorRgb: '0, 242, 255',
  refCompare: '99.3% lighter than the average web page!',
  refCompareVal: 99.3,
  description: 'Tres Sillings Portfolio Main Frame. Highly minimized dependencies, compiled for maximum Client-Side response speeds.',
  breakdown: [
    { name: 'Portfolio Core Engine', size: '15.0 KB', type: 'code' }
  ],
  techs: ['React', 'Vite', 'Production CSS']
}

export default function PerformanceHUD() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const hudRef = useRef(null)

  // Get active statistics matching the path
  const activeStats = useMemo(() => {
    const path = location.pathname.toLowerCase()
    return HUD_DATABASE[path] || DEFAULT_STATS
  }, [location.pathname])

  // Custom icon map for file breakdown types
  const getFileIcon = (type) => {
    switch (type) {
      case 'model': return <Layers className="perf-hud-file-icon" size={10} />
      case 'audio': return <Volume2 className="perf-hud-file-icon" size={10} />
      case 'code': return <Code className="perf-hud-file-icon" size={10} />
      case 'image': return <Image className="perf-hud-file-icon" size={10} />
      default: return <FileText className="perf-hud-file-icon" size={10} />
    }
  }

  // Handle click outside to collapse card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && hudRef.current && !hudRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Update document body variables to dynamically matching colors
  useEffect(() => {
    if (activeStats) {
      document.documentElement.style.setProperty('--hud-accent', activeStats.accentColor)
      document.documentElement.style.setProperty('--hud-accent-rgb', activeStats.accentColorRgb)
    }
  }, [activeStats])

  return (
    <div className="perf-hud-container" ref={hudRef}>
      {/* ── Compact Badge Button ── */}
      {!isOpen && (
        <button
          className="perf-hud-pill"
          onClick={() => setIsOpen(true)}
          style={{ cursor: 'pointer', border: '1px solid var(--hud-accent)' }}
          title="Click to analyze page load weight and code optimization"
        >
          <Activity className="perf-hud-icon-pulse" size={12} />
          <span>PAYLOAD: {activeStats.totalSize}</span>
        </button>
      )}

      {/* ── Telemetry Expanded Panel ── */}
      {isOpen && (
        <div className="perf-hud-card">
          {/* Header */}
          <div className="perf-hud-header">
            <div className="perf-hud-meta">
              <span className="perf-hud-chapter-tag">{activeStats.chapter} / SYSTEM TELEMETRY</span>
              <h3 className="perf-hud-title">{activeStats.title}</h3>
            </div>
            <button className="perf-hud-close-btn" onClick={() => setIsOpen(false)}>
              <X size={15} />
            </button>
          </div>

          {/* Rating & Size Displays */}
          <div className="perf-hud-main-stats">
            <div className="perf-hud-payload-display">
              <span className="perf-hud-payload-val">{activeStats.totalSize}</span>
              <span className="perf-hud-payload-lbl">Network Payload</span>
            </div>
            <div
              className="perf-hud-rating-badge"
              style={{ color: activeStats.accentColor }}
            >
              {activeStats.rating}
            </div>
          </div>

          {/* Optimization Graph vs Web average */}
          <div className="perf-hud-compare-section">
            <div className="perf-hud-compare-text">
              {activeStats.refCompare}
            </div>
            {activeStats.refCompareVal > 0 && (
              <div className="perf-hud-bar-container">
                <div className="perf-hud-bar-row">
                  <div className="perf-hud-bar-labels">
                    <span>This Page ({activeStats.totalSize})</span>
                    <span>{activeStats.refCompareVal.toFixed(0)}%</span>
                  </div>
                  <div className="perf-hud-bar-bg">
                    <div
                      className="perf-hud-bar-fill"
                      style={{
                        width: `${Math.max(5, 100 - activeStats.refCompareVal)}%`,
                        background: 'var(--hud-accent)'
                      }}
                    />
                  </div>
                </div>

                <div className="perf-hud-bar-row">
                  <div className="perf-hud-bar-labels">
                    <span>Web Average (2.4 MB)</span>
                    <span>100%</span>
                  </div>
                  <div className="perf-hud-bar-bg">
                    <div
                      className="perf-hud-bar-fill"
                      style={{ width: '100%', background: '#666' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Asset Breakdown Table */}
          <div className="perf-hud-breakdown-title">Asset Breakdown</div>
          <table className="perf-hud-table">
            <tbody>
              {activeStats.breakdown?.map((item, idx) => (
                <tr key={idx}>
                  <td className="perf-hud-file-name">
                    {getFileIcon(item.type)}
                    <span>{item.name}</span>
                  </td>
                  <td className="perf-hud-file-size">{item.size}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Explanation Text */}
          <div className="perf-hud-desc">
            {activeStats.description}
          </div>

          {/* Technologies Tag Cloud */}
          <div className="perf-hud-techs">
            {activeStats.techs?.map((tech, idx) => (
              <span key={idx} className="perf-hud-tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
