// src/components/ServicesChatPopup/ServicesChatPopup.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';
import { sendTelegramMessage } from '../../services/telegramService';
import styles from './ServicesChatPopup.module.css';

const ServicesChatPopup = ({ isOpen, onClose, selectedService = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: selectedService?.title || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const message = `
🚀 NEW SERVICE INQUIRY FROM REDIX WEBSITE:

👤 **Name:** ${formData.name}
📧 **Email:** ${formData.email}
${formData.phone ? `📞 **Phone:** ${formData.phone}` : ''}
🛠️ **Service Interested:** ${formData.service}

💬 **Message:**
${formData.message}

📅 **Time:** ${new Date().toLocaleString('fr-TN', { 
  timeZone: 'Africa/Tunis'
})}
    `;

    try {
      const success = await sendTelegramMessage(message);
      if (success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          service: selectedService?.title || ''
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus('');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div 
              className={styles.header}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className={styles.headerContent}>
                <div className={styles.headerIcon}>
                  <FaComment />
                </div>
                <div className={styles.headerText}>
                  <h3>Let's Start Your Project</h3>
                  <p>Tell us about your {selectedService?.title.toLowerCase() || 'project'} needs</p>
                </div>
              </div>
              
              <motion.button
                className={styles.closeButton}
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </motion.div>

            {/* Form */}
            <motion.form 
              className={styles.form}
              onSubmit={handleSubmit}
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaUser className={styles.fieldIcon} />
                  Full Name
                </label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your full name"
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaEnvelope className={styles.fieldIcon} />
                  Email Address
                </label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="your.email@example.com"
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Phone Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaPhone className={styles.fieldIcon} />
                  Phone Number (Optional)
                </label>
                <motion.input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="+216 XX XXX XXX"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Service Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  Service Interested In
                </label>
                <motion.input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Select or type service"
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Message Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  Project Details
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Tell us about your project requirements, timeline, and any specific features you need..."
                  rows="4"
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                variants={fieldVariants}
              >
                {isSubmitting ? (
                  <motion.div
                    className={styles.loadingSpinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    Send Message
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaPaperPlane className={styles.sendIcon} />
                    </motion.div>
                  </>
                )}
              </motion.button>

              {/* Status Messages */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    className={styles.successMessage}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    ✅ Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}
                
                {submitStatus === 'error' && (
                  <motion.div
                    className={styles.errorMessage}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    ❌ Failed to send message. Please try again or contact us directly.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServicesChatPopup;
