import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// Chapter rooms
import Curiosity   from './pages/Home/Rooms/01-Curiosity/Experience.jsx'
import Experiments from './pages/Home/Rooms/02-Workshop/Experience.jsx'
import Building    from './pages/Home/Rooms/03-Building/Room.jsx'
import Freelance   from './pages/Home/Rooms/04-Freelance/Room.jsx'
import Agency      from './pages/Home/Rooms/05-Agency/Room.jsx'
import Playground  from './pages/Home/Rooms/06-Playground/Room.jsx'
import Future      from './pages/Home/Rooms/07-Future/Room.jsx'

// Sub-app pages (linked from within rooms)
import Shoe        from './pages/ShoeLab/Shoe.jsx'
import Forge       from './pages/Forge/Sword.jsx'
import MaterialLab from './pages/MaterialLab/Experience.jsx'
import CoffinEditor from './pages/CoffinEditor/Experience.jsx'
import Lab         from './pages/Home/Rooms/03-Building/Lab.jsx'
import Watch       from './pages/Home/Rooms/04-Freelance/Watch.jsx'
import EditorDemo  from './pages/Home/Rooms/06-Playground/Experience.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root → Chapter 01 */}
        <Route path="/" element={<Navigate to="/curiosity" replace />} />

        {/* ── The 7 Journey Chapters ── */}
        <Route path="/curiosity"   element={<Curiosity />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/building"    element={<Building />} />
        <Route path="/freelance"   element={<Freelance />} />
        <Route path="/agency"      element={<Agency />} />
        <Route path="/playground"  element={<Playground />} />
        <Route path="/future"      element={<Future />} />

        {/* ── Legacy redirects (old URLs → new chapter URLs) ── */}
        <Route path="/home"       element={<Navigate to="/curiosity"   replace />} />
        <Route path="/workshop"   element={<Navigate to="/experiments" replace />} />
        <Route path="/lab"        element={<Navigate to="/building"    replace />} />
        <Route path="/watch"      element={<Navigate to="/freelance"   replace />} />
        <Route path="/awebco"     element={<Navigate to="/agency"      replace />} />
        <Route path="/editor-demo" element={<Navigate to="/playground" replace />} />
        <Route path="/agenticai"  element={<Navigate to="/future"      replace />} />

        {/* ── Sub-app pages (still accessible directly) ── */}
        <Route path="/shoe"        element={<Shoe />} />
        <Route path="/forge"       element={<Forge />} />
        <Route path="/materiallab" element={<MaterialLab />} />
        <Route path="/coffin-editor" element={<CoffinEditor />} />
        <Route path="/3d-room"     element={<Lab />} />
        <Route path="/watch-lab"   element={<Watch />} />
        <Route path="/room-editor" element={<EditorDemo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)