import Link from 'next/link';
import { FloatingStars } from '@/components/ui/FloatingStars';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import styles from './Home.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <FloatingStars />
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Reflection Week</h1>
          <p className={styles.subtitle}>"One day at a time."</p>
          
          <div className={styles.ctaContainer}>
            <Link href="/journal" className={styles.btn}>
              Open Journal
            </Link>
            <Link href="/gallery" className={styles.btnSecondary}>
              Memories
            </Link>
          </div>
        </div>

        <div className={styles.illustrationArea}>
          <WashiTape rotation={-15} className={styles.heroTape} />
          <Polaroid rotation={5} caption="Starting today..." className={styles.heroPolaroid}>
            <div className={styles.notebookPlaceholder}>
              {/* This would be an illustration or an icon */}
              <span style={{ fontSize: '4rem' }}>📓</span>
            </div>
          </Polaroid>
        </div>
      </section>

      <div className="cloud-divider" />

      <section className="scrapbook-container">
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className="handwritten">Recent Thoughts</h2>
            <p>Your latest reflections will appear here...</p>
          </div>
          <div className={styles.card}>
            <h2 className="handwritten">Mood of the Week</h2>
            <p>Tracking your journey through colors.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
