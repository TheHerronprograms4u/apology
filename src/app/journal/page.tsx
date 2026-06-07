'use client';

import React from 'react';
import Link from 'next/link';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import { Plus, Calendar, Smile } from 'lucide-react';
import styles from './JournalList.module.css';

const DUMMY_ENTRIES = [
  { id: '1', title: 'A New Journey', date: '2026-06-07', mood: 'Excited', rotation: -2 },
  { id: '2', title: 'Quiet Moments', date: '2026-06-06', mood: 'Calm', rotation: 3 },
];

export default function JournalListPage() {
  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">My Journal</h1>
        <Link href="/journal/new" className={styles.addBtn}>
          <Plus size={20} /> New Entry
        </Link>
      </header>

      <div className={styles.grid}>
        {DUMMY_ENTRIES.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id} className={styles.entryLink}>
            <div className={styles.entryCard}>
              <WashiTape rotation={entry.rotation * 2} className={styles.tape} />
              <Polaroid rotation={entry.rotation} className={styles.polaroid}>
                <div className={styles.entryContent}>
                  <h2 className="handwritten">{entry.title}</h2>
                  <div className={styles.meta}>
                    <Calendar size={14} /> <span>{entry.date}</span>
                  </div>
                  <div className={styles.meta}>
                    <Smile size={14} /> <span>{entry.mood}</span>
                  </div>
                </div>
              </Polaroid>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
