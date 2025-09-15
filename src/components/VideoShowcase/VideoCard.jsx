// src/components/VideoShowcase/VideoCard.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from './VideoCard.module.css';

const VideoCard = ({ video, videoRef, isActive, index, isTransitioning }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const cardRef = useRef(null);

    const isReel = video.type === 'reel';
    const isLandscape = video.type === 'landscape';

    // Intersection Observer to detect when video card is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            {
                threshold: 0.5, // Video is considered in view when 50% is visible
                rootMargin: '-10% 0px -10% 0px' // Add some margin for better UX
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    // Handle video events and setup
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Set video to unmuted with full volume by default
        videoElement.muted = false;
        videoElement.volume = 1.0; // Maximum volume

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);

        return () => {
            videoElement.removeEventListener('play', handlePlay);
            videoElement.removeEventListener('pause', handlePause);
        };
    }, [videoRef]);

    // Auto-play/pause based on section visibility
    useEffect(() => {
        if (!videoRef.current || !isActive) return;

        if (isInView) {
            // Play video when section comes into view
            videoRef.current.play().catch(() => { });
        } else {
            // Pause video when section goes out of view
            videoRef.current.pause();
        }
    }, [isInView, isActive, videoRef]);

    // Reset video when index changes
    useEffect(() => {
        if (videoRef.current && isActive && isInView) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => { });
        }
    }, [index, isActive, isInView]);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play().catch(() => { });
        } else {
            videoRef.current.pause();
        }

        // Show the icon briefly
        setShowIcon(true);
        setTimeout(() => {
            setShowIcon(false);
        }, 1000); // Hide after 1 second
    };

    // Animation variants
    const cardVariants = {
        enter: {
            x: 300,
            opacity: 0,
            scale: 0.8,
            rotateY: 25
        },
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        },
        exit: {
            x: -300,
            opacity: 0,
            scale: 0.8,
            rotateY: -25,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const iconVariants = {
        hidden: {
            opacity: 0,
            scale: 0.5
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 1.2,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    return (
        <motion.div
            ref={cardRef}
            className={`${styles.videoCard} ${styles[video.type]} ${isActive ? styles.active : ''}`}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            layout
        >
            {/* Video Background */}
            <div className={styles.videoContainer}>
                <video
                    ref={videoRef}
                    className={styles.backgroundVideo}
                    src={video.videoUrl}
                    muted={false} // Unmuted by default
                    loop
                    playsInline
                    poster={video.thumbnailUrl}
                    onClick={togglePlay}
                />

                {/* Overlay Gradient */}
                <div className={styles.videoOverlay} />

                {/* Category Badge */}
                <motion.div
                    className={styles.categoryBadge}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {video.category}
                </motion.div>

                {/* Format Indicator */}
                <div className={styles.formatIndicator}>
                    <span className={styles.formatBadge}>
                        {isReel ? 'REEL' : 'LANDSCAPE'}
                    </span>
                </div>

                {/* Transient Play/Pause Icon */}
                {showIcon && (
                    <motion.div
                        className={styles.transientIcon}
                        variants={iconVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </motion.div>
                )}

                {/* Volume Indicator - Only show when video is playing and in view */}
                {isPlaying && isInView && (
                    <motion.div
                        className={styles.volumeIndicator}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className={styles.volumeBars}>
                            <div className={styles.volumeBar}></div>
                            <div className={styles.volumeBar}></div>
                            <div className={styles.volumeBar}></div>
                        </div>
                    </motion.div>
                )}


            </div>

            {/* Active Indicator */}
            {isActive && (
                <motion.div
                    className={styles.activeIndicator}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                />
            )}

            {/* Loading Overlay */}
            {isTransitioning && (
                <motion.div
                    className={styles.loadingOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className={styles.loadingSpinner} />
                </motion.div>
            )}
        </motion.div>
    );
};

export default VideoCard;
