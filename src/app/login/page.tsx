'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="scrapbook-container">
      <div className={styles.loginCard}>
        <h1 className="handwritten">Owner Login</h1>
        <p className={styles.subtitle}>Welcome back to your sanctuary.</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Your secret password"
              required 
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? 'Entering...' : 'Unlock Journal'}
          </button>
        </form>
      </div>
    </div>
  );
}
