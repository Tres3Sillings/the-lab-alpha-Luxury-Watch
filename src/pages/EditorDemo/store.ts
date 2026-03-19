import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type Point = { x: number; z: number };

export type AttachmentStyle = {
  id: string;
  name: string;
  width: number;
  height: number;
  yOffset: number;
  color: string;
  frameColor: string;
  glassOpacity?: number;
};

export const DOOR_STYLES: Record<string, AttachmentStyle> = {
  'standard': { id: 'standard', name: 'Standard Door', width: 0.9, height: 2.1, yOffset: 0, color: '#8b5a2b', frameColor: '#4a3b2c' },
  'double': { id: 'double', name: 'Double Door', width: 1.6, height: 2.1, yOffset: 0, color: '#8b5a2b', frameColor: '#4a3b2c' },
  'glass': { id: 'glass', name: 'Glass Door', width: 0.9, height: 2.1, yOffset: 0, color: '#88ccff', frameColor: '#333333', glassOpacity: 0.6 },
};

export const WINDOW_STYLES: Record<string, AttachmentStyle> = {
  'standard': { id: 'standard', name: 'Standard Window', width: 1.2, height: 1.2, yOffset: 0.9, color: '#88ccff', frameColor: '#333333', glassOpacity: 0.4 },
  'large': { id: 'large', name: 'Large Window', width: 2.0, height: 1.5, yOffset: 0.6, color: '#88ccff', frameColor: '#333333', glassOpacity: 0.4 },
  'tall': { id: 'tall', name: 'Tall Window', width: 0.8, height: 1.8, yOffset: 0.3, color: '#88ccff', frameColor: '#333333', glassOpacity: 0.4 },
};

export type Attachment = {
  id: string;
  type: 'door' | 'window';
  style: string;
  wallIndex: number;
  ratio: number;
};

export type Furniture = {
  id: string;
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
};

export type Step = 'SETUP' | 'FURNISH' | 'LISTS';
export type ViewMode = '2D' | '3D';
export type SetupMode = 'menu' | 'template' | 'custom' | 'photo';
export type CustomSetupStep = 1 | 2 | 3 | 4;

export const getFurnitureDimensions = (url: string): { width: number, depth: number, type: 'wall' | 'center' } => {
  if (url === 'procedural:chair') return { width: 0.6, depth: 0.6, type: 'wall' };
  if (url === 'procedural:sofa') return { width: 2.2, depth: 1.0, type: 'wall' };
  if (url === 'procedural:table') return { width: 1.4, depth: 1.0, type: 'center' };
  if (url === 'procedural:bed') return { width: 1.6, depth: 2.1, type: 'wall' };
  if (url === 'procedural:plant') return { width: 0.6, depth: 0.6, type: 'center' };
  if (url === 'procedural:rug') return { width: 2.5, depth: 3.5, type: 'center' };
  if (url === 'procedural:desk') return { width: 1.4, depth: 0.7, type: 'wall' };
  return { width: 1, depth: 1, type: 'center' };
};

const findPlacement = (state: EditorState, url: string): { position: [number, number, number], rotation: [number, number, number] } => {
  const dims = getFurnitureDimensions(url);
  const { vertices, placedFurniture } = state;
  
  const checkOverlap = (x: number, z: number, width: number, depth: number) => {
    for (const f of placedFurniture) {
      const fDims = getFurnitureDimensions(f.modelUrl);
      const dx = Math.abs(f.position[0] - x);
      const dz = Math.abs(f.position[2] - z);
      const r1 = Math.max(width, depth) / 2;
      const r2 = Math.max(fDims.width, fDims.depth) / 2;
      if (Math.sqrt(dx*dx + dz*dz) < r1 + r2 + 0.2) {
        return true;
      }
    }
    return false;
  };

  if (dims.type === 'wall') {
    const walls = [];
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const len = Math.sqrt(dx*dx + dz*dz);
      walls.push({ p1, p2, dx, dz, len });
    }
    walls.sort((a, b) => b.len - a.len);

    for (const wall of walls) {
      const nx = -wall.dz / wall.len;
      const nz = wall.dx / wall.len;
      const angle = Math.atan2(nx, nz);
      
      const safeDistance = dims.width / 2 + 0.2; // 0.2 is wall thickness
      const startStep = Math.ceil(safeDistance / 0.5);
      const steps = Math.floor(wall.len / 0.5);
      const endStep = steps - startStep;
      
      for (let i = startStep; i <= endStep; i++) {
        const t = i / steps;
        const offset = 0.1 + dims.depth / 2 + 0.05; // 0.1 is half wall thickness
        const px = wall.p1.x + wall.dx * t + nx * offset;
        const pz = wall.p1.z + wall.dz * t + nz * offset;
        
        if (!checkOverlap(px, pz, dims.width, dims.depth)) {
          return { position: [px, 0, pz], rotation: [0, angle, 0] };
        }
      }
    }
  }

  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  vertices.forEach(v => {
    minX = Math.min(minX, v.x);
    maxX = Math.max(maxX, v.x);
    minZ = Math.min(minZ, v.z);
    maxZ = Math.max(maxZ, v.z);
  });
  
  let cx = (minX + maxX) / 2;
  let cz = (minZ + maxZ) / 2;
  
  for (let r = 0; r < 10; r += 0.5) {
    for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 4) {
      const px = cx + Math.cos(theta) * r;
      const pz = cz + Math.sin(theta) * r;
      
      let inside = false;
      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, zi = vertices[i].z;
        const xj = vertices[j].x, zj = vertices[j].z;
        const intersect = ((zi > pz) !== (zj > pz))
            && (px < (xj - xi) * (pz - zi) / (zj - zi) + xi);
        if (intersect) inside = !inside;
      }
      
      if (inside && !checkOverlap(px, pz, dims.width, dims.depth)) {
        return { position: [px, 0, pz], rotation: [0, 0, 0] };
      }
    }
  }

  return { position: [cx, 0, cz], rotation: [0, 0, 0] };
};

