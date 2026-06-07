'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Timeline.module.css';

const TIMELINE_ENTRIES = [
  { id: 1, date: 'June 7', title: 'A New Journey', mood: 'Excited', snippet: 'Today I started my quiet blue journal...' },
  { id: 2, date: 'June 6', title: 'Quiet Moments', mood: 'Calm', snippet: 'The rain outside matches my mood...' },
  { id: 3, date: 'June 5', title: 'Deep Thoughts', mood: 'Reflective', snippet: 'Thinking about the lessons learned this week...' },
  { id: 4, date: 'June 4', title: 'Small Wins', mood: 'Happy', snippet: 'I finally finished that project...' },
];

export default function TimelinePage() {
  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">Reflection Timeline</h1>
      </header>

      <div className={styles.timelineWrapper}>
        <div className={styles.line} />
        
        {TIMELINE_ENTRIES.map((entry, index) => (
          <motion.div 
            key={entry.id} 
            className={styles.entry}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={styles.dateBubble}>{entry.date}</div>
            <div className={styles.contentCard}>
              <h2 className="handwritten">{entry.title}</h2>
              <div className={styles.moodBadge}>{entry.mood}</div>
              <p>{entry.snippet}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
