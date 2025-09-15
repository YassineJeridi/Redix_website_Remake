// src/components/VideoShowcase/VideoShowcase.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaPlay, FaFilm } from 'react-icons/fa';
import { videoProjects } from '../../data/videoShowcase';
import VideoCard from './VideoCard';
import VideoControls from './VideoControls';
import AnimatedBackground from './AnimatedBackground';
import styles from './VideoShowcase.module.css';

const VideoShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3, once: true });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Visibility detection
  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      // Auto-play current video after 1 second
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 1000);
    }
  }, [isInView]);

  // Navigation functions with animation
  const nextVideo = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % videoProjects.length);
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning]);

  const prevVideo = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + videoProjects.length) % videoProjects.length);
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning]);

  // Go to specific video
  const goToVideo = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 100);
  }, [currentIndex, isTransitioning]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextVideo();
    if (isRightSwipe) prevVideo();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevVideo();
      if (e.key === 'ArrowRight') nextVideo();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextVideo, prevVideo]);

  // Auto-play video when index changes
  useEffect(() => {
    if (videoRef.current && isVisible) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, isVisible]);

  const currentVideo = videoProjects[currentIndex];

  return (
    <section className={styles.videoShowcase} id="portfolio" ref={sectionRef}>
      <AnimatedBackground />
      
      <div className={styles.container}>
        {/* Header */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className={styles.sectionTag}
            whileHover={{ scale: 1.05 }}
          >
            <FaFilm /> Our Creative Work
          </motion.div>
          <h2 className={styles.title}>Video Portfolio</h2>
          <p className={styles.subtitle}>
            Discover our stunning collection of video content that brings brands to life and tells compelling stories
          </p>
        </motion.div>

        {/* Video Display */}
        <motion.div 
          className={styles.videoDisplay}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          {/* Desktop Controls */}
          {!isMobile && (
            <VideoControls
              onPrev={prevVideo}
              onNext={nextVideo}
              currentIndex={currentIndex}
              totalVideos={videoProjects.length}
              disabled={isTransitioning}
            />
          )}

          {/* Video Card with Animation */}
          <div className={styles.videoCardContainer}>
            <AnimatePresence mode="wait">
              <VideoCard
                key={currentIndex}
                video={currentVideo}
                videoRef={videoRef}
                isActive={true}
                index={currentIndex}
                isTransitioning={isTransitioning}
              />
            </AnimatePresence>
          </div>

          {/* Mobile Swipe Indicator */}
          {isMobile && (
            <motion.div 
              className={styles.swipeIndicator}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              ← Swipe to browse videos →
            </motion.div>
          )}
        </motion.div>

        {/* Progress & Navigation */}
        <motion.div 
          className={styles.navigation}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                animate={{ 
                  width: `${((currentIndex + 1) / videoProjects.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className={styles.progressText}>
              {currentIndex + 1} / {videoProjects.length}
            </span>
          </div>

          {/* Thumbnail Navigation */}
          <div className={styles.thumbnailNav}>
            {videoProjects.map((video, index) => (
              <motion.button
                key={video.id}
                className={`${styles.thumbItem} ${
                  index === currentIndex ? styles.activeThumb : ''
                }`}
                onClick={() => goToVideo(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isTransitioning}
              >
                <img src={video.thumbnailUrl} alt={video.title} />
                <div className={styles.thumbOverlay}>
                  <span className={styles.thumbType}>{video.type}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
