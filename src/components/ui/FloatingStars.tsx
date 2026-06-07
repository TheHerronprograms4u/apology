'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const FloatingStars = () => {
  const stars = Array.from({ length: 15 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {stars.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0, 
            y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, '-=100'],
            opacity: [0, 0.8, 0],
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          style={{ position: 'absolute' }}
        >
          <Star size={Math.random() * 20 + 10} fill="var(--sky-blue)" color="transparent" />
        </motion.div>
      ))}
    </div>
  );
};
