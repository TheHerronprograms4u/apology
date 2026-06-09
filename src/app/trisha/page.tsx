import { createClient } from '@/lib/supabase-server';
import { TrishaClient } from './TrishaClient';
import { cookies } from 'next/headers';

export default async function TrishaPage() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const accessUser = cookieStore.get('access_user')?.value;

  const { data: { user } } = await supabase.auth.getUser();

  let entriesQuery = supabase
    .from('entries')
    .select('id, title, content, journal_date, mood, is_draft')
    .eq('is_draft', false)
    .order('journal_date', { ascending: true });

  if (user) {
    const isTrishaLoggedIn = user.email === 'moncadatrisha600@gmail.com';
    
    if (accessUser === 'harron') {
      if (isTrishaLoggedIn) {
        // Trisha selecting "Harron" button -> Her own scrapbook (Name swap)
        entriesQuery = entriesQuery.eq('user_id', user.id);
      } else {
        // Harron selecting "Harron" button -> His own scrapbook (Original behavior)
        entriesQuery = entriesQuery.or(`user_id.eq.${user.id},user_id.is.null`);
      }
    } else {
      // accessUser === 'trisha'
      if (isTrishaLoggedIn) {
        // Trisha seeing her own entries
        entriesQuery = entriesQuery.eq('user_id', user.id);
      } else {
        // Harron seeing Trisha's scrapbook
        entriesQuery = entriesQuery.neq('user_id', user.id).not('user_id', 'is', null);
      }
    }
  }

  // Fetch all journal entries, ordered chronologically
  const { data: entries } = await entriesQuery;

  // Fetch all photos/attachments
  const { data: attachments } = await supabase
    .from('attachments')
    .select(`
      id,
      url,
      file_name,
      entry_id,
      entries (
        title,
        journal_date,
        user_id
      )
    `)
    .order('created_at', { ascending: true });

  // Filter attachments based on the same logic if needed, 
  // though they are typically tied to entries.
  const memories = (attachments || []).filter((att: any) => {
    if (!att.entries) return false;
    const entryUserId = att.entries.user_id;
    
    if (accessUser === 'harron') {
      return entryUserId === null || (user && entryUserId !== (user.email === 'moncadatrisha600@gmail.com' ? user.id : ''));
    } else {
      return entryUserId !== null && (user && entryUserId === (user.email === 'moncadatrisha600@gmail.com' ? user.id : ''));
    }
  });

  // Actually, the memory filtering above is slightly wrong because 'Harron' can see his own memories too.
  // Let's simplify: only show memories belonging to the entries we fetched.
  const validEntryIds = new Set((entries || []).map(e => e.id));
  const filteredMemories = (attachments || []).filter((att: any) => validEntryIds.has(att.entry_id));

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <TrishaClient entries={entries || []} memories={filteredMemories} />
    </main>
  );
}
