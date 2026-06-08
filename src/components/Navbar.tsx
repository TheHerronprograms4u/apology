'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Book, Image, Calendar, User, Home, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/journal/new', icon: Book, label: 'Write' },
    { href: '/journal', icon: Book, label: 'Journal' },
    { href: '/gallery', icon: Image, label: 'Memories' },
    { href: '/timeline', icon: Calendar, label: 'Timeline' },
  ];

  if (pathname?.startsWith('/trisha')) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          The Quiet Blue
        </Link>
        
        <div className={styles.links}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(styles.link, pathname === item.href && styles.active)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className={styles.auth}>
          {user ? (
            <button onClick={handleSignOut} className={styles.loginBtn} title="Sign Out">
              <LogOut size={20} />
            </button>
          ) : (
            <Link href="/login" className={styles.loginBtn} title="Sign In">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
