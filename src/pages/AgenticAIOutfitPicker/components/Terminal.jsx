import React, { useState } from 'react';

export default function Terminal({ onOutfitChange, setGlitch }) {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    // Prevent sending empty strings to the API
    if (!input.trim()) return;

    // 1. Start the visual glitch effect
    setGlitch(true);
    
    // 2. Grab your key from the .env file
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // 3. Define the Forbidden.Thread archive
    const clothingLibrary = [
      { id: "tshirt_01", description: "Comfortable jersey, symbolic graphic" },
      { id: "hoodie_01", description: "Oversized, distressed, sun-faded" }
    ];

    try {
const cleanUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
      const response = await fetch(cleanUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey 
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are the Forbidden.Thread Archive Stylist. 
              Your goal is to select itemIds from the library based on the user's vibe.
              Library: ${JSON.stringify(clothingLibrary)}
              
              RULES:
              1. Output ONLY a valid JSON object.
              2. Format: {"itemIds": ["id"], "message": "Short stylist comment"}
              
              User Request: "${input}"`
            }]
          }],
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
          ],
          generationConfig: {
            response_mime_type: "application/json",
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("GOOGLE_API_ERROR:", data.error?.message || "Unknown error occurred.");
        return;
      }

      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        let rawText = data.candidates[0].content.parts[0].text;
        
        // FAILSAFE: Strip markdown formatting if Gemini tries to be "helpful" and wraps the JSON
        rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

        const result = JSON.parse(rawText);
        
        onOutfitChange(result.itemIds);
        console.log("STYLIST_ADVICE:", result.message);
      } else {
        console.error("GEMINI_ERROR: Unexpected response structure.", data);
      }
      
    } catch (error) {
      console.error("ARCHIVE_ERROR:", error);
    } finally {
      setGlitch(false);
      setInput("");
    }
  };

  return (
    <div style={{ position: 'absolute', bottom: 40, left: 40, zIndex: 10, width: '400px' }}>
      <div className="label" style={{ color: '#00ff88', fontSize: '10px' }}>COMMAND_LINE // ARCHIVE_STYLIST</div>
      <input 
        className="terminal-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="DESCRIBE THE VIBE..."
        style={{ 
          background: 'transparent', border: '1px solid #00ff88', 
          color: '#00ff88', width: '100%', padding: '10px', outline: 'none' 
        }}
      />
    </div>
  );
}