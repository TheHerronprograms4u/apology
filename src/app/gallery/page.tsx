'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import { createClient } from '@/lib/supabase-client';
import styles from './Gallery.module.css';

export default function GalleryPage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMemories = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const accessUser = sessionStorage.getItem('access_user');

      let query = supabase
        .from('attachments')
        .select(`
          id,
          url,
          file_name,
          entry_id,
          entries!inner (
            title,
            journal_date,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (user && user.email === 'moncadatrisha600@gmail.com') {
        if (accessUser === 'harron') {
          query = query.neq('entries.user_id', user.id);
        } else {
          query = query.eq('entries.user_id', user.id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching memories:', error);
      } else {
        setMemories(data || []);
      }
      setLoading(false);
    };

    fetchMemories();
  }, [supabase]);

  if (loading) return <div className="scrapbook-container">Opening your photo album...</div>;

  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <h1 className="handwritten">Memory Gallery</h1>
        <p className={styles.subtitle}>A collection of moments captured in time.</p>
      </header>

      <div className={styles.masonry}>
        {memories.map((memory, index) => {
          const rotation = (index % 3 === 0 ? -3 : index % 3 === 1 ? 2 : 4);
          const tapeColor = (index % 2 === 0 ? 'var(--baby-blue)' : 'var(--periwinkle)');
          
          return (
            <Link 
              href={`/journal/edit/${memory.entry_id}`} 
              key={memory.id} 
              className={styles.galleryItemLink}
            >
              <div className={styles.galleryItem}>
                <WashiTape rotation={rotation * 2} color={tapeColor} className={styles.tape} />
                <Polaroid 
                  rotation={rotation} 
                  caption={memory.entries?.title || memory.file_name} 
                  className={styles.polaroid}
                >
                  <img 
                    src={memory.url} 
                    alt={memory.file_name} 
                    className={styles.image} 
                  />
                </Polaroid>
              </div>
            </Link>
          );
        })}
      </div>

      {memories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Your gallery is empty. Upload some photos in a new journal entry!</p>
          <Link href="/journal/new" className="sb-btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Write a Memory
          </Link>
        </div>
      )}
    </div>
  );
}
