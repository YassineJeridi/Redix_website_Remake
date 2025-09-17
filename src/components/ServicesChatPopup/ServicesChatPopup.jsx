// src/components/ServicesChatPopup/ServicesChatPopup.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaPaperPlane, FaUser, FaEnvelope, FaPhone, 
  FaComment, FaRocket, FaCheckCircle, FaExclamationCircle, 
  FaSpinner, FaDollarSign, FaClock 
} from 'react-icons/fa';
import { sendTelegramMessage } from '../../services/telegramService';
import styles from './ServicesChatPopup.module.css';

const ServicesChatPopup = ({ isOpen, onClose, selectedService = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: selectedService?.title || '',
    budget: '',
    timeline: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  
  const firstInputRef = useRef(null);
  const modalRef = useRef(null);

  // Update service when selectedService changes
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        service: selectedService.title
      }));
    }
  }, [selectedService]);

  // Focus management
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current.focus(), 300);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Form validation
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email' : '';
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
      default:
        return '';
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    setFocusedField('');
  }, [validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    ['name', 'email', 'message'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    const message = `
🚀 NEW SERVICE INQUIRY - REDIX DIGITAL

👤 Client: ${formData.name}
📧 Email: ${formData.email}
${formData.phone ? `📞 Phone: ${formData.phone}` : ''}

🛠️ Service: ${formData.service}
${formData.budget ? `💰 Budget: ${formData.budget}` : ''}
${formData.timeline ? `⏰ Timeline: ${formData.timeline}` : ''}

💬 Message:
${formData.message}

📅 Submitted: ${new Date().toLocaleString('en-TN', {
      timeZone: 'Africa/Tunis',
      dateStyle: 'full',
      timeStyle: 'short'
    })}

🌐 Source: Website Contact Form
    `;

    try {
      const success = await sendTelegramMessage(message);
      
      if (success) {
        setSubmitStatus('success');
        
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          service: selectedService?.title || '',
          budget: '',
          timeline: ''
        });
        
        // Auto close after success
        setTimeout(() => {
          onClose();
          setSubmitStatus('');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15,
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
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      }
    }
  };

  const statusVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* Enhanced Backdrop */
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          {/* Enhanced Modal */}
          <motion.div
            ref={modalRef}
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Elements */}
            <div className={styles.modalBackground}>
              <div className={styles.gradientOrb1} />
              <div className={styles.gradientOrb2} />
              <div className={styles.gridPattern} />
            </div>

            {/* Enhanced Header */}
            <motion.div 
              className={styles.header}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.headerContent}>
                <motion.div 
                  className={styles.headerIcon}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(193, 45, 224, 0.3)",
                      "0 0 30px rgba(193, 45, 224, 0.6)",
                      "0 0 20px rgba(193, 45, 224, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaRocket />
                </motion.div>
                <div className={styles.headerText}>
                  <h3>Let's Start Your Project</h3>
                  <p>Tell us about your {selectedService?.title.toLowerCase() || 'project'} needs and we'll get back to you within 24 hours</p>
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

            {/* Enhanced Form */}
            <motion.form 
              className={styles.form}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
            >
              {/* Name Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaUser className={styles.fieldIcon} />
                  Full Name
                </label>
                <div className={styles.inputContainer}>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''} ${focusedField === 'name' ? styles.inputFocused : ''}`}
                    placeholder="Enter your full name"
                    required
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.span
                        className={styles.errorText}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaEnvelope className={styles.fieldIcon} />
                  Email Address
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''} ${focusedField === 'email' ? styles.inputFocused : ''}`}
                    placeholder="your@email.com"
                    required
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.span
                        className={styles.errorText}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Phone Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaPhone className={styles.fieldIcon} />
                  Phone Number <span className={styles.optional}>(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={handleBlur}
                  className={`${styles.input} ${focusedField === 'phone' ? styles.inputFocused : ''}`}
                  placeholder="+216 XX XXX XXX"
                />
              </motion.div>

              {/* Service and Budget Row */}
              <div className={styles.fieldRow}>
                <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                  <label className={styles.label}>
                    <FaRocket className={styles.fieldIcon} />
                    Service Interested In
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Select a service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Video Production">Video Production</option>
                    <option value="Hosting Services">Hosting Services</option>
                  </select>
                </motion.div>

                <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                  <label className={styles.label}>
                    <FaDollarSign className={styles.fieldIcon} />
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Select budget</option>
                    <option value="500-1000 TND">500-1000 TND</option>
                    <option value="1000-2500 TND">1000-2500 TND</option>
                    <option value="2500-5000 TND">2500-5000 TND</option>
                    <option value="5000+ TND">5000+ TND</option>
                    <option value="To be discussed">To be discussed</option>
                  </select>
                </motion.div>
              </div>

              {/* Timeline Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaClock className={styles.fieldIcon} />
                  Project Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">As soon as possible</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="1 month">Within 1 month</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </motion.div>

              {/* Message Field */}
              <motion.div className={styles.fieldGroup} variants={fieldVariants}>
                <label className={styles.label}>
                  <FaComment className={styles.fieldIcon} />
                  Project Details
                </label>
                <div className={styles.inputContainer}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={handleBlur}
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ''} ${focusedField === 'message' ? styles.inputFocused : ''}`}
                    placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                    rows={4}
                    required
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.span
                        className={styles.errorText}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.message}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Enhanced Submit Button */}
              <motion.button
                type="submit"
                className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''} ${submitStatus === 'success' ? styles.success : ''}`}
                disabled={isSubmitting}
                variants={fieldVariants}
                whileHover={!isSubmitting ? { 
                  scale: 1.02, 
                  boxShadow: "0 12px 35px rgba(193, 45, 224, 0.5)" 
                } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <motion.div
                    className={styles.loadingSpinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : submitStatus === 'success' ? (
                  <FaCheckCircle />
                ) : (
                  <FaPaperPlane className={styles.sendIcon} />
                )}
                <span>
                  {isSubmitting ? 'Sending Message...' : 
                   submitStatus === 'success' ? 'Message Sent!' : 
                   'Send Message'}
                </span>
              </motion.button>

              {/* Status Messages */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    className={styles.successMessage}
                    variants={statusVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <FaCheckCircle className={styles.statusIcon} />
                    <div>
                      <strong>Success!</strong> Your message has been sent successfully.
                      <br />We'll get back to you within 24 hours.
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    className={styles.errorMessage}
                    variants={statusVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <FaExclamationCircle className={styles.statusIcon} />
                    <div>
                      <strong>Oops!</strong> There was an error sending your message.
                      <br />Please try again or contact us at contact@redixsolutions.pro
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServicesChatPopup;
