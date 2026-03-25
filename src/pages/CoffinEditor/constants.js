export const COLORS = {
  white: '#FFFFFF',
  lightGray: '#EEEEEE',
  accentBlue: '#6FAFD7',
  darkBlue: '#2F3942',
  tanAccent: '#A1988A',
};

export const METAL_COLORS = {
  'Gold': '#D4AF37',
  'Silver': '#C0C0C0',
  'Copper': '#B87333',
  'Black': '#111111',
};

export const METAL_FINISH = {
  'Bronze': '#a06127',
  'Copper': '#8B4513',
  'Stainless Steel': '#6b6b6b',
};
export const VAULT_MATERIALS = {
  'White Marble': { color: '#FFFFFF', matName: 'White_Marble' },
  'Black Marble': { color: '#111111', matName: 'Black_Marble' },
  'Rose Granite': { color: '#73000A', matName: 'rose-granite-polymer' },
  'Gray Granite': { color: '#4B4B4B', matName: 'Gray_Granite' }, // Using same material as Rose Granite but will tint it gray in the shader
};

export const selectStyles = {
  padding: '0.8rem',
  backgroundColor: COLORS.tanAccent,
  color: COLORS.darkBlue,
  border: 'none',
  borderRadius: '6px',
  outline: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '0.95rem'
};