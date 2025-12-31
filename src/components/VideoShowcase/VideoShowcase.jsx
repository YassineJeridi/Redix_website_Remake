// src/components/VideoShowcase/VideoShowcase.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { videoProjects } from '../../data/videoShowcase';
import VideoCard from './VideoCard';
import styles from './VideoShowcase.module.css';

const VideoShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(null);

  const currentVideo = videoProjects[currentIndex];

  const changeVideo = useCallback((newIndex, dir) => {
    if (newIndex === currentIndex) return;
    setDirection(dir);
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const nextVideo = useCallback(() => {
    const newIndex = (currentIndex + 1) % videoProjects.length;
    changeVideo(newIndex, 1);
  }, [currentIndex, changeVideo]);

  const prevVideo = useCallback(() => {
    const newIndex = (currentIndex - 1 + videoProjects.length) % videoProjects.length;
    changeVideo(newIndex, -1);
  }, [currentIndex, changeVideo]);

  const goToVideo = (index) => {
    if (index === currentIndex) return;
    changeVideo(index, index > currentIndex ? 1 : -1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextVideo() : prevVideo();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevVideo();
      if (e.key === 'ArrowRight') nextVideo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextVideo, prevVideo]);

  return (
    <section className={styles.showcase} id="video-showcase">
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.badge}>
            <FaPlay />
            <span>Video Portfolio</span>
          </div>
          <h2 className={styles.title}>Our Creative Work</h2>
          <p className={styles.subtitle}>
            Stunning video content that brings brands to life and tells compelling stories
          </p>
        </motion.div>

        {/* Video Player */}
        <div 
          className={styles.player}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={prevVideo}
            aria-label="Previous video"
          >
            <FaChevronLeft />
          </button>

          <AnimatePresence mode="wait" custom={direction}>
            <VideoCard
              key={currentIndex}
              video={currentVideo}
              direction={direction}
            />
          </AnimatePresence>

          <button
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={nextVideo}
            aria-label="Next video"
          >
            <FaChevronRight />
          </button>

          <div className={styles.mobileHint}>
            Swipe to navigate
          </div>
        </div>

        {/* Video Title Only */}
        <motion.div
          className={styles.info}
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className={styles.videoTitle}>{currentVideo.title}</h3>
        </motion.div>

        {/* Thumbnails */}
        <div className={styles.thumbnails}>
          {videoProjects.map((video, index) => (
            <button
              key={video.id}
              className={`${styles.thumb} ${index === currentIndex ? styles.activeThumb : ''}`}
              onClick={() => goToVideo(index)}
              aria-label={`Go to ${video.title}`}
            >
              <video src={video.videoUrl} muted preload="metadata" />
              <div className={styles.thumbOverlay}>
                <span>{video.type}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className={styles.progress}>
          <motion.div
            className={styles.progressBar}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / videoProjects.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
