import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useEditorStore, Point, Attachment, DOOR_STYLES, WINDOW_STYLES } from '../store';

export const WALL_HEIGHT = 3;
export const WALL_THICKNESS = 0.2;

const isPointInPolygon = (px: number, pz: number, vertices: Point[]) => {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, zi = vertices[i].z;
    const xj = vertices[j].x, zj = vertices[j].z;
    const intersect = ((zi > pz) !== (zj > pz))
        && (px < (xj - xi) * (pz - zi) / (zj - zi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const pointToSegmentDistance = (px: number, pz: number, x1: number, z1: number, x2: number, z2: number) => {
  const l2 = (x2 - x1) ** 2 + (z2 - z1) ** 2;
  if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (pz - z1) ** 2);
  let t = ((px - x1) * (x2 - x1) + (pz - z1) * (z2 - z1)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * (x2 - x1);
  const projZ = z1 + t * (z2 - z1);
  return Math.sqrt((px - projX) ** 2 + (pz - projZ) ** 2);
};

const getLightPositions = (vertices: Point[], margin = 1.0, spacing = 2.0) => {
  if (vertices.length < 3) return [];
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  vertices.forEach(v => {
    minX = Math.min(minX, v.x);
    maxX = Math.max(maxX, v.x);
    minZ = Math.min(minZ, v.z);
    maxZ = Math.max(maxZ, v.z);
  });

  const positions: Point[] = [];
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;

  const startX = cx - Math.floor((cx - minX) / spacing) * spacing;
  const startZ = cz - Math.floor((cz - minZ) / spacing) * spacing;

  for (let x = startX; x <= maxX; x += spacing) {
    for (let z = startZ; z <= maxZ; z += spacing) {
      if (isPointInPolygon(x, z, vertices)) {
        let minDist = Infinity;
        for (let i = 0; i < vertices.length; i++) {
          const p1 = vertices[i];
          const p2 = vertices[(i + 1) % vertices.length];
          const dist = pointToSegmentDistance(x, z, p1.x, p1.z, p2.x, p2.z);
          minDist = Math.min(minDist, dist);
        }
        if (minDist >= margin) {
          positions.push({ x, z });
        }
      }
    }
  }
  return positions;
};

const useAdvancedWallTextures = (color: string) => {
  return useMemo(() => {
    const width = 512;
    const height = 512;

    const diffuseCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    const roughCanvas = document.createElement('canvas');

    diffuseCanvas.width = bumpCanvas.width = roughCanvas.width = width;
    diffuseCanvas.height = bumpCanvas.height = roughCanvas.height = height;

    const dCtx = diffuseCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');
    const rCtx = roughCanvas.getContext('2d');

    if (!dCtx || !bCtx || !rCtx) return null;

    // Base colors
    dCtx.fillStyle = color;
    dCtx.fillRect(0, 0, width, height);

    bCtx.fillStyle = '#808080'; // Neutral bump
    bCtx.fillRect(0, 0, width, height);

    rCtx.fillStyle = '#cccccc'; // High roughness (mostly matte)
    rCtx.fillRect(0, 0, width, height);

    // Add noise for plaster/drywall effect
    const dData = dCtx.getImageData(0, 0, width, height);
    const bData = bCtx.getImageData(0, 0, width, height);
    const rData = rCtx.getImageData(0, 0, width, height);

    for (let i = 0; i < dData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20; // subtle noise

      // Diffuse noise
      dData.data[i] = Math.min(255, Math.max(0, dData.data[i] + noise * 0.3));
      dData.data[i+1] = Math.min(255, Math.max(0, dData.data[i+1] + noise * 0.3));
      dData.data[i+2] = Math.min(255, Math.max(0, dData.data[i+2] + noise * 0.3));

      // Bump noise (plaster effect)
      const bumpVal = 128 + noise * 3;
      bData.data[i] = bData.data[i+1] = bData.data[i+2] = bumpVal;

      // Roughness noise
      const roughVal = 200 + noise * 2;
      rData.data[i] = rData.data[i+1] = rData.data[i+2] = roughVal;
    }

    dCtx.putImageData(dData, 0, 0);
    bCtx.putImageData(bData, 0, 0);
    rCtx.putImageData(rData, 0, 0);

    const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    const roughnessMap = new THREE.CanvasTexture(roughCanvas);

    [diffuseMap, bumpMap, roughnessMap].forEach(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2); // Repeat texture
      tex.anisotropy = 4;
    });

    diffuseMap.colorSpace = THREE.SRGBColorSpace;

    return { diffuseMap, bumpMap, roughnessMap };
  }, [color]);
};

const useAdvancedWoodTextures = (color: string) => {
  return useMemo(() => {
    const width = 1024;
    const height = 1024;
    
    const diffuseCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    const roughCanvas = document.createElement('canvas');
    
    diffuseCanvas.width = bumpCanvas.width = roughCanvas.width = width;
    diffuseCanvas.height = bumpCanvas.height = roughCanvas.height = height;
    
    const dCtx = diffuseCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');
    const rCtx = roughCanvas.getContext('2d');
    
    if (!dCtx || !bCtx || !rCtx) return null;

    // Base colors
    dCtx.fillStyle = color;
    dCtx.fillRect(0, 0, width, height);
    
    bCtx.fillStyle = '#888888'; // Mid-level bump
    bCtx.fillRect(0, 0, width, height);
    
    rCtx.fillStyle = '#888888'; // Base roughness
    rCtx.fillRect(0, 0, width, height);
    
    const numPlanks = 8;
    const plankWidth = width / numPlanks;
    
    for (let i = 0; i < numPlanks; i++) {
      const x = i * plankWidth;
      
      // Plank color variation
      const shade = (Math.random() - 0.5) * 0.15;
      dCtx.fillStyle = `rgba(0,0,0,${shade > 0 ? shade : 0})`;
      dCtx.fillRect(x, 0, plankWidth, height);
      dCtx.fillStyle = `rgba(255,255,255,${shade < 0 ? -shade : 0})`;
      dCtx.fillRect(x, 0, plankWidth, height);
      
      // Grain lines
      for (let g = 0; g < 60; g++) {
        const startX = x + Math.random() * plankWidth;
        const cp1x = startX + (Math.random() - 0.5) * 60;
        const cp2x = startX + (Math.random() - 0.5) * 60;
        const endX = startX + (Math.random() - 0.5) * 40;
        
        const drawCurve = (ctx: CanvasRenderingContext2D, strokeStyle: string, lineWidth: number) => {
          ctx.beginPath();
          ctx.moveTo(startX, 0);
          ctx.bezierCurveTo(cp1x, height / 3, cp2x, 2 * height / 3, endX, height);
          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        };
        
        const lw = Math.random() * 4 + 1;
        drawCurve(dCtx, `rgba(0,0,0,${Math.random() * 0.12})`, lw);
        drawCurve(bCtx, `rgba(100,100,100,${Math.random() * 0.6})`, lw); // Darker = deeper
        drawCurve(rCtx, `rgba(180,180,180,${Math.random() * 0.6})`, lw); // Lighter = rougher
      }
      
      // Plank gaps (vertical)
      const gapWidth = 6;
      dCtx.fillStyle = '#1a1a1a';
      dCtx.fillRect(x, 0, gapWidth, height);
      
      bCtx.fillStyle = '#000000'; // Deepest
      bCtx.fillRect(x, 0, gapWidth, height);
      
      rCtx.fillStyle = '#ffffff'; // Roughest
      rCtx.fillRect(x, 0, gapWidth, height);
      
      // Plank horizontal cuts
      let y = Math.random() * height;
      while (y < height) {
        dCtx.fillStyle = '#1a1a1a';
        dCtx.fillRect(x, y, plankWidth, gapWidth);
        
        bCtx.fillStyle = '#000000';
        bCtx.fillRect(x, y, plankWidth, gapWidth);
        
        rCtx.fillStyle = '#ffffff';
        rCtx.fillRect(x, y, plankWidth, gapWidth);
        
        y += height / 3 + Math.random() * height / 2;
      }
    }
    
    const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    
    [diffuseMap, bumpMap, roughnessMap].forEach(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 6);
      tex.anisotropy = 4;
    });
    
    diffuseMap.colorSpace = THREE.SRGBColorSpace;
    
    return { diffuseMap, bumpMap, roughnessMap };
  }, [color]);
};

