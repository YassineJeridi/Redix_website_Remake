// src/components/Services/ServiceDetails.jsx
import { motion } from 'framer-motion';
import { FaTimes, FaCheck } from 'react-icons/fa';
import styles from './ServiceDetails.module.css';

const ServiceDetails = ({ service, onClose }) => {
  const IconComponent = service.icon;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Details Panel */}
      <motion.div
        className={styles.detailsPanel}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.serviceInfo}>
            <div className={styles.serviceIconLarge}>
              <IconComponent />
            </div>
            <div>
              <h2 className={styles.serviceTitle}>{service.title}</h2>
              <p className={styles.serviceCategory}>{service.category}</p>
            </div>
          </div>
          
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={styles.panelContent}>
          <div className={styles.descriptionSection}>
            <h3>Overview</h3>
            <p>{service.description}</p>
          </div>

          <div className={styles.featuresSection}>
            <h3>What's Included</h3>
            <div className={styles.featuresList}>
              {service.features?.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <FaCheck className={styles.checkIcon} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pricingSection}>
            <h3>Investment</h3>
            <div className={styles.priceDisplay}>
              <span className={styles.priceAmount}>{service.pricing}</span>
              <span className={styles.priceNote}>Starting price - Contact us for detailed quote</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className={styles.panelFooter}>
          <div className={styles.contactInfo}>
            <p>Ready to get started?</p>
            <div className={styles.contactMethods}>
              <a href="mailto:contact@redix.pro" className={styles.contactBtn}>
                Email Us
              </a>
              <a href="tel:+1234567890" className={styles.contactBtn}>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ServiceDetails;
