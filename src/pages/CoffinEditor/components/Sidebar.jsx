import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { COLORS, METAL_COLORS, selectStyles } from '../constants';
import { ColorSwatch } from './ColorSwatch';
import CanvasEditorModal from './CanvasEditorModal';

export default function Sidebar({
  coffinMaterial, setCoffinMaterial,
  metalColor, setMetalColor,
  handles, setHandles,
  handleColor, setHandleColor,
  ornament, setOrnament,
  decalImage, setDecalImage,
  glRef
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    
    // 1. Title
    doc.setFontSize(22);
    doc.text("Trigard Coffin Configuration", 14, 22);

    // 2. 3D Screenshot
    if (glRef && glRef.current) {
        const canvas = glRef.current.domElement;
        const imgData = canvas.toDataURL('image/png');
        doc.setFontSize(16);
        doc.text("3D Preview", 14, 38);
        doc.addImage(imgData, 'PNG', 14, 42, 180, 100); // Adjust dimensions as needed
    }

    // 3. Configuration Summary Table
    const body = [
        { option: 'Coffin Material', value: coffinMaterial },
        { option: 'Metal Finish', value: metalColor },
        { option: 'Handles', value: handles },
        { option: 'Handle Color', value: handleColor },
        { option: 'Ornament', value: ornament },
    ];

    autoTable(doc, {
        startY: 150, // Start table below the image
        head: [['Configuration', 'Selection']],
        body: body.map(row => [row.option, row.value]),
        theme: 'grid',
        headStyles: { fillColor: [44, 44, 44] }, // dark gray
    });

    // 4. Custom Wrap Design
    if (decalImage) {
        const finalY = doc.lastAutoTable.finalY || 150;
        doc.setFontSize(16);
        doc.text("Custom Wrap Design", 14, finalY + 15);
        doc.addImage(decalImage, 'PNG', 14, finalY + 20, 180, 42.5); // 180 / 4.23 ratio
    }

    doc.save(`trigard-configuration-${Date.now()}.pdf`);
  };

  return (
    <div style={{
      width: '350px',
      backgroundColor: COLORS.darkBlue,
      color: COLORS.white,
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      boxShadow: '2px 0 15px rgba(0,0,0,0.15)',
      zIndex: 10
    }}>
      <div>
        <h1 style={{ color: COLORS.accentBlue, margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Trigard</h1>
        <p style={{ color: COLORS.tanAccent, margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Coffin Configurator Alpha</p>
      </div>

      {/* Coffin Material Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Coffin Material</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ColorSwatch color="#FFFFFF" name="White Marble" active={coffinMaterial === 'White Marble'} onClick={() => setCoffinMaterial('White Marble')} />
              <ColorSwatch color="#111111" name="Black Marble" active={coffinMaterial === 'Black Marble'} onClick={() => setCoffinMaterial('Black Marble')} />
            </div>
          </div>

          {/* Metal Cover Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Metal</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ColorSwatch color={METAL_COLORS['Bronze']} name="Bronze" active={metalColor === 'Bronze'} onClick={() => setMetalColor('Bronze')} />
              <ColorSwatch color={METAL_COLORS['Stainless Steel']} name="Stainless Steel" active={metalColor === 'Stainless Steel'} onClick={() => setMetalColor('Stainless Steel')} />
              <ColorSwatch color={METAL_COLORS['Copper']} name="Copper" active={metalColor === 'Copper'} onClick={() => setMetalColor('Copper')} />
            </div>
          </div>

          {/* Handles Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Handles</h3>
            <select 
              value={handles} 
              onChange={(e) => setHandles(e.target.value)}
              style={selectStyles}
            >
              <option value="none">None</option>
              <option value="standard">Standard Brass</option>
              <option value="ornate">Ornate Premium</option>
            </select>
          </div>

          {/* Handle Colors Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Handle Color</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ColorSwatch color={METAL_COLORS['Bronze']} name="Bronze" active={handleColor === 'Bronze'} onClick={() => setHandleColor('Bronze')} />
              <ColorSwatch color={METAL_COLORS['Stainless Steel']} name="Stainless Steel" active={handleColor === 'Stainless Steel'} onClick={() => setHandleColor('Stainless Steel')} />
              <ColorSwatch color={METAL_COLORS['Copper']} name="Copper" active={handleColor === 'Copper'} onClick={() => setHandleColor('Copper')} />
            </div>
          </div>

          {/* Ornaments Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: COLORS.white }}>Ornaments</h3>
            <select 
              value={ornament} 
              onChange={(e) => setOrnament(e.target.value)}
              style={selectStyles}
            >
              <option value="none">None</option>
              <option value="cross">Classic Cross</option>
              <option value="rose">Bronze Rose</option>
            </select>
          </div>

          {/* Custom Editor Nav Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: COLORS.accentBlue,
                color: COLORS.white,
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background 0.2s ease'
              }}
            >
              Open 2D Canvas Editor
            </button>
            {decalImage && (
              <button
                onClick={() => setDecalImage(null)}
                style={{
                  padding: '0.6rem',
                  backgroundColor: COLORS.tanAccent,
                  color: COLORS.darkBlue,
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Remove Image
              </button>
            )}
          </div>

      {/* Footer actions */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Share link copied to clipboard!");
          }}
          style={{
            width: '100%', padding: '1rem', backgroundColor: COLORS.accentBlue,
            color: COLORS.white, border: 'none', borderRadius: '6px',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s ease'
          }}>
          Copy Share Link
        </button>
        <button 
          onClick={handleDownloadPdf} 
          style={{ width: '100%', padding: '1rem', backgroundColor: COLORS.tanAccent, color: COLORS.darkBlue, border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s ease' }}
        >
          Download Configuration (PDF)
        </button>
      </div>

      {/* 2D Canvas Overlay Modal */}
      {isModalOpen && (
        <CanvasEditorModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(dataUrl) => setDecalImage(dataUrl)} 
        />
      )}
    </div>
  );
}