'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronDown, Music } from 'lucide-react';
import styles from './Trisha.module.css';

const PLAYLIST = [
  { title: 'Waltz of Four Left Feet', url: '/Waltz of Four Left Feet.mp3' },
  { title: 'Mundo', url: '/Mundo.mp3' }
];

export function TrishaClient({ entries, memories }: { entries: any[], memories: any[] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Chunk entries into 4 chapters (since 5th is Reflection)
  const chunkSize = Math.ceil(entries.length / 4) || 1;
  const chapters = [
    { title: 'Chapter 1: The Beginning', items: entries.slice(0, chunkSize) },
    { title: 'Chapter 2: Special Moments', items: entries.slice(chunkSize, chunkSize * 2) },
    { title: 'Chapter 3: Growth and Memories', items: entries.slice(chunkSize * 2, chunkSize * 3) },
    { title: 'Chapter 4: Important Milestones', items: entries.slice(chunkSize * 3, chunkSize * 4) }
  ];

  useEffect(() => {
    // Auto-play music on mount
    const audio = new Audio(PLAYLIST[0].url);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log('Autoplay blocked. User interaction required.');
      }
    };
    
    playAudio();

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Particles */}
      <div className={styles.particles}>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [0.2, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Floating Music Player */}
      <div className={styles.musicPlayer}>
        <Music size={18} color="#ff9a9e" />
        <button onClick={togglePlay} className={styles.musicBtn}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        {isMuted || volume === 0 ? <VolumeX size={16} color="#ff9a9e" /> : <Volume2 size={16} color="#ff9a9e" />}
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={handleVolume}
          className={styles.volumeSlider}
          style={{ width: '60px' }}
        />
        <input 
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress || 0}
          onChange={handleProgress}
          className={styles.volumeSlider}
          style={{ width: '100px' }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.h1 
          className={styles.heroTitle}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Our Story
        </motion.h1>
        <motion.p 
          className={styles.heroSubtitle}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          A digital scrapbook of memories, thoughts, and love.
        </motion.p>
        
        <motion.div 
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.section>

      {/* Chapters (Journal Journey & Timeline) */}
      {chapters.map((chapter, chapterIndex) => (
        chapter.items.length > 0 && (
          <section key={chapterIndex} className={styles.chapter}>
            <motion.h2 
              className={styles.chapterTitle}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {chapter.title}
            </motion.h2>

            <div className={styles.timeline}>
              {chapter.items.map((entry: any, index: number) => (
                <motion.div 
                  key={entry.id} 
                  className={styles.timelineItem}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDot} />
                    <div className={styles.entryDate}>{new Date(entry.journal_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <h3 className={styles.entryTitle}>{entry.title}</h3>
                    <div 
                      className={styles.entryContent}
                      dangerouslySetInnerHTML={{ __html: entry.content || '' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )
      ))}

      {/* Photo Gallery Section */}
      {memories.length > 0 && (
        <section className={styles.chapter}>
          <motion.h2 
            className={styles.chapterTitle}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Captured Moments
          </motion.h2>
          
          <div className={styles.gallery}>
            {memories.map((memory: any, index: number) => {
              const rotation = (index % 2 === 0 ? 1 : -1) * (Math.random() * 5 + 2);
              return (
                <motion.div 
                  key={memory.id}
                  className={styles.polaroidWrapper}
                  initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.2 }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                >
                  <img src={memory.url} alt={memory.file_name} className={styles.polaroidImg} />
                  <p className={styles.polaroidCaption}>{memory.entries?.title || memory.file_name}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Chapter 5: Reflection (Cinematic Ending) */}
      <section className={styles.cinematicEnding}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <h2 className={styles.chapterTitle} style={{ borderBottom: 'none' }}>Chapter 5: Reflection</h2>
          <p className={styles.endingQuote}>
            "Every memory we create is a piece of art in the scrapbook of our lives. 
            Thank you for being the most beautiful chapter."
          </p>
          <p className={styles.endingMessage}>With love, always.</p>
        </motion.div>
      </section>

    </div>
  );
}
