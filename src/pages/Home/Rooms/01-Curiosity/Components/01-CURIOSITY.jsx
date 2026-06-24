import React, { useState, useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playHover, playClick } from './SoundEffects'

// Interactive wrapper for 3D elements to apply premium hover reactions (scale-up and vertical lift)
function InteractiveElement({ name, geometry, material, position, rotation, scale, externalHover, onHoverChange, onClick }) {
  const meshRef = useRef()
  const [localHovered, setLocalHovered] = useState(false)
  const localMaterial = useRef()

  // Clone material to avoid mutating shared textures (like Bookslogos on stickers/sticky notes)
  if (!localMaterial.current && material) {
    localMaterial.current = material.clone()
    localMaterial.current.emissive = new THREE.Color(0, 0, 0)
    localMaterial.current.emissiveIntensity = 0
  }

  // Hover state is active if either local hover or parent/external hover is true
  const hovered = externalHover !== undefined ? (externalHover || localHovered) : localHovered

  const setHoveredState = (state) => {
    setLocalHovered(state)
    if (onHoverChange) {
      onHoverChange(state)
    }
  }

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Handle both single numeric scale values and vector scale arrays
      const baseScale = Array.isArray(scale) ? scale : [scale, scale, scale]

      // Lerp scale up smoothly when hovered (by 15%)
      const targetScale = hovered ? 1.15 : 1.0
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, baseScale[0] * targetScale, delta * 10)
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, baseScale[1] * targetScale, delta * 10)
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, baseScale[2] * targetScale, delta * 10)

      // Lift the element up slightly on the Y-axis when hovered for depth and feedback
      const targetY = hovered ? position[1] + 0.02 : position[1]
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 10)

      // -- Periodic Nudge Glow / Flicker --
      // Trigger a synchronized visual nudge pulse every 20 seconds, lasting for 2.5 seconds
      if (localMaterial.current) {
        const time = state.clock.getElapsedTime()
        const pulsePeriod = 20
        const pulseDuration = 2.5
        const pulseTime = time % pulsePeriod

        if (hovered) {
          localMaterial.current.emissive.set("#c5a880")
          localMaterial.current.emissiveIntensity = 0.35
        } else if (pulseTime < pulseDuration) {
          const progress = pulseTime / pulseDuration // 0 to 1
          const basePulse = Math.sin(progress * Math.PI)
          const flicker = Math.sin(time * 30) * Math.cos(time * 50) * 0.15 + 0.85
          localMaterial.current.emissive.set("#c5a880")
          localMaterial.current.emissiveIntensity = basePulse * flicker * 0.55
        } else {
          localMaterial.current.emissiveIntensity = 0
        }
      }
    }
  })

  // Update cursor style
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'auto'
    }
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  return (
    <mesh
      ref={meshRef}
      name={name}
      geometry={geometry}
      material={localMaterial.current || material}
      position={[...position]}
      rotation={rotation || [0, 0, 0]}
      scale={Array.isArray(scale) ? [...scale] : scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHoveredState(true)
        playHover()
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHoveredState(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick()
        playClick()
      }}
    />
  )
}

