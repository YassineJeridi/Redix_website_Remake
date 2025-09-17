// src/components/ChatPopup/ChatPopup.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ChatPopup.module.css';

const ChatPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: ''
  });
  const [status, setStatus] = useState('idle');

  // Early return - don't render anything if not open
  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', message: '', phone: '' });
      }, 2000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.popup}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h3>Contact Us</h3>
            <button className={styles.closeBtn} onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className={styles.content}>
            {status === 'idle' || status === 'sending' ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className={styles.textarea}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className={styles.submitBtn}
                >
                  {status === 'sending' ? (
                    <>
                      <div className={styles.spinner}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            ) : status === 'success' ? (
              <div className={styles.successMessage}>
                <FaCheck className={styles.successIcon} />
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <div className={styles.errorMessage}>
                <FaExclamationTriangle className={styles.errorIcon} />
                <h4>Something went wrong</h4>
                <p>Please try again or contact us directly.</p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className={styles.retryBtn}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatPopup;
