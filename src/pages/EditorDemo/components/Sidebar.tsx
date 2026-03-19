import React, { useState } from 'react';
import { useEditorStore, Point, Attachment, DOOR_STYLES, WINDOW_STYLES } from '../store';
import { 
  BoxSelect, 
  Sofa, 
  Palette, 
  Wand2, 
  Lock, 
  Unlock, 
  Undo, 
  Redo, 
  Save, 
  FolderOpen,
  Trash2,
  Layers,
  Search,
  ShoppingCart,
  PaintBucket,
  LayoutTemplate,
  Sparkles
} from 'lucide-react';

import { v4 as uuidv4 } from 'uuid';
import { autoFurnishRoom } from '../services/aiService';

type TemplateDef = {
  vertices: Point[];
  attachments: Omit<Attachment, 'id'>[];
};

const TEMPLATES: Record<string, TemplateDef> = {
  'Rectangular': {
    vertices: [
      { x: -4, z: -3 },
      { x: 4, z: -3 },
      { x: 4, z: 3 },
      { x: -4, z: 3 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 0, ratio: 0.5 },
      { type: 'window', style: 'large', wallIndex: 2, ratio: 0.5 }
    ]
  },
  'L-Shape': {
    vertices: [
      { x: -4, z: -4 },
      { x: 2, z: -4 },
      { x: 2, z: 0 },
      { x: 4, z: 0 },
      { x: 4, z: 4 },
      { x: -4, z: 4 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 0, ratio: 0.2 },
      { type: 'window', style: 'standard', wallIndex: 4, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 5, ratio: 0.5 }
    ]
  },
  'Cut': {
    vertices: [
      { x: -4, z: -4 },
      { x: 2, z: -4 },
      { x: 4, z: -2 },
      { x: 4, z: 4 },
      { x: -4, z: 4 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 0, ratio: 0.5 },
      { type: 'window', style: 'large', wallIndex: 3, ratio: 0.5 }
    ]
  },
  'T-Shape': {
    vertices: [
      { x: -2, z: -4 },
      { x: 2, z: -4 },
      { x: 2, z: -1 },
      { x: 5, z: -1 },
      { x: 5, z: 3 },
      { x: -5, z: 3 },
      { x: -5, z: -1 },
      { x: -2, z: -1 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 0, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 3, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 6, ratio: 0.5 }
    ]
  },
  'U-Shape': {
    vertices: [
      { x: -5, z: -4 },
      { x: -2, z: -4 },
      { x: -2, z: 0 },
      { x: 2, z: 0 },
      { x: 2, z: -4 },
      { x: 5, z: -4 },
      { x: 5, z: 4 },
      { x: -5, z: 4 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 3, ratio: 0.5 },
      { type: 'window', style: 'large', wallIndex: 6, ratio: 0.5 }
    ]
  },
  'Beveled': {
    vertices: [
      { x: -2, z: -4 },
      { x: 2, z: -4 },
      { x: 4, z: -2 },
      { x: 4, z: 2 },
      { x: 2, z: 4 },
      { x: -2, z: 4 },
      { x: -4, z: 2 },
      { x: -4, z: -2 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 0, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 3, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 7, ratio: 0.5 }
    ]
  },
  'Cross': {
    vertices: [
      { x: -2, z: -6 },
      { x: 2, z: -6 },
      { x: 2, z: -2 },
      { x: 6, z: -2 },
      { x: 6, z: 2 },
      { x: 2, z: 2 },
      { x: 2, z: 6 },
      { x: -2, z: 6 },
      { x: -2, z: 2 },
      { x: -6, z: 2 },
      { x: -6, z: -2 },
      { x: -2, z: -2 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 0, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 3, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 6, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 9, ratio: 0.5 }
    ]
  },
  'Z-Shape': {
    vertices: [
      { x: -6, z: -4 },
      { x: 2, z: -4 },
      { x: 2, z: 0 },
      { x: 6, z: 0 },
      { x: 6, z: 4 },
      { x: -2, z: 4 },
      { x: -2, z: 0 },
      { x: -6, z: 0 },
    ],
    attachments: [
      { type: 'door', style: 'standard', wallIndex: 0, ratio: 0.2 },
      { type: 'window', style: 'large', wallIndex: 3, ratio: 0.5 },
      { type: 'window', style: 'standard', wallIndex: 5, ratio: 0.8 }
    ]
  }
};

