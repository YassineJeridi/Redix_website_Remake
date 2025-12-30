// src/pages/Furniture.jsx
import { useEffect } from 'react';
import FurnitureGallery from '../components/Portfolio/FurnitureGallery';
import styles from './Portfolio.module.css';

const Furniture = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.portfolioPage}>
      <FurnitureGallery />
    </div>
  );
};

export default Furniture;
