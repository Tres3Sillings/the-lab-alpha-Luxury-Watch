import React, { useState, useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playHover, playClick } from '../../01-Curiosity/Components/SoundEffects'

// Interactive wrapper for 3D elements to apply premium hover reactions (scale-up and vertical lift)
function InteractiveElement({ name, geometry, material, position, rotation, scale, externalHover, onHoverChange, onClick }) {
  const meshRef = useRef()
  const [localHovered, setLocalHovered] = useState(false)
  const localMaterial = useRef()

  // Clone material to avoid mutating shared textures
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
      const baseScale = Array.isArray(scale) ? scale : [scale, scale, scale]

      // Lerp scale up smoothly when hovered (by 12%)
      const targetScale = hovered ? 1.12 : 1.0
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, baseScale[0] * targetScale, delta * 10)
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, baseScale[1] * targetScale, delta * 10)
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, baseScale[2] * targetScale, delta * 10)

      // Lift the element up slightly on the Y-axis when hovered
      const targetY = hovered ? position[1] + 0.02 : position[1]
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 10)

      // Periodic glow flicker for interactive prompts
      if (localMaterial.current) {
        const time = state.clock.getElapsedTime()
        const pulsePeriod = 20
        const pulseDuration = 2.5
        const pulseTime = time % pulsePeriod

        if (hovered) {
          localMaterial.current.emissive.set("#c5a880")
          localMaterial.current.emissiveIntensity = 0.4
        } else if (pulseTime < pulseDuration) {
          const progress = pulseTime / pulseDuration
          const basePulse = Math.sin(progress * Math.PI)
          const flicker = Math.sin(time * 30) * Math.cos(time * 50) * 0.15 + 0.85
          localMaterial.current.emissive.set("#c5a880")
          localMaterial.current.emissiveIntensity = basePulse * flicker * 0.5
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

export function Model({ onElementClick, ...props }) {
  const { nodes, materials } = useGLTF('/02-EXPERERMENT-transformed.glb')

  // Shared hovers for notebook sub-parts
  const [notebook1Hovered, setNotebook1Hovered] = useState(false)
  const [notebook2Hovered, setNotebook2Hovered] = useState(false)

  return (
    <group {...props} dispose={null}>
      {/* Interactive Laptop */}
      <InteractiveElement
        name="Laptop"
        geometry={nodes.Laptop.geometry}
        material={nodes.Laptop.material}
        position={[0.029, 0.713, 0.301]}
        rotation={[0, -0.035, 0]}
        scale={[0.198, 0.198, 0.261]}
        onClick={() => onElementClick && onElementClick('Laptop')}
      />

      {/* Interactive Book Stack */}
      <InteractiveElement
        name="Book"
        geometry={nodes.Book.geometry}
        material={materials.BookStack}
        position={[-0.223, 0.713, 1.022]}
        rotation={[0, 0.317, 0]}
        scale={[0.193, 0.031, 0.222]}
        onClick={() => onElementClick && onElementClick('Book')}
      />

      {/* Interactive SketchBook 1 (Rings + SketchBook) */}
      <InteractiveElement
        name="Rings"
        geometry={nodes.Rings.geometry}
        material={nodes.Rings.material}
        position={[0.447, 0.729, 1.001]}
        rotation={[Math.PI / 2, 0, -1.379]}
        scale={[0.013, 0.011, 0.013]}
        externalHover={notebook1Hovered}
        onHoverChange={setNotebook1Hovered}
        onClick={() => onElementClick && onElementClick('Notebook1')}
      />

      <InteractiveElement
        name="SketchBook"
        geometry={nodes.SketchBook.geometry}
        material={nodes.SketchBook.material}
        position={[0.283, 0.72, 0.979]}
        rotation={[-0.026, -0.192, -0.004]}
        scale={[0.173, 0.118, 0.158]}
        externalHover={notebook1Hovered}
        onHoverChange={setNotebook1Hovered}
        onClick={() => onElementClick && onElementClick('Notebook1')}
      />

      {/* Interactive SketchBook 2 (Sketchbook2 + Paper002 + Pen) */}
      <InteractiveElement
        name="Sketchbook2"
        geometry={nodes.Sketchbook2.geometry}
        material={nodes.Sketchbook2.material}
        position={[0.487, 0.72, 0.319]}
        rotation={[-0.025, 0.011, 0.002]}
        scale={[0.173, 0.118, 0.158]}
        externalHover={notebook2Hovered}
        onHoverChange={setNotebook2Hovered}
        onClick={() => onElementClick && onElementClick('Notebook2')}
      />

      <InteractiveElement
        name="Paper002"
        geometry={nodes.Paper002.geometry}
        material={nodes.Paper002.material}
        position={[0.487, 0.72, 0.319]}
        rotation={[-3.116, -0.011, -3.14]}
        scale={[0.173, 0.118, 0.158]}
        externalHover={notebook2Hovered}
        onHoverChange={setNotebook2Hovered}
        onClick={() => onElementClick && onElementClick('Notebook2')}
      />

      <InteractiveElement
        name="Pen"
        geometry={nodes.Pen.geometry}
        material={materials.pencil}
        position={[0.563, 0.738, 0.191]}
        rotation={[1.574, -0.01, 2.453]}
        scale={[0.003, 0.067, 0.003]}
        externalHover={notebook2Hovered}
      />

      {/* Interactive Cup */}
      <InteractiveElement
        name="Cup"
        geometry={nodes.Cup.geometry}
        material={materials.Cup}
        position={[0.199, 0.734, 0.792]}
        rotation={[0, 1.118, 0]}
        scale={0.062}
        onClick={() => onElementClick && onElementClick('Cup')}
      />

      {/* Static Scene Meshes */}
      <mesh name="maindesk" geometry={nodes.maindesk.geometry} material={nodes.maindesk.material} position={[0.744, 0.68, -0.123]} rotation={[Math.PI, Math.PI / 2, 0]} scale={[0.089, 0.634, 0.089]} />
      <mesh name="Room" geometry={nodes.Room.geometry} material={nodes.Room.material} scale={5.796} />
      <mesh name="table" geometry={nodes.table.geometry} material={nodes.table.material} position={[-3.53, 0.595, -5.499]} scale={[1, 1, 0.377]} />
      <mesh name="shorttable" geometry={nodes.shorttable.geometry} material={nodes.shorttable.material} position={[-5.535, 0.323, -3.955]} rotation={[0, Math.PI / 2, 0]} scale={[0.605, 1, 0.28]} />
      <mesh name="box004" geometry={nodes.box004.geometry} material={nodes.box004.material} position={[-5.478, -0.003, -4.182]} scale={[0.137, 0.118, 0.161]} />
      <mesh name="box001" geometry={nodes.box001.geometry} material={nodes.box001.material} position={[-2.864, -0.003, -5.466]} scale={[0.137, 0.091, 0.161]} />
      <mesh name="box002" geometry={nodes.box002.geometry} material={nodes.box002.material} position={[-1.562, -0.003, -5.078]} rotation={[0, -0.331, 0]} scale={[0.137, 0.091, 0.161]} />
      <mesh name="box003" geometry={nodes.box003.geometry} material={nodes.box003.material} position={[-1.101, -0.003, -4.701]} rotation={[0, -0.331, 0]} scale={[0.137, 0.144, 0.161]} />
      <mesh name="box" geometry={nodes.box.geometry} material={nodes.box.material} position={[-5.478, -0.003, -2.986]} scale={[0.137, 0.157, 0.234]} />
    </group>
  )
}

useGLTF.preload('/02-EXPERERMENT-transformed.glb')
