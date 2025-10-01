// src/components/Services/ServiceCard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ 
  service, 
  transform, 
  onGetQuote,
  isMobile = false 
}) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const IconComponent = service.icon;

  const handleToggleFeatures = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAllFeatures(!showAllFeatures);
  };

  const handleGetQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onGetQuote(service);
  };

  // Get initial features to display (first 2)
  const initialFeatures = service.features?.slice(0, 2) || [];
  const remainingFeatures = service.features?.slice(2) || [];
  const hasMoreFeatures = remainingFeatures.length > 0;

  return (
    <motion.div
      className={`${styles.serviceCard} ${transform.isActive ? styles.active : ''} ${service.MostPopular ? styles.popular : ''} ${isMobile ? styles.mobile : ''}`}
      animate={{
        rotateY: transform.rotateY || 0,
        x: transform.translateX || 0,
        z: transform.translateZ || 0,
        scale: transform.scale || 1,
      }}
      style={{
        opacity: transform.opacity || 1,
        zIndex: transform.zIndex || 0,
        '--service-gradient': service.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={transform.isActive ? {
        scale: (transform.scale || 1) * (isMobile ? 1.02 : 1.03),
        y: isMobile ? -6 : -10
      } : {}}
      whileTap={{ scale: (transform.scale || 1) * 0.98 }}
    >
      {/* Most Popular Badge */}
      {service.MostPopular && (
        <motion.div 
          className={styles.popularBadge}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <FaStar className={styles.starIcon} />
          <span>Most Popular</span>
        </motion.div>
      )}

      {/* Card Background with Cross-Platform Compatibility */}
      <div className={styles.cardBackground}>
        <div className={styles.slidingGradient} />
        <div className={styles.glassOverlay} />
      </div>

      {/* Service Icon */}
      <motion.div 
        className={styles.iconContainer}
        whileHover={{ 
          scale: 1.1,
          rotate: 5
        }}
        transition={{ duration: 0.3 }}
      >
        <IconComponent className={styles.serviceIcon} />
      </motion.div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        {/* Basic Info */}
        <div className={styles.basicInfo}>
          <h3 className={styles.serviceTitle}>{service.title}</h3>
          <p className={styles.serviceDescription}>{service.description}</p>
        </div>

        {/* Features Section */}
        {service.features && service.features.length > 0 && (
          <div className={styles.featuresContainer}>
            <h4 className={styles.featuresTitle}>Key Features</h4>
            
            {/* Initial Features (Always Visible) */}
            <div className={styles.featuresList}>
              {initialFeatures.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className={styles.featureItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className={styles.featureDot} />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Expandable Features */}
            <AnimatePresence>
              {showAllFeatures && remainingFeatures.length > 0 && (
                <motion.div
                  className={styles.expandedFeatures}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                >
                  {remainingFeatures.map((feature, index) => (
                    <motion.div 
                      key={index + 2} 
                      className={styles.featureItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <div className={styles.featureDot} />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show More/Less Button */}
            {hasMoreFeatures && (
              <motion.button
                className={styles.toggleFeaturesBtn}
                onClick={handleToggleFeatures}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span>
                  {showAllFeatures 
                    ? `Show Less` 
                    : `${remainingFeatures.length} More Feature${remainingFeatures.length > 1 ? 's' : ''}`
                  }
                </span>
                {showAllFeatures ? (
                  <FaChevronUp className={styles.toggleIcon} />
                ) : (
                  <FaChevronDown className={styles.toggleIcon} />
                )}
              </motion.button>
            )}
          </div>
        )}

        {/* Technologies Section (for active cards only) */}
      

        {/* Pricing Section */}
        <div className={styles.pricingSection}>
          <div className={styles.priceContainer}>
            <span className={styles.priceAmount}>{service.pricing}</span>
          </div>
        </div>

        {/* Get Quote Button */}
        <motion.button
          className={styles.getQuoteBtn}
          onClick={handleGetQuote}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span>Get Custom Quote</span>
          <FaArrowRight className={styles.arrowIcon} />
        </motion.button>
      </div>

      {/* Cross-platform compatible shine effect */}
      <div className={styles.shineEffect} />
    </motion.div>
  );
};

export default ServiceCard;
