import React, { useState, useRef } from 'react';
import { furnitureCatalog } from '../data/furnitureCatalog';

export default function DecoratorChat({ onRecommendation }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      const base64Data = reader.result.split(',')[1];
      setImageBase64({ mime_type: file.type, data: base64Data });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!input.trim() && !imageBase64) return;
    setIsLoading(true);
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    try {
      const cleanUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
      const minifiedCatalog = furnitureCatalog.map(({ id, style, type }) => ({ id, style, type }));

      const parts = [{
        text: `You are LUMIÈRE's elite interior stylist.
        Analyze the request/photo. Return a primary item and a matching collection.
        Library: ${JSON.stringify(minifiedCatalog)}
        
        RULES:
        1. Output ONLY valid JSON.
        2. Format: {"primaryId": "id", "supplementaryIds": ["id1", "id2"], "reasoning": "advice"}
        
        User Request: "${input}"`
      }];

      if (imageBase64) {
        parts.push({ inline_data: { mime_type: imageBase64.mime_type, data: imageBase64.data } });
      }

      const response = await fetch(cleanUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const result = JSON.parse(rawText);
        
        const primaryItem = furnitureCatalog.find(item => item.id === result.primaryId);
        const supplementaryItems = furnitureCatalog.filter(item => 
          result.supplementaryIds.includes(item.id)
        );
        
        onRecommendation({
          primary: primaryItem,
          collection: supplementaryItems,
          reasoning: result.reasoning
        });
      }
    } catch (error) {
      console.error("DECORATOR_API_ERROR:", error);
    } finally {
      setIsLoading(false);
      setInput("");
      setImagePreview(null);
      setImageBase64(null);
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      boxSizing: 'border-box',
      padding: '0 20px 20px', // Spacing for the edges and bottom
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
          color: '#111', 
          fontSize: '10px', 
          fontWeight: '700', 
          letterSpacing: '1px', 
          textTransform: 'uppercase',
          opacity: 0.6 
        }}>
          LUMIÈRE Stylist Assistant
        </div>
        
        {/* Preview Thumbnail */}
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Room Preview" 
            style={{ 
              height: '32px', 
              width: '32px', 
              objectFit: 'cover', 
              borderRadius: '8px', 
              border: '1px solid #ddd' 
            }} 
          />
        )}
      </div>
      
      {/* Input Row */}
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageChange} 
        />

        <button 
          onClick={() => fileInputRef.current.click()} 
          style={{ 
            background: imagePreview ? '#e0f7fa' : '#f0f0f0', 
            border: imagePreview ? '1px solid #00bcd4' : 'none', 
            borderRadius: '12px', 
            width: '48px', 
            height: '48px', 
            flexShrink: 0, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '18px'
          }}>
          📷
        </button>
        
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe your space..."
          disabled={isLoading}
          style={{ 
            flex: 1, 
            minWidth: 0, 
            background: '#f5f5f5', // Light grey for contrast inside the white drawer
            border: '1px solid #eee', 
            borderRadius: '12px', 
            padding: '0 16px', 
            color: '#000', 
            fontSize: '16px', 
            outline: 'none' 
          }}
        />
        
        <button 
          onClick={handleSend}
          disabled={isLoading || (!input.trim() && !imageBase64)}
          style={{
            background: isLoading || (!input.trim() && !imageBase64) ? '#ccc' : '#000', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '12px', 
            padding: '0 20px', 
            fontWeight: 'bold', 
            flexShrink: 0, 
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}