// src/components/VideoShowcase/VideoCard.jsx
import { useEffect, useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './VideoCard.module.css';

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.3 }
  })
};

const VideoCard = memo(({ video, direction }) => {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  
  const isInView = useInView(cardRef, { 
    threshold: 0.5,
    margin: "-50px"
  });

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
