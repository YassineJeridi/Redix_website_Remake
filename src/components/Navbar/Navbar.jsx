// src/components/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaCog, FaBriefcase, FaEnvelope, FaEye, FaCouch, FaPlane, FaTshirt, FaUtensils, FaChevronDown } from 'react-icons/fa';
import styles from './Navbar.module.css';

const logoImage = '/redix.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const location = useLocation();

  const workItems = [
    { label: 'Quick Overview', href: '/#video-showcase', icon: FaEye, isHash: true },
    { label: 'Furniture Store', href: '/furniture', icon: FaCouch, isHash: false },
    { label: 'Travel Agency', href: '/travel', icon: FaPlane, isHash: false },
    { label: 'Fashion Portfolio', href: '/fashion', icon: FaTshirt, isHash: false },
    { label: 'Chef Portfolio', href: '/chef', icon: FaUtensils, isHash: false }
  ];

  const navItems = [
    { id: 'why-choose-us', label: 'About', href: '/#why-choose-us', icon: FaUser, isHash: true },
    { id: 'services', label: 'Services', href: '/#services', icon: FaCog, isHash: true },
    { id: 'our-work', label: 'Our Work', icon: FaBriefcase, hasDropdown: true },
    { id: 'book-call', label: 'Contact', href: '/#book-call', icon: FaEnvelope, isHash: true }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      if (location.pathname === '/') {
        const sections = navItems.filter(item => !item.hasDropdown).map(item => item.id);
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (currentSection) setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
    setIsOpen(false);
    setIsWorkOpen(false);
  };

  const handleNavClick = (e, item) => {
    if (item.isHash && location.pathname === '/') {
      e.preventDefault();
      scrollToSection(item.id);
    }
  };

  const handleWorkItemClick = (item) => {
    setIsWorkOpen(false);
    setIsOpen(false);
    if (item.isHash && location.pathname === '/') {
      const sectionId = item.href.replace('/#', '');
      scrollToSection(sectionId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.navbar}`)) {
        setIsOpen(false);
        setIsWorkOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <motion.img 
            src={logoImage} 
            alt="Redix" 
            className={styles.logoImage}
            whileHover={{ scale: 1.05 }}
          />
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.hasDropdown) {
              return (
                <li key={item.id} className={styles.dropdown}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsWorkOpen(!isWorkOpen); }}
                    className={`${styles.navLink} ${isWorkOpen ? styles.active : ''}`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                    <FaChevronDown className={`${styles.chevron} ${isWorkOpen ? styles.rotated : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isWorkOpen && (
                      <motion.div
                        className={styles.dropdownMenu}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {workItems.map((work) => {
                          const WorkIcon = work.icon;
                          const Component = work.isHash ? Link : Link;
                          return (
                            <Component
                              key={work.label}
                              to={work.href}
                              onClick={() => handleWorkItemClick(work)}
                              className={styles.dropdownItem}
                            >
                              <WorkIcon />
                              <span>{work.label}</span>
                            </Component>
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
                <Link
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Toggle */}
        <button
          className={styles.menuToggle}
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className={styles.mobileHeader}>
                <img src={logoImage} alt="Redix" className={styles.mobileLogo} />
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  <FaTimes />
                </button>
              </div>

              <ul className={styles.mobileNavLinks}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.hasDropdown) {
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setIsWorkOpen(!isWorkOpen)}
                          className={`${styles.mobileNavLink} ${isWorkOpen ? styles.activeLink : ''}`}
                        >
                          <Icon />
                          <span>{item.label}</span>
                          <FaChevronDown className={`${styles.chevron} ${isWorkOpen ? styles.rotated : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isWorkOpen && (
                            <motion.div
                              className={styles.subMenu}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              {workItems.map((work) => {
                                const WorkIcon = work.icon;
                                return (
                                  <Link
                                    key={work.label}
                                    to={work.href}
                                    onClick={() => handleWorkItemClick(work)}
                                    className={styles.subMenuItem}
                                  >
                                    <WorkIcon />
                                    <span>{work.label}</span>
                                  </Link>
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
                      <Link
                        to={item.href}
                        onClick={(e) => { handleNavClick(e, item); setIsOpen(false); }}
                        className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.activeLink : ''}`}
                      >
                        <Icon />
                        <span>{item.label}</span>
                        {activeSection === item.id && location.pathname === '/' && (
                          <span className={styles.activeDot} />
                        )}
                      </Link>
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
