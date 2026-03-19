import React, { useMemo, useState, useEffect } from 'react';
import { useGLTF, Box, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShoppingBag, RotateCw, ArrowLeftRight, LayoutGrid, Copy, Trash2 } from 'lucide-react';
import { useEditorStore, Furniture, getFurnitureDimensions } from '../store';

const ProceduralModel = ({ url, hovered, isDragging, color }: { url: string, hovered: boolean, isDragging: boolean, color?: string }) => {
  const emissiveColor = (hovered || isDragging) ? '#444444' : '#000000';
  const chairColor = color || '#333333'; // Default charcoal
  const sofaColor = color || '#d3d3d3'; // Default light grey
  const tableColor = color || '#c19a6b'; // Default oak

  if (url === 'procedural:chair') {
    return (
      <group>
        {/* Seat */}
        <Box args={[0.5, 0.1, 0.5]} position={[0, 0.45, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={chairColor} emissive={emissiveColor} />
        </Box>
        {/* Legs */}
        <Box args={[0.05, 0.4, 0.05]} position={[-0.2, 0.2, -0.2]} castShadow receiveShadow>
          <meshStandardMaterial color={chairColor} emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.4, 0.05]} position={[0.2, 0.2, -0.2]} castShadow receiveShadow>
          <meshStandardMaterial color={chairColor} emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.4, 0.05]} position={[-0.2, 0.2, 0.2]} castShadow receiveShadow>
          <meshStandardMaterial color={chairColor} emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.4, 0.05]} position={[0.2, 0.2, 0.2]} castShadow receiveShadow>
          <meshStandardMaterial color={chairColor} emissive={emissiveColor} />
        </Box>
        {/* Backrest */}
        <Box args={[0.5, 0.5, 0.05]} position={[0, 0.75, -0.225]} castShadow receiveShadow>
          <meshStandardMaterial color={chairColor} emissive={emissiveColor} />
        </Box>
      </group>
    );
  }

  if (url === 'procedural:sofa') {
    return (
      <group>
        {/* Base */}
        <Box args={[2, 0.4, 0.8]} position={[0, 0.2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={sofaColor} emissive={emissiveColor} />
        </Box>
        {/* Back */}
        <Box args={[2, 0.6, 0.2]} position={[0, 0.7, -0.3]} castShadow receiveShadow>
          <meshStandardMaterial color={sofaColor} emissive={emissiveColor} />
        </Box>
        {/* Arms */}
        <Box args={[0.2, 0.5, 0.8]} position={[-0.9, 0.65, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={sofaColor} emissive={emissiveColor} />
        </Box>
        <Box args={[0.2, 0.5, 0.8]} position={[0.9, 0.65, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={sofaColor} emissive={emissiveColor} />
        </Box>
      </group>
    );
  }

  if (url === 'procedural:table') {
    return (
      <group>
        {/* Top */}
        <Box args={[1.2, 0.05, 0.8]} position={[0, 0.45, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={tableColor} emissive={emissiveColor} />
        </Box>
        {/* Legs */}
        <Box args={[0.05, 0.45, 0.05]} position={[-0.5, 0.225, -0.3]} castShadow receiveShadow>
          <meshStandardMaterial color={tableColor} emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.45, 0.05]} position={[0.5, 0.225, -0.3]} castShadow receiveShadow>
          <meshStandardMaterial color={tableColor} emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.45, 0.05]} position={[-0.5, 0.225, 0.3]} castShadow receiveShadow>
          <meshStandardMaterial color={tableColor} emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.45, 0.05]} position={[0.5, 0.225, 0.3]} castShadow receiveShadow>
          <meshStandardMaterial color={tableColor} emissive={emissiveColor} />
        </Box>
      </group>
    );
  }

  if (url === 'procedural:bed') {
    const bedColor = color || '#ffffff';
    return (
      <group>
        {/* Frame */}
        <Box args={[1.6, 0.3, 2.1]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#5c4033" emissive={emissiveColor} />
        </Box>
        {/* Mattress */}
        <Box args={[1.5, 0.25, 2.0]} position={[0, 0.425, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={bedColor} emissive={emissiveColor} />
        </Box>
        {/* Headboard */}
        <Box args={[1.6, 1.0, 0.1]} position={[0, 0.5, -1.0]} castShadow receiveShadow>
          <meshStandardMaterial color="#5c4033" emissive={emissiveColor} />
        </Box>
        {/* Pillows */}
        <Box args={[0.6, 0.15, 0.3]} position={[-0.4, 0.625, -0.7]} castShadow receiveShadow>
          <meshStandardMaterial color="#f0f0f0" emissive={emissiveColor} />
        </Box>
        <Box args={[0.6, 0.15, 0.3]} position={[0.4, 0.625, -0.7]} castShadow receiveShadow>
          <meshStandardMaterial color="#f0f0f0" emissive={emissiveColor} />
        </Box>
      </group>
    );
  }

  if (url === 'procedural:plant') {
    const potColor = color || '#f0f0f0';
    return (
      <group>
        {/* Pot */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.5, 16]} />
          <meshStandardMaterial color={potColor} emissive={emissiveColor} />
        </mesh>
        {/* Dirt */}
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 16]} />
          <meshStandardMaterial color="#3b2f2f" />
        </mesh>
        {/* Leaves (simplified) */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#2d5a27" emissive={emissiveColor} />
        </mesh>
        <mesh position={[-0.15, 1.0, 0.1]} castShadow receiveShadow>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#3a7031" emissive={emissiveColor} />
        </mesh>
        <mesh position={[0.15, 0.9, -0.1]} castShadow receiveShadow>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#2d5a27" emissive={emissiveColor} />
        </mesh>
      </group>
    );
  }

  if (url === 'procedural:rug') {
    const rugColor = color || '#fdfbf7';
    return (
      <group>
        <Box args={[2.5, 0.02, 3.5]} position={[0, 0.01, 0]} receiveShadow>
          <meshStandardMaterial color={rugColor} emissive={emissiveColor} roughness={0.9} />
        </Box>
      </group>
    );
  }

  if (url === 'procedural:desk') {
    const deskColor = color || '#d7c4a3';
    return (
      <group>
        {/* Top */}
        <Box args={[1.4, 0.05, 0.7]} position={[0, 0.75, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={deskColor} emissive={emissiveColor} />
        </Box>
        {/* Legs */}
        <Box args={[0.05, 0.75, 0.05]} position={[-0.65, 0.375, -0.3]} castShadow receiveShadow>
          <meshStandardMaterial color="#111111" emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.75, 0.05]} position={[0.65, 0.375, -0.3]} castShadow receiveShadow>
          <meshStandardMaterial color="#111111" emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.75, 0.05]} position={[-0.65, 0.375, 0.3]} castShadow receiveShadow>
          <meshStandardMaterial color="#111111" emissive={emissiveColor} />
        </Box>
        <Box args={[0.05, 0.75, 0.05]} position={[0.65, 0.375, 0.3]} castShadow receiveShadow>
          <meshStandardMaterial color="#111111" emissive={emissiveColor} />
        </Box>
      </group>
    );
  }

  return null;
};

