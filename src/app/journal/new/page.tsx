'use client';

import React, { useState } from 'react';
import { Editor } from '@/components/Editor';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import { ImagePlus, Save, Trash2, Calendar, Smile } from 'lucide-react';
import styles from './JournalEntry.module.css';

const MOODS = [
  { label: 'Happy', emoji: '😊', color: '#FFF4BD' },
  { label: 'Calm', emoji: '😌', color: '#DCEEFF' },
  { label: 'Reflective', emoji: '🤔', color: '#BFCBFF' },
  { label: 'Sad', emoji: '😢', color: '#C7E6FF' },
  { label: 'Excited', emoji: '✨', color: '#A8D8FF' },
];

export default function NewJournalEntry() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [mood, setMood] = useState('Calm');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSave = async () => {
    // Logic to save to Supabase
    console.log({ title, content, mood, photos });
    alert('Entry saved! (Sync with Supabase pending setup)');
  };

  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">New Entry</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>Save Draft</button>
          <button onClick={handleSave} className={styles.btnPrimary}>
            <Save size={18} /> Publish
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
              <p>Drag photos here</p>
            </div>
            
            <div className={styles.photoGrid}>
              {photos.length === 0 && (
                <Polaroid rotation={-2} className={styles.placeholderPolaroid}>
                  <div className={styles.emptyPhoto}>No photos yet</div>
                </Polaroid>
              )}
            </div>
          </div>

          <div className={styles.tagsArea}>
            <h3 className="handwritten">Tags & Collections</h3>
            <input type="text" placeholder="Add a tag..." className={styles.tagInput} />
          </div>
        </aside>
      </div>
    </div>
  );
}