export const FURNITURE_CATALOG = [
  { 
    name: 'Tank Chair', 
    url: '/Tank_chair_2-transformed.glb', 
    price: 299, 
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'A sturdy, comfortable chair with a modern industrial aesthetic. Perfect for reading or lounging.',
    snapsTo: ['procedural:table', 'procedural:desk'],
    colors: [
      { id: 'charcoal', name: 'Charcoal', hex: '#333333' },
      { id: 'navy', name: 'Navy Blue', hex: '#1a365d' },
      { id: 'olive', name: 'Olive Green', hex: '#4b5320' },
      { id: 'rust', name: 'Rust', hex: '#8b4513' }
    ]
  },
  { 
    name: 'Modern Sofa', 
    url: 'procedural:sofa', 
    price: 899, 
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'Sleek and minimalist sofa with deep seating and premium fabric upholstery. Designed for both style and comfort.',
    snapsTo: ['procedural:table'],
    colors: [
      { id: 'light-grey', name: 'Light Grey', hex: '#d3d3d3' },
      { id: 'beige', name: 'Beige', hex: '#f5f5dc' },
      { id: 'emerald', name: 'Emerald', hex: '#50c878' },
      { id: 'terracotta', name: 'Terracotta', hex: '#e2725b' }
    ]
  },
  { 
    name: 'Coffee Table', 
    url: 'procedural:table', 
    price: 149, 
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'A solid wood coffee table with clean lines and a durable finish. The perfect centerpiece for your living room.',
    isSnapper: true,
    colors: [
      { id: 'oak', name: 'Natural Oak', hex: '#c19a6b' },
      { id: 'walnut', name: 'Dark Walnut', hex: '#5c4033' },
      { id: 'black', name: 'Matte Black', hex: '#111111' },
      { id: 'white', name: 'Gloss White', hex: '#f8f8f8' }
    ]
  },
  { 
    name: 'Queen Bed', 
    url: 'procedural:bed', 
    price: 699, 
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'A comfortable queen-sized bed with a plush headboard and sturdy frame.',
    colors: [
      { id: 'white', name: 'Crisp White', hex: '#ffffff' },
      { id: 'grey', name: 'Heather Grey', hex: '#808080' },
      { id: 'navy', name: 'Midnight Navy', hex: '#1a2b4c' },
      { id: 'blush', name: 'Blush Pink', hex: '#f4c2c2' }
    ]
  },
  { 
    name: 'Potted Monstera', 
    url: 'procedural:plant', 
    price: 45, 
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'A lush, vibrant Monstera plant in a modern ceramic pot. Adds life to any room.',
    colors: [
      { id: 'white-pot', name: 'White Pot', hex: '#f0f0f0' },
      { id: 'terracotta-pot', name: 'Terracotta Pot', hex: '#cc6633' },
      { id: 'black-pot', name: 'Black Pot', hex: '#222222' }
    ]
  },
  { 
    name: 'Area Rug', 
    url: 'procedural:rug', 
    price: 199, 
    image: 'https://images.unsplash.com/photo-1575414003593-ceaebddf295b?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'A soft, woven area rug that anchors the room and adds warmth to your floors.',
    colors: [
      { id: 'cream', name: 'Cream', hex: '#fdfbf7' },
      { id: 'charcoal', name: 'Charcoal', hex: '#36454f' },
      { id: 'sage', name: 'Sage Green', hex: '#9dc183' },
      { id: 'rust', name: 'Rust Red', hex: '#b7410e' }
    ]
  },
  { 
    name: 'Minimalist Desk', 
    url: 'procedural:desk', 
    price: 249, 
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'A sleek, minimalist desk perfect for your home office or study nook.',
    isSnapper: true,
    colors: [
      { id: 'birch', name: 'Birch', hex: '#d7c4a3' },
      { id: 'white', name: 'White', hex: '#f5f5f5' },
      { id: 'black', name: 'Black', hex: '#1a1a1a' }
    ]
  }
];

