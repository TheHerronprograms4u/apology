'use client';

import React, { useState, useRef } from 'react';
import { Editor } from '@/components/Editor';
import { Polaroid } from '@/components/ui/Polaroid';
import { createClient } from '@/lib/supabase-client';
import { ImagePlus, Save, Calendar, Smile, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();
  const router = useRouter();

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

        const { data } = supabase.storage
          .from('journal-assets')
          .getPublicUrl(filePath);

        let publicUrl = data.publicUrl;
        
        // Safety check: ensure /public/ is present in the URL for public access
        if (!publicUrl.includes('/public/')) {
          publicUrl = publicUrl.replace('/object/journal-assets/', '/object/public/journal-assets/');
        }

        setPhotos(prev => [...prev, { url: publicUrl, name: file.name }]);
      }
    } catch (error: any) {
      console.error('Error uploading:', error);
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

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to save entries.');
        router.push('/login?redirectTo=/journal/new');
        return;
      }

      // 1. Insert Entry
      const { data: entry, error: entryError } = await supabase
        .from('entries')
        .insert({
          title,
          content,
          mood,
          is_draft: isDraft,
          user_id: user.id,
          journal_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // 2. Insert Attachments if any
      if (photos.length > 0) {
        const attachmentData = photos.map(photo => ({
          entry_id: entry.id,
          url: photo.url,
          file_name: photo.name,
          file_type: 'image'
        }));

        const { error: attachError } = await supabase
          .from('attachments')
          .insert(attachmentData);

        if (attachError) throw attachError;
      }

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
      <header className="sb-header">
        <h1 className="handwritten">New Entry</h1>
        <div className="sb-actions">
          <button 
            onClick={() => handleSave(true)} 
            disabled={loading || uploading}
            className="sb-btn-secondary"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(false)} 
            disabled={loading || uploading}
            className="sb-btn-primary"
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </header>

      <div className="sb-layout">
        <div className="sb-main-column">
          <input 
            type="text" 
            placeholder="Give this memory a name..." 
            className="sb-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="sb-meta-row">
            <div className="sb-meta-item">
              <Calendar size={18} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="sb-meta-item">
              <Smile size={18} />
              <select 
                value={mood} 
                onChange={(e) => setMood(e.target.value)}
                className="sb-mood-select"
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

        <aside className="sb-sidebar">
          <div className="sb-photo-drop">
            <h3 className="handwritten">Photo Gallery</h3>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <div 
              className="sb-dropzone" 
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2 className="animate-spin" size={32} /> : <ImagePlus size={32} />}
              <p>{uploading ? 'Uploading...' : 'Click to add photos'}</p>
            </div>
            
            <div className="sb-photo-grid">
              {photos.map((photo, index) => (
                <div key={index} className="sb-photo-wrapper">
                  <button className="sb-remove-btn" onClick={() => removePhoto(index)}>
                    <X size={14} />
                  </button>
                  <Polaroid rotation={index % 2 === 0 ? -2 : 2} className="sb-sidebar-polaroid">
                    <img src={photo.url} alt="Uploaded" className="sb-preview-image" />
                  </Polaroid>
                </div>
              ))}
              {photos.length === 0 && !uploading && (
                <Polaroid rotation={-2} className="sb-placeholder-polaroid">
                  <div className="sb-empty-photo">No photos yet</div>
                </Polaroid>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
