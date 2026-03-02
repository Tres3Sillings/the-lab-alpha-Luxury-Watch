import React from 'react';
import { editable as e } from '@theatre/r3f';
import Mannequin from './Mannequin'; 
import { Model as TShirt } from './TShirt_01'; 

export default function Scene({ activeOutfit, isGlitching }) {
  return (
    <>
      {/* High-Contrast Lighting Setup 
        Dark ambient light with a harsh spotlight to give that cinematic, symbolic edge
      */}
      <ambientLight intensity={0.1} />
      <e.spotLight 
        theatreKey="Main_Spotlight" 
        position={[2, 4, 2]} 
        intensity={2.5} 
        penumbra={0.8} 
        color="#ffffff" 
      />
      <e.pointLight 
        theatreKey="Backlight_Green" 
        position={[-2, -1, -3]} 
        intensity={4} 
        color="#00ff88" 
      />

      {/* BASE CHARACTER: Mr. Whisper always stays visible */}
      <e.group theatreKey="Mannequin_Root" position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <Mannequin />
      </e.group>

      {/* AGENTIC TOGGLE: 
        React will only render this group if the AI returns "tshirt_01" in the JSON 
      */}
      {activeOutfit.includes('tshirt_01') && (
        <e.group theatreKey="TShirt_Layer" position={[0, -1.5, 0]} rotation={[0, Math.PI, 0]}>
          <TShirt />
        </e.group>
      )}
    </>
  );
}