import { createClient } from '@/lib/supabase-server';
import { TrishaClient } from './TrishaClient';

export default async function TrishaPage() {
  const supabase = await createClient();

  // Fetch all journal entries, ordered chronologically
  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, content, journal_date, mood, is_draft')
    .eq('is_draft', false)
    .order('journal_date', { ascending: true });

  // Fetch all photos/attachments
  const { data: memories } = await supabase
    .from('attachments')
    .select(`
      id,
      url,
      file_name,
      entry_id,
      entries (
        title,
        journal_date
      )
    `)
    .order('created_at', { ascending: true });

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <TrishaClient entries={entries || []} memories={memories || []} />
    </main>
  );
}
