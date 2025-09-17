// src/components/Services/Services.jsx
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FaCode, FaMobile, FaChartLine, FaPalette, FaVideo, FaCloud,
  FaArrowRight, FaCheck, FaStar, FaRocket, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { services } from '../../data/services';
import ServicesChatPopup from '../ServicesChatPopup/ServicesChatPopup';
import styles from './Services.module.css';

const Services = () => {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // State management
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.floor(services.length / 2));
  const [isScrolling, setIsScrolling] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Icon mapping for services
  const iconMap = useMemo(() => ({
    1: FaCode,
    2: FaChartLine,
    3: FaMobile,
    4: FaPalette,
    5: FaVideo,
    6: FaCloud
  }), []);

  // Enhanced services data with gradients and popular flag
  const enhancedServices = useMemo(() => {
    const gradients = {
      1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      2: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      3: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      4: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      5: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      6: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    };

    return services.map(service => ({
      ...service,
      icon: iconMap[service.id] || FaCode,
      popular: service.id === 2, // Digital Marketing is most popular
      gradient: gradients[service.id] || gradients[1]
    }));
  }, [services, iconMap]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3D Transform calculations for cards
  const getCardTransform = useCallback((index, activeIndex, total) => {
    const distance = index - activeIndex;
    const absDistance = Math.abs(distance);

    // 3D transform values
    const rotateY = distance * -15; // Rotation based on position
    const translateZ = absDistance > 1 ? -150 : -absDistance * 75; // Depth
    const scale = absDistance > 1 ? 0.8 : 1 - (absDistance * 0.1); // Scale
    const opacity = absDistance > 2 ? 0.3 : 1 - (absDistance * 0.15); // Fade
    const translateX = distance * (isMobile ? 320 : 380); // Horizontal spacing

    return {
      rotateY,
      translateZ,
      scale,
      opacity,
      translateX,
      zIndex: total - absDistance
    };
  }, [isMobile]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    if (isScrolling || index < 0 || index >= enhancedServices.length) return;
    
    setIsScrolling(true);
    setActiveIndex(index);
    
    // Haptic feedback on mobile
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => setIsScrolling(false), 500);
  }, [isScrolling, enhancedServices.length, isMobile]);

  const nextSlide = useCallback(() => {
    goToSlide((activeIndex + 1) % enhancedServices.length);
  }, [activeIndex, enhancedServices.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeIndex - 1 + enhancedServices.length) % enhancedServices.length);
  }, [activeIndex, enhancedServices.length, goToSlide]);

  // Touch gesture handling
  const handleDragEnd = useCallback((event, { offset, velocity }) => {
    const swipeThreshold = 50;
    const velocityThreshold = 300;

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0 || velocity.x > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  }, [nextSlide, prevSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isInView) return;
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleGetStarted(enhancedServices[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, prevSlide, nextSlide, activeIndex, enhancedServices]);

  // Chat popup handlers
  const handleGetStarted = useCallback((service) => {
    if (navigator.vibrate) navigator.vibrate(50);
    setSelectedService(service);
    setIsChatOpen(true);
  }, []);

  const closeChatPopup = useCallback(() => {
    setIsChatOpen(false);
    setSelectedService(null);
  }, []);

  return (
    <>
      <section ref={sectionRef} className={styles.services}>
        {/* Enhanced Animated Background */}
        <div className={styles.backgroundAnimations}>
          {/* Floating Orbs */}
          <div className={styles.floatingOrbs}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`orb-${i}`}
                className={`${styles.orb} ${styles[`orb${i + 1}`]}`}
                animate={{
                  y: [-20, 20, -20],
                  x: [-15, 15, -15],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4 + (i * 0.5),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Animated Grid */}
          <div className={styles.animatedGrid}>
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={`grid-${i}`}
                className={styles.gridDot}
                animate={{
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  delay: (i * 0.1) % 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.container}>
          {/* Enhanced Header */}
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
              Our Premium Services
            </motion.div>
            
            <h2 className={styles.title}>Transform Your Digital Future</h2>
            <p className={styles.subtitle}>
              Experience our comprehensive digital solutions through an immersive 3D showcase designed for the modern web
            </p>
          </motion.div>

          {/* 3D Services Carousel */}
          <div className={styles.carouselContainer}>
            {/* Navigation Arrows - Desktop Only */}
            {!isMobile && (
              <>
                <motion.button
                  className={`${styles.navButton} ${styles.navPrev}`}
                  onClick={prevSlide}
                  disabled={isScrolling}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous service"
                >
                  <FaChevronLeft />
                </motion.button>

                <motion.button
                  className={`${styles.navButton} ${styles.navNext}`}
                  onClick={nextSlide}
                  disabled={isScrolling}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Next service"
                >
                  <FaChevronRight />
                </motion.button>
              </>
            )}

            {/* 3D Cards Carousel */}
            <motion.div
              ref={carouselRef}
              className={styles.carouselTrack}
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              dragElastic={0.1}
            >
              {enhancedServices.map((service, index) => {
                const transform = getCardTransform(index, activeIndex, enhancedServices.length);
                const IconComponent = service.icon;
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={service.id}
                    className={`${styles.serviceCard} ${service.popular ? styles.popular : ''} ${isActive ? styles.active : ''}`}
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
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    onClick={() => isActive && handleGetStarted(service)}
                    whileHover={isActive ? { scale: transform.scale * 1.05 } : {}}
                    onHoverStart={() => {
                      if (!isActive && !isScrolling && !isMobile) {
                        goToSlide(index);
                      }
                    }}
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

                    {/* Enhanced Card Glow */}
                    <div 
                      className={styles.cardGlow}
                      style={{ background: service.gradient }}
                    />

                    {/* 3D Icon Container */}
                    <motion.div 
                      className={styles.iconContainer}
                      style={{ background: service.gradient }}
                      animate={isActive ? {
                        rotateY: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={styles.iconRipple} />
                      <IconComponent className={styles.serviceIcon} />
                    </motion.div>

                    {/* Service Content */}
                    <div className={styles.serviceContent}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      <p className={styles.serviceDescription}>{service.description}</p>

                      {/* Features List */}
                      <ul className={styles.featuresList}>
                        {service.features.slice(0, 4).map((feature, featureIndex) => (
                          <motion.li 
                            key={featureIndex}
                            className={styles.featureItem}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ 
                              delay: (featureIndex * 0.1) + 0.3,
                              duration: 0.4
                            }}
                          >
                            <FaCheck className={styles.checkIcon} />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Pricing */}
                      <div className={styles.pricingSection}>
                        <div className={styles.pricing}>
                          {service.pricing}
                        </div>
                      </div>

                      {/* CTA Button - Only visible for active card */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.button
                            className={styles.ctaButton}
                            onClick={() => handleGetStarted(service)}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.3 }}
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
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Mobile Scroll Indicators */}
            {isMobile && (
              <motion.div 
                className={styles.scrollIndicator}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                ← Drag to explore services →
              </motion.div>
            )}
          </div>

          {/* Service Dots Navigation */}
          <div className={styles.dotsNavigation}>
            {enhancedServices.map((_, index) => (
              <motion.button
                key={index}
                className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
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
