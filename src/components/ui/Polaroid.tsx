'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Polaroid.module.css';
import { clsx } from 'clsx';

interface PolaroidProps {
  children: React.ReactNode;
  caption?: string;
  rotation?: number;
  className?: string;
}

export const Polaroid: React.FC<PolaroidProps> = ({ 
  children, 
  caption, 
  rotation = 0,
  className 
}) => {
  return (
    <motion.div 
      className={clsx(styles.container, className)}
      initial={{ rotate: rotation }}
      whileHover={{ scale: 1.05, rotate: rotation + 2, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className={styles.imageArea}>
        {children}
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </motion.div>
  );
};
