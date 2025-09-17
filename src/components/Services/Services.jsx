// src/components/Services/Services.jsx
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FaCode, FaMobile, FaChartLine, FaPencilRuler, FaVideo, FaCloud,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { services } from '../../data/services';
import ServiceCard from './ServiceCard';
import ServicesChatPopup from './ServicesChatPopup/ServicesChatPopup';
import styles from './Services.module.css';

const Services = () => {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const [selectedService, setSelectedService] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Icon mappings for services - Updated Graphic Design icon
  const iconMap = useMemo(() => ({
    1: FaCode, // Web Development
    2: FaChartLine, // Digital Marketing  
    3: FaMobile, // Mobile App
    4: FaPencilRuler, // Graphic Design - Updated icon
    5: FaVideo, // Video Production
    6: FaCloud // E-commerce
  }), []);

  // Enhanced services with styling data - Popular service centered
  const enhancedServices = useMemo(() => {
    const gradients = {
      1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      2: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      3: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      4: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      5: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      6: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    };

    const highlights = {
      2: 'Most Popular',
      1: 'Best Value',
      5: 'Creative',
    };

    // Reorder services to put popular service (id=2) in the center
    let orderedServices = [...services];
    const popularServiceIndex = orderedServices.findIndex(s => s.id === 2);
    
    if (popularServiceIndex > -1) {
      const popularService = orderedServices.splice(popularServiceIndex, 1)[0];
      const centerIndex = Math.floor(orderedServices.length / 2);
      orderedServices.splice(centerIndex, 0, popularService);
    }

    return orderedServices.map(service => ({
      ...service,
      icon: iconMap[service.id] || FaCode,
      gradient: gradients[service.id],
      highlight: highlights[service.id],
      isPopular: service.id === 2
    }));
  }, [iconMap]);

  // Set default activeIndex to center where popular service is
  const [activeIndex, setActiveIndex] = useState(() => {
    const popularIndex = enhancedServices.findIndex(s => s.isPopular);
    return popularIndex > -1 ? popularIndex : Math.floor(enhancedServices.length / 2);
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function for indicator labels
  const getIndicatorLabel = (serviceTitle) => {
    const firstWord = serviceTitle.split(' ')[0];
    
    const labelMap = {
      "Digital": "Marketing",
      "Graphic": "Graphic Design", 
      "Video": "Video Production"
    };
    
    return labelMap[firstWord] || firstWord;
  };

  // Enhanced 3D Transform calculations with increased gaps and reduced back opacity
  const getTransform = useCallback((index, activeIndex, total) => {
    let distance = index - activeIndex;
    
    // Handle circular positioning
    if (distance > total / 2) distance -= total;
    else if (distance < -total / 2) distance += total;

    const absDistance = Math.abs(distance);
    const rotateY = distance * (isMobile ? -5 : -12);
    
    // Mobile-optimized gaps
    const baseGap = isMobile ? 320 : 420;
    const translateX = distance * baseGap;
    
    const translateZ = absDistance === 0 ? 0 : -50 - (absDistance * 40);
    const scale = absDistance === 0 ? 1 : Math.max(0.8, 1 - (absDistance * 0.12));
    
    // Reduced opacity for back cards
    const opacity = absDistance === 0 ? 1 : Math.max(0.2, 1 - (absDistance * 0.5));

    return {
      rotateY,
      translateX,
      translateZ,
      scale,
      opacity,
      zIndex: total - absDistance,
      isActive: absDistance === 0
    };
  }, [isMobile]);

  // Navigation functions
  const navigateToService = useCallback((index) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const nextService = useCallback(() => {
    navigateToService((activeIndex + 1) % enhancedServices.length);
  }, [activeIndex, enhancedServices.length, navigateToService]);

  const prevService = useCallback(() => {
    navigateToService((activeIndex - 1 + enhancedServices.length) % enhancedServices.length);
  }, [activeIndex, enhancedServices.length, navigateToService]);

  // Handle get quote - opens ServicesChatPopup
  const handleGetQuote = (service) => {
    setSelectedService(service);
    setShowChatPopup(true);
  };

  // Touch/Drag handling for mobile
  const handleDragEnd = useCallback((event, { offset, velocity }) => {
    const threshold = 80;
    const velocityThreshold = 400;

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0 || velocity.x > 0) {
        prevService();
      } else {
        nextService();
      }
    }
  }, [nextService, prevService]);

  return (
    <section className={styles.services} id="services" ref={sectionRef}>
      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>

      <div className={styles.container}>
        {/* Header Section */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span 
            className={styles.sectionTag}
            whileHover={{ scale: 1.05 }}
          >
            Our Services
          </motion.span>
          <h2 className={styles.title}>What We Do Best</h2>
          <p className={styles.subtitle}>
            Transforming ideas into digital excellence through innovative solutions
            and cutting-edge technology
          </p>
        </motion.div>

        {/* Services Container */}
        <motion.div
          className={styles.servicesContainer}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Navigation Controls (Both Desktop & Mobile) */}
          <motion.button
            className={`${styles.navArrow} ${styles.navLeft} ${isMobile ? styles.mobileNav : ''}`}
            onClick={prevService}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronLeft />
          </motion.button>
          
          <motion.button
            className={`${styles.navArrow} ${styles.navRight} ${isMobile ? styles.mobileNav : ''}`}
            onClick={nextService}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronRight />
          </motion.button>

          {/* 3D Carousel Container */}
          <motion.div
            className={styles.cardsStack}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ perspective: isMobile ? 800 : 1200 }}
            ref={carouselRef}
          >
            {enhancedServices.map((service, index) => {
              const transform = getTransform(index, activeIndex, enhancedServices.length);
              
              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  transform={transform}
                  onGetQuote={() => handleGetQuote(service)}
                  isMobile={isMobile}
                />
              );
            })}
          </motion.div>

          {/* Enhanced Mobile Service Indicators */}
          <div className={styles.indicators}>
            <div className={styles.indicatorTrack}>
              {enhancedServices.map((service, index) => (
                <motion.button
                  key={index}
                  className={`${styles.indicator} ${index === activeIndex ? styles.active : ''}`}
                  onClick={() => navigateToService(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMobile && (
                    <span className={styles.indicatorLabel}>
                      {getIndicatorLabel(service.title)}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          {isMobile && (
            <motion.div
              className={styles.swipeHint}
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: 2 }}
            >
              ← Swipe or tap arrows to explore →
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Services Chat Popup */}
      <AnimatePresence>
        {showChatPopup && selectedService && (
          <ServicesChatPopup
            isOpen={showChatPopup}
            service={selectedService}
            onClose={() => {
              setShowChatPopup(false);
              setSelectedService(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
