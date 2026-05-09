import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ActorProfile from './pages/ActorProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/actor/:id" element={<ActorProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
