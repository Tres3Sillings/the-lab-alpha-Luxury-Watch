import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { SheetProvider, PerspectiveCamera, editable as e } from '@theatre/r3f'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { Model as CuriosityModel } from './Components/01-CURIOSITY.jsx'
import { Environment } from '@react-three/drei'
import './Home.css'
import projectState from './Curiosity Project.theatre-project-state.json'

// Import segmented sub-components
import EnvironmentBackground from './Components/Environment/EnvironmentBackground'
import CameraRig from './Components/Camera/CameraRig'
import AchievementsDrawer, { ACHIEVEMENTS } from './Components/Drawers/AchievementsDrawer'
import ShopDrawer from './Components/Drawers/ShopDrawer'
import FolderModal from './Components/Modals/FolderModal'
import { enableSoundEffects, disableSoundEffects } from './Components/SoundEffects'

// Initialize Theatre.js studio only in development environment
if (import.meta.env.DEV) {
  studio.initialize()
  studio.extend(extension)
}

const project = getProject('Curiosity Project', { state: projectState })
const sheet = project.sheet('Curiosity Scene')

const achievementMap = {
  'PC': 'curiosity',
  'Notebook': 'builder',
  'Calculator': 'wrong_turn',
  'Book': 'wrong_turn',
  'Cup': 'night_owl',
  'Sticker1': 'designer',
  'Sticker2': 'creator',
  'Sticker3': 'wordpress',
  'Sticker4': 'developer',
  'Sticker5': 'creative_coder'
}

