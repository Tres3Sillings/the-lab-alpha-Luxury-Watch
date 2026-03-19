import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Watch from './pages/WatchLab/Watch.jsx' // Directly importing the Experience
import Home from './Home.jsx'
import Shoe from './pages/ShoeLab/Shoe.jsx'
import Forge from './pages/Forge/Sword.jsx' // Importing the Sword Page/Builder
import Awebco from './pages/Awebco/Experience.jsx' // Importing the Awebco Page/Builder
import MaterialLab from './pages/MaterialLab/Experience.jsx' // Importing the Material Lab Page/Builder
import AgenticAi from './pages/AgenticAI/Experience.jsx' // Importing the Agentic AI Outfit Picker Page/Builder
import Workshop from './pages/Workshop/Experience.jsx' // Importing the Workshop Page/Builder
import EditorDemo from './pages/EditorDemo/Experience.jsx' // Importing the Editor Demo Page/Builder

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
      <Route path="/shoe" element={<Shoe />} />
      <Route path="/forge" element={<Forge />} />
      <Route path="/awebco" element={<Awebco />} />
      <Route path="/materiallab" element={<MaterialLab />} />
      <Route path="/agenticai" element={<AgenticAi />} />
      <Route path="/workshop" element={<Workshop />} />
      <Route path="/editor-demo" element={<EditorDemo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)