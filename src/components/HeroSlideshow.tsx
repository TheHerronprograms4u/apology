'use client';

import React, { useState, useEffect } from 'react';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import { AnimatePresence, motion } from 'framer-motion';
import styles from '@/app/Home.module.css';

export function HeroSlideshow({ images }: { images: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 8000); // Change image every 8 seconds
      return () => clearInterval(interval);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className={styles.illustrationArea}>
        <WashiTape rotation={-15} className={styles.heroTape} />
        <Polaroid rotation={5} caption="Starting today..." className={styles.heroPolaroid}>
          <div className={styles.notebookPlaceholder}>
            <span style={{ fontSize: '4rem' }}>📓</span>
          </div>
        </Polaroid>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className={styles.illustrationArea} style={{ position: 'relative', width: '280px', height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', width: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div style={{ position: 'absolute', top: '-15px', zIndex: 30 }}>
            <WashiTape rotation={-15} />
          </div>
          
          <div style={{ width: '100%' }}>
            <Polaroid rotation={5} caption={currentImage.file_name}>
              <img 
                src={currentImage.url} 
                alt={currentImage.file_name} 
                style={{ width: '100%', height: '226px', objectFit: 'cover', borderRadius: '4px' }} 
              />
            </Polaroid>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