const Model = ({ url, hovered, isDragging, color }: { url: string, hovered: boolean, isDragging: boolean, color?: string }) => {
  if (url.startsWith('procedural:')) {
    return <ProceduralModel url={url} hovered={hovered} isDragging={isDragging} color={color} />;
  }

  const { scene } = useGLTF(url);
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          if ('emissive' in mat) {
            if (hovered || isDragging) {
              mat.emissive = new THREE.Color('#444444');
            } else {
              mat.emissive = new THREE.Color('#000000');
            }
          }
          if (color && 'color' in mat) {
            mat.color = new THREE.Color(color);
          }
        }
      }
    });
  }, [hovered, isDragging, clonedScene, color]);
  
  return <primitive object={clonedScene} />;
};

export const FurnitureItem = ({ furniture }: { furniture: Furniture }) => {
  const updateFurniture = useEditorStore((state) => state.updateFurniture);
  const currentStep = useEditorStore((state) => state.currentStep);
  const activeDragId = useEditorStore((state) => state.activeDragId);
  const setActiveDragId = useEditorStore((state) => state.setActiveDragId);
  const selectedFurnitureId = useEditorStore((state) => state.selectedFurnitureId);
  const setSelectedFurnitureId = useEditorStore((state) => state.setSelectedFurnitureId);
  
  const [hovered, setHovered] = useState(false);
  const [showRotateSlider, setShowRotateSlider] = useState(false);
  const isFurnishStep = currentStep === 'FURNISH';
  const isDragging = activeDragId === furniture.id;
  const isSelected = selectedFurnitureId === furniture.id;

  useCursor(hovered && isFurnishStep, isDragging ? 'grabbing' : 'grab', 'auto');

  // Deselect when clicking outside is handled in EditorPage
  // Hide rotate slider if deselected
  useEffect(() => {
    if (!isSelected) {
      setShowRotateSlider(false);
    }
  }, [isSelected]);

  const dims = getFurnitureDimensions(furniture.modelUrl);

  return (
    <group 
      position={furniture.position} 
      rotation={furniture.rotation}
      onPointerOver={(e) => {
        if (isFurnishStep && !activeDragId) {
          e.stopPropagation();
          setHovered(true);
        }
      }}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(e) => {
        if (isFurnishStep) {
          e.stopPropagation();
          setActiveDragId(furniture.id);
          setSelectedFurnitureId(furniture.id);
        }
      }}
      onContextMenu={(e) => {
        if (isFurnishStep) {
          e.stopPropagation();
          useEditorStore.getState().commitHistory();
          updateFurniture(furniture.id, { rotation: [0, furniture.rotation[1] + Math.PI / 4, 0] });
        }
      }}
    >
      <React.Suspense fallback={<Box args={[1, 1, 1]} position={[0, 0.5, 0]}><meshStandardMaterial color="gray" /></Box>}>
        <Model url={furniture.modelUrl} hovered={hovered || isSelected} isDragging={isDragging} color={furniture.color} />
        {(isDragging || isSelected) && (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[dims.width, 1, dims.depth]} />
            <meshBasicMaterial color={isSelected ? "#eab308" : "#3b82f6"} wireframe transparent opacity={0.8} />
          </mesh>
        )}
        
        {isSelected && !isDragging && (
          <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
            <div 
              className="flex flex-col items-center gap-2"
              onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopPropagation(); }}
              onPointerMove={(e) => { e.stopPropagation(); e.nativeEvent.stopPropagation(); }}
              onPointerUp={(e) => { e.stopPropagation(); e.nativeEvent.stopPropagation(); }}
              onWheel={(e) => { e.stopPropagation(); e.nativeEvent.stopPropagation(); }}
            >
              <div className="bg-[#222222] text-white rounded-2xl md:rounded-full px-2 py-2 shadow-xl flex flex-wrap md:flex-nowrap items-center justify-center gap-1 pointer-events-auto max-w-[280px] md:max-w-none">
                <button className="flex flex-col items-center gap-1 px-2 md:px-3 py-1 hover:bg-white/10 rounded-lg transition-colors md:border-r border-white/20">
                  <ShoppingBag size={18} />
                  <span className="text-[10px] whitespace-nowrap">Add to bag</span>
                </button>
                
                <div 
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setShowRotateSlider(true)}
                  onMouseLeave={() => setShowRotateSlider(false)}
                >
                  <button 
                    className={`flex flex-col items-center gap-1 px-2 md:px-3 py-1 hover:bg-white/10 rounded-lg transition-colors ${showRotateSlider ? 'bg-white/20' : ''}`}
                  >
                    <RotateCw size={18} />
                    <span className="text-[10px]">Rotate</span>
                  </button>
                  
                  {showRotateSlider && (
                    <div className="absolute bottom-full pb-2 w-56 flex justify-center z-50">
                      <div className="bg-[#222222] rounded-full px-4 py-2 shadow-xl flex items-center pointer-events-auto w-full h-10 relative">
                        {/* Track line */}
                        <div className="absolute left-4 right-4 h-1 bg-white/30 rounded-full pointer-events-none"></div>
                        
                        {/* Ticks */}
                        <div className="absolute left-4 right-4 flex justify-between items-center pointer-events-none h-full">
                          <div className="w-0.5 h-3 bg-white"></div>
                          <div className="w-0.5 h-3 bg-white"></div>
                          <div className="w-0.5 h-3 bg-white"></div>
                          <div className="w-0.5 h-3 bg-white"></div>
                          <div className="w-0.5 h-3 bg-white"></div>
                        </div>

                        {/* Range input */}
                        <input 
                          type="range" 
                          min="-180" 
                          max="180" 
                          step="1"
                          value={Math.round((furniture.rotation[1] * 180) / Math.PI)}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopPropagation();
                            useEditorStore.getState().commitHistory();
                          }}
                          onPointerMove={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopPropagation();
                          }}
                          onChange={(e) => {
                            const angle = (parseFloat(e.target.value) * Math.PI) / 180;
                            updateFurniture(furniture.id, { rotation: [0, angle, 0] });
                          }}
                          className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10 m-0"
                        />

                        {/* Custom Thumb */}
                        <div 
                          className="absolute top-1/2 w-5 h-5 bg-white rounded-full pointer-events-none shadow-md transform -translate-y-1/2 -translate-x-1/2 z-0"
                          style={{ left: `calc(1rem + ${((Math.round((furniture.rotation[1] * 180) / Math.PI) + 180) / 360)} * (100% - 2rem))` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#111111] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg">
                            {Math.round((furniture.rotation[1] * 180) / Math.PI)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button className="flex flex-col items-center gap-1 px-2 md:px-3 py-1 hover:bg-white/10 rounded-lg transition-colors">
                  <ArrowLeftRight size={18} />
                  <span className="text-[10px]">Replace</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-2 md:px-3 py-1 hover:bg-white/10 rounded-lg transition-colors">
                  <LayoutGrid size={18} />
                  <span className="text-[10px] whitespace-nowrap">Goes with</span>
                </button>
                <button 
                  className="flex flex-col items-center gap-1 px-2 md:px-3 py-1 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => {
                    useEditorStore.getState().addFurniture(furniture.modelUrl);
                  }}
                >
                  <Copy size={18} />
                  <span className="text-[10px] whitespace-nowrap">Make copy</span>
                </button>
                <button 
                  className="flex flex-col items-center gap-1 px-2 md:px-3 py-1 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                  onClick={() => {
                    useEditorStore.getState().removeFurniture(furniture.id);
                    useEditorStore.getState().setSelectedFurnitureId(null);
                  }}
                >
                  <Trash2 size={18} />
                  <span className="text-[10px]">Remove</span>
                </button>
              </div>
            </div>
          </Html>
        )}
      </React.Suspense>
    </group>
  );
};
