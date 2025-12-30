// src/components/Services/Services.jsx
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FaCode, FaMobile, FaChartLine, FaPencilRuler, FaVideo, FaCloud, FaPalette,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { services } from '../../data/services';
import ServiceCard from './ServiceCard';
import ServicesChatPopup from './ServicesChatPopup';
import styles from './Services.module.css';

const Services = () => {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedService, setSelectedService] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Icon mappings
  const iconMap = useMemo(() => ({
    1: FaCode,
    2: FaChartLine,
    3: FaMobile,
    4: FaPencilRuler,
    5: FaVideo,
    6: FaCloud,
    7: FaPalette
  }), []);

  // Enhanced services
  const enhancedServices = useMemo(() => {
    return services.map(service => ({
      ...service,
      icon: iconMap[service.id] || FaCode,
      isPopular: service.MostPopular || false,
      isCommon: service.common || false
    }));
  }, [iconMap]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev === 0) {
        return enhancedServices.length - 1;
      }
      return prev - 1;
    });
  }, [enhancedServices.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev === enhancedServices.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  }, [enhancedServices.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showChatPopup) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNext, handlePrev, showChatPopup]);

  // Calculate visible cards based on screen size
  const getVisibleCards = () => {
    if (isMobile) return 1;
    if (window.innerWidth < 1200) return 2;
    return 3;
  };

  // Calculate transform based on current index
  const getTransform = () => {
    const visibleCards = getVisibleCards();
    const cardWidth = isMobile ? 100 : 100 / visibleCards;
    const gap = isMobile ? 1 : 1.333;
    
    return `calc(-${currentIndex * cardWidth}% - ${currentIndex * gap}rem)`;
  };

  // Handle get quote
  const handleGetQuote = useCallback((service) => {
    setSelectedService(service);
    setShowChatPopup(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowChatPopup(false);
    setSelectedService(null);
  }, []);

  return (
    <section ref={sectionRef}  id="services"  className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Our Services</h2>
          <p className={styles.subtitle}>
            Transform your business with our cutting-edge digital solutions
          </p>
        </motion.div>

        {/* Services Container with Navigation */}
        <div className={styles.servicesContainer}>
          {/* Navigation Arrows */}
          <button 
            className={`${styles.navArrow} ${styles.navArrowLeft}`}
            onClick={handlePrev}
            aria-label="Previous service"
          >
            <FaChevronLeft />
          </button>

          <button 
            className={`${styles.navArrow} ${styles.navArrowRight}`}
            onClick={handleNext}
            aria-label="Next service"
          >
            <FaChevronRight />
          </button>

          {/* Carousel */}
          <div className={styles.carouselWrapper} ref={carouselRef}>
            <motion.div
              className={styles.carousel}
              animate={{
                x: getTransform()
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {enhancedServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  className={styles.cardWrapper}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServiceCard service={service} onGetQuote={handleGetQuote} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Indicators */}
          <div className={styles.indicators}>
            {enhancedServices.map((service, index) => (
              <button
                key={service.id}
                className={`${styles.indicator} ${
                  index === currentIndex ? styles.active : ''
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to ${service.title}`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: 'linear-gradient(135deg, #c12de0, #e856ff)' }}></span>
            <span>Most Popular</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }}></span>
            <span>Common Services</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: 'rgba(255, 255, 255, 0.1)' }}></span>
            <span>Premium Services</span>
          </div>
        </div>

        {/* Navigation Hint */}
        <motion.div
          className={styles.navHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5 }}
        >
          Use arrows or keyboard ← → to navigate
        </motion.div>
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {showChatPopup && selectedService && (
          <ServicesChatPopup
            service={selectedService}
            onClose={handleClosePopup}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
