// src/components/ChatPopup/ChatPopup.jsx
import { useState, useEffect } from 'react';
import { sendTelegramMessage } from '../../services/telegramService';
import styles from './ChatPopup.module.css';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const services = [
    'Web Development',
    'Mobile Development', 
    'Digital Marketing',
    'UI/UX Design',
    'Video Production',
    'Hosting Services'
  ];

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
🔥 NEW CONTACT FROM REDIX WEBSITE:

👤 Name: ${formData.name}
📧 Email: ${formData.email}
🛠️ Service: ${formData.service}
💬 Message: ${formData.message}

Time: ${new Date().toLocaleString()}
    `;

    try {
      const success = await sendTelegramMessage(message);
      if (success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '', service: '' });
        setTimeout(() => {
          setIsOpen(false);
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

  return (
    <>
      <div className={`${styles.chatButton} ${isOpen ? styles.active : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </div>

      <div className={`${styles.chatPopup} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <h3>Get in Touch</h3>
          <p>Let's discuss your project</p>
        </div>

        <form className={styles.chatForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          
          <select
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            required
            className={styles.select}
          >
            <option value="">Select a Service</option>
            {services.map((service, index) => (
              <option key={index} value={service}>{service}</option>
            ))}
          </select>
          
          <textarea
            name="message"
            placeholder="Tell us about your project..."
            value={formData.message}
            onChange={handleInputChange}
            required
            className={styles.textarea}
            rows="4"
          />
          
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitStatus === 'success' && (
            <div className={styles.successMessage}>
              ✅ Message sent successfully!
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className={styles.errorMessage}>
              ❌ Failed to send message. Please try again.
            </div>
          )}
        </form>
      </div>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatPopup;
