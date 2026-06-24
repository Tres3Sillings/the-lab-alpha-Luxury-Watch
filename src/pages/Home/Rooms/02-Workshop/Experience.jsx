import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { SheetProvider, PerspectiveCamera, editable as e } from '@theatre/r3f'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { Environment, ContactShadows } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { Model as WorkshopModel } from './Components/02-EXPERERMENT.jsx'
import '../01-Curiosity/Home.css' // Import shared premium folder, drawer, and shop styles
import projectState from './Workshop Project.theatre-project-state.json'

// Reuse drawer components from Room 1 Curiosity
import AchievementsDrawer from '../01-Curiosity/Components/Drawers/AchievementsDrawer'
import ShopDrawer from '../01-Curiosity/Components/Drawers/ShopDrawer'
import { enableSoundEffects, disableSoundEffects } from '../01-Curiosity/Components/SoundEffects'

// Initialize Theatre.js studio only in development
if (import.meta.env.DEV) {
  studio.initialize()
  studio.extend(extension)
}

const project = getProject('Workshop Project', { state: projectState })
const sheet = project.sheet('Workshop Scene')

const WORKSHOP_DETAILS = {
  Laptop: {
    title: "02 / 3D ROOM PLAYGROUND",
    subtitle: "Custom 3D Scene Configurator",
    desc: "A fully interactive 3D editor built in React Three Fiber that lets users design and organize interior rooms.\n\nExperiment with dynamic layout systems, custom lights, shadows, and gltf asset placement in real-time.\n\nClick the button below to launch the interactive demo page.",
    link: "/editor-demo",
    btnText: "Launch 3D Playground"
  },
  Book: {
    title: "02 / NIKE CUSTOMIZER",
    subtitle: "Three.js Sneaker Colorizer",
    desc: "Interactive Nike shoe customization workbench.\n\nSelect specific mesh segments (swoosh, laces, sole, collar) and paint them with high-fidelity materials, orbit control viewing, and touch gestures.\n\nClick below to start customizing.",
    link: "/shoe",
    btnText: "Customize Sneaker"
  },
  Notebook1: {
    title: "02 / COFFIN DESIGNER",
    subtitle: "Skeuomorphic Configurator Workbench",
    desc: "A creative configuration app showcasing custom wood textures, metallic trim parameters, and custom hardware accessories for 3D modeling renders.\n\nBuilt in React Three Fiber and OrbitControls.",
    link: "/coffin-editor",
    btnText: "Launch Coffin Editor"
  },
  Notebook2: {
    title: "02 / KING'S MAKER FORGE",
    subtitle: "3D Sword Builder",
    desc: "Step into the custom forge and assemble standard blades, handles, and guards with metallic reflection overlays.\n\nChoose colors and select parts visually.",
    link: "/forge",
    btnText: "Enter Forge"
  },
  Cup: {
    title: "02 / CODING STATS",
    subtitle: "Late Night Code Fuel",
    desc: "Ambient stats dashboard tracking caffeine inputs and developer hours.\n\nEst. 2,100 cups consumed. Best ideas usually come after midnight.",
    link: null,
    btnText: ""
  }
}

