import React from 'react'
import LaptopPanel from '../Panels/LaptopPanel'
import BookPanel from '../Panels/BookPanel'
import Notebook1Panel from '../Panels/Notebook1Panel'
import Notebook2Panel from '../Panels/Notebook2Panel'
import CupPanel from '../Panels/CupPanel'

export default function WorkshopFolderModal({ selectedElement, handleCloseFolder, navigate }) {
  const renderPanel = () => {
    switch (selectedElement) {
      case 'Laptop':
        return <LaptopPanel navigate={navigate} />
      case 'Book':
        return <BookPanel navigate={navigate} />
      case 'Notebook1':
        return <Notebook1Panel navigate={navigate} />
      case 'Notebook2':
        return <Notebook2Panel navigate={navigate} />
      case 'Cup':
        return <CupPanel />
      default:
        return null
    }
  }

  return (
    <div className="folder-backdrop" onClick={handleCloseFolder}>
      <div className="folder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="folder-tab-bar">
          <div className="folder-tab active">
            <span className="folder-tab-icon">📁</span>
            <span className="folder-tab-title">{selectedElement.toUpperCase()} WORKBENCH</span>
          </div>
          <button className="folder-close-btn" onClick={handleCloseFolder}>
            <span>×</span> CLOSE FOLDER
          </button>
        </div>

        <div className="folder-scroll-body">
          {renderPanel()}
        </div>
      </div>
    </div>
  )
}
