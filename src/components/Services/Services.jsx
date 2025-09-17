// src/components/Services/Services.jsx
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FaCode, FaMobile, FaChartLine, FaPalette, FaVideo, FaCloud,
  FaArrowRight, FaCheck, FaStar, FaRocket
} from 'react-icons/fa';
import { services } from '../../data/services';
import ServicesChatPopup from '../ServicesChatPopup/ServicesChatPopup';
import styles from './Services.module.css';

const Services = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Icon mappings
  const iconMap = useMemo(() => ({
    1: FaCode,
    2: FaChartLine,
    3: FaMobile,
    4: FaPalette,
    5: FaVideo,
    6: FaCloud
  }), []);

  // Reorder services - Digital Marketing in middle for BOTH desktop and mobile
  const orderedServices = useMemo(() => {
    const digitalMarketing = services.find(s => s.id === 2);
    const others = services.filter(s => s.id !== 2);
    const middle = Math.floor(others.length / 2);
    
    // Same arrangement for both desktop and mobile - Digital Marketing in center
    return [...others.slice(0, middle), digitalMarketing, ...others.slice(middle)];
  }, []);

  // Enhanced services with gradients and styling
  const enhancedServices = useMemo(() => {
    const gradients = {
      1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      2: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      3: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      4: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      5: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      6: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    };
    
    return orderedServices.map(service => ({
      ...service,
      icon: iconMap[service.id] || FaCode,
      popular: service.id === 2,
      gradient: gradients[service.id] || gradients[1]
    }));
  }, [orderedServices, iconMap]);

  // Mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize activeIndex - always start with middle (Digital Marketing)
  useEffect(() => {
    if (enhancedServices.length > 0) {
      const middleIndex = Math.floor(enhancedServices.length / 2);
      setActiveIndex(middleIndex);
    }
  }, [enhancedServices.length]);

  // Enhanced looping transform calculation
  const getLoopingTransform = useCallback((index, activeIndex, total) => {
    // Calculate distance with looping logic
    let distance = index - activeIndex;
    
    // Handle looping: choose shortest path
    if (distance > total / 2) {
      distance = distance - total;
    } else if (distance < -total / 2) {
      distance = distance + total;
    }

    const absDistance = Math.abs(distance);
    
    // 3D transform values with smooth transitions
    const rotateY = distance * -10;
    const translateX = distance * (isMobile ? 280 : 320);
    const translateZ = absDistance === 0 ? 0 : -60 - (absDistance * 30);
    const scale = absDistance === 0 ? 1 : Math.max(0.8, 1 - (absDistance * 0.12));
    const opacity = Math.max(0.2, 1 - (absDistance * 0.25));

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

  // Enhanced card selection with looping navigation
  const selectCard = useCallback((index) => {
    if (index === activeIndex) {
      // If clicking active card, open chat
      setSelectedService(enhancedServices[index]);
      setIsChatOpen(true);
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      // Navigate to selected card
      setActiveIndex(index);
      if (navigator.vibrate && isMobile) navigator.vibrate(30);
    }
  }, [activeIndex, enhancedServices, isMobile]);

  // Enhanced drag handling with looping
  const handleDragEnd = useCallback((event, { offset, velocity }) => {
    const threshold = 60;
    const velocityThreshold = 500;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0 || velocity.x > 0) {
        // Drag right - go to previous (with looping)
        setActiveIndex(prevIndex => 
          (prevIndex - 1 + enhancedServices.length) % enhancedServices.length
        );
      } else {
        // Drag left - go to next (with looping)
        setActiveIndex(prevIndex => 
          (prevIndex + 1) % enhancedServices.length
        );
      }
    }
  }, [enhancedServices.length]);

  // Keyboard navigation with looping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isInView) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + enhancedServices.length) % enhancedServices.length);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % enhancedServices.length);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (enhancedServices[activeIndex]) {
            setSelectedService(enhancedServices[activeIndex]);
            setIsChatOpen(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, activeIndex, enhancedServices]);

  // Chat popup handlers
  const closeChatPopup = useCallback(() => {
    setIsChatOpen(false);
    setSelectedService(null);
  }, []);

  return (
    <>
      <section ref={sectionRef} className={styles.services}>
        {/* Background Elements */}
        <div className={styles.backgroundAnimations}>
          <div className={styles.floatingOrbs}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`orb-${i}`}
                className={`${styles.orb} ${styles[`orb${i + 1}`]}`}
                animate={{
                  y: [-15, 15, -15],
                  x: [-10, 10, -10],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4 + (i * 0.3),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.container}>
          {/* Header */}
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className={styles.sectionTag}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket className={styles.tagIcon} />
              Our Services
            </motion.div>
            
            <h2 className={styles.title}>What We Do Best</h2>
            <p className={styles.subtitle}>
              Click any card to explore our services • Use arrow keys or swipe to navigate
            </p>
          </motion.div>

          {/* Enhanced 3D Looping Carousel */}
          <div className={styles.carouselContainer}>
            <motion.div
              className={styles.carouselTrack}
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
              onDragEnd={handleDragEnd}
              style={{ perspective: 1200 }}
            >
              {enhancedServices.map((service, index) => {
                const transform = getLoopingTransform(index, activeIndex, enhancedServices.length);
                const IconComponent = service.icon;

                return (
                  <motion.div
                    key={service.id}
                    className={`${styles.serviceCard} ${service.popular ? styles.popular : ''} ${transform.isActive ? styles.active : ''}`}
                    style={{
                      '--service-gradient': service.gradient,
                      zIndex: transform.zIndex
                    }}
                    animate={{
                      rotateY: transform.rotateY,
                      translateX: transform.translateX,
                      translateZ: transform.translateZ,
                      scale: transform.scale,
                      opacity: transform.opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 40,
                      mass: 1
                    }}
                    onClick={() => selectCard(index)}
                    whileHover={transform.isActive ? { 
                      scale: transform.scale * 1.02,
                      rotateY: transform.rotateY * 0.8 
                    } : { 
                      scale: transform.scale * 1.05 
                    }}
                    whileTap={{ scale: transform.scale * 0.95 }}
                  >
                    {/* Popular Badge */}
                    {service.popular && (
                      <motion.div 
                        className={styles.popularBadge}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.3,
                          type: "spring",
                          stiffness: 500
                        }}
                      >
                        <FaStar className={styles.starIcon} />
                        Most Popular
                      </motion.div>
                    )}

                    {/* Card Glow */}
                    <div 
                      className={styles.cardGlow}
                      style={{ background: service.gradient }}
                    />

                    {/* Icon Container */}
                    <motion.div 
                      className={styles.iconContainer}
                      style={{ background: service.gradient }}
                      animate={transform.isActive ? {
                        rotateY: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      } : {}}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <IconComponent className={styles.serviceIcon} />
                      <div className={styles.iconRipple} />
                    </motion.div>

                    {/* Service Content */}
                    <div className={styles.serviceContent}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      <p className={styles.serviceDescription}>{service.description}</p>

                      {/* Features - Only show for active card */}
                      {transform.isActive && (
                        <motion.ul 
                          className={styles.featuresList}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {service.features.slice(0, 4).map((feature, featureIndex) => (
                            <motion.li 
                              key={featureIndex}
                              className={styles.featureItem}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: featureIndex * 0.1,
                                duration: 0.3
                              }}
                            >
                              <FaCheck className={styles.checkIcon} />
                              <span>{feature}</span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}

                      {/* Pricing */}
                      <div className={styles.pricingSection}>
                        <div className={styles.pricing}>
                          {service.pricing}
                        </div>
                      </div>

                      {/* CTA Button - Only for active card */}
                      {transform.isActive && (
                        <motion.button
                          className={styles.ctaButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                            setIsChatOpen(true);
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span>Get Started</span>
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ 
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <FaArrowRight className={styles.arrowIcon} />
                          </motion.div>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Mobile Instructions */}
            {isMobile && (
              <motion.div 
                className={styles.mobileInstructions}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
              >
                Swipe to navigate
              </motion.div>
            )}
          </div>

          {/* Service Counter */}
          <motion.div 
            className={styles.serviceCounter}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            {activeIndex + 1} of {enhancedServices.length}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Services Chat Popup */}
      <ServicesChatPopup
        isOpen={isChatOpen}
        onClose={closeChatPopup}
        selectedService={selectedService}
      />
    </>
  );
};

export default Services;
