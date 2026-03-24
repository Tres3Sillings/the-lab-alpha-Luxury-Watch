import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';

// Draggable, resizable image component with bounding boxes
const EditorImage = ({ imageObj, shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current) {
      // Attach transformer arrows to the selected image
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        onMouseDown={onSelect}
        onTouchStart={onSelect}
        ref={shapeRef}
        image={imageObj}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          // Reset scale to 1 and update width/height directly to prevent distortion
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation()
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default function CanvasEditorModal({ onClose, onSave }) {
  const [images, setImages] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef();

  // Exact physical aspect ratio of the 3D Metal Lid (1.61 width / 0.38 depth = ~4.23)
  const CANVAS_WIDTH = 846;
  const CANVAS_HEIGHT = 200;

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      setImages([
        ...images,
        {
          id: Date.now().toString(),
          img: img,
          x: CANVAS_WIDTH / 2 - 50,
          y: CANVAS_HEIGHT / 2 - (100 * aspectRatio) / 2,
          width: 100,
          height: 100 * aspectRatio,
          rotation: 0
        }
      ]);
    };
  };

  const handleExport = () => {
    selectShape(null); // Deselect to hide transformer bounding boxes before taking the picture
    setTimeout(() => {
      // pixelRatio: 4 creates a massive 3384 x 800 image for the production team to print!
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 4, mimeType: 'image/png' }); 
      onSave(dataUrl);
      onClose();
    }, 100);
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) selectShape(null);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#2C2C2C', padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #444', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>2D Image Editor</h2>
        <p style={{ color: '#aaa', margin: 0 }}>Upload logos and position them. The bounding box equals the metal lid.</p>
        
        {/* The 2D Canvas Workspace */}
        <div style={{ border: '2px dashed #666', backgroundColor: '#111', overflow: 'hidden', cursor: 'crosshair' }}>
          <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onMouseDown={checkDeselect} onTouchStart={checkDeselect} ref={stageRef}>
            <Layer>
              {images.map((imgObj, i) => (
                <EditorImage
                  key={imgObj.id}
                  imageObj={imgObj.img}
                  shapeProps={imgObj}
                  isSelected={imgObj.id === selectedId}
                  onSelect={() => selectShape(imgObj.id)}
                  onChange={(newAttrs) => {
                    const imgs = images.slice();
                    imgs[i] = newAttrs;
                    setImages(imgs);
                  }}
                />
              ))}
            </Layer>
          </Stage>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center' }}>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ color: '#fff' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={onClose} style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', borderRadius: '4px', border: 'none' }}>Cancel</button>
            <button onClick={handleExport} style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', backgroundColor: '#4361ee', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Save & Apply to 3D</button>
          </div>
        </div>
      </div>
    </div>
  );
}