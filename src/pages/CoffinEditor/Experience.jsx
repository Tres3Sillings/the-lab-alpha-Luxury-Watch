import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Palette } from 'lucide-react';
import ConfiguratorCanvas from './components/ConfiguratorCanvas';
import CanvasEditorModal from './components/CanvasEditorModal';
import { COLORS } from './constants';
import './CoffinEditor.css';

export default function Experience() {
  const queryParams = new URLSearchParams(window.location.search);

  // Configuration states
  const [coffinMaterial, setCoffinMaterial] = useState(queryParams.get('material') || 'White Marble');
  const [metalFinish, setMetalFinish] = useState(queryParams.get('metalFinish') || 'Bronze');
  const [handles, setHandles] = useState(queryParams.get('handles') || 'standard');
  const [handleColor, setHandleColor] = useState(queryParams.get('handleColor') || 'Bronze');
  const [ornament, setOrnament] = useState(queryParams.get('ornament') || 'none');
  const [nameplate, setNameplate] = useState(queryParams.get('nameplate') || 'standard');
  const [nameplateColor, setNameplateColor] = useState(queryParams.get('nameplateColor') || 'Bronze');
  const [ornamentColor, setOrnamentColor] = useState(queryParams.get('ornamentColor') || 'Bronze');
  const [decalImage, setDecalImage] = useState(null);
  const [editorMode, setEditorMode] = useState('main'); // Tracks which UI screen we are on
  
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // Used to temporarily hide 3D buttons for the screenshot

  const glRef = useRef(null);
  const cameraRef = useRef(null);
  const staticCameraRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('material', coffinMaterial);
    params.set('metalFinish', metalFinish);
    params.set('handles', handles);
    params.set('handleColor', handleColor);
    params.set('ornament', ornament);
    params.set('nameplate', nameplate);
    params.set('nameplateColor', nameplateColor);
    params.set('ornamentColor', ornamentColor);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [coffinMaterial, metalFinish, handles, handleColor, ornament, nameplate, nameplateColor, ornamentColor]);

  const handleReset = () => {
    setCoffinMaterial('White Marble');
    setMetalFinish('Bronze');
    setHandles('standard');
    setHandleColor('Bronze');
    setOrnament('none');
    setNameplate('standard');
    setNameplateColor('Bronze');
    setOrnamentColor('Bronze');
    setDecalImage(null);
    setActiveHotspot(null);
  };

  const handleDownloadPdf = async () => {
    // 1. Hide the hotspots and active popups
    setActiveHotspot(null);
    setIsExporting(true);

    // 2. Wait 2 frames to guarantee the 3D Canvas updates and clears the buttons visually
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("Trigard Coffin Configuration", 14, 22);

    // 3. Take Screenshot
    if (glRef && glRef.current) {
        const canvas = glRef.current.domElement || glRef.current;
        const imgData = canvas.toDataURL('image/png');
        doc.setFontSize(16);
        doc.text("3D Preview", 14, 38);
        doc.addImage(imgData, 'PNG', 14, 42, 180, 100);
    }

    const body = [
        { option: 'Coffin Material', value: coffinMaterial },
        { option: 'Metal Finish', value: metalFinish },
        { option: 'Handles', value: handles },
        { option: 'Handle Color', value: handleColor },
        { option: 'Nameplate', value: nameplate },
        { option: 'Nameplate Color', value: nameplateColor },
        { option: 'Ornament', value: ornament },
        { option: 'Ornament Color', value: ornamentColor },
    ];

    autoTable(doc, {
        startY: 150,
        head: [['Configuration', 'Selection']],
        body: body.map(row => [row.option, row.value]),
        theme: 'grid',
        headStyles: { fillColor: [44, 44, 44] },
    });

    if (decalImage) {
        const finalY = doc.lastAutoTable?.finalY || 150;
        doc.setFontSize(16);
        doc.text("Custom Wrap Design", 14, finalY + 15);
        doc.addImage(decalImage, 'PNG', 14, finalY + 20, 180, 42.5);
    }

    doc.save(`trigard-configuration-${Date.now()}.pdf`);

    // 4. Show the hotspots again
    setIsExporting(false);
  };

  return (
    <div className="coffin-editor flex h-screen w-full bg-white overflow-hidden font-sans text-gray-900">
      
      {/* Floating Logo */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-1 text-gray-900">Trigard</h1>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Premium Vault Configurator</p>
      </div>

      {/* 3D Viewer Area */}
      <div className="flex-1 relative bg-white">
        <div className="absolute top-8 right-8 z-10 flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 !bg-white border border-gray-200 px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-bold uppercase tracking-wider text-gray-900"
          >
            <Palette size={18} className="text-blue-600" />
            <span>Custom Wrap</span>
          </button>
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-3 !bg-white border border-gray-200 px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-bold uppercase tracking-wider text-gray-900"
          >
            <Download size={18} className="text-blue-400" />
            <span>Export PDF</span>
          </button>
        </div>

        <ConfiguratorCanvas 
          coffinMaterial={coffinMaterial}
          setCoffinMaterial={setCoffinMaterial}
          metalFinish={metalFinish}
          setMetalFinish={setMetalFinish}
          handleColor={handleColor}
          setHandleColor={setHandleColor}
          handles={handles}
          setHandles={setHandles}
          ornament={ornament}
          setOrnament={setOrnament}
          nameplate={nameplate}
          setNameplate={setNameplate}
          nameplateColor={nameplateColor}
          setNameplateColor={setNameplateColor}
          ornamentColor={ornamentColor}
          setOrnamentColor={setOrnamentColor}
          decalImage={decalImage}
          editorMode={editorMode}
          glRef={glRef}
          cameraRef={cameraRef}
          sceneRef={sceneRef}
          controlsRef={controlsRef}
          activeHotspot={activeHotspot}
          setActiveHotspot={setActiveHotspot}
          isExporting={isExporting}
        />

     
      </div>

      {/* Modals */}
      {isModalOpen && (
        <CanvasEditorModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(img) => {
            setDecalImage(img);
            setIsModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}