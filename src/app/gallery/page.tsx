'use client';

import React from 'react';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import styles from './Gallery.module.css';

const DUMMY_MEMORIES = [
  { id: 1, caption: 'Sunset at the beach', rotation: -3, color: 'var(--powder-blue)' },
  { id: 2, caption: 'The first bloom', rotation: 2, color: 'var(--baby-blue)' },
  { id: 3, caption: 'Cozy reading nook', rotation: -5, color: 'var(--periwinkle)' },
  { id: 4, caption: 'Morning coffee', rotation: 4, color: 'var(--sky-blue)' },
  { id: 5, caption: 'A long walk', rotation: -2, color: 'var(--powder-blue)' },
  { id: 6, caption: 'New beginnings', rotation: 3, color: 'var(--baby-blue)' },
];

export default function GalleryPage() {
  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">Memory Gallery</h1>
        <p className={styles.subtitle}>A collection of moments captured in time.</p>
      </header>

      <div className={styles.masonry}>
        {DUMMY_MEMORIES.map((memory) => (
          <div key={memory.id} className={styles.galleryItem}>
            <WashiTape rotation={memory.rotation * 2} color={memory.color} className={styles.tape} />
            <Polaroid rotation={memory.rotation} caption={memory.caption} className={styles.polaroid}>
              <div className={styles.imagePlaceholder}>
                <span style={{ fontSize: '3rem' }}>📸</span>
              </div>
            </Polaroid>
          </div>
        ))}
      </div>
    </div>
  );
}
