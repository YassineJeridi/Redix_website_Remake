// src/components/Services/ServicesChatPopup/ServicesChatPopup.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaCheck, FaExclamationTriangle, FaRocket } from 'react-icons/fa';
import { sendTelegramMessage } from '../../../services/telegramService';
import styles from './ServicesChatPopup.module.css';

const ServicesChatPopup = ({ isOpen, service, onClose }) => {
  // State management - all hooks at top
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDescription: '',
    budget: '',
    timeline: ''
  });
  const [status, setStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(1);
  const messagesEndRef = useRef(null);

  // Effects
  useEffect(() => {
    if (isOpen && service) {
      // Reset form when opening with new service
      setCurrentStep(1);
      setStatus('idle');
    }
  }, [isOpen, service]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [status, currentStep]);

  // Early return after all hooks
  if (!isOpen || !service) {
    return null;
  }

  const budgetRanges = [
    '$1,000 - $5,000',
    '$5,000 - $15,000', 
    '$15,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+'
  ];

  const timelineOptions = [
    'ASAP (Rush job)',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    '3-6 months',
    '6+ months'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Prepare message for Telegram
      const telegramData = {
        service: service.title,
        ...formData,
        timestamp: new Date().toISOString()
      };

      await sendTelegramMessage(telegramData);
      setStatus('success');
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({
          name: '', email: '', phone: '', company: '',
          projectDescription: '', budget: '', timeline: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepProgress = () => (currentStep / 3) * 100;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modalContainer}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.modalHeader}>
            <div className={styles.serviceInfo}>
              <service.icon className={styles.serviceIcon} />
              <div>
                <h3>Get Quote for {service.title}</h3>
                <p>Let's discuss your project requirements</p>
              </div>
            </div>
            
            <button className={styles.closeBtn} onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                animate={{ width: `${getStepProgress()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className={styles.stepInfo}>Step {currentStep} of 3</span>
          </div>

          {/* Form Content */}
          <div className={styles.modalBody}>
            {status === 'idle' || status === 'sending' ? (
              <form onSubmit={handleSubmit} className={styles.chatForm}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      className={styles.formStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4>Contact Information</h4>
                      
                      <div className={styles.inputGroup}>
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@company.com"
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Company (Optional)</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company Name"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      className={styles.formStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4>Project Details</h4>
                      
                      <div className={styles.inputGroup}>
                        <label>Project Description *</label>
                        <textarea
                          name="projectDescription"
                          value={formData.projectDescription}
                          onChange={handleChange}
                          required
                          rows="4"
                          placeholder={`Tell us about your ${service.title.toLowerCase()} project. What are your goals, requirements, and expectations?`}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Budget Range *</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map(range => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Timeline *</label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select timeline</option>
                          {timelineOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      className={styles.formStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4>Review & Submit</h4>
                      
                      <div className={styles.reviewSection}>
                        <div className={styles.reviewItem}>
                          <strong>Service:</strong> {service.title}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Name:</strong> {formData.name}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Email:</strong> {formData.email}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Budget:</strong> {formData.budget}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Timeline:</strong> {formData.timeline}
                        </div>
                      </div>
                      
                      <div className={styles.submitNote}>
                        <FaRocket />
                        <p>We'll review your request and get back to you within 24 hours with a detailed proposal.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Navigation */}
                <div className={styles.formNavigation}>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={prevStep}
                    >
                      Back
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      className={styles.nextBtn}
                      onClick={nextStep}
                      disabled={!isStepValid()}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <>
                          <div className={styles.spinner} />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Send Request
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            ) : status === 'success' ? (
              <motion.div
                className={styles.successState}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FaCheck className={styles.successIcon} />
                <h3>Request Sent Successfully!</h3>
                <p>Thank you for your interest in our {service.title} service. We'll review your requirements and send you a detailed proposal within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.div
                className={styles.errorState}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FaExclamationTriangle className={styles.errorIcon} />
                <h3>Something went wrong</h3>
                <p>Please try again or contact us directly at contact@redix.pro</p>
                <button 
                  className={styles.retryBtn}
                  onClick={() => setStatus('idle')}
                >
                  Try Again
                </button>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  function isStepValid() {
    if (currentStep === 1) {
      return formData.name && formData.email && formData.phone;
    }
    if (currentStep === 2) {
      return formData.projectDescription && formData.budget && formData.timeline;
    }
    return true;
  }
};

export default ServicesChatPopup;
