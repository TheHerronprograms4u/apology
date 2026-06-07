'use strict';

import React from 'react';
import styles from './WashiTape.module.css';
import { clsx } from 'clsx';

interface WashiTapeProps {
  color?: string;
  rotation?: number;
  className?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({ 
  color = 'var(--periwinkle)', 
  rotation = -3,
  className 
}) => {
  return (
    <div 
      className={clsx(styles.tape, className)} 
      style={{ 
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`
      } as React.CSSProperties}
    />
  );
};
