import React, { useState } from 'react';
import { furnitureCatalog } from '../data/furnitureCatalog';

export default function TopNav({ onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCatalog = furnitureCatalog.filter(item => 
    item.style.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px', 
      width: '100%', 
      boxSizing: 'border-box',
      zIndex: 100 // Ensure search dropdown stays on top of the stage
    }}>
      {/* Brand Logo */}
      <div style={{ 
        fontSize: '24px', 
        fontWeight: '900', 
        letterSpacing: '-1.5px', 
        color: '#000',
        cursor: 'pointer' 
      }}>
        LUMIÈRE.
      </div>
      
      {/* Search Container */}
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        position: 'relative' 
      }}>
        <input 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search catalog..."
          style={{
            width: '100%', 
            padding: '12px 20px', 
            borderRadius: '30px', 
            border: '1px solid #eee',
            background: '#f9f9f9', 
            color: '#000', 
            caretColor: '#000',
            outline: 'none',
            fontSize: '14px',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
        />
        
        {/* Search Dropdown Results */}
        {isOpen && searchTerm && (
          <div style={{
            position: 'absolute', 
            top: '50px', 
            width: '100%', 
            background: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid rgba(0,0,0,0.1)',
            overflow: 'hidden', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            zIndex: 101
          }}>
            {filteredCatalog.length > 0 ? (
              filteredCatalog.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{ 
                    padding: '12px 20px', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)', 
                    fontSize: '13px',
                    color: '#000',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <img src={item.imageUrl} style={{ width: '30px', height: '30px', objectFit: 'contain' }} alt="" />
                  {item.id.replace(/_/g, ' ').toUpperCase()}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
                No pieces found...
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}