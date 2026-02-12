import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Watch from './Watch.jsx' // Directly importing the Experience
import Home from './Home.jsx'
import Shoe from './Shoe.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
      <Route path="/shoe" element={<Shoe />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)