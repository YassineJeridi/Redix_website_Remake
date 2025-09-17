// src/components/Services/ServiceCard.jsx
import { motion } from 'framer-motion';
import { FaArrowRight, FaCheck, FaStar } from 'react-icons/fa';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ service, transform, isTransitioning, onClick }) => {
  const IconComponent = service.icon;

  return (
    <motion.div
      className={`${styles.serviceCard} ${transform.isActive ? styles.active : ''} ${
        service.isPopular ? styles.popular : ''
      }`}
      onClick={onClick}
      animate={{
        rotateY: transform.rotateY,
        x: transform.translateX,
        z: transform.translateZ,
        scale: transform.scale,
        opacity: transform.opacity
      }}
      style={{ zIndex: transform.zIndex }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        opacity: { duration: 0.3 }
      }}
      whileHover={transform.isActive ? {
        scale: transform.scale * 1.05,
        rotateY: transform.rotateY * 0.8,
        y: -10
      } : {
        scale: transform.scale * 1.02
      }}
      whileTap={{ scale: transform.scale * 0.98 }}
    >
      {/* Popular Badge */}
      {service.highlight && (
        <motion.div 
          className={styles.badge}
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {service.isPopular && <FaStar className={styles.starIcon} />}
          {service.highlight}
        </motion.div>
      )}

      {/* Card Glow Effect */}
      <div 
        className={styles.cardGlow}
        style={{ background: service.gradient }}
      />

      {/* Icon Container */}
      <motion.div 
        className={styles.iconContainer}
        style={{ background: service.gradient }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <IconComponent className={styles.serviceIcon} />
        <div className={styles.iconRipple} />
      </motion.div>

      {/* Service Content */}
      <div className={styles.serviceContent}>
        <motion.h3 
          className={styles.serviceTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {service.title}
        </motion.h3>

        <motion.p 
          className={styles.serviceDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {service.description}
        </motion.p>

        {/* Features List (only for active card) */}
        {transform.isActive && (
          <motion.ul 
            className={styles.featuresList}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {service.features.slice(0, 4).map((feature, index) => (
              <motion.li 
                key={index}
                className={styles.featureItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <FaCheck className={styles.checkIcon} />
                {feature}
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Pricing Section */}
        <motion.div 
          className={styles.pricingSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={styles.pricing}>
            Starting at {service.pricing}
          </div>
        </motion.div>

        {/* CTA Button (only for active card) */}
        {transform.isActive && (
          <motion.button
            className={styles.ctaButton}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            onClick={(e) => {
              e.stopPropagation();
              // This will trigger the chat popup
              onClick();
            }}
          >
            Get Started
            <FaArrowRight className={styles.arrowIcon} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceCard;