// Special interactive handler for the vintage CRT PC to simulate screen flicker without physical motion
function InteractivePC({ name, geometry, material, position, rotation, scale, onClick, crtTheme }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const localMaterial = useRef()

  // Clone material to avoid mutating other shared PC textures
  if (!localMaterial.current && material) {
    localMaterial.current = material.clone()
    // Configure bright phosphor green emissive CRT settings
    localMaterial.current.emissive = new THREE.Color("#55ff88")
    localMaterial.current.emissiveIntensity = 0
  }

  const emissiveColor = crtTheme === 'amber' ? "#ffaa00" : "#55ff88"

  useFrame((state) => {
    if (localMaterial.current) {
      if (hovered) {
        // High-frequency noise + sine wave combination to model realistic tube screen flickering
        const time = state.clock.getElapsedTime()
        const noise = Math.sin(time * 45) * Math.cos(time * 75) * 0.35 + 0.95
        const signalDrop = Math.random() > 0.985 ? 0.1 : 1.0 // Occasional micro-blackout spikes
        localMaterial.current.emissive.set(emissiveColor)
        localMaterial.current.emissiveIntensity = noise * signalDrop * 1.8
      } else {
        // -- Periodic Nudge Glow / Flicker --
        // Trigger a synchronized visual nudge pulse every 20 seconds, lasting for 2.5 seconds
        const time = state.clock.getElapsedTime()
        const pulsePeriod = 20
        const pulseDuration = 2.5
        const pulseTime = time % pulsePeriod

        if (pulseTime < pulseDuration) {
          const progress = pulseTime / pulseDuration // 0 to 1
          const basePulse = Math.sin(progress * Math.PI)
          const flicker = Math.sin(time * 30) * Math.cos(time * 50) * 0.15 + 0.85
          localMaterial.current.emissive.set(emissiveColor)
          localMaterial.current.emissiveIntensity = basePulse * flicker * 0.9
        } else {
          // No green glow/tint when idle
          localMaterial.current.emissiveIntensity = 0
        }
      }
    }
  })

  // Update cursor pointer
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'auto'
    }
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  return (
    <mesh
      ref={meshRef}
      name={name}
      geometry={geometry}
      material={localMaterial.current || material}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        playHover()
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick()
        playClick()
      }}
    />
  )
}

