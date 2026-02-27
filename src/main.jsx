import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Watch from './pages/WatchLab/Watch.jsx' // Directly importing the Experience
import Home from './Home.jsx'
import Shoe from './pages/ShoeLab/Shoe.jsx'
import Sword from './pages/Forge/Sword.jsx' // Importing the Sword Page/Builder
import Awebco from './pages/Awebco/Experience.jsx' // Importing the Awebco Page/Builder
import MaterialLab from './pages/MaterialLab/Experience.jsx' // Importing the Material Lab Page/Builder
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet"></link>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
      <Route path="/shoe" element={<Shoe />} />
      <Route path="/sword" element={<Sword />} />
      <Route path="/awebco" element={<Awebco />} />
      <Route path="/materiallab" element={<MaterialLab />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)