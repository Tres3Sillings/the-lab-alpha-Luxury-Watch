import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Watch from './Watch.jsx' // Directly importing the Experience
import Home from './Home.jsx'
import Shoe from './Shoe.jsx'
import Sword from './Sword.jsx' // Importing the Sword Page/Builder
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
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)