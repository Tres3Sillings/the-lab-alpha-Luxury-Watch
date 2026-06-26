import React from 'react'
import PCPanel from '../Panels/PCPanel'
import BookPanel from '../Panels/BookPanel'
import CalculatorPanel from '../Panels/CalculatorPanel'
import NotebookPanel from '../Panels/NotebookPanel'
import CupPanel from '../Panels/CupPanel'
import PhotoshopPanel from '../Panels/PhotoshopPanel'
import BlenderPanel from '../Panels/BlenderPanel'
import WordPressPanel from '../Panels/WordPressPanel'
import ReactPanel from '../Panels/ReactPanel'
import ThreeJsPanel from '../Panels/ThreeJsPanel'

const tabTitles = {
  Sticker1: 'Photoshop',
  Sticker2: 'Blender',
  Sticker3: 'WordPress',
  Sticker4: 'React',
  Sticker5: 'Three.js',
  PC: 'CURIOSITY',
  Book: 'THE ROAD I ALMOST TOOK',
  Calculator: 'THE LAST TIME I USED THIS',
  Notebook: 'IDEA BOOK',
  Cup: 'NIGHT OWL STATISTICS'
}

export default function FolderModal({
  selectedSticker,
  handleBackToHome,
  handleStickerClick
}) {
  if (!selectedSticker) return null

  const renderPanel = () => {
    switch (selectedSticker) {
      case 'PC':
        return <PCPanel />
      case 'Book':
        return <BookPanel />
      case 'Calculator':
        return <CalculatorPanel />
      case 'Notebook':
        return <NotebookPanel />
      case 'Cup':
        return <CupPanel />
      case 'Sticker1':
        return <PhotoshopPanel />
      case 'Sticker2':
        return <BlenderPanel />
      case 'Sticker3':
        return <WordPressPanel />
      case 'Sticker4':
        return <ReactPanel />
      case 'Sticker5':
        return <ThreeJsPanel />
      default:
        return null
    }
  }

  const activeTabTitle = tabTitles[selectedSticker] || 'DOCUMENT'

  return (
    <div className="folder-backdrop" onClick={handleBackToHome}>
      <div className="folder-modal" onClick={(e) => e.stopPropagation()}>

        {/* Floating Close Button for Mobile / Small Screens */}
        <button className="folder-close-floating" onClick={handleBackToHome} title="Close Folder">
          ×
        </button>

        {/* Folder Tab Header */}
        <div className="folder-tab-bar">
          <div className="folder-tabs-scroll-container">
            {selectedSticker.startsWith('Sticker') ? (
              ['Sticker1', 'Sticker2', 'Sticker3', 'Sticker4', 'Sticker5'].map((stickId) => {
                const isActive = selectedSticker === stickId
                const tabTitle = tabTitles[stickId] || 'Skill'
                return (
                  <div
                    key={stickId}
                    className={`folder-tab ${isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleStickerClick(stickId)}
                    style={{ cursor: isActive ? 'default' : 'pointer' }}
                  >
                    <span className="folder-tab-icon">📕</span>
                    <span className="folder-tab-title">{tabTitle.toUpperCase()}</span>
                  </div>
                )
              })
            ) : (
              <div className="folder-tab active">
                <span className="folder-tab-icon">📁</span>
                <span className="folder-tab-title">
                  {activeTabTitle.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <button className="folder-close-btn" onClick={handleBackToHome}>
            <span>×</span> CLOSE FOLDER
          </button>
        </div>

        {/* Folder Scrollable Sheet */}
        <div className="folder-scroll-body">
          {renderPanel()}
        </div>

      </div>
    </div>
  )
}
