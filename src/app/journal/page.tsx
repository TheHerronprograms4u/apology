'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import { Plus, Calendar, Smile, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import styles from './JournalList.module.css';

export default function JournalListPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'all' | 'published' | 'drafts'>('all');
  const supabase = createClient();

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('journal_date', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
      } else {
        setEntries(data || []);
      }
      setLoading(false);
    };

    fetchEntries();
  }, [supabase]);

  const filteredEntries = entries.filter(entry => {
    if (view === 'published') return !entry.is_draft;
    if (view === 'drafts') return entry.is_draft;
    return true;
  });

  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">My Journal</h1>
        <div className={styles.headerActions}>
          <div className={styles.filterTabs}>
            <button 
              className={view === 'all' ? styles.activeTab : ''} 
              onClick={() => setView('all')}
            >
              All
            </button>
            <button 
              className={view === 'published' ? styles.activeTab : ''} 
              onClick={() => setView('published')}
            >
              Published
            </button>
            <button 
              className={view === 'drafts' ? styles.activeTab : ''} 
              onClick={() => setView('drafts')}
            >
              Drafts
            </button>
          </div>
          <Link href="/journal/new" className={styles.addBtn}>
            <Plus size={20} /> New Entry
          </Link>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Opening your journal...</div>
      ) : (
        <div className={styles.grid}>
          {filteredEntries.map((entry, index) => (
            <Link href={`/journal/edit/${entry.id}`} key={entry.id} className={styles.entryLink}>
              <div className={styles.entryCard}>
                <WashiTape 
                  rotation={(index % 2 === 0 ? -5 : 5)} 
                  color={entry.is_draft ? 'var(--periwinkle)' : 'var(--baby-blue)'} 
                  className={styles.tape} 
                />
                <Polaroid rotation={(index % 2 === 0 ? -2 : 2)} className={styles.polaroid}>
                  <div className={styles.entryContent}>
                    {entry.is_draft && (
                      <div className={styles.draftBadge}>
                        <FileText size={12} /> Draft
                      </div>
                    )}
                    <h2 className="handwritten">{entry.title}</h2>
                    <div className={styles.meta}>
                      <Calendar size={14} /> <span>{entry.journal_date}</span>
                    </div>
                    <div className={styles.meta}>
                      <Smile size={14} /> <span>{entry.mood}</span>
                    </div>
                  </div>
                </Polaroid>
              </div>
            </Link>
          ))}
          {filteredEntries.length === 0 && (
            <div className={styles.emptyState}>
              <p>No entries found here. Start writing!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
