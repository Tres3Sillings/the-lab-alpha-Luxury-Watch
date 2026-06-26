import React from 'react'

export default function PageLoader() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#050505',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '2px solid rgba(0, 242, 255, 0.1)',
        borderTop: '2px solid #00f2ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px',
        boxShadow: '0 0 10px rgba(0, 242, 255, 0.2)'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        color: '#00f2ff',
        fontSize: '10px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        opacity: 0.8
      }}>
        Loading Telemetry...
      </div>
    </div>
  )
}
