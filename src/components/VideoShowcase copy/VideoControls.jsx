// src/components/VideoShowcase/VideoControls.jsx
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './VideoControls.module.css';

const VideoControls = ({ onPrev, onNext, currentIndex, totalVideos, disabled }) => {
    return (
        <div className={styles.controls}>
            <motion.button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={onPrev}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.1, x: -5 } : {}}
                whileTap={!disabled ? { scale: 0.9 } : {}}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <FiChevronLeft />
                <span className={styles.buttonText}>Previous</span>
            </motion.button>

            <motion.button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={onNext}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.1, x: 5 } : {}}
                whileTap={!disabled ? { scale: 0.9 } : {}}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <span className={styles.buttonText}>Next</span>
                <FiChevronRight />
            </motion.button>

            {/* Progress Indicator */}
           
        </div>
    );
};

export default VideoControls;
