// src/components/Navbar/Navbar.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaHome, FaUser, FaCog, FaBriefcase, FaEnvelope, FaEye, FaCouch, FaPlane, FaTshirt, FaUtensils, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './Navbar.module.css';

const logoImage = '/redix.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isWorkOpen, setIsWorkOpen] = useState(false);

  // Portfolio/Work items
  const workItems = [
    { 
      label: 'Quick Overview', 
      href: '#video-showcase',
      icon: FaEye,
      isInternal: true
    },
    { 
      label: 'Furniture Store', 
      href: 'https://redixdigitalsolutions.github.io/redix-furniture/',
      icon: FaCouch,
      isInternal: false
    },
    { 
      label: 'Travel Agency', 
      href: 'https://redixdigitalsolutions.github.io/travel-agency/',
      icon: FaPlane,
      isInternal: false
    },
    { 
      label: 'Fashion Portfolio', 
      href: 'https://redixdigitalsolutions.github.io/redixfashionportfolio/',
      icon: FaTshirt,
      isInternal: false
    },
    { 
      label: 'Chef Portfolio', 
      href: 'https://redixdigitalsolutions.github.io/restaurant-chef-portfolio/',
      icon: FaUtensils,
      isInternal: false
    }
  ];

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', href: '#home', icon: FaHome },
    { id: 'why-choose-us', label: 'About', href: '#why-choose-us', icon: FaUser },
    { id: 'services', label: 'Services', href: '#services', icon: FaCog },
    { id: 'our-work', label: 'Our Work', href: '#', icon: FaBriefcase, hasDropdown: true },
    { id: 'book-call', label: 'Free Consultation', href: '#book-call', icon: FaEnvelope }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      const sections = navItems.filter(item => !item.hasDropdown).map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
    setIsWorkOpen(false);
  };

  // Handle work item click
  const handleWorkItemClick = (item) => {
    if (item.isInternal) {
      scrollToSection(item.href.replace('#', ''));
    } else {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    }
    setIsWorkOpen(false);
    setIsOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.navbar}`)) {
        setIsOpen(false);
        setIsWorkOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.container}>
        {/* Logo */}
        <motion.a
          href="#home"
          className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={logoImage} alt="Redix Logo" className={styles.logoImage} />
        </motion.a>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            
            if (item.hasDropdown) {
              return (
                <li key={item.id} className={styles.dropdown}>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWorkOpen(!isWorkOpen);
                    }}
                    className={`${styles.navLink} ${isWorkOpen ? styles.active : ''}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className={styles.navIcon} />
                    {item.label}
                  </motion.button>
                  
                  <AnimatePresence>
                    {isWorkOpen && (
                      <motion.div
                        className={styles.dropdownMenu}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {workItems.map((work, idx) => {
                          const WorkIcon = work.icon;
                          return (
                            <motion.button
                              key={idx}
                              onClick={() => handleWorkItemClick(work)}
                              className={styles.dropdownItem}
                              whileHover={{ x: 5 }}
                            >
                              <WorkIcon className={styles.dropdownIcon} />
                              <span>{work.label}</span>
                              {!work.isInternal && <FaExternalLinkAlt className={styles.externalIcon} />}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <motion.a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className={styles.navIcon} />
                  {item.label}
                </motion.a>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <motion.button
          className={styles.menuToggle}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.mobileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className={styles.mobileMenu}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className={styles.mobileHeader}>
                <img src={logoImage} alt="Redix Logo" className={styles.mobileLogo} />
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  <FaTimes />
                </button>
              </div>

              <ul className={styles.mobileNavLinks}>
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  
                  if (item.hasDropdown) {
                    return (
                      <div key={item.id}>
                        <motion.button
                          onClick={() => setIsWorkOpen(!isWorkOpen)}
                          className={`${styles.mobileNavLink} ${isWorkOpen ? styles.activeMobile : ''}`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <IconComponent className={styles.mobileNavIcon} />
                          {item.label}
                        </motion.button>
                        
                        <AnimatePresence>
                          {isWorkOpen && (
                            <motion.div
                              className={styles.mobileDropdown}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {workItems.map((work, idx) => {
                                const WorkIcon = work.icon;
                                return (
                                  <motion.button
                                    key={idx}
                                    onClick={() => handleWorkItemClick(work)}
                                    className={styles.mobileDropdownItem}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <WorkIcon className={styles.mobileNavIcon} />
                                    <span>{work.label}</span>
                                    {!work.isInternal && <FaExternalLinkAlt className={styles.externalIcon} />}
                                  </motion.button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <li key={item.id}>
                      <motion.a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(item.id);
                        }}
                        className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.activeMobile : ''}`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent className={styles.mobileNavIcon} />
                        {item.label}
                        {activeSection === item.id && <span className={styles.activeDot}></span>}
                      </motion.a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
