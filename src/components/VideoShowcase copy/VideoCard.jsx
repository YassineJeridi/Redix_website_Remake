// src/components/VideoShowcase/VideoCard.jsx
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import styles from './VideoCard.module.css';

// Direction-aware animation variants
const slideVariants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 300 : direction < 0 ? -300 : 0,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : direction < 0 ? -15 : 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "tween"
    }
  },
  exit: (direction) => {
    return {
      x: direction > 0 ? -300 : direction < 0 ? 300 : 0,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -15 : direction < 0 ? 15 : 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "tween"
      }
    };
  }
};

const VideoCard = memo(({ 
  video, 
  isActive, 
  index, 
  isTransitioning, 
  isVisible,
  onVideoLoad,
  onVideoError,
  direction = 0 // Default to 0 (no direction)
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);
  const observerRef = useRef(null);

  // Optimized Intersection Observer
  useEffect(() => {
    if (!cardRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    observerRef.current.observe(cardRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Video event handlers with error handling
  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onVideoLoad?.(video.id);
  }, [video.id, onVideoLoad]);

  const handleVideoError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onVideoError?.(video.id);
  }, [video.id, onVideoError]);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

  // Setup video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.addEventListener('loadeddata', handleVideoLoad);
    videoElement.addEventListener('error', handleVideoError);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('loadeddata', handleVideoLoad);
      videoElement.removeEventListener('error', handleVideoError);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [handleVideoLoad, handleVideoError, handlePlay, handlePause]);

  // Optimized video playback control
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive || hasError) return;

    const shouldPlay = isIntersecting && isVisible && !isTransitioning;

    if (shouldPlay && videoElement.paused) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, show play button
          setShowPlayIcon(true);
        });
      }
    } else if (!shouldPlay && !videoElement.paused) {
      videoElement.pause();
    }
  }, [isActive, isIntersecting, isVisible, isTransitioning, hasError]);

  // Reset video when switching
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && isActive) {
      videoElement.currentTime = 0;
    }
  }, [index, isActive]);

  const togglePlayback = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement || hasError) return;

    if (videoElement.paused) {
      videoElement.play().catch(() => {});
    } else {
      videoElement.pause();
    }

    // Show play/pause icon briefly
    setShowPlayIcon(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPlayIcon(false), 1000);
  }, [hasError]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (hasError) {
    return (
      <motion.div
        ref={cardRef}
        className={`${styles.videoCard} ${styles.errorCard}`}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
      >
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Video Unavailable</h3>
          <p>This video could not be loaded</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.videoCard} ${
        video.type === 'reel' ? styles.reel : styles.landscape
      } ${isActive ? styles.active : ''}`}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={direction}
      onClick={togglePlayback}
      style={{ zIndex: isActive ? 10 : 1 }} // Ensure proper layering
    >
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.backgroundVideo}
          poster={video.thumbnailUrl}
          loop
          playsInline
          preload="metadata"
          tabIndex={0}
          aria-label={`${video.title} video`}
        >
          <source src={video.videoUrl} type="video/mp4" />
          <source src={video.videoUrl} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay */}
        <div className={styles.videoOverlay} />

        {/* Category Badge */}
        <div className={styles.categoryBadge}>
          {video.category}
        </div>

        {/* Format Indicator */}
        <div className={styles.formatIndicator}>
          <span className={styles.formatBadge}>
            {video.type === 'reel' ? 'REEL' : 'LANDSCAPE'}
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
          </div>
        )}

        {/* Play/Pause Icon */}
        {showPlayIcon && (
          <motion.div
            className={styles.playIcon}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </motion.div>
        )}

        {/* Volume Indicator */}
        {isPlaying && isIntersecting && (
          <div className={styles.volumeIndicator}>
            <FaVolumeUp />
          </div>
        )}

        {/* Active Indicator */}
        {isActive && (
          <div className={styles.activeIndicator} />
        )}
      </div>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';
export default VideoCard;
