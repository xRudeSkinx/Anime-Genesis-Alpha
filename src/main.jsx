
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './pages/App.jsx'
import Gencore from './pages/Gencore.jsx'
import './styles.css'

// HashRouter ensures /#/gencore works on any host
createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/gencore" element={<Gencore />} />
    </Routes>
  </HashRouter>
)