interface EditorState {
  vertices: Point[];
  attachments: Attachment[];
  placedFurniture: Furniture[];
  currentStep: Step;
  setupMode: SetupMode;
  customSetupStep: CustomSetupStep;
  viewMode: ViewMode;
  isFloorPlanLocked: boolean;
  isLightingGenerated: boolean;
  activeDragId: string | null;
  selectedFurnitureId: string | null;
  activeWallIndex: number | null;
  wallDragStart: { x: number, z: number, vertices: Point[] } | null;
  activeAttachmentId: string | null;
  floorMaterial: string;
  wallMaterial: string;
  past: { vertices: Point[], attachments: Attachment[], placedFurniture: Furniture[], floorMaterial: string, wallMaterial: string }[];
  future: { vertices: Point[], attachments: Attachment[], placedFurniture: Furniture[], floorMaterial: string, wallMaterial: string }[];
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;
  setActiveDragId: (id: string | null) => void;
  setActiveAttachmentId: (id: string | null) => void;
  setSelectedFurnitureId: (id: string | null) => void;
  startWallDrag: (index: number, x: number, z: number, vertices: Point[]) => void;
  stopWallDrag: () => void;
  setVertices: (vertices: Point[]) => void;
  setAttachments: (attachments: Attachment[]) => void;
  addAttachment: (type: 'door' | 'window', style: string, wallIndex: number) => void;
  updateAttachment: (id: string, updates: Partial<Attachment>) => void;
  removeAttachment: (id: string) => void;
  setFloorMaterial: (color: string) => void;
  setWallMaterial: (color: string) => void;
  setPlacedFurniture: (furniture: Furniture[]) => void;
  addFurniture: (modelUrl: string) => void;
  updateFurniture: (id: string, updates: Partial<Furniture>) => void;
  removeFurniture: (id: string) => void;
  setCurrentStep: (step: Step) => void;
  setSetupMode: (mode: SetupMode) => void;
  setCustomSetupStep: (step: CustomSetupStep) => void;
  setViewMode: (mode: ViewMode) => void;
  setFloorPlanLocked: (locked: boolean) => void;
  setLightingGenerated: (generated: boolean) => void;
  saveProject: () => void;
  loadProject: () => void;
  resetProject: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  vertices: [
    { x: -5, z: -4 },
    { x: 5, z: -4 },
    { x: 5, z: 4 },
    { x: -5, z: 4 },
  ],
  attachments: [],
  placedFurniture: [],
  currentStep: 'SETUP',
  setupMode: 'menu',
  customSetupStep: 1,
  viewMode: '3D',
  isFloorPlanLocked: false,
  isLightingGenerated: false,
  activeDragId: null,
  activeAttachmentId: null,
  selectedFurnitureId: null,
  activeWallIndex: null,
  wallDragStart: null,
  floorMaterial: '#8b5a2b',
  wallMaterial: '#f4f4f5',
  past: [],
  future: [],
  commitHistory: () => set((state) => ({
    past: [...state.past, {
      vertices: state.vertices,
      attachments: state.attachments,
      placedFurniture: state.placedFurniture,
      floorMaterial: state.floorMaterial,
      wallMaterial: state.wallMaterial
    }],
    future: []
  })),
  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    return {
      past: newPast,
      future: [{
        vertices: state.vertices,
        attachments: state.attachments,
        placedFurniture: state.placedFurniture,
        floorMaterial: state.floorMaterial,
        wallMaterial: state.wallMaterial
      }, ...state.future],
      vertices: previous.vertices,
      attachments: previous.attachments,
      placedFurniture: previous.placedFurniture,
      floorMaterial: previous.floorMaterial,
      wallMaterial: previous.wallMaterial
    };
  }),
  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      past: [...state.past, {
        vertices: state.vertices,
        attachments: state.attachments,
        placedFurniture: state.placedFurniture,
        floorMaterial: state.floorMaterial,
        wallMaterial: state.wallMaterial
      }],
      future: newFuture,
      vertices: next.vertices,
      attachments: next.attachments,
      placedFurniture: next.placedFurniture,
      floorMaterial: next.floorMaterial,
      wallMaterial: next.wallMaterial
    };
  }),
  setActiveDragId: (id) => set((state) => {
    if (id !== null && state.activeDragId === null) {
      state.commitHistory();
    }
    return { activeDragId: id };
  }),
  setActiveAttachmentId: (id) => set({ activeAttachmentId: id }),
  setSelectedFurnitureId: (id) => set({ selectedFurnitureId: id }),
  startWallDrag: (index, x, z, vertices) => set((state) => {
    state.commitHistory();
    return { activeWallIndex: index, wallDragStart: { x, z, vertices } };
  }),
  stopWallDrag: () => set({ activeWallIndex: null, wallDragStart: null }),
  setVertices: (vertices) => set({ vertices }),
  setAttachments: (attachments) => set({ attachments }),
  addAttachment: (type, style, wallIndex) => set((state) => {
    state.commitHistory();
    const newId = uuidv4();
    return {
      attachments: [...state.attachments, { id: newId, type, style, wallIndex, ratio: 0.5 }],
      activeAttachmentId: newId
    };
  }),
  updateAttachment: (id, updates) => set((state) => ({
    attachments: state.attachments.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  removeAttachment: (id) => set((state) => {
    state.commitHistory();
    return { 
      attachments: state.attachments.filter(a => a.id !== id),
      activeAttachmentId: state.activeAttachmentId === id ? null : state.activeAttachmentId
    };
  }),
  setFloorMaterial: (color) => set((state) => {
    state.commitHistory();
    return { floorMaterial: color };
  }),
  setWallMaterial: (color) => set((state) => {
    state.commitHistory();
    return { wallMaterial: color };
  }),
  setPlacedFurniture: (furniture) => set((state) => {
    state.commitHistory();
    return { placedFurniture: furniture };
  }),
  addFurniture: (modelUrl) =>
    set((state) => {
      state.commitHistory();
      const placement = findPlacement(state, modelUrl);
      return {
        placedFurniture: [
          ...state.placedFurniture,
          { id: uuidv4(), modelUrl, position: placement.position, rotation: placement.rotation },
        ],
      };
    }),
  updateFurniture: (id, updates) =>
    set((state) => ({
      placedFurniture: state.placedFurniture.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),
  removeFurniture: (id) =>
    set((state) => {
      state.commitHistory();
      return {
        placedFurniture: state.placedFurniture.filter((f) => f.id !== id),
      };
    }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setSetupMode: (mode) => set({ setupMode: mode }),
  setCustomSetupStep: (step) => set({ customSetupStep: step }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFloorPlanLocked: (locked) => set({ isFloorPlanLocked: locked }),
  setLightingGenerated: (generated) => set({ isLightingGenerated: generated }),
  saveProject: () => {
    set((state) => {
      const data = {
        vertices: state.vertices,
        attachments: state.attachments,
        placedFurniture: state.placedFurniture,
        isFloorPlanLocked: state.isFloorPlanLocked,
        floorMaterial: state.floorMaterial,
        wallMaterial: state.wallMaterial,
      };
      localStorage.setItem('phalene_project', JSON.stringify(data));
      return state;
    });
  },
  loadProject: () => {
    const data = localStorage.getItem('phalene_project');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        set({
          vertices: parsed.vertices || [],
          attachments: parsed.attachments || [],
          placedFurniture: parsed.placedFurniture || [],
          isFloorPlanLocked: !!parsed.isFloorPlanLocked,
          isLightingGenerated: !!parsed.isLightingGenerated,
          floorMaterial: parsed.floorMaterial || '#e5e5e5',
          wallMaterial: parsed.wallMaterial || '#ffffff',
          past: [],
          future: [],
        });
      } catch (e) {
        console.error('Failed to load project', e);
      }
    }
  },
  resetProject: () => {
    set({
      currentStep: 'SETUP',
      setupMode: 'menu',
      customSetupStep: 1,
      viewMode: '2D',
      vertices: [
        { x: -4, z: -3 },
        { x: 4, z: -3 },
        { x: 4, z: 3 },
        { x: -4, z: 3 },
      ],
      attachments: [],
      placedFurniture: [],
      floorMaterial: '#e5e5e5',
      wallMaterial: '#ffffff',
      isFloorPlanLocked: false,
      isLightingGenerated: false,
      activeDragId: null,
      selectedFurnitureId: null,
      activeWallIndex: null,
      wallDragStart: null,
      activeAttachmentId: null,
      past: [],
      future: []
    });
  }
}));
