'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Image, Calendar, User, Home } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/journal/new', icon: Book, label: 'Write' },
    { href: '/gallery', icon: Image, label: 'Memories' },
    { href: '/timeline', icon: Calendar, label: 'Timeline' },
  ];

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
          <Link href="/login" className={styles.loginBtn}>
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};
