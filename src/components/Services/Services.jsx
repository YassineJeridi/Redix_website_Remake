// src/components/Services/Services.jsx
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FaCode,
  FaMobile,
  FaChartLine,
  FaPalette,
  FaVideo,
  FaCloud,
  FaArrowRight,
  FaCheck,
  FaStar
} from 'react-icons/fa';
import ServicesChatPopup from '../ServicesChatPopup/ServicesChatPopup';
import styles from './Services.module.css';

const Services = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Chat popup state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Updated services data with Digital Marketing as most popular and in the middle
  const services = [
    {
      id: 1,
      icon: FaCode,
      title: "Web Development",
      description: "Modern, responsive websites built with cutting-edge technologies",
      features: [
        "React/Vue.js Development",
        "Node.js Backend",
        "Responsive Design",
        "SEO Optimized",
        "E-commerce Solutions",
        "Custom CMS"
      ],
      pricing: "Starting from 500 TND",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      popular: false
    },
    {
      id: 2,
      icon: FaChartLine,
      title: "Digital Marketing",
      description: "Comprehensive digital marketing strategies that drive results",
      features: [
        "Social Media Management",
        "Google Ads Campaigns",
        "Content Strategy",
        "Analytics & Reporting",
        "Email Marketing",
        "Influencer Marketing"
      ],
      pricing: "Starting from 550 TND",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      popular: true // Changed from false to true - Now most popular!
    },
    {
      id: 3,
      icon: FaMobile,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications",
      features: [
        "iOS & Android Apps",
        "React Native Development",
        "Flutter Development",
        "App Store Optimization",
        "Push Notifications",
        "Offline Functionality"
      ],
      pricing: "Starting from 700 TND",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      popular: false // Changed from true to false
    },

    {
      id: 4,
      icon: FaPalette,
      title: "UI/UX Design",
      description: "User-centered design that converts visitors into customers",
      features: [
        "User Research",
        "Wireframing & Prototyping",
        "Visual Design",
        "Design Systems",
        "Usability Testing",
        "Brand Identity"
      ],
      pricing: "Starting from 750 TND",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      popular: false
    },
    {
      id: 5,
      icon: FaVideo,
      title: "Video Production",
      description: "Professional video content that tells your brand story",
      features: [
        "Corporate Videos",
        "Social Media Content",
        "Event Coverage",
        "Animation & Motion Graphics",
        "Post-Production",
        "Live Streaming"
      ],
      pricing: "Starting from 250 TND",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      popular: false
    },
    {
      id: 6,
      icon: FaCloud,
      title: "Hosting Services",
      description: "Reliable and secure hosting solutions for your digital presence",
      features: [
        "Cloud Hosting",
        "SSL Certificates",
        "Daily Backups",
        "24/7 Monitoring",
        "CDN Integration",
        "Email Hosting"
      ],
      pricing: "Starting from 350 TND",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      popular: false
    }
  ];

  const handleGetStarted = (service) => {
    setSelectedService(service);
    setIsChatOpen(true);
  };

  const closeChatPopup = () => {
    setIsChatOpen(false);
    setSelectedService(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      scale: 0.8,
      rotateX: 15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -20,
      scale: 1.03,
      rotateX: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <section className={styles.services} ref={sectionRef} id="services">
        {/* Advanced Animated Background */}
        <div className={styles.backgroundAnimations}>
          {/* Floating Orbs */}
          <div className={styles.floatingOrbs}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`${styles.orb} ${styles[`orb${i + 1}`]}`}
                animate={{
                  y: [-20, 20, -20],
                  x: [-15, 15, -15],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </div>

          {/* Animated Grid */}
          <div className={styles.animatedGrid}>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.gridDot}
                animate={{
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Rotating Rings */}
          <div className={styles.rotatingRings}>
            <motion.div
              className={styles.ring1}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className={styles.ring2}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        <div className={styles.container}>
          {/* Header */}
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className={styles.sectionTag}
              whileHover={{ scale: 1.05 }}
            >
              What We Do
            </motion.span>

            <motion.h2 className={styles.title}>
              Our Premium Services
            </motion.h2>

            <motion.p className={styles.subtitle}>
              Transform your business with our comprehensive digital solutions designed for growth and success
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            className={styles.servicesGrid}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;

              return (
                <motion.article
                  key={service.id}
                  className={`${styles.serviceCard} ${service.popular ? styles.popular : ''}`}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <motion.div
                      className={styles.popularBadge}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <FaStar className={styles.starIcon} />
                      Most Popular
                    </motion.div>
                  )}

                  {/* Card Glow Effect */}
                  <motion.div
                    className={styles.cardGlow}
                    style={{ background: service.gradient }}

                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon Container */}
                  <motion.div
                    className={styles.iconContainer}
                    style={{ background: service.gradient }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 10,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <IconComponent className={styles.serviceIcon} />
                    <motion.div
                      className={styles.iconRipple}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>

                  {/* Service Content */}
                  <div className={styles.serviceContent}>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDescription}>{service.description}</p>

                    {/* Features List */}
                    <ul className={styles.featuresList}>
                      {service.features.slice(0, 4).map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className={styles.featureItem}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1 + featureIndex * 0.05 + 0.8
                          }}
                        >
                          <FaCheck className={styles.checkIcon} />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Pricing */}
                    <motion.div
                      className={styles.pricingSection}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
                    >
                      <span className={styles.pricing}>{service.pricing}</span>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                      className={styles.ctaButton}
                      onClick={() => handleGetStarted(service)}
                      whileHover={{
                        scale: 1.05,
                        y: -3,
                        boxShadow: "0 15px 30px rgba(193, 45, 224, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 + 1.2 }}
                    >
                      Get Started
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <FaArrowRight className={styles.arrowIcon} />
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Chat Popup */}
      <ServicesChatPopup
        isOpen={isChatOpen}
        onClose={closeChatPopup}
        selectedService={selectedService}
      />
    </>
  );
};

export default Services;
