'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import styles from './Timeline.module.css';

export default function TimelinePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('is_draft', false) // Usually we show published entries on the timeline
        .order('journal_date', { ascending: false });

      if (error) {
        console.error('Error fetching timeline:', error);
      } else {
        setEntries(data || []);
      }
      setLoading(false);
    };

    fetchEntries();
  }, [supabase]);

  if (loading) return <div className="scrapbook-container">Loading your journey...</div>;

  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">Reflection Timeline</h1>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Your journey, one day at a time.</p>
      </header>

      <div className={styles.timelineWrapper}>
        <div className={styles.line} />
        
        {entries.map((entry, index) => (
          <motion.div 
            key={entry.id} 
            className={styles.entry}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={styles.dateBubble}>
              {new Date(entry.journal_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
            <Link href={`/journal/edit/${entry.id}`} className={styles.entryLink}>
              <div className={styles.contentCard}>
                <h2 className="handwritten">{entry.title}</h2>
                <div className={styles.moodBadge}>{entry.mood}</div>
                <p className={styles.snippet}>
                  {/* Simplistic way to show content if it's text-based, or just a placeholder */}
                  Click to view and edit this reflection...
                </p>
              </div>
            </Link>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Your timeline is empty. Start your journey by writing a new entry!</p>
          </div>
        )}
      </div>
    </div>
  );
}