export function Model({ onStickerClick, crtTheme, ...props }) {
  const { nodes, materials } = useGLTF('/01-CURIOSITY-transformed.glb')

  // Track hover state of notebook elements to trigger pencil animation
  const [notebookHovered, setNotebookHovered] = useState(false)

  return (
    <group {...props} dispose={null}>
      {/* Interactive CRT PC Screen */}
      <InteractivePC
        name="PC"
        geometry={nodes.PC.geometry}
        material={materials.PC}
        position={[-0.201, 0, 0.713]}
        rotation={[0, 0.772, 0]}
        scale={0.232}
        onClick={() => onStickerClick && onStickerClick('PC')}
        crtTheme={crtTheme}
      />

      {/* Interactive Accounting Books */}
      <InteractiveElement
        name="Book"
        geometry={nodes.Book.geometry}
        material={materials.BookStack}
        position={[0.248, 0, 1.098]}
        rotation={[0, 0.972, 0]}
        scale={[0.193, 0.031, 0.222]}
        onClick={() => onStickerClick && onStickerClick('Book')}
      />

      {/* Interactive Calculator */}
      <InteractiveElement
        name="Calculator"
        geometry={nodes.Calculator.geometry}
        material={materials.Calcilator}
        position={[0.512, 0, 0.761]}
        rotation={[0, 0.262, 0]}
        scale={[0.152, 0.005, 0.079]}
        onClick={() => onStickerClick && onStickerClick('Calculator')}
      />

      {/* Notebook Rings - triggers notebook hover & click */}
      <InteractiveElement
        name="Rings"
        geometry={nodes.Rings.geometry}
        material={nodes.Rings.material}
        position={[0.651, 0.015, 0.334]}
        rotation={[Math.PI / 2, 0, -2.145]}
        scale={0.013}
        externalHover={notebookHovered}
        onHoverChange={setNotebookHovered}
        onClick={() => onStickerClick && onStickerClick('Notebook')}
      />

      {/* Notebook Paper - triggers notebook hover & click */}
      <InteractiveElement
        name="Paper"
        geometry={nodes.Paper.geometry}
        material={materials.SketchBook}
        position={[0.495, 0.007, 0.435]}
        rotation={[-0.03, 0.577, 0.017]}
        scale={[0.194, 0.118, 0.138]}
        externalHover={notebookHovered}
        onHoverChange={setNotebookHovered}
        onClick={() => onStickerClick && onStickerClick('Notebook')}
      />

      {/* Interactive Pen (pencil) - linked to notebook hover */}
      <InteractiveElement
        name="Pen"
        geometry={nodes.Pen.geometry}
        material={materials.pencil}
        position={[0.467, 0.025, 0.179]}
        rotation={[1.56, 0, 0.565]}
        scale={[0.003, 0.067, 0.003]}
        externalHover={notebookHovered}
      />

      {/* Interactive Cup */}
      <InteractiveElement 
        name="Cup" 
        geometry={nodes.Cup.geometry} 
        material={materials.Cup} 
        position={[0.303, 0, 0.077]} 
        rotation={[0, 0.437, 0]} 
        scale={0.062}
        onClick={() => onStickerClick && onStickerClick('Cup')}
      />

      {/* Static Floor (Desk) Plane - No Hover reactions */}
      <mesh
        name="Floor"
        geometry={nodes.Floor.geometry}
        material={materials.Wood}
        position={[1.457, 0, 0]}
        scale={[2.024, 2.024, 1.777]}
      />

      {/* Static Skill Book (Sticker stack) - No Hover reactions */}
      <mesh
        name="BooksForStickers"
        geometry={nodes.BooksForStickers.geometry}
        material={materials.Bookslogos}
        position={[0.063, 0, -0.232]}
        rotation={[-Math.PI, 0.822, -Math.PI]}
        scale={[0.248, 0.028, 0.293]}
      />

      {/* Static NotePin */}
      <mesh
        name="NotePin"
        geometry={nodes.NotePin.geometry}
        material={materials.Bookslogos}
        position={[0.144, 0.112, -0.417]}
        scale={-0.007}
      />

      {/* Static Sticknote01 */}
      <mesh
        name="Sticknote01"
        geometry={nodes.Sticknote01.geometry}
        material={materials.Bookslogos}
        position={[0.144, 0.112, -0.417]}
        rotation={[0.137, 0.518, -0.075]}
        scale={[0.083, 0.054, 0.064]}
      />

      {/* Static StickyNote02 */}
      <mesh
        name="StickyNote02"
        geometry={nodes.StickyNote02.geometry}
        material={materials.Bookslogos}
        position={[0.144, 0.112, -0.417]}
        rotation={[0.05, 0.524, -0.026]}
        scale={[0.083, 0.054, 0.064]}
      />

      {/* Interactive Sticker 1 (Photoshop) */}
      <InteractiveElement
        name="Sticker1"
        geometry={nodes.Sticker1.geometry}
        material={materials.Bookslogos}
        position={[0.015, 0.112, -0.064]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0.055, 0.056, 0.055]}
        onClick={() => onStickerClick && onStickerClick('Sticker1')}
      />

      {/* Interactive Sticker 2 (Blender) */}
      <InteractiveElement
        name="Sticker2"
        geometry={nodes.Sticker2.geometry}
        material={materials.Bookslogos}
        position={[-0.133, 0.112, -0.189]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0.055, 0.056, 0.055]}
        onClick={() => onStickerClick && onStickerClick('Sticker2')}
      />

      {/* Interactive Sticker 3 (WordPress) */}
      <InteractiveElement
        name="Sticker3"
        geometry={nodes.Sticker3.geometry}
        material={materials.Bookslogos}
        position={[0.155, 0.112, -0.19]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0.055, 0.056, 0.055]}
        onClick={() => onStickerClick && onStickerClick('Sticker3')}
      />

      {/* Interactive Sticker 4 (React) */}
      <InteractiveElement
        name="Sticker4"
        geometry={nodes.Sticker4.geometry}
        material={materials.Bookslogos}
        position={[0, 0.112, -0.323]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0.055, 0.056, 0.055]}
        onClick={() => onStickerClick && onStickerClick('Sticker4')}
      />

      {/* Interactive Sticker 5 (Three.js) */}
      <InteractiveElement
        name="Sticker5"
        geometry={nodes.Sticker5.geometry}
        material={materials.Bookslogos}
        position={[0.255, 0.112, -0.313]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0.055, 0.056, 0.055]}
        onClick={() => onStickerClick && onStickerClick('Sticker5')}
      />

      {/* Static Frame (Window frame) */}
      <mesh
        name="Frame"
        geometry={nodes.Frame.geometry}
        material={materials.Wood}
        scale={0.707}
      />
    </group>
  )
}

useGLTF.preload('/01-CURIOSITY-transformed.glb')
