// src/components/Services/ServicesChatPopup/ServicesChatPopup.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaCheck, FaExclamationTriangle, FaRocket } from 'react-icons/fa';
import { sendTelegramMessage } from '../../../services/telegramService';
import { services } from '../../../data/services'; // Import available services
import styles from './ServicesChatPopup.module.css';

const ServicesChatPopup = ({ isOpen, service, onClose }) => {
  // State management - all hooks at top
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selectedService: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(1);
  const messagesEndRef = useRef(null);

  // Debug logging to trace undefined issues
  useEffect(() => {
    console.log('ServicesChatPopup props:', { isOpen, service, onClose });
    if (service) {
      console.log('Service details:', service);
      // Pre-select the service when popup opens
      setFormData(prev => ({
        ...prev,
        selectedService: service.title || ''
      }));
    }
  }, [isOpen, service, onClose]);

  // Effects
  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setCurrentStep(1);
      setStatus('idle');
      // Pre-select service if provided
      if (service) {
        setFormData(prev => ({
          ...prev,
          selectedService: service.title || ''
        }));
      }
      console.log('Chat popup opened for service:', service?.title);
    }
  }, [isOpen, service]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [status, currentStep]);

  // Early return after all hooks
  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Prepare message data to match your telegram service API
      const telegramData = {
        name: formData.name || 'Not provided',
        email: formData.email || 'Not provided',
        phone: formData.phone || 'Not provided',
        selectedService: formData.selectedService || 'Unknown Service',
        message: formData.message || 'No message provided'
      };

      console.log('Sending telegram data:', telegramData);

      await sendTelegramMessage(telegramData);
      setStatus('success');
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({
          name: '', 
          email: '', 
          phone: '', 
          selectedService: '',
          message: ''
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

  function isStepValid() {
    if (currentStep === 1) {
      return formData.name && formData.email && formData.phone && formData.selectedService;
    }
    if (currentStep === 2) {
      return formData.message;
    }
    return true;
  }

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
              <div>
                <h3>Get Quote for Your Project</h3>
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
                        <label>Select Service *</label>
                        <select
                          name="selectedService"
                          value={formData.selectedService}
                          onChange={handleChange}
                          required
                          className={styles.serviceSelect}
                        >
                          <option value="">Choose a service...</option>
                          {services.map(serviceItem => (
                            <option key={serviceItem.id} value={serviceItem.title}>
                              {serviceItem.title}
                            </option>
                          ))}
                        </select>
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
                        <label>Message / Project Description *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="6"
                          placeholder={`Tell us about your ${formData.selectedService ? formData.selectedService.toLowerCase() : 'project'}. What are your goals, requirements, and expectations? Please be as detailed as possible.`}
                        />
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
                          <strong>Service:</strong> {formData.selectedService || 'N/A'}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Name:</strong> {formData.name || 'N/A'}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Email:</strong> {formData.email || 'N/A'}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Phone:</strong> {formData.phone || 'N/A'}
                        </div>
                        <div className={styles.reviewItem}>
                          <strong>Message Preview:</strong> 
                          <p className={styles.messagePreview}>
                            {formData.message?.length > 100 
                              ? `${formData.message.substring(0, 100)}...` 
                              : formData.message || 'N/A'
                            }
                          </p>
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
                <p>Thank you for your interest in our services. We'll review your requirements and send you a detailed proposal within 24 hours.</p>
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
};

export default ServicesChatPopup;