export default function Experience() {
  const navigate = useNavigate()
  const [selectedSticker, setSelectedSticker] = useState(null)
  const [dismissedIntro, setDismissedIntro] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [backScrollProgress, setBackScrollProgress] = useState(0)

  // --- All state that scroll useEffect depends on must be declared first ---
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

  const [showShop, setShowShop] = useState(false)

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

  const [glitchActive, setGlitchActive] = useState(false)
  const [lofiPlaying, setLofiPlaying] = useState(() => {
    try {
      return localStorage.getItem('the-lab-lofi-playing') === 'true'
    } catch (e) {
      return false
    }
  })
  // --- End of early state declarations ---

  // Auto-dismiss the intro after 15 seconds & coin accumulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDismissedIntro(true)
    }, 15000)

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

    return () => {
      clearTimeout(timer)
      clearInterval(coinInterval)
    }
  }, [])

  // Bidirectional scroll: down → /experiments, up → /future (wrap)
  useEffect(() => {
    if (!dismissedIntro) return
    if (selectedSticker || showShop || showAchievements) {
      setScrollProgress(0)
      setBackScrollProgress(0)
      return
    }

    let fwd = 0
    let bwd = 0

    const handleScroll = (e) => {
      if (e.deltaY > 0) {
        fwd = Math.min(100, fwd + e.deltaY * 0.15)
        bwd = Math.max(0, bwd - 4)
      } else {
        bwd = Math.min(100, bwd + Math.abs(e.deltaY) * 0.15)
        fwd = Math.max(0, fwd - 4)
      }
      setScrollProgress(fwd)
      setBackScrollProgress(bwd)
      if (fwd >= 100) handleNavigation('/experiments')
      if (bwd >= 100) handleNavigation('/future')
    }

    window.addEventListener('wheel', handleScroll, { passive: true })

    let touchStartY = 0
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const handleTouchMove = (e) => {
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
      if (fwd >= 100) handleNavigation('/experiments')
      if (bwd >= 100) handleNavigation('/future')
    }
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove',  handleTouchMove,  { passive: true })

    const decayTimer = setInterval(() => {
      fwd = Math.max(0, fwd - 1.5)
      bwd = Math.max(0, bwd - 1.5)
      setScrollProgress(fwd)
      setBackScrollProgress(bwd)
    }, 100)

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove',  handleTouchMove)
      clearInterval(decayTimer)
    }
  }, [dismissedIntro, selectedSticker, showShop, showAchievements])

  useEffect(() => {
    localStorage.setItem('the-lab-crt-theme', crtTheme)
  }, [crtTheme])

  const triggerGlitchBurst = () => {
    const audio = new Audio('/glitch.mp3')
    audio.volume = 0.4
    audio.play().catch(() => {})
    setGlitchActive(true)
    setTimeout(() => {
      setGlitchActive(false)
    }, 1500)
  }

  // startLofiSynth Web Audio API player
  const startLofiSynth = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    const ctx = new AudioContext()

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(550, ctx.currentTime)
    filter.Q.setValueAtTime(1, ctx.currentTime)
    filter.connect(ctx.destination)

    const masterVol = ctx.createGain()
    masterVol.gain.setValueAtTime(0.25, ctx.currentTime)
    masterVol.connect(filter)

    // Vinyl Crackle Noise Buffer
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

    // Chords Mellow progression
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

  // ── Helper: unlock an achievement and show toast ─────────────────
  const unlockAchievement = (achId) => {
    if (!unlocked.includes(achId)) {
      setUnlocked(prev => [...prev, achId])
      const ach = ACHIEVEMENTS.find(a => a.id === achId)
      if (ach) setToast({ title: ach.title, desc: ach.desc, icon: ach.icon })
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
      // Achievement: first time lo-fi is played
      unlockAchievement('lofi_vibes')
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

  // Particles Canvas Refs
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0, moved: false })

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

  // Sync wallet balance to local storage
  useEffect(() => {
    localStorage.setItem('the-lab-wallet', walletBalance.toString())
  }, [walletBalance])

  // Sync claimed achievements
  useEffect(() => {
    localStorage.setItem('the-lab-claimed-achievements', JSON.stringify(claimedAchievements))
  }, [claimedAchievements])

  // Sync purchased items
  useEffect(() => {
    localStorage.setItem('the-lab-purchased-items', JSON.stringify(unlockedShopItems))
  }, [unlockedShopItems])

  // Sync active cursor
  useEffect(() => {
    localStorage.setItem('the-lab-active-cursor', activeCursor)
  }, [activeCursor])

  // Track global mouse position for cursor trails
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

  // Sparkle popper burst
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
    // Achievement: first time confetti popper is used
    unlockAchievement('confetti_king')
  }

  // Claim particle burst
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

  // Claim points trigger
  const handleClaimPoints = (achId, clientX, clientY) => {
    if (unlocked.includes(achId) && !claimedAchievements.includes(achId)) {
      setClaimedAchievements(prev => [...prev, achId])
      setWalletBalance(prev => prev + 50)
      triggerClaimBurst(clientX, clientY)
    }
  }

  // Buy item trigger
  const handleBuyItem = (itemId, cost) => {
    if (walletBalance >= cost && !unlockedShopItems.includes(itemId)) {
      setWalletBalance(prev => prev - cost)
      setUnlockedShopItems(prev => [...prev, itemId])
      
      if (itemId === 'cursor_phosphor') {
        setActiveCursor('phosphor')
      } else if (itemId === 'cursor_gold') {
        setActiveCursor('gold')
      } else if (itemId === 'cursor_flame') {
        setActiveCursor('flame')
      } else if (itemId === 'cursor_matrix') {
        setActiveCursor('matrix')
      } else if (itemId === 'cursor_rainbow') {
        setActiveCursor('rainbow')
      }
      
      triggerConfettiExplosion()
    }
  }

  const handleEquipCursor = (cursorType) => {
    setActiveCursor(cursorType)
  }

  // Sync selected element state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#notebook') {
        setSelectedSticker('Notebook')
      } else if (hash === '#cup') {
        setSelectedSticker('Cup')
      } else if (hash === '#calculator') {
        setSelectedSticker('Calculator')
      } else if (hash === '#pc') {
        setSelectedSticker('PC')
      } else if (hash === '#book') {
        setSelectedSticker('Book')
      } else {
        const match = hash.match(/^#sticker([1-5])$/i)
        if (match) {
          setSelectedSticker(`Sticker${match[1]}`)
        } else {
          setSelectedSticker(null)
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Sync unlocked achievements to localStorage
  useEffect(() => {
    localStorage.setItem('the-lab-achievements', JSON.stringify(unlocked))
  }, [unlocked])

  // Unlock achievement when selecting an element
  useEffect(() => {
    if (selectedSticker && achievementMap[selectedSticker]) {
      const achId = achievementMap[selectedSticker]
      if (!unlocked.includes(achId)) {
        setUnlocked(prev => [...prev, achId])
        const ach = ACHIEVEMENTS.find(a => a.id === achId)
        if (ach) {
          setToast({
            title: ach.title,
            desc: ach.desc,
            icon: ach.icon
          })
        }
      }
    }
  }, [selectedSticker, unlocked])

  // Clear toast notifications after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Trigger navigation by changing hash
  const handleStickerClick = (stickerName) => {
    if (stickerName) {
      window.location.hash = stickerName.toLowerCase()
    }
  }

  // Clear hash and go back to base home view
  const handleBackToHome = () => {
    window.history.pushState('', document.title, window.location.pathname + window.location.search)
    setSelectedSticker(null)
  }

  // Timeline configuration mapping portfolio items to their corresponding routes
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

  return (
    <div className={`home-container cursor-${activeCursor} ${glitchActive ? 'full-screen-glitch' : ''}`}>

      {/* Background subtle radial gradient to ensure text legibility over any scene colors */}
      <div className="gradient-overlay" />

      {/* Centered Intro Overlay Screen */}
      <div className={`intro-overlay ${dismissedIntro ? 'dismissed' : ''}`}>
        {/* WIP Red Scrolling Warning Banner */}
        <div className="wip-banner">
          <div className="wip-banner-track">
            <span>⚠️ WORK IN PROGRESS: THE SITE IS STILL A WIP SO EXPECT TO SEE A LOT OF BUGS AND UNCOMPLETED THINGS WITH PLACEHOLDER AI TEXT. THANKS FOR YOUR UNDERSTANDING!</span>
            <span>⚠️ WORK IN PROGRESS: THE SITE IS STILL A WIP SO EXPECT TO SEE A LOT OF BUGS AND UNCOMPLETED THINGS WITH PLACEHOLDER AI TEXT. THANKS FOR YOUR UNDERSTANDING!</span>
            <span>⚠️ WORK IN PROGRESS: THE SITE IS STILL A WIP SO EXPECT TO SEE A LOT OF BUGS AND UNCOMPLETED THINGS WITH PLACEHOLDER AI TEXT. THANKS FOR YOUR UNDERSTANDING!</span>
            <span>⚠️ WORK IN PROGRESS: THE SITE IS STILL A WIP SO EXPECT TO SEE A LOT OF BUGS AND UNCOMPLETED THINGS WITH PLACEHOLDER AI TEXT. THANKS FOR YOUR UNDERSTANDING!</span>
          </div>
        </div>

        <div className="intro-content">
          <h1>TRES SILLINGS</h1>
          <h2>Creative Developer & 3D Web Designer</h2>
          <p>
            {`Welcome to my interactive 3D portfolio. I specialize in building immersive web applications, highly performant Three.js configuration workbenches, and rich frontend systems.

            Explore the room. Click on objects in the desk space to examine my skills, project case studies, and creative milestones.`}
          </p>
          <button className="begin-btn" onClick={() => setDismissedIntro(true)}>
            BEGIN EXPERIENCE
          </button>
        </div>
      </div>

      {/* R3F 3D Canvas with Theatre.js sheet connectivity */}
      <Canvas
        gl={{ toneMapping: THREE.AgXToneMapping, toneMappingExposure: 0.8 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <Suspense fallback={null}>
          <SheetProvider sheet={sheet}>
            {/* Camera Rig to apply subtle mouse coordinates parallax swaying */}
            <CameraRig>
              {/* Theatre.js editable Perspective Camera */}
              <PerspectiveCamera
                theatreKey="Camera"
                makeDefault
                position={[0.3, 0.4, 1.8]}
                fov={45}
              />
            </CameraRig>

            {/* Theatre.js editable Lighting */}
            <e.ambientLight theatreKey="Ambient Light" intensity={0.85} />
            <e.pointLight theatreKey="Point Light" position={[2, 4, 3]} intensity={3.5} />
            <e.spotLight theatreKey="Spot Light" position={[-4, 8, 4]} angle={0.3} penumbra={1} intensity={2.0} />
            <e.directionalLight theatreKey="Directional Light" position={[5, 10, 5]} intensity={2.0} />
            <Environment preset="city" />

            {/* 3D Background Plane */}
            <EnvironmentBackground />

            {/* Theatre.js editable Curiosity model group */}
            <e.group theatreKey="Curiosity Model" position={[0.5, -0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <CuriosityModel onStickerClick={handleStickerClick} crtTheme={crtTheme} />
            </e.group>
          </SheetProvider>
        </Suspense>
      </Canvas>

      {/* Modern overlays layer */}
      <div className="ui-overlay">
        {/* Top Timeline scrollbar header */}
        <header className="timeline-header">
          <div className="timeline-line" />
          {timelineSteps.map((step) => (
            <button
              key={step.id}
              className={`timeline-node ${step.id === '01' ? 'active' : ''}`}
              onClick={() => handleNavigation(step.path)}
            >
              <div className="node-circle">{step.id}</div>
              <span className="node-label">{step.label}</span>
            </button>
          ))}
        </header>

        {/* left-content-wrapper removed for centered splash screen */}

        {/* Scroll back indicator — always visible after intro, wraps to The Future (07) */}
        {dismissedIntro && (
          <div style={{
            position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
            zIndex: 90, opacity: backScrollProgress > 0 ? 1 : 0.35, cursor: 'pointer',
            transition: 'opacity 0.3s'
          }} onClick={() => handleNavigation('/future')}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '8px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>↑ THE FUTURE</span>
            <div style={{ width: '80px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${backScrollProgress}%`, background: 'rgba(255,255,255,0.5)', transition: 'width 0.1s ease-out' }} />
            </div>
          </div>
        )}

        {/* Bottom Scroll to Continue → Experiments (02) */}
        <button className="scroll-continue" onClick={() => handleNavigation('/experiments')}>
          <span className="scroll-text">SCROLL TO CONTINUE</span>
          <div className="scroll-progress-container">
            <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
          </div>
          <div className="mouse-icon">
            <div className="mouse-wheel" />
          </div>
        </button>

        {/* Steam-Style Achievement Toast Notification */}
        {toast && (
          <div className="steam-toast">
            <div className="steam-toast-icon">🏆</div>
            <div className="steam-toast-content">
              <div className="steam-toast-header">ACHIEVEMENT UNLOCKED!</div>
              <div className="steam-toast-name">{toast.title}</div>
              <div className="steam-toast-desc">{toast.desc}</div>
            </div>
            <button className="steam-toast-close" onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* Floating Achievements Trophy Button */}
        <button 
          className={`trophy-button ${showAchievements ? 'active' : ''}`}
          onClick={() => {
            setShowAchievements(!showAchievements)
            setShowShop(false) // Close shop drawer when trophy is clicked
          }}
          title="Show Achievements"
        >
          <span className="trophy-icon">🏆</span>
          <span className="trophy-badge">{unlocked.length}</span>
        </button>

        {/* Floating Lab Shop Button */}
        <button 
          className={`shop-button ${showShop ? 'active' : ''}`}
          onClick={() => {
            setShowShop(!showShop)
            setShowAchievements(false) // Close achievements drawer when shop is clicked
          }}
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

        {/* Collapsible Achievements Drawer */}
        <AchievementsDrawer
          showAchievements={showAchievements}
          setShowAchievements={setShowAchievements}
          unlocked={unlocked}
          claimedAchievements={claimedAchievements}
          handleClaimPoints={handleClaimPoints}
        />

        {/* Collapsible Lab Shop Drawer */}
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

        {/* Folder-Style Popup Modal */}
        <FolderModal
          selectedSticker={selectedSticker}
          handleBackToHome={handleBackToHome}
          handleStickerClick={handleStickerClick}
        />
      </div>

      {/* HTML5 Canvas overlay for cursor trails/sparkles — rendered LAST so it sits above the 3D canvas */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          pointerEvents: 'none', 
          zIndex: 99999
        }} 
      />
    </div>
  )
}