export const Sidebar = () => {
  const { 
    currentStep, setCurrentStep, 
    setupMode, setSetupMode,
    customSetupStep, setCustomSetupStep,
    setVertices, 
    isFloorPlanLocked, setFloorPlanLocked, 
    isLightingGenerated, setLightingGenerated, 
    addFurniture, placedFurniture, removeFurniture, 
    saveProject, loadProject, resetProject, 
    floorMaterial, wallMaterial, setFloorMaterial, setWallMaterial, 
    attachments, addAttachment, updateAttachment, removeAttachment,
    viewMode, setViewMode,
    selectedFurnitureId, setSelectedFurnitureId, updateFurniture
  } = useEditorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoFurnishPrompt, setAutoFurnishPrompt] = useState('');
  const [isAutoFurnishing, setIsAutoFurnishing] = useState(false);
  const [isAutoFurnishOpen, setIsAutoFurnishOpen] = useState(false);

  const handleAutoFurnish = async () => {
    setIsAutoFurnishing(true);
    try {
      const state = useEditorStore.getState();
      const newFurniture = await autoFurnishRoom(state.vertices, state.attachments, autoFurnishPrompt);
      if (newFurniture && newFurniture.length > 0) {
        state.setPlacedFurniture(newFurniture);
      }
      setIsAutoFurnishOpen(false);
      setAutoFurnishPrompt('');
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Failed to generate layout with AI. Check your browser's Developer Console for more details.");
    } finally {
      setIsAutoFurnishing(false);
    }
  };

  const selectedFurniture = placedFurniture.find(f => f.id === selectedFurnitureId);
  const selectedCatalogItem = selectedFurniture ? FURNITURE_CATALOG.find(c => c.url === selectedFurniture.modelUrl) : null;

  const filteredCatalog = FURNITURE_CATALOG.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPrice = placedFurniture.reduce((sum, f) => {
    const catalogItem = FURNITURE_CATALOG.find(c => c.url === f.modelUrl);
    return sum + (catalogItem?.price || 0);
  }, 0);

  const STEPS = ['SETUP', 'FURNISH', 'LISTS'] as const;
  const currentStepIndex = STEPS.indexOf(currentStep);

  const handleFinishSetup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setFloorPlanLocked(true);
      setCurrentStep('FURNISH');
      setViewMode('3D');
      setIsProcessing(false);
    }, 1500);
  };

  const handleCustomNext = () => {
    if (customSetupStep < 4) {
      const nextStep = (customSetupStep + 1) as 1 | 2 | 3 | 4;
      setCustomSetupStep(nextStep);
      if (nextStep === 3 || nextStep === 4) {
        setViewMode('3D');
      } else {
        setViewMode('2D');
      }
    } else {
      handleFinishSetup();
    }
  };

  const handleCustomBack = () => {
    if (customSetupStep > 1) {
      const prevStep = (customSetupStep - 1) as 1 | 2 | 3 | 4;
      setCustomSetupStep(prevStep);
      if (prevStep === 1 || prevStep === 2) {
        setViewMode('2D');
      } else {
        setViewMode('3D');
      }
    } else {
      setSetupMode('menu');
    }
  };

  return (
    <div className="w-full md:w-80 h-[45vh] md:h-full bg-white border-t md:border-t-0 md:border-r border-neutral-200 flex flex-col z-10 shadow-sm shrink-0 relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium text-neutral-900">Processing...</p>
        </div>
      )}

      <div className="hidden md:block p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Phalène</h1>
        </div>
        <p className="text-sm text-neutral-500">Interior Design Editor</p>
      </div>

      {currentStep === 'SETUP' && setupMode === 'custom' && (
        <div className="flex p-2 bg-neutral-50 border-b border-neutral-100 gap-1 shrink-0 overflow-x-hidden">
          {[
            { id: 1, label: 'Shape' },
            { id: 2, label: 'Size' },
            { id: 3, label: 'Build' },
            { id: 4, label: 'Style' }
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => {
                setCustomSetupStep(step.id as 1 | 2 | 3 | 4);
                if (step.id === 1 || step.id === 2) {
                  setViewMode('2D');
                } else {
                  setViewMode('3D');
                }
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md text-center transition-colors ${
                customSetupStep === step.id 
                  ? 'bg-white shadow-sm text-neutral-900' 
                  : customSetupStep > step.id 
                    ? 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100' 
                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {step.id}. {step.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {selectedFurniture && selectedCatalogItem ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedFurnitureId(null)}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 mb-2"
            >
              ← Back to Room
            </button>
            
            <div className="w-full aspect-square bg-neutral-100 rounded-xl overflow-hidden relative">
              <img 
                src={selectedCatalogItem.image} 
                alt={selectedCatalogItem.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-neutral-900">{selectedCatalogItem.name}</h2>
                <span className="text-lg font-semibold text-neutral-900">${selectedCatalogItem.price}</span>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {selectedCatalogItem.description}
              </p>
            </div>

            {selectedCatalogItem.colors && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Fabric / Color</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedCatalogItem.colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => updateFurniture(selectedFurniture.id, { color: color.id })}
                      className={`group flex flex-col items-center gap-1.5`}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedFurniture.color === color.id || (!selectedFurniture.color && color.id === selectedCatalogItem.colors[0].id)
                            ? 'border-neutral-900 scale-110 shadow-sm' 
                            : 'border-transparent shadow-sm hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                      <span className="text-[10px] font-medium text-neutral-500 group-hover:text-neutral-900">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-neutral-100">
              <button 
                onClick={() => {
                  removeFurniture(selectedFurniture.id);
                  setSelectedFurnitureId(null);
                }}
                className="w-full py-3 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Remove from Room
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 'SETUP' && setupMode === 'menu' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">How would you like to start?</h2>
            
            <button 
              onClick={() => setSetupMode('template')}
              className="w-full p-4 border border-black rounded-xl text-left hover:bg-neutral-50 hover:shadow-sm transition-all bg-white group"
            >
              <div className="font-semibold text-neutral-900 mb-1 group-hover:text-neutral-900">Start from template</div>
              <div className="text-xs text-neutral-500">Choose from pre-designed room layouts and styles.</div>
            </button>

            <button 
              onClick={() => {
                setSetupMode('custom');
                setCustomSetupStep(1);
                setViewMode('2D');
              }}
              className="w-full p-4 border border-black rounded-xl text-left hover: bg-neutral-50 hover:shadow-sm transition-all bg-white group"
            >
              <div className="font-semibold text-neutral-900 mb-1 group-hover:text-neutral-900">Build your own room</div>
              <div className="text-xs text-neutral-500">Create a custom floor plan from scratch.</div>
            </button>

            <button 
              disabled
              className="w-full p-4 border border-black rounded-xl text-left opacity-70 cursor-not-allowed bg-neutral-50"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold text-neutral-900">Take photos of your room</div>
                <span className="text-[10px] font-bold bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full uppercase">Coming Soon</span>
              </div>
              <div className="text-xs text-neutral-500">Have your room automatically generated from photos.</div>
            </button>
          </div>
        )}

        {currentStep === 'SETUP' && setupMode === 'template' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <LayoutTemplate size={16} />
                Room Templates
              </h2>
              <div className="grid gap-3">
                {Object.entries(TEMPLATES).map(([name, template]) => (
                  <button
                    key={name}
                    onClick={() => {
                      useEditorStore.getState().commitHistory();
                      setVertices(template.vertices);
                      useEditorStore.getState().setAttachments(
                        template.attachments.map(a => ({ ...a, id: uuidv4() }) as Attachment)
                      );
                    }}
                  className={`p-4 border rounded-xl text-left transition-all hover:bg-neutral-50 border-black hover:shadow-sm bg-white`}
                  >
                    <div className="font-medium text-neutral-900">{name}</div>
                    <div className="text-xs text-neutral-500 mt-1">{template.vertices.length} corners</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Palette size={16} />
                Room Colors
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-2">Wall Color</label>
                  <div className="flex flex-wrap gap-2">
                    {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#fef3c7', '#dcfce7', '#e0f2fe', '#f3e8ff', '#ffe4e6'].map(color => (
                      <button
                        key={color}
                        onClick={() => setWallMaterial(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${wallMaterial === color ? 'border-neutral-900 scale-110' : 'border-transparent shadow-sm'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-2">Floor Color</label>
                  <div className="flex flex-wrap gap-2">
                    {['#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#1e293b', '#d6d3d1', '#a8a29e', '#78716c', '#44403c', '#292524'].map(color => (
                      <button
                        key={color}
                        onClick={() => setFloorMaterial(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${floorMaterial === color ? 'border-neutral-900 scale-110' : 'border-transparent shadow-sm'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setSetupMode('menu')}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleFinishSetup}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium !bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                Finish Setup
              </button>
            </div>
          </div>
        )}

        {currentStep === 'SETUP' && setupMode === 'custom' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Step {customSetupStep} of 4
              </h2>
              <span className="text-xs font-medium text-neutral-500">
                {customSetupStep === 1 && 'Size & Shape'}
                {customSetupStep === 2 && 'Adjust Dimensions'}
                {customSetupStep === 3 && 'Doors & Windows'}
                {customSetupStep === 4 && 'Choose Style'}
              </span>
            </div>

            {customSetupStep === 1 && (
              <div>
                <p className="text-sm text-neutral-600 mb-4">Choose a starting shape for your room.</p>
                <div className="grid gap-3">
                  {Object.entries(TEMPLATES).map(([name, template]) => (
                    <button
                      key={name}
                      onClick={() => {
                        useEditorStore.getState().commitHistory();
                        setVertices(template.vertices);
                        useEditorStore.getState().setAttachments(
                          template.attachments.map(a => ({ ...a, id: uuidv4() }) as Attachment)
                        );
                      }}
                    className={`p-4 border rounded-xl text-left transition-all hover:bg-neutral-50 border-black hover:shadow-sm bg-white`}
                    >
                      <div className="font-medium text-neutral-900">{name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {customSetupStep === 2 && (
              <div>
                <p className="text-sm text-neutral-600 mb-4">Drag the walls on the 2D floor plan to adjust the dimensions of your room.</p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                  <strong>Tip:</strong> Click and drag the walls to resize. The dimensions will update automatically.
                </div>
              </div>
            )}

            {customSetupStep === 3 && (
              <div>
                <p className="text-sm text-neutral-600 mb-4">Add doors and windows. Click and drag them on the 3D view to move them between walls.</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Doors</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(DOOR_STYLES).map((style) => (
                        <button
                          key={style.id}
                          onClick={() => addAttachment('door', style.id, 0)}
                          className="flex flex-col items-center p-3 border border-black rounded-lg hover:bg-neutral-50 hover:shadow-sm bg-white transition-all group"
                        >
                          <div className="w-12 h-16 border-2 border-neutral-300 rounded-sm mb-2 relative flex items-center justify-center group-hover:border-neutral-500 transition-colors">
                            {style.id === 'double' ? (
                              <div className="w-full h-full flex">
                                <div className="w-1/2 h-full border-r border-neutral-300"></div>
                                <div className="w-1/2 h-full"></div>
                              </div>
                            ) : style.id === 'glass' ? (
                              <div className="w-8 h-12 bg-blue-50 border border-neutral-200"></div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-neutral-300 absolute right-2 top-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-neutral-700 text-center">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Windows</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(WINDOW_STYLES).map((style) => (
                        <button
                          key={style.id}
                          onClick={() => addAttachment('window', style.id, 0)}
                          className="flex flex-col items-center p-3 border border-black rounded-lg hover:bg-neutral-50 hover:shadow-sm bg-white transition-all group"
                        >
                          <div className={`border-2 border-neutral-300 rounded-sm mb-2 relative flex items-center justify-center group-hover:border-neutral-500 transition-colors ${
                            style.id === 'tall' ? 'w-8 h-16' : style.id === 'large' ? 'w-16 h-10' : 'w-12 h-12'
                          }`}>
                            <div className="w-full h-full flex flex-col">
                              <div className="w-full h-1/2 border-b border-neutral-300 flex">
                                <div className="w-1/2 h-full border-r border-neutral-300"></div>
                                <div className="w-1/2 h-full"></div>
                              </div>
                              <div className="w-full h-1/2 flex">
                                <div className="w-1/2 h-full border-r border-neutral-300"></div>
                                <div className="w-1/2 h-full"></div>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-neutral-700 text-center">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Placed Items</h3>
                  {attachments.length === 0 && (
                    <div className="text-xs text-neutral-500 text-center py-4 bg-neutral-50 rounded-lg border border-neutral-100">
                      No doors or windows placed yet.
                    </div>
                  )}
                  {attachments.map((att, index) => {
                    const styles = att.type === 'door' ? DOOR_STYLES : WINDOW_STYLES;
                    const isActive = useEditorStore.getState().activeAttachmentId === att.id;
                    return (
                      <div 
                        key={att.id} 
                        className={`p-3 rounded-lg border transition-colors ${isActive ? 'border-amber-500 bg-amber-50' : 'border-black bg-neutral-50'}`}
                        onClick={() => useEditorStore.getState().setActiveAttachmentId(att.id)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium capitalize">{att.type} {index + 1}</span>
                          <button onClick={(e) => { e.stopPropagation(); removeAttachment(att.id); }} className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500 w-12">Style:</span>
                          <select 
                            value={att.style} 
                            onChange={(e) => updateAttachment(att.id, { style: e.target.value })}
                            className="flex-1 text-xs border border-neutral-200 rounded p-1.5 bg-white"
                          >
                            {Object.values(styles).map(style => (
                              <option key={style.id} value={style.id}>{style.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {customSetupStep === 4 && (
              <div>
                <p className="text-sm text-neutral-600 mb-4">Choose the materials for your floor and walls.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-700 block mb-2">Floor Color</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Light Wood', color: '#d2b48c' },
                        { name: 'Dark Wood', color: '#5c4033' },
                        { name: 'Grey Tile', color: '#808080' },
                        { name: 'White Marble', color: '#fdfdfd' },
                        { name: 'Carpet', color: '#e5e5e5' },
                      ].map((mat) => (
                        <button
                          key={mat.name}
                          onClick={() => setFloorMaterial(mat.color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${floorMaterial === mat.color ? 'border-neutral-900 scale-110' : 'border-transparent shadow-sm'}`}
                          style={{ backgroundColor: mat.color }}
                          title={mat.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 block mb-2">Wall Color</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'White Paint', color: '#ffffff' },
                        { name: 'Beige Paint', color: '#f5f5dc' },
                        { name: 'Blue Paint', color: '#add8e6' },
                        { name: 'Brick', color: '#b22222' },
                        { name: 'Concrete', color: '#a9a9a9' },
                      ].map((mat) => (
                        <button
                          key={mat.name}
                          onClick={() => setWallMaterial(mat.color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${wallMaterial === mat.color ? 'border-neutral-900 scale-110' : 'border-transparent shadow-sm'}`}
                          style={{ backgroundColor: mat.color }}
                          title={mat.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-neutral-100">
              <button
                onClick={handleCustomBack}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleCustomNext}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium !bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                {customSetupStep === 4 ? 'Finish Setup' : 'Next Step'}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'FURNISH' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Sofa size={16} />
                Catalog
              </h2>
              <button 
                onClick={() => setCurrentStep('LISTS')}
                className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 rounded-md transition-colors"
              >
                View List (${totalPrice})
              </button>
            </div>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-neutral-700" />
              </div>
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] rounded-lg text-sm text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent hover:bg-neutral-50 transition-colors"
              />
            </div>

            <button
              onClick={() => setLightingGenerated(!isLightingGenerated)}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                isLightingGenerated 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {isLightingGenerated ? 'Exit Final Render' : 'Final Render?'}
            </button>

            <div className="border border-[#E5E5E5] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setIsAutoFurnishOpen(!isAutoFurnishOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-neutral-900">Auto Furnish with AI</span>
                </div>
              </button>
              
              {isAutoFurnishOpen && (
                <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Mood Board</h4>
                    <p className="text-xs text-neutral-600">
                      Select a style to inspire the AI, or describe your own vision below.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Minimalist Scandi', prompt: 'A minimalist Scandinavian style room with light wood furniture, clean lines, and a neutral color palette. Keep it uncluttered and airy.', image: 'https://picsum.photos/seed/scandi/150/100' },
                        { name: 'Mid-Century', prompt: 'A mid-century modern room with warm wood tones, retro-inspired furniture, and pops of mustard yellow or teal.', image: 'https://picsum.photos/seed/midcentury/150/100' },
                        { name: 'Industrial Loft', prompt: 'An industrial loft style with dark metal accents, leather furniture, and a raw, urban feel.', image: 'https://picsum.photos/seed/industrial/150/100' },
                        { name: 'Cozy Farmhouse', prompt: 'A cozy farmhouse style with rustic wood, comfortable overstuffed furniture, and a warm, inviting atmosphere.', image: 'https://picsum.photos/seed/farmhouse/150/100' }
                      ].map((style) => (
                        <button
                          key={style.name}
                          onClick={() => setAutoFurnishPrompt(style.prompt)}
                          className="relative group overflow-hidden rounded-md border border-black hover:border-indigo-500 transition-colors"
                        >
                          <img src={style.image} alt={style.name} className="w-full h-16 object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                            <span className="text-[10px] font-medium text-white leading-tight">{style.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Custom Prompt</h4>
                    <textarea
                      value={autoFurnishPrompt}
                      onChange={(e) => setAutoFurnishPrompt(e.target.value)}
                      placeholder="e.g., A cozy living room with a sofa facing the window, and a coffee table in the center."
                      className="w-full p-3 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-none bg-white"
                    />
                  </div>
                  
                  <button
                    onClick={handleAutoFurnish}
                    disabled={isAutoFurnishing}
                    className="w-full py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
                  >
                    {isAutoFurnishing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Layout'
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredCatalog.map((item) => (
                <div
                  key={item.name}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'furniture', url: item.url }));
                  }}
                  onClick={() => addFurniture(item.url)}
                  className="group border border-[#E5E5E5] rounded-xl overflow-hidden hover:bg-neutral-50 transition-all hover:shadow-sm flex flex-col bg-white cursor-grab active:cursor-grabbing"
                >
                  <div className="h-24 w-full bg-neutral-100 relative overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-2 text-center">
                    <span className="text-xs font-medium text-neutral-900 block">{item.name}</span>
                    <span className="text-xs text-neutral-500">${item.price}</span>
                  </div>
                </div>
              ))}
              {filteredCatalog.length === 0 && (
                <div className="col-span-2 py-8 text-center text-sm text-neutral-500">
                  No items found.
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'LISTS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart size={16} />
                Shopping List
              </h2>
              <button 
                onClick={() => setCurrentStep('FURNISH')}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline"
              >
                Back to Catalog
              </button>
            </div>
            
            {placedFurniture.length === 0 ? (
              <div className="text-center py-8 text-sm text-neutral-500 bg-neutral-50 rounded-xl border border-black">
                Your room is empty.<br/>Go to Furnish to add items.
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-6">
                  {placedFurniture.map((f, i) => {
                    const catalogItem = FURNITURE_CATALOG.find(c => c.url === f.modelUrl);
                    return (
                      <div key={f.id} className="flex items-center justify-between p-3 bg-white hover:bg-neutral-50 transition-colors rounded-lg border border-black shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-neutral-100 overflow-hidden flex-shrink-0">
                            {catalogItem?.image && <img src={catalogItem.image} alt={catalogItem.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{catalogItem?.name || 'Unknown Item'}</div>
                            <div className="text-xs text-neutral-500">${catalogItem?.price || 0}</div>
                          </div>
                        </div>
                        <button onClick={() => removeFurniture(f.id)} className="text-neutral-400 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-4 bg-neutral-50 rounded-xl border border-black">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-neutral-700">Total Estimated Cost</span>
                    <span className="text-lg font-bold text-neutral-900">${totalPrice}</span>
                  </div>
                  <button className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};
