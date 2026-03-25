export const COLORS = {
  darkBlue: '#1a2a3a',
  accentBlue: '#4361ee',
  white: '#ffffff',
  lightGray: '#f0f0f0',
  tanAccent: '#f4a261',
};

export const METAL_COLORS = {
  'Bronze': '#CD7F32',
  'Stainless Steel': '#C0C0C0',
  'Copper': '#B87333',
};

export const METAL_FINISH = {
  'Bronze': '#CD7F32',
  'Stainless Steel': '#C0C0C0',
  'Copper': '#B87333',
};

// Add this to control Vault Body colors and material references in one place!
export const VAULT_MATERIALS = {
  'White Marble': { color: '#FFFFFF', matName: 'White_Marble' },
  'Black Marble': { color: '#111111', matName: 'Black_Marble' },
  'Rose Granite': { color: '#9A5B5B', matName: 'Grey_Granite', tint: true },
  'Grey Granite': { color: '#808080', matName: 'Grey_Granite', tint: true },
};

export const selectStyles = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#2C2C2C',
  color: COLORS.white,
  border: `1px solid ${COLORS.tanAccent}`,
  borderRadius: '6px',
  fontSize: '1rem',
};