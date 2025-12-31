// src/components/Portfolio/FurnitureGallery.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaImage, FaTimes } from 'react-icons/fa';
import { furniturePhotos, furnitureVideos } from '../../data/portfolioData';
import styles from './PortfolioGallery.module.css';

const FurnitureGallery = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <div className={styles.gallery}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Portfolio</h1>
        <p>Elegant designs for modern living spaces</p>
      </motion.div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'photos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          <FaImage /> Photos ({furniturePhotos.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'videos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <FaPlay /> Videos ({furnitureVideos.length})
        </button>
      </div>

      <div className={styles.grid}>
        {activeTab === 'photos' && furniturePhotos.map((photo) => (
          <motion.div
            key={photo.id}
            className={styles.item}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: photo.id * 0.03 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedMedia(photo)}
          >
            <img src={photo.src} alt={photo.title} loading="lazy" />
            <div className={styles.overlay}>
              <FaImage />
              <span>{photo.title}</span>
            </div>
          </motion.div>
        ))}

        {activeTab === 'videos' && furnitureVideos.map((video) => (
          <motion.div
            key={video.id}
            className={styles.item}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: video.id * 0.05 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedMedia(video)}
          >
            <video src={video.src} muted preload="metadata" />
            <div className={styles.overlay}>
              <FaPlay />
              <span>{video.title}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedMedia && (
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedMedia(null)}
        >
          <button className={styles.closeBtn} onClick={() => setSelectedMedia(null)}>
            <FaTimes />
          </button>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {activeTab === 'photos' ? (
              <img src={selectedMedia.src} alt={selectedMedia.title} />
            ) : (
              <video src={selectedMedia.src} controls autoPlay />
            )}
            <h3>{selectedMedia.title}</h3>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FurnitureGallery;
