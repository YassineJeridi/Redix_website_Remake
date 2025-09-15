// src/App.jsx
import './styles/global.css';
import GlobalBackground from './components/GlobalBackground/GlobalBackground';

// Import all your components
import Navbar from './components/Navbar/Navbar';
import Banner from './components/Banner/Banner';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import Testimonials from './components/Testimonials/Testimonials';
import Services from './components/Services/Services';
import VideoShowcase from './components/VideoShowcase/VideoShowcase';
import DevProject from './components/DevProject/DevProject';
import TrustedBy from './components/TrustedBy/TrustedBy';
import BookCall from './components/BookCall/BookCall';
import Footer from './components/Footer/Footer';
import ChatPopup from './components/ChatPopup/ChatPopup';

function App() {
  return (
    <GlobalBackground>
      <Navbar />
      <Banner />
      <WhyChooseUs />

      <Services />

      <BookCall />
      <VideoShowcase />
      <DevProject />
      <BookCall />


      <Testimonials />
      <TrustedBy />

      <Footer />
      <ChatPopup />
    </GlobalBackground>
  );
}

export default App;
