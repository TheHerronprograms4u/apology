'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import styles from './MusicPlayer.module.css';

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio('/Mundo.mp3');
    audio.loop = true;
    audioRef.current = audio;

    // Load user preferences from localStorage
    const savedPlayState = localStorage.getItem('music-playing') === 'true';
    const savedMutedState = localStorage.getItem('music-muted') === 'true';

    setIsMuted(savedMutedState);
    audio.muted = savedMutedState;

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
      // Remove listeners after first attempt
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    if (savedPlayState) {
      // If user had it playing before, try to play on interaction
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
    } else {
      // Otherwise, show tooltip to encourage them to play
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      audio.pause();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

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
            <span className={styles.title}>Mundo</span>
            <span className={styles.status}>{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
          <div className={styles.buttons}>
            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className={styles.ctrlBtn} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
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