const Wall = ({ p1, p2, viewMode, index, textures, attachments = [] }: { p1: Point; p2: Point; viewMode: '2D' | '3D'; index: number; textures?: any; attachments?: Attachment[] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Group>(null);
  const currentStep = useEditorStore((state) => state.currentStep);
  const setupMode = useEditorStore((state) => state.setupMode);
  const customSetupStep = useEditorStore((state) => state.customSetupStep);
  const startWallDrag = useEditorStore((state) => state.startWallDrag);
  const vertices = useEditorStore((state) => state.vertices);
  const wallMaterialColor = useEditorStore((state) => state.wallMaterial);
  const [hovered, setHovered] = useState(false);
  
  const { length, midpoint, angle, normal } = useMemo(() => {
    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const midpoint = { x: (p1.x + p2.x) / 2, z: (p1.z + p2.z) / 2 };
    const angle = Math.atan2(dz, dx);
    
    // Normal pointing inwards (assuming clockwise vertices)
    const normal = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
    
    return { length, midpoint, angle, normal };
  }, [p1, p2]);

  useFrame(({ camera }) => {
    if (meshesRef.current) {
      if (viewMode === '2D') {
        meshesRef.current.visible = true;
      } else {
        // Dollhouse view logic: hide walls facing the camera
        const toCamera = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(midpoint.x, WALL_HEIGHT / 2, midpoint.z));
        const dot = normal.dot(toCamera);
        meshesRef.current.visible = dot > 0;
      }
    }
  });

  const isBuildStep = currentStep === 'SETUP' && !(setupMode === 'custom' && customSetupStep === 4);
  const canDragWalls = currentStep === 'SETUP' && setupMode === 'custom' && (customSetupStep === 1 || customSetupStep === 2);
  const canDragAttachments = currentStep === 'SETUP' && setupMode === 'custom' && customSetupStep === 3;
  const useTextures = !isBuildStep && textures;
  const wallColor = useTextures ? '#ffffff' : (canDragWalls ? (hovered ? '#60a5fa' : '#bfdbfe') : wallMaterialColor);

  const sortedAttachments = [...attachments].sort((a, b) => a.ratio - b.ratio);
  const wallPieces = [];
  const attachmentMeshes = [];
  let currentX = 0;

  sortedAttachments.forEach(att => {
    const isDoor = att.type === 'door';
    const styleDef = isDoor ? DOOR_STYLES[att.style] || DOOR_STYLES['standard'] : WINDOW_STYLES[att.style] || WINDOW_STYLES['standard'];
    
    const attW = styleDef.width;
    const attH = styleDef.height;
    const attY = styleDef.yOffset;
    
    const attCenter = length * att.ratio;
    const attStart = Math.max(currentX, attCenter - attW / 2);
    const attEnd = Math.min(length, attCenter + attW / 2);
    const actualW = attEnd - attStart;

    if (attStart > currentX) {
      wallPieces.push({ x: currentX, w: attStart - currentX, y: 0, h: WALL_HEIGHT });
    }

    if (actualW > 0) {
      if (attY > 0) wallPieces.push({ x: attStart, w: actualW, y: 0, h: attY });
      if (attY + attH < WALL_HEIGHT) wallPieces.push({ x: attStart, w: actualW, y: attY + attH, h: WALL_HEIGHT - (attY + attH) });
      
      attachmentMeshes.push({ 
        id: att.id,
        type: att.type, 
        style: styleDef,
        x: attStart, 
        w: actualW, 
        y: attY, 
        h: attH 
      });
    }
    currentX = Math.max(currentX, attEnd);
  });

  if (currentX < length) {
    wallPieces.push({ x: currentX, w: length - currentX, y: 0, h: WALL_HEIGHT });
  }

  const handlePointerDown = (e: any) => {
    if (canDragWalls) {
      e.stopPropagation();
      startWallDrag(index, e.point.x, e.point.z, vertices);
    }
  };

  const handlePointerOver = (e: any) => {
    if (canDragWalls) {
      e.stopPropagation();
      setHovered(true);
    }
  };

  const handlePointerOut = () => setHovered(false);

  const setActiveAttachmentId = useEditorStore((state) => state.setActiveAttachmentId);
  const activeAttachmentId = useEditorStore((state) => state.activeAttachmentId);
  const updateAttachment = useEditorStore((state) => state.updateAttachment);
  const [hoveredAttachmentId, setHoveredAttachmentId] = useState<string | null>(null);

  const { camera, raycaster, pointer } = useThree();

  const handleAttachmentPointerDown = (e: any, id: string) => {
    if (canDragAttachments) {
      e.stopPropagation();
      setActiveAttachmentId(id);
    }
  };

  return (
    <group ref={groupRef}>
      <group position={[midpoint.x, 0, midpoint.z]} rotation={[0, -angle, 0]}>
        <group ref={meshesRef}>
          {wallPieces.map((piece, i) => (
            <mesh
              key={`wall-${i}`}
              position={[piece.x + piece.w / 2 - length / 2, piece.y + piece.h / 2, 0]}
              castShadow
              receiveShadow
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
              onPointerDown={handlePointerDown}
            >
              <boxGeometry args={[piece.w, piece.h, WALL_THICKNESS]} />
              <meshStandardMaterial 
                color={wallColor} 
                roughness={0.9} 
                map={useTextures ? textures.diffuseMap : undefined}
                bumpMap={useTextures ? textures.bumpMap : undefined}
                bumpScale={0.02}
                roughnessMap={useTextures ? textures.roughnessMap : undefined}
              />
            </mesh>
          ))}

          {attachmentMeshes.map((att, i) => {
            const isActive = att.id === activeAttachmentId || att.id === hoveredAttachmentId;
            const highlightColor = isActive ? '#fbbf24' : undefined;
            const frameColor = highlightColor || att.style.frameColor;
            const isGlassDoor = att.type === 'door' && att.style.id === 'glass';
            const isDoubleDoor = att.type === 'door' && att.style.id === 'double';
            
            return (
            <group 
              key={`att-${i}`} 
              position={[att.x + att.w / 2 - length / 2, att.y + att.h / 2, 0]}
              onPointerDown={(e) => handleAttachmentPointerDown(e, att.id)}
              onPointerOver={(e) => { 
                if (canDragAttachments) { 
                  e.stopPropagation(); 
                  document.body.style.cursor = 'grab'; 
                  setHoveredAttachmentId(att.id);
                } 
              }}
              onPointerOut={() => { 
                if (!activeAttachmentId) {
                  document.body.style.cursor = 'auto'; 
                }
                setHoveredAttachmentId(null);
              }}
            >
              {att.type === 'window' ? (
                <group>
                  {/* Outer Frame */}
                  <mesh>
                    <boxGeometry args={[att.w, att.h, WALL_THICKNESS + 0.05]} />
                    <meshStandardMaterial color={frameColor} />
                  </mesh>
                  {/* Inner cutout for frame */}
                  <mesh>
                    <boxGeometry args={[att.w - 0.1, att.h - 0.1, WALL_THICKNESS + 0.06]} />
                    <meshStandardMaterial color="#000" colorWrite={false} depthWrite={false} />
                  </mesh>
                  {/* Glass */}
                  <mesh>
                    <boxGeometry args={[att.w - 0.1, att.h - 0.1, 0.02]} />
                    <meshStandardMaterial color={att.style.color} transparent opacity={att.style.glassOpacity || 0.4} roughness={0.1} metalness={0.8} />
                  </mesh>
                  {/* Vertical Mullion */}
                  <mesh>
                    <boxGeometry args={[0.04, att.h - 0.1, 0.04]} />
                    <meshStandardMaterial color={frameColor} />
                  </mesh>
                  {/* Horizontal Mullion */}
                  <mesh>
                    <boxGeometry args={[att.w - 0.1, 0.04, 0.04]} />
                    <meshStandardMaterial color={frameColor} />
                  </mesh>
                </group>
              ) : (
                <group>
                  {/* Door Frame */}
                  <mesh>
                    <boxGeometry args={[att.w, att.h, WALL_THICKNESS + 0.05]} />
                    <meshStandardMaterial color={frameColor} />
                  </mesh>
                  
                  {isDoubleDoor ? (
                    <>
                      {/* Left Door Panel */}
                      <mesh position={[-att.w / 4, 0, 0]}>
                        <boxGeometry args={[att.w / 2 - 0.05, att.h - 0.1, WALL_THICKNESS - 0.05]} />
                        <meshStandardMaterial color={att.style.color} roughness={0.8} />
                      </mesh>
                      {/* Right Door Panel */}
                      <mesh position={[att.w / 4, 0, 0]}>
                        <boxGeometry args={[att.w / 2 - 0.05, att.h - 0.1, WALL_THICKNESS - 0.05]} />
                        <meshStandardMaterial color={att.style.color} roughness={0.8} />
                      </mesh>
                      {/* Handles */}
                      <mesh position={[-0.05, 0, (WALL_THICKNESS - 0.05) / 2 + 0.02]}>
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
                      </mesh>
                      <mesh position={[0.05, 0, (WALL_THICKNESS - 0.05) / 2 + 0.02]}>
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
                      </mesh>
                    </>
                  ) : (
                    <>
                      {/* Single Door Panel */}
                      <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[att.w - 0.1, att.h - 0.1, WALL_THICKNESS - 0.05]} />
                        <meshStandardMaterial color={att.style.color} roughness={0.8} transparent={!!att.style.glassOpacity} opacity={att.style.glassOpacity || 1} />
                      </mesh>
                      {/* Handle */}
                      <mesh position={[att.w / 2 - 0.15, 0, (WALL_THICKNESS - 0.05) / 2 + 0.02]}>
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
                      </mesh>
                      <mesh position={[att.w / 2 - 0.15, 0, -(WALL_THICKNESS - 0.05) / 2 - 0.02]}>
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
                      </mesh>
                    </>
                  )}
                </group>
              )}

              {/* Dimension Lines (visible when active/hovered and in build mode) */}
              {isActive && canDragAttachments && (
                <group position={[0, -att.h / 2 + 0.1, WALL_THICKNESS / 2 + 0.1]}>
                  {/* Left Dimension */}
                  <Line 
                    points={[[-att.w / 2, 0, 0], [-att.x - att.w / 2, 0, 0]]} 
                    color="#1e3a8a" 
                    lineWidth={2} 
                  />
                  <Text
                    position={[-att.x / 2 - att.w / 2, 0.2, 0]}
                    fontSize={0.2}
                    color="#1e3a8a"
                    anchorX="center"
                    anchorY="bottom"
                  >
                    {att.x.toFixed(2)}m
                  </Text>
                  
                  {/* Right Dimension */}
                  <Line 
                    points={[[att.w / 2, 0, 0], [length - att.x - att.w / 2, 0, 0]]} 
                    color="#1e3a8a" 
                    lineWidth={2} 
                  />
                  <Text
                    position={[(length - att.x - att.w) / 2 + att.w / 2, 0.2, 0]}
                    fontSize={0.2}
                    color="#1e3a8a"
                    anchorX="center"
                    anchorY="bottom"
                  >
                    {(length - (att.x + att.w)).toFixed(2)}m
                  </Text>

                  {/* Center Mark on the wall */}
                  <Line 
                    points={[
                      [length / 2 - (att.x + att.w / 2), -0.1, 0], 
                      [length / 2 - (att.x + att.w / 2), 0.1, 0]
                    ]} 
                    color="#ef4444" 
                    lineWidth={2} 
                  />
                  <Text
                    position={[length / 2 - (att.x + att.w / 2), -0.2, 0]}
                    fontSize={0.15}
                    color="#ef4444"
                    anchorX="center"
                    anchorY="top"
                  >
                    Center
                  </Text>
                </group>
              )}
            </group>
          )})}
        </group>
        
        {/* Lights outside meshesRef so they don't disappear */}
        {attachmentMeshes.map((att, i) => {
          if (att.type === 'window' && !isBuildStep) {
            return (
              <pointLight 
                key={`light-${i}`} 
                distance={8} 
                intensity={1.5} 
                color="#e0f7fa" 
                position={[att.x + att.w / 2 - length / 2, att.y + att.h / 2, 1]} 
                castShadow 
              />
            );
          }
          return null;
        })}
      </group>
      
      {isBuildStep && (
        <Text
          position={[midpoint.x, WALL_HEIGHT + 0.2, midpoint.z]}
          rotation={[-Math.PI / 2, 0, -angle]}
          fontSize={0.4}
          color="#1e3a8a"
          anchorX="center"
          anchorY="middle"
        >
          {length.toFixed(1)}m
        </Text>
      )}
    </group>
  );
};

