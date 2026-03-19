import React, { useEffect, useState } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { ProceduralRoom, WALL_THICKNESS } from './components/ProceduralRoom';
import { FurnitureItem } from './components/FurnitureItem';
import { useEditorStore, getFurnitureDimensions } from './store';
import { Sidebar, FURNITURE_CATALOG } from './components/Sidebar';

import { Undo, Redo, X } from 'lucide-react';
import './editor.css';

const EditorPage = () => {
  const [showExitModal, setShowExitModal] = useState(false);
  const viewMode = useEditorStore((state) => state.viewMode);
  const placedFurniture = useEditorStore((state) => state.placedFurniture);
  const activeDragId = useEditorStore((state) => state.activeDragId);
  const setActiveDragId = useEditorStore((state) => state.setActiveDragId);
  const activeWallIndex = useEditorStore((state) => state.activeWallIndex);
  const wallDragStart = useEditorStore((state) => state.wallDragStart);
  const stopWallDrag = useEditorStore((state) => state.stopWallDrag);
  const updateFurniture = useEditorStore((state) => state.updateFurniture);
  const vertices = useEditorStore((state) => state.vertices);
  const isLightingGenerated = useEditorStore((state) => state.isLightingGenerated);
  const activeAttachmentId = useEditorStore((state) => state.activeAttachmentId);
  const setActiveAttachmentId = useEditorStore((state) => state.setActiveAttachmentId);
  const updateAttachment = useEditorStore((state) => state.updateAttachment);

  useEffect(() => {
    if (activeAttachmentId) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [activeAttachmentId]);

  useEffect(() => {
    const handleUp = () => {
      setActiveDragId(null);
      stopWallDrag();
      setActiveAttachmentId(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'Escape') {
        setActiveDragId(null);
        stopWallDrag();
        setActiveAttachmentId(null);
        useEditorStore.getState().setSelectedFurnitureId(null);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        const state = useEditorStore.getState();
        if (state.selectedFurnitureId) {
          state.commitHistory();
          state.removeFurniture(state.selectedFurnitureId);
          state.setSelectedFurnitureId(null);
        }
      }
    };
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setActiveDragId, stopWallDrag, setActiveAttachmentId]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (activeAttachmentId) {
      e.stopPropagation();
      const targetX = e.point.x;
      const targetZ = e.point.z;

      let minDistToAnyWall = Infinity;
      let closestWallIndex = 0;
      let closestRatio = 0.5;

      for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        const dx = p2.x - p1.x;
        const dz = p2.z - p1.z;
        const len = Math.sqrt(dx*dx + dz*dz);
        if (len === 0) continue;

        const t = ((targetX - p1.x) * dx + (targetZ - p1.z) * dz) / (len * len);
        const clampedT = Math.max(0.05, Math.min(0.95, t));
        const projX = p1.x + clampedT * dx;
        const projZ = p1.z + clampedT * dz;
        const distToSegment = Math.sqrt((targetX - projX) ** 2 + (targetZ - projZ) ** 2);

        if (distToSegment < minDistToAnyWall) {
          minDistToAnyWall = distToSegment;
          closestWallIndex = i;
          closestRatio = clampedT;
        }
      }

      updateAttachment(activeAttachmentId, { wallIndex: closestWallIndex, ratio: closestRatio });
      return;
    }

    if (activeWallIndex !== null && wallDragStart) {
      e.stopPropagation();
      const dx = e.point.x - wallDragStart.x;
      const dz = e.point.z - wallDragStart.z;
      
      const newVertices = wallDragStart.vertices.map(v => ({...v}));
      
      // Project movement onto the wall's normal to keep it parallel
      const p1 = wallDragStart.vertices[activeWallIndex];
      const p2 = wallDragStart.vertices[(activeWallIndex + 1) % wallDragStart.vertices.length];
      const wallDx = p2.x - p1.x;
      const wallDz = p2.z - p1.z;
      const len = Math.sqrt(wallDx*wallDx + wallDz*wallDz);
      
      if (len > 0) {
        const nx = -wallDz / len;
        const nz = wallDx / len;
        
        const dot = dx * nx + dz * nz;
        const moveX = nx * dot;
        const moveZ = nz * dot;

        const snap = 0.5;
        const snappedMoveX = Math.round(moveX / snap) * snap;
        const snappedMoveZ = Math.round(moveZ / snap) * snap;

        newVertices[activeWallIndex].x = wallDragStart.vertices[activeWallIndex].x + snappedMoveX;
        newVertices[activeWallIndex].z = wallDragStart.vertices[activeWallIndex].z + snappedMoveZ;
        
        const nextIndex = (activeWallIndex + 1) % newVertices.length;
        newVertices[nextIndex].x = wallDragStart.vertices[nextIndex].x + snappedMoveX;
        newVertices[nextIndex].z = wallDragStart.vertices[nextIndex].z + snappedMoveZ;

        useEditorStore.getState().setVertices(newVertices);
      }
      return;
    }

    if (activeDragId) {
      e.stopPropagation();
      let targetX = e.point.x;
      let targetZ = e.point.z;
      let targetRotation = null;

      const item = placedFurniture.find(f => f.id === activeDragId);
      if (!item) return;

      // 1. Check if point is inside the room
      let inside = false;
      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, zi = vertices[i].z;
        const xj = vertices[j].x, zj = vertices[j].z;
        const intersect = ((zi > targetZ) !== (zj > targetZ))
            && (targetX < (xj - xi) * (targetZ - zi) / (zj - zi) + xi);
        if (intersect) inside = !inside;
      }

      // 2. If outside, snap exactly to the closest boundary point
      if (!inside) {
        let minDistToBoundary = Infinity;
        let closestPoint = { x: targetX, z: targetZ };
        for (let i = 0; i < vertices.length; i++) {
          const p1 = vertices[i];
          const p2 = vertices[(i + 1) % vertices.length];
          const l2 = (p1.x - p2.x) ** 2 + (p1.z - p2.z) ** 2;
          if (l2 === 0) continue;
          let t = ((targetX - p1.x) * (p2.x - p1.x) + (targetZ - p1.z) * (p2.z - p1.z)) / l2;
          t = Math.max(0, Math.min(1, t));
          const projX = p1.x + t * (p2.x - p1.x);
          const projZ = p1.z + t * (p2.z - p1.z);
          const dist = Math.sqrt((targetX - projX) ** 2 + (targetZ - projZ) ** 2);
          if (dist < minDistToBoundary) {
            minDistToBoundary = dist;
            closestPoint = { x: projX, z: projZ };
          }
        }
        targetX = closestPoint.x;
        targetZ = closestPoint.z;
      }

      // 3. OBB Collision and Snapping
      const dims = getFurnitureDimensions(item.modelUrl);
      const SNAP_DISTANCE = 1.0; 
      let snappedToWall = false;
      let snappedToObject = false;
      let wallAngle = 0;

      // Object snapping logic
      const catalogItem = FURNITURE_CATALOG.find(c => c.url === item.modelUrl);
      if (catalogItem?.snapsTo) {
        let closestSnapper = null;
        let minSnapperDist = Infinity;
        
        for (const other of placedFurniture) {
          if (other.id === item.id) continue;
          if (catalogItem.snapsTo.includes(other.modelUrl)) {
            const dist = Math.sqrt((targetX - other.position[0])**2 + (targetZ - other.position[2])**2);
            if (dist < minSnapperDist) {
              minSnapperDist = dist;
              closestSnapper = other;
            }
          }
        }

        if (closestSnapper && minSnapperDist < 1.5) {
          const otherDims = getFurnitureDimensions(closestSnapper.modelUrl);
          const dx = targetX - closestSnapper.position[0];
          const dz = targetZ - closestSnapper.position[2];
          
          const sAngle = closestSnapper.rotation[1];
          const sCos = Math.cos(-sAngle);
          const sSin = Math.sin(-sAngle);
          const localDx = dx * sCos - dz * sSin;
          const localDz = dx * sSin + dz * sCos;
          
          const hw = dims.width / 2;
          const hd = dims.depth / 2;
          const shw = otherDims.width / 2;
          const shd = otherDims.depth / 2;
          
          const distPosX = Math.abs(localDx - (shw + hd));
          const distNegX = Math.abs(localDx - -(shw + hd));
          const distPosZ = Math.abs(localDz - (shd + hd));
          const distNegZ = Math.abs(localDz - -(shd + hd));
          
          const minFaceDist = Math.min(distPosX, distNegX, distPosZ, distNegZ);
          
          let snapLocalX = 0;
          let snapLocalZ = 0;
          let snapRotation = 0;
          
          if (minFaceDist === distPosX) {
            snapLocalX = shw + hd;
            snapLocalZ = Math.max(-shd, Math.min(shd, localDz));
          } else if (minFaceDist === distNegX) {
            snapLocalX = -(shw + hd);
            snapLocalZ = Math.max(-shd, Math.min(shd, localDz));
          } else if (minFaceDist === distPosZ) {
            snapLocalX = Math.max(-shw, Math.min(shw, localDx));
            snapLocalZ = shd + hd;
          } else {
            snapLocalX = Math.max(-shw, Math.min(shw, localDx));
            snapLocalZ = -(shd + hd);
          }
          
          const wCos = Math.cos(sAngle);
          const wSin = Math.sin(sAngle);
          targetX = closestSnapper.position[0] + snapLocalX * wCos - snapLocalZ * wSin;
          targetZ = closestSnapper.position[2] + snapLocalX * wSin + snapLocalZ * wCos;
          
          // Calculate rotation to face the table's center
          const faceDx = closestSnapper.position[0] - targetX;
          const faceDz = closestSnapper.position[2] - targetZ;
          targetRotation = [0, Math.atan2(faceDx, faceDz), 0] as [number, number, number];
          snappedToObject = true;
        }
      }

      // Determine if we should snap to a wall to get the target rotation
      let minDistToAnyWall = Infinity;
      for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        const dx = p2.x - p1.x;
        const dz = p2.z - p1.z;
        const len = Math.sqrt(dx*dx + dz*dz);
        if (len === 0) continue;

        let t = ((targetX - p1.x) * dx + (targetZ - p1.z) * dz) / (len * len);
        t = Math.max(0, Math.min(1, t));
        const projX = p1.x + t * dx;
        const projZ = p1.z + t * dz;
        const distToSegment = Math.sqrt((targetX - projX) ** 2 + (targetZ - projZ) ** 2);

        if (distToSegment < minDistToAnyWall) {
          minDistToAnyWall = distToSegment;
          const normal = { x: -dz / len, z: dx / len };
          wallAngle = Math.atan2(normal.x, normal.z);
        }
      }

      if (minDistToAnyWall < SNAP_DISTANCE && !snappedToObject) {
        snappedToWall = true;
        targetRotation = [0, wallAngle, 0] as [number, number, number];
      } else if (!snappedToObject) {
        targetRotation = item.rotation;
      }

      // Apply OBB collision relaxation
      const angle = targetRotation[1];
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const hw = dims.width / 2;
      const hd = dims.depth / 2;
      const maxRadius = Math.sqrt(hw*hw + hd*hd);

      for (let step = 0; step < 3; step++) {
        for (let i = 0; i < vertices.length; i++) {
          const p1 = vertices[i];
          const p2 = vertices[(i + 1) % vertices.length];
          const dx = p2.x - p1.x;
          const dz = p2.z - p1.z;
          const len = Math.sqrt(dx*dx + dz*dz);
          if (len === 0) continue;

          // Find the closest point on the segment to the center of the furniture
          let tCenter = ((targetX - p1.x) * dx + (targetZ - p1.z) * dz) / (len * len);
          let clampedT = Math.max(0, Math.min(1, tCenter));
          let projX = p1.x + clampedT * dx;
          let projZ = p1.z + clampedT * dz;
          let distToSegment = Math.sqrt((targetX - projX)**2 + (targetZ - projZ)**2);
          
          const WALL_MARGIN = (WALL_THICKNESS / 2) + 0.05;

          // Only consider this wall if the furniture is actually close to the segment
          if (distToSegment < maxRadius + WALL_MARGIN) {
            const normal = { x: -dz / len, z: dx / len };
            const wallDir = { x: dx / len, z: dz / len };
            
            // Box local axes
            const localX = { x: cos, z: -sin };
            const localZ = { x: sin, z: cos };
            
            // Extent of the box along the wall's normal
            const extentNormal = Math.abs(localX.x * normal.x + localX.z * normal.z) * (dims.width / 2) + 
                                 Math.abs(localZ.x * normal.x + localZ.z * normal.z) * (dims.depth / 2);
                                 
            // Extent of the box along the wall's direction
            const extentDir = Math.abs(localX.x * wallDir.x + localX.z * wallDir.z) * (dims.width / 2) + 
                              Math.abs(localZ.x * wallDir.x + localZ.z * wallDir.z) * (dims.depth / 2);
                              
            // Center projection along wall normal
            const signedDistCenter = (targetX - p1.x) * normal.x + (targetZ - p1.z) * normal.z;
            
            // Center projection along wall direction
            const projCenter = tCenter * len;
            
            // Check overlap along wall direction
            const overlapsDir = (projCenter >= 0) && (projCenter <= len);
            
            // Check overlap along wall normal
            const minSignedDist = signedDistCenter - extentNormal;
            
            // If it overlaps along the direction, and penetrates the normal, push it out
            if (overlapsDir && minSignedDist < WALL_MARGIN && minSignedDist > -maxRadius * 2) {
              targetX += normal.x * (WALL_MARGIN - minSignedDist);
              targetZ += normal.z * (WALL_MARGIN - minSignedDist);
            }
          }
        }
      }

      updateFurniture(activeDragId, { position: [targetX, 0, targetZ], rotation: targetRotation });
    }
  };

  return (
    <div className="editor-demo-container flex flex-col-reverse md:flex-row h-screen w-full bg-neutral-100 overflow-hidden font-sans relative">
      {showExitModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Are you sure you want to leave?</h2>
            <p className="text-neutral-500 mb-6">All unsaved progress will be lost.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  useEditorStore.getState().resetProject();
                  setShowExitModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Discard Project
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar />
      
      <div 
        className="flex-1 relative min-h-[50vh]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'furniture' && data.url) {
              useEditorStore.getState().addFurniture(data.url);
            }
          } catch (err) {
            // ignore
          }
        }}
      >
        <Canvas 
          shadows
          onPointerMissed={() => {
            useEditorStore.getState().setSelectedFurnitureId(null);
          }}
        >
          <color attach="background" args={['#f5f5f5']} />
          
          {viewMode === '3D' ? (
            <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
          ) : (
            <OrthographicCamera makeDefault position={[0, 10, 0]} zoom={40} rotation={[-Math.PI / 2, 0, 0]} />
          )}

          <OrbitControls 
            makeDefault 
            enableRotate={viewMode === '3D' && !activeDragId && activeWallIndex === null && !activeAttachmentId} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Don't go below ground
          />

          {(activeDragId || activeWallIndex !== null || activeAttachmentId) && (
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
              onPointerMove={handlePointerMove}
              visible={false}
            >
              <planeGeometry args={[1000, 1000]} />
            </mesh>
          )}

          {!isLightingGenerated ? (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight
                castShadow
                position={[5, 10, 5]}
                intensity={1.5}
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
              />
              <Environment preset="apartment" />
            </>
          ) : (
            <>
              <ambientLight intensity={0.1} />
              <Environment preset="night" />
            </>
          )}

          <group position={[0, -0.01, 0]}>
            <Grid infiniteGrid fadeDistance={50} sectionColor="#d0d0d0" cellColor="#e0e0e0" />
          </group>

          <ProceduralRoom />

          {placedFurniture.map((furniture) => (
            <FurnitureItem key={furniture.id} furniture={furniture} />
          ))}

          <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={2} far={4} />
        </Canvas>
        
        {/* Top Controls Overlay */}
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          {/* Undo/Redo */}
          <div className="bg-white rounded-lg shadow-md p-1 flex gap-1">
            <button
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => useEditorStore.getState().undo()}
              disabled={useEditorStore((state) => state.past.length === 0)}
              title="Undo"
            >
              <Undo size={16} />
            </button>
            <button
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => useEditorStore.getState().redo()}
              disabled={useEditorStore((state) => state.future.length === 0)}
              title="Redo"
            >
              <Redo size={16} />
            </button>
          </div>

          {/* 2D/3D Toggle */}
          <div className="bg-white rounded-lg shadow-md p-1 flex gap-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === '2D' ? '!bg-black !text-white' : 'text-neutral-600 hover:!bg-neutral-100'}`}
              onClick={() => useEditorStore.getState().setViewMode('2D')}
            >
              2D Plan
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === '3D' ? '!bg-black !text-white' : 'text-neutral-600 hover:!bg-neutral-100'}`}
              onClick={() => useEditorStore.getState().setViewMode('3D')}
            >
              3D View
            </button>
          </div>

          {/* Close Project */}
          <button 
            onClick={() => setShowExitModal(true)}
            className="p-2 bg-white/80 backdrop-blur-md rounded-lg shadow-md border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-white transition-all flex items-center justify-center"
            title="Close Project"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
