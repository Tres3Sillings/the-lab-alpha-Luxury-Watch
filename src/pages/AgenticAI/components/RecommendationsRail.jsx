import React, { useState, useEffect } from 'react';

export default function RecommendationsRail({ activeProduct, collection = [], originalHero, onSelectProduct }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!activeProduct) return null;

  // Create a unique list of items: Original Hero + Collection + Current Active
  let itemsToDisplay = [];
  
  // 1. Always put the Original AI Hero first if it exists
  if (originalHero) {
    itemsToDisplay.push(originalHero);
  }

  // 2. Add the collection items (filtering out the originalHero if it's already in there)
  collection.forEach(item => {
    if (!itemsToDisplay.find(existing => existing.id === item.id)) {
      itemsToDisplay.push(item);
    }
  });

  // 3. If the user somehow selected a product NOT in the set (via search), add it to the end
  if (!itemsToDisplay.find(existing => existing.id === activeProduct.id)) {
    itemsToDisplay.push(activeProduct);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', padding: '10px 20px', overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center' }}>
        {itemsToDisplay.map(item => {
          const isSelected = activeProduct.id === item.id;
          const isOriginalHero = originalHero?.id === item.id;

          return (
            <div 
              key={item.id} 
              onClick={() => onSelectProduct(item)} 
              style={{
                width: isSelected ? '70px' : '62px', 
                height: isSelected ? '70px' : '62px', 
                borderRadius: '14px', 
                flexShrink: 0,
                background: '#fff',
                // Black border for selected, dashed for original hero if not selected
                border: isSelected ? '2px solid #000' : (isOriginalHero ? '1px dashed #ccc' : '1px solid #eee'),
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isSelected ? '0 8px 20px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <img 
                src={item.imageUrl} 
                alt={item.id}
                style={{ 
                  width: '80%', height: '80%', objectFit: 'contain',
                  opacity: isSelected ? 1 : 0.6
                }} 
              />
              {/* Optional: Small "Original" tag for the hero piece */}
              {isOriginalHero && !isSelected && (
                <div style={{ position: 'absolute', top: -5, background: '#000', color: '#fff', fontSize: '6px', padding: '2px 4px', borderRadius: '4px' }}>ORIGINAL</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}