export default function WorkshopExperience() {
  const navigate = useNavigate()
  const [selectedElement, setSelectedElement] = useState(null)
  const [dismissedIntro, setDismissedIntro] = useState(false)
  const [scrollProgress, setScrollProgress]     = useState(0)
  const [backScrollProgress, setBackScrollProgress] = useState(0)

  // Wallet & Shop States (shared via LocalStorage)
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const saved = localStorage.getItem('the-lab-achievements')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })
  const [showAchievements, setShowAchievements] = useState(false)
  const [toast, setToast] = useState(null)

  const [walletBalance, setWalletBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('the-lab-wallet')
      return saved ? parseInt(saved, 10) : 0
    } catch (e) {
      return 0
    }
  })
  
  const [claimedAchievements, setClaimedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem('the-lab-claimed-achievements')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [unlockedShopItems, setUnlockedShopItems] = useState(() => {
    try {
      const saved = localStorage.getItem('the-lab-purchased-items')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [activeCursor, setActiveCursor] = useState(() => {
    try {
      const saved = localStorage.getItem('the-lab-active-cursor')
      return saved ? saved : 'default'
    } catch (e) {
      return 'default'
    }
  })

  const [crtTheme, setCrtTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('the-lab-crt-theme')
      return saved ? saved : 'green'
    } catch (e) {
      return 'green'
    }
  })

  const [soundsEnabled, setSoundsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('the-lab-sounds-enabled')
      return saved !== 'false'
    } catch (e) {
      return true
    }
  })

  const [showShop, setShowShop] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [lofiPlaying, setLofiPlaying] = useState(() => {
    try {
      return localStorage.getItem('the-lab-lofi-playing') === 'true'
    } catch (e) {
      return false
    }
  })

  // Particle Engine Canvas Refs
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0, moved: false })

  // Auto-dismiss the intro after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setDismissedIntro(true)
    }, 15000)
    return () => clearTimeout(timer)
  }, [])

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('the-lab-wallet', walletBalance.toString())
  }, [walletBalance])

  useEffect(() => {
    localStorage.setItem('the-lab-claimed-achievements', JSON.stringify(claimedAchievements))
  }, [claimedAchievements])

  useEffect(() => {
    localStorage.setItem('the-lab-purchased-items', JSON.stringify(unlockedShopItems))
  }, [unlockedShopItems])

  useEffect(() => {
    localStorage.setItem('the-lab-active-cursor', activeCursor)
  }, [activeCursor])

  useEffect(() => {
    localStorage.setItem('the-lab-crt-theme', crtTheme)
  }, [crtTheme])

  // Enable/disable sound effects globally when the shop item is purchased and toggled on/off
  useEffect(() => {
    if (unlockedShopItems.includes('sound_effects') && soundsEnabled) {
      enableSoundEffects()
    } else {
      disableSoundEffects()
    }
  }, [unlockedShopItems, soundsEnabled])

  // Sync sounds enabled status
  useEffect(() => {
    localStorage.setItem('the-lab-sounds-enabled', soundsEnabled.toString())
  }, [soundsEnabled])

  // Clear toast notifications after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Accumulate 10 coins per minute
  useEffect(() => {
    const coinInterval = setInterval(() => {
      setWalletBalance(prev => {
        const newBal = prev + 10
        setToast({
          title: "EXPLORER BONUS!",
          desc: "+10 Coins awarded for exploring.",
          icon: "💰"
        })
        return newBal
      })
    }, 60000)
    return () => clearInterval(coinInterval)
  }, [])

  // Mouse Move listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.moved = true
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Canvas particle loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    let animationFrameId
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity || 0
        p.alpha -= p.decay
        p.rotation += p.vRotation || 0
        
        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }
        
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        
        if (p.type === 'confetti') {
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        } else if (p.type === 'gold_sparkle') {
          ctx.fillStyle = '#c5a880'
          ctx.beginPath()
          ctx.moveTo(0, -p.size)
          ctx.lineTo(p.size * 0.3, -p.size * 0.3)
          ctx.lineTo(p.size, 0)
          ctx.lineTo(p.size * 0.3, p.size * 0.3)
          ctx.lineTo(0, p.size)
          ctx.lineTo(-p.size * 0.3, p.size * 0.3)
          ctx.lineTo(-p.size, 0)
          ctx.lineTo(-p.size * 0.3, -p.size * 0.3)
          ctx.closePath()
          ctx.fill()
        } else if (p.type === 'flame') {
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'matrix') {
          ctx.fillStyle = `rgba(39, 201, 63, ${p.alpha})`
          ctx.font = `${p.size}px monospace`
          ctx.fillText(p.char, -p.size / 2, p.size / 2)
        } else if (p.type === 'rainbow_sparkle') {
          ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`
          ctx.beginPath()
          ctx.moveTo(0, -p.size)
          ctx.lineTo(p.size * 0.3, -p.size * 0.3)
          ctx.lineTo(p.size, 0)
          ctx.lineTo(p.size * 0.3, p.size * 0.3)
          ctx.lineTo(0, p.size)
          ctx.lineTo(-p.size * 0.3, p.size * 0.3)
          ctx.lineTo(-p.size, 0)
          ctx.lineTo(-p.size * 0.3, -p.size * 0.3)
          ctx.closePath()
          ctx.fill()
        }
        
        ctx.restore()
      }
      
      if (mouseRef.current.moved) {
        if (activeCursor === 'gold') {
          for (let j = 0; j < 2; j++) {
            particles.push({
              type: 'gold_sparkle',
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2 - 0.5,
              size: Math.random() * 5 + 3,
              alpha: 1,
              decay: Math.random() * 0.02 + 0.015,
              rotation: Math.random() * Math.PI,
              vRotation: (Math.random() - 0.5) * 0.05
            })
          }
        } else if (activeCursor === 'flame') {
          for (let j = 0; j < 3; j++) {
            particles.push({
              type: 'flame',
              x: mouseRef.current.x + (Math.random() - 0.5) * 10,
              y: mouseRef.current.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -Math.random() * 2 - 1.0,
              size: Math.random() * 10 + 6,
              alpha: 1,
              decay: Math.random() * 0.035 + 0.025,
              color: Math.random() > 0.4 ? '#ff5f1f' : (Math.random() > 0.5 ? '#ff2a00' : '#ffe600')
            })
          }
        } else if (activeCursor === 'matrix') {
          if (Math.random() > 0.5) {
            particles.push({
              type: 'matrix',
              x: mouseRef.current.x + (Math.random() - 0.5) * 16,
              y: mouseRef.current.y + 10,
              vx: (Math.random() - 0.5) * 0.2,
              vy: Math.random() * 1.5 + 1.0,
              size: 10,
              alpha: 1,
              decay: Math.random() * 0.02 + 0.01,
              char: Math.floor(Math.random() * 10).toString()
            })
          }
        } else if (activeCursor === 'rainbow') {
          for (let j = 0; j < 2; j++) {
            particles.push({
              type: 'rainbow_sparkle',
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              size: Math.random() * 6 + 3,
              alpha: 1,
              decay: Math.random() * 0.025 + 0.015,
              hue: (Date.now() / 10 + Math.random() * 30) % 360,
              rotation: Math.random() * Math.PI,
              vRotation: (Math.random() - 0.5) * 0.05
            })
          }
        }
        mouseRef.current.moved = false
      }
      
      animationFrameId = requestAnimationFrame(render)
    }
    
    render()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [activeCursor])

  // Confetti popper
  const triggerConfettiExplosion = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = ['#ff5f56', '#ffd65f', '#61dafb', '#c5a880', '#27c93f', '#ff79c6']
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        type: 'confetti',
        x: canvas.width / 2,
        y: canvas.height / 2 - 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 5,
        gravity: 0.25,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.2
      })
    }
  }

  // Claim sparkle
  const triggerClaimBurst = (clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const spawnX = clientX || canvas.width / 2
    const spawnY = clientY || canvas.height / 2
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push({
        type: 'gold_sparkle',
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        gravity: 0.15,
        size: Math.random() * 5 + 3,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        rotation: Math.random() * Math.PI,
        vRotation: (Math.random() - 0.5) * 0.1
      })
    }
  }

  const handleClaimPoints = (achId, clientX, clientY) => {
    if (unlocked.includes(achId) && !claimedAchievements.includes(achId)) {
      setClaimedAchievements(prev => [...prev, achId])
      setWalletBalance(prev => prev + 50)
      triggerClaimBurst(clientX, clientY)
    }
  }

  const handleBuyItem = (itemId, cost) => {
    if (walletBalance >= cost && !unlockedShopItems.includes(itemId)) {
      setWalletBalance(prev => prev - cost)
      setUnlockedShopItems(prev => [...prev, itemId])
      if (itemId.startsWith('cursor_')) {
        setActiveCursor(itemId.replace('cursor_', ''))
      }
      triggerConfettiExplosion()
    }
  }

  const handleEquipCursor = (cursorType) => {
    setActiveCursor(cursorType)
  }

  const triggerGlitchBurst = () => {
    const audio = new Audio('/glitch.mp3')
    audio.volume = 0.4
    audio.play().catch(() => {})
    setGlitchActive(true)
    setTimeout(() => {
      setGlitchActive(false)
    }, 1500)
  }

  const startLofiSynth = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    const ctx = new AudioContext()

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(550, ctx.currentTime)
    filter.connect(ctx.destination)

    const masterVol = ctx.createGain()
    masterVol.gain.setValueAtTime(0.25, ctx.currentTime)
    masterVol.connect(filter)

    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
    const crackleNode = ctx.createBufferSource()
    crackleNode.buffer = noiseBuffer
    crackleNode.loop = true
    const crackleFilter = ctx.createBiquadFilter()
    crackleFilter.type = 'bandpass'
    crackleFilter.frequency.setValueAtTime(1200, ctx.currentTime)
    crackleFilter.Q.setValueAtTime(2.5, ctx.currentTime)
    const crackleVol = ctx.createGain()
    crackleVol.gain.setValueAtTime(0.035, ctx.currentTime)
    crackleNode.connect(crackleFilter)
    crackleFilter.connect(crackleVol)
    crackleVol.connect(ctx.destination)
    crackleNode.start()

    const chordProgression = [
      [110.00, 130.81, 164.81, 196.00], // Am7
      [146.83, 185.00, 220.00, 261.63], // D7
      [98.00, 123.47, 146.83, 185.00],  // Gmaj7
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7
    ]
    let step = 0
    let isStopped = false
    const lfo = ctx.createOscillator()
    lfo.frequency.setValueAtTime(4.0, ctx.currentTime)
    const lfoGain = ctx.createGain()
    lfoGain.gain.setValueAtTime(1.2, ctx.currentTime)
    lfo.connect(lfoGain)
    lfo.start()

    function playChord(time) {
      if (isStopped) return
      const chord = chordProgression[step]
      step = (step + 1) % chordProgression.length
      const oscVol = ctx.createGain()
      oscVol.gain.setValueAtTime(0, time)
      oscVol.gain.linearRampToValueAtTime(0.12, time + 0.8)
      oscVol.gain.setValueAtTime(0.12, time + 2.5)
      oscVol.gain.exponentialRampToValueAtTime(0.001, time + 3.9)
      oscVol.connect(masterVol)
      chord.forEach((freq) => {
        const osc = ctx.createOscillator()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, time)
        lfoGain.connect(osc.frequency)
        osc.connect(oscVol)
        osc.start(time)
        osc.stop(time + 4.0)
      })
      setTimeout(() => playChord(ctx.currentTime), 4000)
    }

    function playTick(time) {
      if (isStopped) return
      const kickOsc = ctx.createOscillator()
      const kickGain = ctx.createGain()
      kickOsc.connect(kickGain)
      kickGain.connect(masterVol)
      kickOsc.frequency.setValueAtTime(110, time)
      kickOsc.frequency.exponentialRampToValueAtTime(35, time + 0.18)
      kickGain.gain.setValueAtTime(0.35, time)
      kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22)
      kickOsc.start(time)
      kickOsc.stop(time + 0.22)

      const snareTime = time + 1.0
      const snareOsc = ctx.createOscillator()
      const snareGain = ctx.createGain()
      snareOsc.connect(snareGain)
      snareGain.connect(masterVol)
      snareOsc.frequency.setValueAtTime(280, snareTime)
      snareGain.gain.setValueAtTime(0.12, snareTime)
      snareGain.gain.exponentialRampToValueAtTime(0.001, snareTime + 0.06)
      snareOsc.start(snareTime)
      snareOsc.stop(snareTime + 0.06)
      setTimeout(() => playTick(ctx.currentTime), 2000)
    }

    playChord(ctx.currentTime)
    playTick(ctx.currentTime)

    return {
      stop() {
        isStopped = true
        lfo.stop()
        crackleNode.stop()
        ctx.close()
      }
    }
  }

  const toggleLofiPlaying = () => {
    if (lofiPlaying) {
      if (window.__lofiSynth) {
        window.__lofiSynth.stop()
        window.__lofiSynth = null
      }
      setLofiPlaying(false)
      localStorage.setItem('the-lab-lofi-playing', 'false')
    } else {
      if (!window.__lofiSynth) {
        window.__lofiSynth = startLofiSynth()
      }
      setLofiPlaying(true)
      localStorage.setItem('the-lab-lofi-playing', 'true')
    }
  }

  // Memory/autoplay support: auto-resume if music was turned on
  useEffect(() => {
    if (localStorage.getItem('the-lab-lofi-playing') === 'true') {
      const tryStart = () => {
        if (!window.__lofiSynth) {
          try {
            window.__lofiSynth = startLofiSynth()
          } catch (_) {}
        }
      }
      tryStart()

      // Listen for click/touch in case browser suspended the audio context
      const resumeContext = () => {
        tryStart()
        window.removeEventListener('click', resumeContext)
        window.removeEventListener('touchstart', resumeContext)
      }
      window.addEventListener('click', resumeContext)
      window.addEventListener('touchstart', resumeContext)

      return () => {
        window.removeEventListener('click', resumeContext)
        window.removeEventListener('touchstart', resumeContext)
      }
    }
  }, [])

  // Bidirectional scroll: down → /building, up → /curiosity
  useEffect(() => {
    if (!dismissedIntro) return
    if (selectedElement || showShop || showAchievements) {
      setScrollProgress(0)
      setBackScrollProgress(0)
      return
    }

    let fwd = 0
    let bwd = 0

    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        fwd = Math.min(100, fwd + e.deltaY * 0.15)
        bwd = Math.max(0, bwd - 4)
      } else {
        bwd = Math.min(100, bwd + Math.abs(e.deltaY) * 0.15)
        fwd = Math.max(0, fwd - 4)
      }
      setScrollProgress(fwd)
      setBackScrollProgress(bwd)
      if (fwd >= 100) navigate('/building')
      if (bwd >= 100) navigate('/curiosity')
    }

    let touchStartY = 0
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const handleTouchMove  = (e) => {
      const diff = touchStartY - e.touches[0].clientY
      if (diff > 0) {
        fwd = Math.min(100, fwd + diff * 0.5)
        bwd = Math.max(0, bwd - 4)
      } else {
        bwd = Math.min(100, bwd + Math.abs(diff) * 0.5)
        fwd = Math.max(0, fwd - 4)
      }
      setScrollProgress(fwd)
      setBackScrollProgress(bwd)
      touchStartY = e.touches[0].clientY
      if (fwd >= 100) navigate('/building')
      if (bwd >= 100) navigate('/curiosity')
    }

    const decay = setInterval(() => {
      fwd = Math.max(0, fwd - 1.5)
      bwd = Math.max(0, bwd - 1.5)
      setScrollProgress(fwd)
      setBackScrollProgress(bwd)
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
  }, [dismissedIntro, selectedElement, showShop, showAchievements])

  const handleElementClick = (elementName) => {
    setSelectedElement(elementName)
  }

  const handleCloseFolder = () => {
    setSelectedElement(null)
  }

  // Navigation mapping
  const timelineSteps = [
    { id: '01', label: 'Curiosity',   path: '/curiosity' },
    { id: '02', label: 'Experiments', path: '/experiments' },
    { id: '03', label: 'Building',    path: '/building' },
    { id: '04', label: 'Freelance',   path: '/freelance' },
    { id: '05', label: 'Agency',      path: '/agency' },
    { id: '06', label: 'Playground',  path: '/playground' },
    { id: '07', label: 'The Future',  path: '/future' },
  ]

  const handleNavigation = (path) => {
    if (path.startsWith('/')) {
      navigate(path)
    }
  }

  const folderDetails = WORKSHOP_DETAILS[selectedElement]

  return (
    <div className={`home-container cursor-${activeCursor} ${glitchActive ? 'full-screen-glitch' : ''}`}>

      <div className="gradient-overlay" />

      {/* Chapter 2 Intro Overlay */}
      <div className={`intro-overlay ${dismissedIntro ? 'dismissed' : ''}`}>
        <div className="intro-content">
          <h1>02 / EXPERIMENTS</h1>
          <h2>I tried everything.</h2>
          <p>
            {`This is where ideas became reality.

Some failed. Some worked. Every project taught me something.

I wasn't chasing money — I was collecting skills.

Click on objects in the room to explore the workbench projects.`}
          </p>
          <button className="begin-btn" onClick={() => setDismissedIntro(true)}>
            ENTER THE WORKSHOP
          </button>
        </div>
      </div>

      {/* R3F Canvas */}
      <Canvas
        gl={{ toneMapping: THREE.AgXToneMapping, toneMappingExposure: 0.9 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <Suspense fallback={null}>
          <SheetProvider sheet={sheet}>
            {/* Theatre.js editable camera — no OrbitControls, fully locked */}
            <PerspectiveCamera
              theatreKey="Camera"
              makeDefault
              position={[0, 2.0, 3.5]}
              fov={45}
            />

            {/* Theatre.js editable lighting */}
            <e.ambientLight theatreKey="Ambient Light" intensity={0.7} />
            <e.pointLight theatreKey="Point Light" position={[3, 5, 3]} intensity={2.5} />
            <e.spotLight theatreKey="Spot Light" position={[-3, 6, 3]} angle={0.3} penumbra={1} intensity={1.5} />
            <Environment preset="city" />

            {/* Room 2 Model */}
            <e.group theatreKey="Workshop Model" position={[0, -0.6, 0]} rotation={[0, -Math.PI / 4, 0]}>
              <WorkshopModel onElementClick={handleElementClick} />
            </e.group>

            <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={15} blur={2.0} />
          </SheetProvider>
        </Suspense>
      </Canvas>

      {/* HTML Overlays */}
      <div className="ui-overlay">
        <header className="timeline-header">
          <div className="timeline-line" />
          {timelineSteps.map((step) => (
            <button
              key={step.id}
              className={`timeline-node ${step.id === '02' ? 'active' : ''}`}
              onClick={() => handleNavigation(step.path)}
            >
              <div className="node-circle">{step.id}</div>
              <span className="node-label">{step.label}</span>
            </button>
          ))}
        </header>

        <div className="left-content-wrapper">
          <main className="left-content">
            <h1>02 / EXPERIMENTS</h1>
            <h2>I tried everything.</h2>
            <p>
              {`This is where ideas became reality.
Some failed. Some worked. Every project taught me something.

Click on objects in the room to explore the projects.`}
            </p>
          </main>
        </div>

        {/* Scroll back indicator — always visible after intro, goes to Curiosity (01) */}
        {dismissedIntro && (
          <div style={{
            position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
            zIndex: 90, opacity: backScrollProgress > 0 ? 1 : 0.35, cursor: 'pointer',
            transition: 'opacity 0.3s'
          }} onClick={() => navigate('/curiosity')}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '8px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>↑ CURIOSITY</span>
            <div style={{ width: '80px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${backScrollProgress}%`, background: 'rgba(255,255,255,0.5)', transition: 'width 0.1s ease-out' }} />
            </div>
          </div>
        )}

        {/* Scroll forward → Building (03) */}
        <button className="scroll-continue" onClick={() => navigate('/building')}>
          <span className="scroll-text">CONTINUE — BUILDING</span>
          <div className="scroll-progress-container">
            <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
          </div>
          <div className="mouse-icon">
            <div className="mouse-wheel" />
          </div>
        </button>

        {/* Floating Trophy & Shop buttons */}
        <button 
          className={`trophy-button ${showAchievements ? 'active' : ''}`}
          onClick={() => { setShowAchievements(!showAchievements); setShowShop(false); }}
        >
          <span className="trophy-icon">🏆</span>
          <span className="trophy-badge">{unlocked.length}</span>
        </button>

        <button 
          className={`shop-button ${showShop ? 'active' : ''}`}
          onClick={() => { setShowShop(!showShop); setShowAchievements(false); }}
          title="Open Shop"
        >
          <span className="shop-icon">🏪</span>
          <span className="shop-wallet-pill">💰 {walletBalance}</span>
        </button>

        {/* Floating Sound Effects Toggle Button (appears once purchased) */}
        {unlockedShopItems.includes('sound_effects') && (
          <button 
            className={`sound-toggle-button ${soundsEnabled ? 'active' : ''}`}
            onClick={() => setSoundsEnabled(!soundsEnabled)}
            title={soundsEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            <span className="sound-icon">{soundsEnabled ? '🔊' : '🔇'}</span>
          </button>
        )}

        {/* Steam-Style Achievement Toast Notification */}
        {toast && (
          <div className="steam-toast">
            <div className="steam-toast-icon">{toast.icon || '🏆'}</div>
            <div className="steam-toast-content">
              <div className="steam-toast-header">NOTIFICATION</div>
              <div className="steam-toast-name">{toast.title}</div>
              <div className="steam-toast-desc">{toast.desc}</div>
            </div>
            <button className="steam-toast-close" onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* Achievements Drawer */}
        <AchievementsDrawer
          showAchievements={showAchievements}
          setShowAchievements={setShowAchievements}
          unlocked={unlocked}
          claimedAchievements={claimedAchievements}
          handleClaimPoints={handleClaimPoints}
        />

        {/* Shop Drawer */}
        <ShopDrawer
          showShop={showShop}
          setShowShop={setShowShop}
          walletBalance={walletBalance}
          unlockedShopItems={unlockedShopItems}
          activeCursor={activeCursor}
          handleBuyItem={handleBuyItem}
          handleEquipCursor={handleEquipCursor}
          triggerConfettiExplosion={triggerConfettiExplosion}
          crtTheme={crtTheme}
          setCrtTheme={setCrtTheme}
          triggerGlitchBurst={triggerGlitchBurst}
          lofiPlaying={lofiPlaying}
          toggleLofiPlaying={toggleLofiPlaying}
          soundsEnabled={soundsEnabled}
          toggleSoundsEnabled={() => setSoundsEnabled(!soundsEnabled)}
        />

        {/* Custom Local Folder Modal for Workshop Projects */}
        {selectedElement && folderDetails && (
          <div className="folder-backdrop" onClick={handleCloseFolder}>
            <div className="folder-modal" onClick={(e) => e.stopPropagation()}>
              <div className="folder-tab-bar">
                <div className="folder-tab active">
                  <span className="folder-tab-icon">📁</span>
                  <span className="folder-tab-title">{selectedElement.toUpperCase()} WORKBENCH</span>
                </div>
                <button className="folder-close-btn" onClick={handleCloseFolder}>
                  <span>×</span> CLOSE FOLDER
                </button>
              </div>

              <div className="folder-scroll-body">
                <div className="folder-grid">
                  <div className="folder-col-left">
                    <div className="folder-header-title">
                      <h1>{folderDetails.title}</h1>
                      <h2>{folderDetails.subtitle}</h2>
                    </div>
                    <p className="folder-desc">{folderDetails.desc}</p>
                    
                    {folderDetails.link && (
                      <button 
                        className="play-lofi-btn playing" 
                        style={{ marginTop: '20px', width: 'auto', alignSelf: 'flex-start', padding: '12px 24px' }}
                        onClick={() => navigate(folderDetails.link)}
                      >
                        🚀 {folderDetails.btnText}
                      </button>
                    )}
                  </div>
                  
                  <div className="folder-col-right">
                    {/* Add visual illustration for context */}
                    <div className="folder-media-container" style={{ marginTop: '40px' }}>
                      <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', textAlign: 'center', fontFamily: 'monospace', color: '#c5a880', fontSize: '12px' }}>
                        <div>WORKBENCH PROJECT DECALS ACTIVE</div>
                        <div style={{ marginTop: '10px', color: '#888' }}>Select component highlights to inspect configuration lines.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Particle trail canvas — rendered LAST so it sits above the 3D canvas */}
      <canvas 
        ref={canvasRef} 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999 }} 
      />
    </div>
  )
}
