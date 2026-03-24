import React from 'react';
import { COLORS } from '../constants';

export function ColorSwatch({ color, name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={name}
      style={{
        width: '45px', height: '45px', borderRadius: '50%',
        backgroundColor: color,
        border: active ? `3px solid ${COLORS.accentBlue}` : `2px solid ${COLORS.tanAccent}`,
        cursor: 'pointer',
        boxShadow: active ? `0 0 10px ${COLORS.accentBlue}` : 'none',
        transition: 'all 0.2s ease'
      }}
    />
  );
}