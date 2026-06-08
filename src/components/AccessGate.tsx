'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import styles from './AccessGate.module.css';

export function AccessGate() {
  const [showModal, setShowModal] = useState(false);
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
          // If they chose Trisha and try to access normal pages, redirect to Trisha experience
          // Unless they are already on /trisha
          router.push('/trisha');
        }
      }
    };

    checkAccess();
  }, [pathname, router, supabase.auth]);

  const handleSelect = (user: string) => {
    sessionStorage.setItem('access_user', user);
    setShowModal(false);
    if (user === 'trisha') {
      router.push('/trisha');
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
        </div>
      </div>
    </div>
  );
}
