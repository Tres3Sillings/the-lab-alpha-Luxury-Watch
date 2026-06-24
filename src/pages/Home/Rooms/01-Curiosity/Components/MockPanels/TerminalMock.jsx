import React, { useState, useEffect } from 'react'

export default function TerminalMock() {
  const [lines, setLines] = useState([
    "SYSTEM BOOT: v0.1-ALPHA",
    "LOADING CURIOSITY ENGINE...",
    "CONNECTING TO DEVTOOLS PORT 9000...",
    "INSPECTING HTML DOM TREE...",
    "WARNING: REPETITIVE ACCOUNTING THREAD FOUND.",
    "OVERRIDING PATHWAY... CONVERTING TO DEVELOPER."
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const sysLogs = [
        "DOM tree querySelectorAll('button') -> success",
        "Chrome DevTools inspector loaded.",
        "math.calculateAccounts() returned standard numbers.",
        "Math is now measured in pixels. screenX: 1920, screenY: 1080",
        "Initializing creative coder terminal...",
        "Flickering phosphor screen active."
      ]
      const log = sysLogs[Math.floor(Math.random() * sysLogs.length)]
      setLines(prev => [...prev.slice(-6), log])
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="terminal-mock">
      <div className="terminal-titlebar">
        <span className="term-dot red"></span>
        <span className="term-dot yellow"></span>
        <span className="term-dot green"></span>
        <span className="term-title">curiosity_terminal.sh</span>
      </div>
      <div className="terminal-screen">
        {lines.map((l, i) => (
          <div key={i} className="term-line">&gt; {l}</div>
        ))}
        <div className="term-cursor-line">
          <span>&gt; </span>
          <span className="term-cmd">cd /dreams</span>
          <span className="term-cursor">█</span>
        </div>
      </div>
    </div>
  )
}
