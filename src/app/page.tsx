import Link from 'next/link';
import { Calendar, Smile, ArrowRight } from 'lucide-react';
import { FloatingStars } from '@/components/ui/FloatingStars';
import { Polaroid } from '@/components/ui/Polaroid';
import { WashiTape } from '@/components/ui/WashiTape';
import { createClient } from '@/lib/supabase-server';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import styles from './Home.module.css';

export default async function Home() {
  const supabase = await createClient();

  // Fetch the 3 most recent published entries
  const { data: recentEntries } = await supabase
    .from('entries')
    .select('id, title, journal_date, mood, is_draft')
    .eq('is_draft', false)
    .order('journal_date', { ascending: false })
    .limit(3);

  // Fetch all entries from the past 7 days for mood tracking
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data: weekEntries } = await supabase
    .from('entries')
    .select('mood, journal_date')
    .eq('is_draft', false)
    .gte('journal_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('journal_date', { ascending: false });

  const entries = recentEntries || [];
  const moods = weekEntries || [];

  // Fetch images for slideshow
  const { data: attachmentsData } = await supabase
    .from('attachments')
    .select('url, file_name')
    .order('created_at', { ascending: false });
    
  const images = attachmentsData || [];

  // Count mood occurrences for the week
  const moodCounts: Record<string, number> = {};
  moods.forEach((entry) => {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    }
  });
  const moodList = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  return (
    <main className={styles.main}>
      <FloatingStars />
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Reflection Week</h1>
          <p className={styles.subtitle}>&quot;One day at a time.&quot;</p>
          
          <div className={styles.ctaContainer}>
            <Link href="/journal" className={styles.btn}>
              Open Journal
            </Link>
            <Link href="/gallery" className={styles.btnSecondary}>
              Memories
            </Link>
          </div>
        </div>

        <HeroSlideshow images={images} />
      </section>

      <div className="cloud-divider" />

      <section className="scrapbook-container">
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className="handwritten">Recent Thoughts</h2>
            {entries.length > 0 ? (
              <div className={styles.recentEntries}>
                {entries.map((entry) => (
                  <Link
                    href={`/journal/edit/${entry.id}`}
                    key={entry.id}
                    className={styles.recentEntry}
                  >
                    <h3 className={styles.entryTitle}>{entry.title}</h3>
                    <div className={styles.entryMeta}>
                      <span className={styles.entryMetaItem}>
                        <Calendar size={13} />
                        {entry.journal_date}
                      </span>
                      {entry.mood && (
                        <span className={styles.entryMetaItem}>
                          <Smile size={13} />
                          {entry.mood}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                <Link href="/journal" className={styles.viewAllLink}>
                  View all entries <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <p className={styles.emptyHint}>
                No reflections yet. <Link href="/journal/new">Start writing</Link> your first entry!
              </p>
            )}
          </div>
          <div className={styles.card}>
            <h2 className="handwritten">Mood of the Week</h2>
            {moodList.length > 0 ? (
              <div className={styles.moodList}>
                {moodList.map(([mood, count]) => (
                  <div key={mood} className={styles.moodRow}>
                    <span className={styles.moodLabel}>{mood}</span>
                    <div className={styles.moodBar}>
                      <div
                        className={styles.moodBarFill}
                        style={{ width: `${Math.min((count / moods.length) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={styles.moodCount}>{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyHint}>
                Tracking your journey through colors.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
