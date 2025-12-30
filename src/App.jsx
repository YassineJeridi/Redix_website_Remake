// src/App.jsx
import './styles/global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Furniture from './pages/Furniture';
import Travel from './pages/Travel';
import Fashion from './pages/Fashion';
import Chef from './pages/Chef';
import ChatPopup from './components/ChatPopup/ChatPopup';
import GlobalBackground from './components/GlobalBackground/GlobalBackground';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <Router>
      <div className="app">
        <GlobalBackground />
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/chef" element={<Chef />} />
        </Routes>

        <Footer />
        
        {isChatOpen && (
          <ChatPopup isOpen={isChatOpen} onClose={closeChat} />
        )}
      </div>
    </Router>
  );
}

export default App;
