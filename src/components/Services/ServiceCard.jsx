// src/components/Services/ServiceCard.jsx
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar, FaCheck } from 'react-icons/fa';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ 
  service, 
  transform, 
  onGetQuote,
  isMobile = false 
}) => {
  const IconComponent = service.icon;

  return (
    <motion.div
      className={`${styles.serviceCard} ${transform.isActive ? styles.active : ''} ${isMobile ? styles.mobile : ''}`}
      animate={{
        rotateY: transform.rotateY || 0,
        x: transform.translateX || 0,
        z: transform.translateZ || 0,
        scale: transform.scale || 1,
      }}
      style={{
        opacity: transform.opacity || 1,
        zIndex: transform.zIndex || 0,
        '--service-gradient': service.gradient
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={transform.isActive ? {
        scale: (transform.scale || 1) * (isMobile ? 1.01 : 1.02),
        y: isMobile ? -4 : -8
      } : {}}
      whileTap={{ scale: (transform.scale || 1) * 0.98 }}
    >
      {/* Popular Tag */}
      {service.isPopular && (
        <motion.div 
          className={styles.popularTag}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FaStar className={styles.popularIcon} />
          <span>Most Popular</span>
        </motion.div>
      )}

      {/* Glassmorphism Background */}
      <div className={styles.cardBackground}>
        <div 
          className={styles.gradientOverlay}
          style={{ opacity: transform.isActive ? 0.1 : 0.05 }}
        />
        <div className={styles.glassEffect} />
      </div>

      {/* Service Icon */}
      <motion.div 
        className={styles.iconContainer}
        whileHover={{ rotate: transform.isActive ? 360 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <IconComponent className={styles.serviceIcon} />
        <div className={styles.iconGlow} />
      </motion.div>

      {/* Content */}
      <div className={styles.cardContent}>
        <h3 className={styles.serviceTitle}>{service.title}</h3>
        <p className={styles.serviceDescription}>{service.description}</p>
        
        {/* Features List - Only show if active */}
        {transform.isActive && (
          <motion.div
            className={styles.featuresSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h4 className={styles.featuresTitle}>What's Included:</h4>
            <div className={styles.featuresList}>
              {service.features?.slice(0, isMobile ? 4 : 6).map((feature, index) => (
                <motion.div 
                  key={index} 
                  className={styles.featureItem}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <FaCheck className={styles.checkIcon} />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Pills - Show when not active */}
        {!transform.isActive && (
          <div className={styles.featuresPills}>
            {service.features?.slice(0, isMobile ? 2 : 3).map((feature, index) => (
              <span key={index} className={styles.featurePill}>
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className={styles.pricingContainer}>
          <span className={styles.priceLabel}>Starting at</span>
          <span className={styles.priceAmount}>{service.pricing}</span>
          {transform.isActive && (
            <motion.p 
              className={styles.priceNote}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Final price based on project requirements
            </motion.p>
          )}
        </div>

        {/* CTA Button - Always show for active card */}
        {transform.isActive && (
          <motion.button
            className={styles.ctaButton}
            onClick={(e) => {
              e.stopPropagation();
              onGetQuote();
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Custom Quote
            <FaArrowRight className={styles.ctaIcon} />
          </motion.button>
        )}

        {/* Active Card Indicator for non-active cards */}
        {!transform.isActive && (
          <motion.div
            className={styles.activeIndicator}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Click to view details</span>
          </motion.div>
        )}
      </div>

      {/* Card Shine Effect */}
      <div className={styles.cardShine} />
      
      {/* Inner Glow */}
      <div className={styles.innerGlow} />
    </motion.div>
  );
};

export default ServiceCard;
