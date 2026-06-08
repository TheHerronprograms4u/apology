'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Music, SkipForward } from 'lucide-react';
import styles from './MusicPlayer.module.css';

const PLAYLIST = [
  { title: 'Mundo', url: '/Mundo.mp3' },
  { title: 'Waltz of Four Left Feet', url: '/Waltz of Four Left Feet.mp3' }
];

export const MusicPlayer = () => {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Initialize audio on mount
  useEffect(() => {
    const savedTrackIndex = parseInt(localStorage.getItem('music-track-index') || '0', 10);
    const validTrackIndex = savedTrackIndex >= 0 && savedTrackIndex < PLAYLIST.length ? savedTrackIndex : 0;
    setCurrentTrackIndex(validTrackIndex);

    const audio = new Audio(PLAYLIST[validTrackIndex].url);
    audio.loop = false; // We want to advance to the next track when it ends
    audioRef.current = audio;

    const savedPlayState = localStorage.getItem('music-playing') === 'true';
    const savedMutedState = localStorage.getItem('music-muted') === 'true';

    setIsMuted(savedMutedState);
    audio.muted = savedMutedState;

    // Handle track ending
    const handleTrackEnd = () => {
      handleNext();
    };

    audio.addEventListener('ended', handleTrackEnd);

    // Try to auto-play if saved play state is true, or on first interaction
    const handleFirstInteraction = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setShowTooltip(false);
        } catch (err) {
          console.log('Autoplay blocked by browser. User interaction required.');
        }
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    if (savedPlayState) {
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
    } else {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleTrackEnd);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    const currentSrc = PLAYLIST[currentTrackIndex].url;
    // Decode URLs to safely compare pathnames even with spaces/percent encoding
    const audioUrl = decodeURIComponent(new URL(audioRef.current.src, window.location.href).pathname);
    const targetUrl = decodeURIComponent(new URL(currentSrc, window.location.href).pathname);

    if (audioUrl !== targetUrl) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentSrc;
      localStorage.setItem('music-track-index', String(currentTrackIndex));
      
      if (wasPlaying) {
        audioRef.current.play()
          .catch(err => console.error('Error auto-playing changed track:', err));
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('music-playing', 'false');
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowTooltip(false);
          localStorage.setItem('music-playing', 'true');
        })
        .catch(err => {
          console.error('Failed to play audio:', err);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('music-muted', String(nextMuted));
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % PLAYLIST.length);
  };

  if (pathname?.startsWith('/trisha')) return null;

  return (
    <div className={`${styles.playerWrapper} ${isExpanded ? styles.expanded : ''}`}>
      {showTooltip && !isPlaying && (
        <div className={styles.tooltip} onClick={togglePlay}>
          <span>🎵 Tap for cozy music</span>
        </div>
      )}
      
      <div 
        className={`${styles.playerCard} ${isPlaying ? styles.spinning : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.iconContainer}>
          <Music size={20} className={isPlaying ? styles.pulseIcon : ''} />
        </div>
      </div>

      {isExpanded && (
        <div className={styles.controlsPanel}>
          <div className={styles.songInfo}>
            <span className={styles.title}>{PLAYLIST[currentTrackIndex].title}</span>
            <span className={styles.status}>{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
          <div className={styles.buttons}>
            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className={styles.ctrlBtn} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className={styles.ctrlBtn} title="Next Track">
              <SkipForward size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className={styles.ctrlBtn} title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
