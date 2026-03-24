import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';

const EditorImage = ({ imageObj, shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current) {
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
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 4, mimeType: 'image/png' });
      onSave(dataUrl);
    }, 100);
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) selectShape(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#2C2C2C] p-8 rounded-xl shadow-2xl flex flex-col gap-6 border border-[#444] max-w-5xl w-full">
        <div>
          <h2 className="text-white text-2xl font-bold m-0">2D Custom Wrap Editor</h2>
          <p className="text-gray-400 m-0 mt-1">Upload logos and position them. The bounding box equals the metal lid.</p>
        </div>

        <div className="border-2 border-dashed border-gray-500 bg-[#111] overflow-hidden cursor-crosshair mx-auto rounded-lg shadow-inner">
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

        <div className="flex justify-between items-center pt-2">
          <input type="file" accept="image/*" onChange={handleUpload} className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 cursor-pointer rounded-lg border-none text-gray-700 bg-gray-200 font-bold hover:bg-gray-300 transition-colors">Cancel</button>
            <button onClick={handleExport} className="px-6 py-2.5 cursor-pointer bg-blue-600 text-white border-none rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">Save & Apply to 3D</button>
          </div>
        </div>
      </div>
    </div>
  );
}