const CeilingLightFixture = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ camera }) => {
    if (meshRef.current) {
      // Only show the light fixture mesh when the camera is below the ceiling
      meshRef.current.visible = camera.position.y < WALL_HEIGHT;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <pointLight 
        ref={lightRef} 
        intensity={3} 
        distance={WALL_HEIGHT * 1.5} 
        decay={2} 
        color="#fff5e6" 
        castShadow={false} 
      />
    </group>
  );
};

export const ProceduralRoom = () => {
  const vertices = useEditorStore((state) => state.vertices);
  const attachments = useEditorStore((state) => state.attachments);
  const viewMode = useEditorStore((state) => state.viewMode);
  const currentStep = useEditorStore((state) => state.currentStep);
  const isFloorPlanLocked = useEditorStore((state) => state.isFloorPlanLocked);
  const setVertices = useEditorStore((state) => state.setVertices);
  const floorMaterialColor = useEditorStore((state) => state.floorMaterial);
  const wallMaterialColor = useEditorStore((state) => state.wallMaterial);
  const isLightingGenerated = useEditorStore((state) => state.isLightingGenerated);

  const textures = useAdvancedWoodTextures(floorMaterialColor);
  const wallTextures = useAdvancedWallTextures(wallMaterialColor);
  const floorRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (floorRef.current) {
      // Floor is on layer 0 (default) and layer 1 (for the hot spot lights)
      floorRef.current.layers.enable(1);
    }
  }, []);

  const floorShape = useMemo(() => {
    const shape = new THREE.Shape();
    if (vertices.length > 0) {
      shape.moveTo(vertices[0].x, -vertices[0].z); // Note: Shape is in XY plane, we map Z to Y
      for (let i = 1; i < vertices.length; i++) {
        shape.lineTo(vertices[i].x, -vertices[i].z);
      }
      shape.lineTo(vertices[0].x, -vertices[0].z);
    }
    return shape;
  }, [vertices]);

  const lightPositions = useMemo(() => {
    return getLightPositions(vertices, 1.2, 2.5);
  }, [vertices]);

  const navMeshPoints = useMemo(() => {
    if (!isLightingGenerated) return null;
    const points = [];
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    vertices.forEach(v => {
      minX = Math.min(minX, v.x);
      maxX = Math.max(maxX, v.x);
      minZ = Math.min(minZ, v.z);
      maxZ = Math.max(maxZ, v.z);
    });

    for (let x = minX; x <= maxX; x += 0.5) {
      for (let z = minZ; z <= maxZ; z += 0.5) {
        if (isPointInPolygon(x, z, vertices)) {
          // Simple check to keep away from walls
          let minDist = Infinity;
          for (let i = 0; i < vertices.length; i++) {
            const p1 = vertices[i];
            const p2 = vertices[(i + 1) % vertices.length];
            const dist = pointToSegmentDistance(x, z, p1.x, p1.z, p2.x, p2.z);
            minDist = Math.min(minDist, dist);
          }
          if (minDist > 0.4) {
            points.push(new THREE.Vector3(x, 0.05, z));
          }
        }
      }
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [vertices, isLightingGenerated]);

  return (
    <group>
      {/* Floor */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.7} 
          metalness={0.05} 
          map={textures?.diffuseMap || undefined} 
          bumpMap={textures?.bumpMap || undefined}
          bumpScale={0.015}
          roughnessMap={textures?.roughnessMap || undefined}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WALL_HEIGHT, 0]}>
        <shapeGeometry args={[floorShape]} />
        {/* BackSide makes it visible from inside looking up, invisible from outside looking down */}
        <meshStandardMaterial color="#ffffff" roughness={1} side={THREE.BackSide} />
      </mesh>

      {/* Lighting */}
      {isLightingGenerated && (
        <>
          {/* Ceiling Lights */}
          {lightPositions.map((pos, i) => (
            <CeilingLightFixture key={`light-${i}`} position={[pos.x, WALL_HEIGHT - 0.05, pos.z]} />
          ))}
          
          {/* AI NavMesh Visualization */}
          {navMeshPoints && (
            <points geometry={navMeshPoints}>
              <pointsMaterial color="#10b981" size={0.05} sizeAttenuation={true} transparent opacity={0.6} />
            </points>
          )}
        </>
      )}

      {/* Walls */}
      {vertices.map((v, i) => {
        const nextV = vertices[(i + 1) % vertices.length];
        const wallAtts = attachments.filter(a => a.wallIndex === i);
        return <Wall key={`wall-${i}`} index={i} p1={v} p2={nextV} viewMode={viewMode} textures={wallTextures} attachments={wallAtts} />;
      })}
    </group>
  );
};
