// src/components/VideoShowcase/VideoShowcase.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaPlay, FaFilm } from 'react-icons/fa';
import { videoProjects } from '../../data/videoShowcase';
import VideoCard from './VideoCard';
import VideoControls from './VideoControls';
import styles from './VideoShowcase.module.css';

const VideoShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev, 0 for initial
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [errorVideos, setErrorVideos] = useState(new Set());

  const sectionRef = useRef(null);
  const touchStartX = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.2, once: true });

  // Memoize current video to prevent unnecessary re-renders
  const currentVideo = useMemo(() => videoProjects[currentIndex], [currentIndex]);

  // Optimized mobile detection with debouncing
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  // Set visibility when in view
  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
    }
  }, [isInView, isVisible]);

  // Enhanced navigation with direction awareness
  const changeVideo = useCallback((newIndex, animationDirection) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setDirection(animationDirection);
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      // Reset direction after transition to prevent unwanted animations
      setDirection(0);
    }, 600); // Slightly longer than animation duration
  }, [currentIndex, isTransitioning]);

  const nextVideo = useCallback(() => {
    const newIndex = (currentIndex + 1) % videoProjects.length;
    changeVideo(newIndex, 1); // Direction: 1 (forward)
  }, [currentIndex, changeVideo]);

  const prevVideo = useCallback(() => {
    const newIndex = (currentIndex - 1 + videoProjects.length) % videoProjects.length;
    changeVideo(newIndex, -1); // Direction: -1 (backward)
  }, [currentIndex, changeVideo]);

  // Go to specific video with smart direction detection
  const goToVideo = useCallback((targetIndex) => {
    if (isTransitioning || targetIndex === currentIndex) return;
    
    // Determine direction based on target index
    const animationDirection = targetIndex > currentIndex ? 1 : -1;
    changeVideo(targetIndex, animationDirection);
  }, [currentIndex, changeVideo, isTransitioning]);

  // Enhanced touch handlers with direction awareness
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartX.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swiped left -> next video (slide left)
        nextVideo();
      } else {
        // Swiped right -> previous video (slide right)
        prevVideo();
      }
    }
    
    touchStartX.current = null;
  }, [nextVideo, prevVideo]);

  // Keyboard navigation with direction support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevVideo();
      if (e.key === 'ArrowRight') nextVideo();
      if (e.key === ' ') {
        e.preventDefault();
        // Space key can be used for play/pause if needed
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, nextVideo, prevVideo]);

  // Video load/error handlers
  const handleVideoLoad = useCallback((videoId) => {
    setLoadedVideos(prev => new Set([...prev, videoId]));
  }, []);

  const handleVideoError = useCallback((videoId) => {
    setErrorVideos(prev => new Set([...prev, videoId]));
  }, []);

  // Progress calculation
  const progress = ((currentIndex + 1) / videoProjects.length) * 100;

  return (
    <section ref={sectionRef} className={styles.videoShowcase}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionTag}>
            <FaFilm />
            Video Portfolio
          </div>
          <h2 className={styles.title}>Our Creative Work</h2>
          <p className={styles.subtitle}>
            Discover our stunning collection of video content that brings brands to life and tells compelling stories
          </p>
        </motion.div>

        {/* Video Display */}
        <div className={styles.videoDisplay}>
          {!isMobile && (
            <VideoControls
              onPrev={prevVideo}
              onNext={nextVideo}
              currentIndex={currentIndex}
              totalVideos={videoProjects.length}
              disabled={isTransitioning}
            />
          )}

          <div 
            className={styles.videoCardContainer}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <VideoCard
                key={currentVideo.id}
                video={currentVideo}
                isActive={true}
                index={currentIndex}
                isTransitioning={isTransitioning}
                isVisible={isVisible}
                onVideoLoad={handleVideoLoad}
                onVideoError={handleVideoError}
                direction={direction}
              />
            </AnimatePresence>
          </div>

          {isMobile && (
            <motion.div 
              className={styles.swipeIndicator}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              &larr;Swipe to browse videos&rarr;
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <motion.div 
          className={styles.navigation}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
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
                } ${errorVideos.has(video.id) ? styles.errorThumb : ''}`}
                onClick={() => goToVideo(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isTransitioning}
                aria-label={`View ${video.title}`}
              >
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  loading="lazy"
                />
                <div className={styles.thumbOverlay}>
                  <span className={styles.thumbType}>{video.type}</span>
                </div>
                {loadedVideos.has(video.id) && (
                  <div className={styles.loadedIndicator} />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
