// src/components/VideoShowcase/AnimatedBackground.jsx
import { motion } from 'framer-motion';
import { FaPlay, FaVideo, FaFilm, FaCameraRetro } from 'react-icons/fa';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = () => {
    const icons = [FaPlay, FaVideo, FaFilm, FaCameraRetro];

    return (
        <div className={styles.background}>
            {/* Floating Icons */}
            <div className={styles.floatingIcons}>
                {[...Array(12)].map((_, i) => {
                    const Icon = icons[i % icons.length];
                    return (
                        <motion.div
                            key={i}
                            className={`${styles.floatingIcon} ${styles[`icon${i + 1}`]}`}
                            animate={{
                                y: [-20, 20, -20],
                                x: [-10, 10, -10],
                                rotate: [0, 180, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 5 + (i * 0.5),
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.3
                            }}
                        >
                            <Icon />
                        </motion.div>
                    );
                })}
            </div>

            {/* Animated Gradient Orbs */}
            <div className={styles.gradientOrbs}>
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`${styles.orb} ${styles[`orb${i + 1}`]}`}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 8 + (i * 0.8),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                        }}
                    />
                ))}
            </div>

            {/* Particle System */}
            <div className={styles.particles}>
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={styles.particle}
                        animate={{
                            y: [0, -1000],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                            ease: "easeOut"
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: '100%'
                        }}
                    />
                ))}
            </div>

            {/* Rotating Rings */}
            <div className={styles.rotatingRings}>
                <motion.div
                    className={`${styles.ring} ${styles.ring1}`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className={`${styles.ring} ${styles.ring2}`}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className={`${styles.ring} ${styles.ring3}`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
};

export default AnimatedBackground;
