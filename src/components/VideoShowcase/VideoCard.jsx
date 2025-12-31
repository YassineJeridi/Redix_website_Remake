// src/components/VideoShowcase/VideoCard.jsx
import { useEffect, useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './VideoCard.module.css';

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: (direction) => ({
    x: direction > 0 ? -400 : 400,
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.4 }
  })
};

const VideoCard = memo(({ video, direction }) => {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  
  const isInView = useInView(cardRef, { 
    threshold: 0.5,
    margin: "-50px"
  });

  // Handle auto-play/pause based on viewport visibility
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isInView) {
      videoEl.play().catch(() => {
        console.log('Autoplay prevented');
      });
    } else {
      videoEl.pause();
    }
  }, [isInView]);

  // Reset video on mount and set initial volume
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.currentTime = 0;
    videoEl.volume = 0.7;

    return () => {
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    };
  }, [video.id]);

  const isReel = video.type === 'reel';

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${isReel ? styles.reel : styles.landscape}`}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <div className={styles.videoWrap}>
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          controls
          playsInline
          className={styles.video}
        />

        <div className={styles.typeBadge}>
          {video.type}
        </div>

        <div className={styles.categoryBadge}>
          {video.category}
        </div>
      </div>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
