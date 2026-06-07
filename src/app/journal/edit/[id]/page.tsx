'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@/components/Editor';
import { Polaroid } from '@/components/ui/Polaroid';
import { createClient } from '@/lib/supabase-client';
import { ImagePlus, Save, Calendar, Smile, X, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../new/JournalEntry.module.css';

const MOODS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Reflective', emoji: '🤔' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Excited', emoji: '✨' },
];

export default function EditJournalEntry() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [mood, setMood] = useState('Calm');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const { data: entry, error } = await supabase
        .from('entries')
        .select('*, attachments(*)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching entry:', error);
        alert('Could not find this entry.');
        router.push('/journal');
        return;
      }

      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setPhotos(entry.attachments?.map((a: any) => ({ url: a.url, name: a.file_name })) || []);
      setLoading(false);
    };

    if (id) fetchEntry();
  }, [id, supabase, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('journal-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('journal-assets')
          .getPublicUrl(filePath);

        setPhotos(prev => [...prev, { url: publicUrl, name: file.name }]);
      }
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (isDraft = false) => {
    if (!title) {
      alert('Please give your entry a title!');
      return;
    }

    setSaving(true);
    try {
      // 1. Update Entry
      const { error: entryError } = await supabase
        .from('entries')
        .update({
          title,
          content,
          mood,
          is_draft: isDraft,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (entryError) throw entryError;

      // 2. Refresh Attachments (Delete old ones and add new ones for simplicity in this version)
      await supabase.from('attachments').delete().eq('entry_id', id);
      
      if (photos.length > 0) {
        const attachmentData = photos.map(photo => ({
          entry_id: id,
          url: photo.url,
          file_name: photo.name,
          file_type: 'image'
        }));
        await supabase.from('attachments').insert(attachmentData);
      }

      alert('Changes saved!');
      if (!isDraft) router.push('/journal');
      router.refresh();
    } catch (error: any) {
      alert('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry forever?')) return;

    try {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (error) throw error;
      router.push('/journal');
      router.refresh();
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  if (loading) return <div className="scrapbook-container">Loading your reflection...</div>;

  return (
    <div className="scrapbook-container">
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/journal" className={styles.backBtn}><ArrowLeft size={20} /></Link>
          <h1 className="handwritten">Edit Reflection</h1>
        </div>
        <div className={styles.actions}>
          <button onClick={handleDelete} className={styles.btnDanger}><Trash2 size={18} /></button>
          <button 
            onClick={() => handleSave(true)} 
            disabled={saving || uploading}
            className={styles.btnSecondary}
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave(false)} 
            disabled={saving || uploading}
            className={styles.btnPrimary}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <input 
            type="text" 
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <Calendar size={18} />
              <span>Editing Entry</span>
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
          />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.photoDrop}>
            <h3 className="handwritten">Photo Gallery</h3>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <div className={styles.dropZone} onClick={() => fileInputRef.current?.click()}>
              {uploading ? <Loader2 className="animate-spin" size={32} /> : <ImagePlus size={32} />}
              <p>Add more photos</p>
            </div>
            
            <div className={styles.photoGrid}>
              {photos.map((photo, index) => (
                <div key={index} className={styles.photoWrapper}>
                  <button className={styles.removeBtn} onClick={() => removePhoto(index)}>
                    <X size={14} />
                  </button>
                  <Polaroid rotation={index % 2 === 0 ? -2 : 2} className={styles.sidebarPolaroid}>
                    <img src={photo.url} alt="Uploaded" className={styles.previewImage} />
                  </Polaroid>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
