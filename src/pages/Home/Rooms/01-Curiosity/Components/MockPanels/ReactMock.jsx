import React from 'react'

export default function ReactMock() {
  const nodes = [
    { label: "App", type: "root" },
    { label: "StoryScene", type: "parent" },
    { label: "Experience (Vite)", type: "parent" },
    { label: "Canvas (Three.js)", type: "parent" },
    { label: "ReactThreeFiber", type: "child" },
    { label: "Three.js Models", type: "child" },
    { label: "CRM System", type: "active" }
  ]
  return (
    <div className="react-mock">
      <div className="react-header">
        <span className="react-icon-spin">⚛️</span>
        <span>React Component Tree</span>
      </div>
      <div className="react-tree">
        {nodes.map((node, i) => (
          <div key={i} className={`tree-node ${node.type}`} style={{ paddingLeft: `${i * 12}px` }}>
            <span className="tree-arrow">└─</span>
            <span className="tree-label">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
