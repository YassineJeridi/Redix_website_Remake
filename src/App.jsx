import './styles/global.css';
// src/App.jsx
import { useState } from 'react';
import Home from './pages/Home';
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
    <div className="App">
      <GlobalBackground>
      <Navbar/>
      <Home />
      <Footer/> 
      
      
      {/* Chat Button */}
      <button 
        className="chat-button"
        onClick={openChat}
        aria-label="Open chat"
      >
        💬
      </button>
      
      {/* Chat Popup - Only renders when isOpen is true */}
      <ChatPopup 
        isOpen={isChatOpen} 
        onClose={closeChat} 
      />
      </GlobalBackground>
    </div>
  );
}

export default App;
