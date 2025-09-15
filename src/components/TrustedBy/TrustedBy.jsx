// src/components/TrustedBy/TrustedBy.jsx
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { clients } from '../../data/clients';
import styles from './TrustedBy.module.css';

const TrustedBy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const scrollControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      controls.start('visible');
      
      // Start the scrolling animation
      scrollControls.start({
        x: [0, -50 * clients.length * 8], // Adjust based on logo width
        transition: {
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: clients.length * 3, // Dynamic duration based on number of logos
            ease: 'linear'
          }
        }
      });
    }
  }, [isInView, controls, scrollControls, clients.length]);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // Animation variants for header
  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Animation variants for stats
  const statsVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2 + 0.8,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const stats = [
    { number: '100+', label: 'Projects Completed' },
    { number: '50+', label: 'Happy Clients' },
    { number: '3+', label: 'Years Experience' },
    { number: '24/7', label: 'Support Available' }
  ];

  // Create multiple sets of logos for seamless scrolling
  const logoSets = Array(4).fill(clients).flat();

  return (
    <section className={styles.trustedBy} ref={ref} id="trusted">
      <motion.div 
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Animated Background Elements */}
        <motion.div 
          className={styles.backgroundOrb1}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className={styles.backgroundOrb2}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Header Section */}
        <motion.div 
          className={styles.header}
          variants={headerVariants}
        >
          <motion.div className={styles.titleWrapper}>
            <motion.span 
              className={styles.sectionTag}
              initial={{ scale: 0, rotate: -180 }}
              animate={isVisible ? { scale: 1, rotate: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
            >
              Partners
            </motion.span>
            
            <motion.h2 
              className={styles.title}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <motion.span
                initial={{ y: 100, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Trusted By
              </motion.span>
            </motion.h2>
            
            <motion.div 
              className={styles.titleAccent}
              initial={{ scaleX: 0 }}
              animate={isVisible ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </motion.div>
          
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Proud to work with amazing brands and organizations worldwide
          </motion.p>
        </motion.div>

        {/* Animated Scrolling Logos */}
        <motion.div 
          className={styles.scrollingSection}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className={styles.logosContainer}>
            <motion.div
              className={styles.logosWrapper}
              animate={scrollControls}
              initial={{ x: 0 }}
            >
              {logoSets.map((client, index) => (
                <motion.div
                  key={`${client.name}-${index}`}
                  className={styles.logoItem}
                  whileHover={{ 
                    scale: 1.1,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.img
                    src={client.logo}
                    alt={client.name}
                    className={styles.clientLogo}
                    loading="lazy"
                    whileHover={{
                      filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(193, 45, 224, 0.6))'
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Fade edges */}
          <div className={styles.fadeLeft}></div>
          <div className={styles.fadeRight}></div>
        </motion.div>

        {/* Animated Stats Section */}
        <motion.div 
          className={styles.stats}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statItem}
              variants={statsVariants}
              custom={index}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <motion.span 
                className={styles.statNumber}
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2 + 1.5,
                  type: 'spring',
                  stiffness: 200
                }}
              >
                {stat.number}
              </motion.span>
              <motion.span 
                className={styles.statLabel}
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.2 + 1.7 }}
              >
                {stat.label}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TrustedBy;
