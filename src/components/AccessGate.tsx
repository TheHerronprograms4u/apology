'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import styles from './AccessGate.module.css';

export function AccessGate() {
  const [showModal, setShowModal] = useState(false);
  const [challengeStep, setChallengeStep] = useState(0); // 0: select, 1: question, 2: failed
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [challengeError, setChallengeError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAccess = async () => {
      // Don't show on login page
      if (pathname === '/login') return;

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const accessUser = sessionStorage.getItem('access_user');
        if (!accessUser) {
          setShowModal(true);
        } else if (accessUser === 'trisha' && !pathname.startsWith('/trisha') && !pathname.startsWith('/login')) {
          router.push('/trisha');
        }
      }
    };

    checkAccess();
  }, [pathname, router, supabase.auth]);

  const handleSelect = (user: string) => {
    if (user === 'trisha') {
      setChallengeStep(1);
    } else {
      sessionStorage.setItem('access_user', user);
      setShowModal(false);
    }
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (challengeAnswer.trim() === '10/22/25') {
      sessionStorage.setItem('access_user', 'trisha');
      setShowModal(false);
      router.push('/trisha');
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setChallengeStep(2);
        setTimeout(async () => {
          await supabase.auth.signOut();
          window.location.href = '/login';
        }, 4000);
      } else {
        setChallengeAnswer('');
        setChallengeError(`Oops! Try again! (${3 - nextAttempts} attempts left) 🥺`);
      }
    }
  };

  if (!showModal) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.particles}>
          {/* Simple CSS particles */}
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`${styles.particle} ${styles[`particle${i}`]}`} />
          ))}
        </div>
        
        <div className={styles.content}>
          {challengeStep === 0 && (
            <>
              <h2 className={styles.heading}>Welcome Back</h2>
              <p className={styles.subheading}>Who's accessing the Journal?</p>
              
              <div className={styles.buttonGroup}>
                <button 
                  className={`${styles.selectBtn} ${styles.harronBtn}`}
                  onClick={() => handleSelect('harron')}
                >
                  <span className={styles.btnText}>Harron</span>
                </button>
                <button 
                  className={`${styles.selectBtn} ${styles.trishaBtn}`}
                  onClick={() => handleSelect('trisha')}
                >
                  <span className={styles.btnText}>Trisha</span>
                  <span className={styles.sparkle}>✨</span>
                </button>
              </div>
            </>
          )}

          {challengeStep === 1 && (
            <form onSubmit={handleChallengeSubmit} className={styles.challengeForm}>
              <h2 className={styles.heading}>Just to be sure...</h2>
              <p className={styles.subheading} style={{ marginBottom: '1.5rem' }}>When is our monthsary?</p>
              
              <input 
                type="text" 
                className={styles.challengeInput}
                value={challengeAnswer}
                onChange={(e) => setChallengeAnswer(e.target.value)}
                placeholder="MM/DD/YY"
                autoFocus
              />
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                * Please separate the numbers using "/"
              </p>
              
              {challengeError && <p className={styles.errorText}>{challengeError}</p>}
              
              <button type="submit" className={`${styles.selectBtn} ${styles.trishaBtn}`} style={{ marginTop: '1.5rem' }}>
                Verify
              </button>
            </form>
          )}

          {challengeStep === 2 && (
            <div className={styles.failedChallenge}>
              <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'shake 0.5s infinite' }}>😡</div>
              <h2 className={styles.heading} style={{ color: '#ef4444' }}>You're not Trisha or Harron!!</h2>
              <p className={styles.subheading}>Logging you out...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
