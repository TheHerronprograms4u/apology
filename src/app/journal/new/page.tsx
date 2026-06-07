'use client';

import React, { useState } from 'react';
import { Editor } from '@/components/Editor';
import { Polaroid } from '@/components/ui/Polaroid';
import { createClient } from '@/lib/supabase-client';
import { ImagePlus, Save, Calendar, Smile } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './JournalEntry.module.css';

const MOODS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Reflective', emoji: '🤔' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Excited', emoji: '✨' },
];

export default function NewJournalEntry() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [mood, setMood] = useState('Calm');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSave = async (isDraft = false) => {
    if (!title) {
      alert('Please give your entry a title!');
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to save entries.');
        router.push('/login');
        return;
      }

      const { error } = await supabase.from('entries').insert({
        title,
        content,
        mood,
        is_draft: isDraft,
        user_id: user.id,
        journal_date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      alert(isDraft ? 'Draft saved!' : 'Entry published!');
      if (!isDraft) router.push('/journal');
      
    } catch (error: any) {
      console.error('Error saving entry:', error);
      alert('Failed to save: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">New Entry</h1>
        <div className={styles.actions}>
          <button 
            onClick={() => handleSave(true)} 
            disabled={loading}
            className={styles.btnSecondary}
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(false)} 
            disabled={loading}
            className={styles.btnPrimary}
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <input 
            type="text" 
            placeholder="Give this memory a name..." 
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <Calendar size={18} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className={styles.metaItem}>
              <Smile size={18} />
              <select 
                value={mood} 
                onChange={(e) => setMood(e.target.value)}
                className={styles.moodSelect}
              >
                {MOODS.map(m => (
                  <option key={m.label} value={m.label}>{m.emoji} {m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Editor 
            content={content} 
            onChange={setContent} 
            placeholder="What's on your mind today?" 
          />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.photoDrop}>
            <h3 className="handwritten">Photo Gallery</h3>
            <div className={styles.dropZone}>
              <ImagePlus size={32} />
              <p>Coming Soon: Photo Uploads</p>
            </div>
            
            <div className={styles.photoGrid}>
              <Polaroid rotation={-2} className={styles.placeholderPolaroid}>
                <div className={styles.emptyPhoto}>No photos yet</div>
              </Polaroid>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
