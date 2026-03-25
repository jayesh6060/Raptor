import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'client/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndCleanup() {
  console.log('Checking database...');

  // Check announcements
  const { data: ann, error: annError } = await supabase
    .from('announcements')
    .select('*');
  
  if (annError) {
    console.error('Error fetching announcements:', annError);
  } else {
    console.log('Announcements:', ann);
    const lohit = ann.find(a => a.title.toLowerCase().includes('lohit') || a.content.toLowerCase().includes('lohit'));
    if (lohit) {
      console.log('Found lohit announcement, deleting...');
      const { error: delError } = await supabase
        .from('announcements')
        .delete()
        .eq('id', lohit.id);
      if (delError) console.error('Delete failed:', delError);
      else console.log('Deleted successfully.');
    }
  }

  // Check certificates table
  const { error: certError } = await supabase
    .from('certificates')
    .select('id')
    .limit(1);
  
  if (certError && certError.message.includes('relation "public.certificates" does not exist')) {
    console.warn('CERTIFICATES TABLE MISSING! User needs to run certificates_migration.sql.');
  } else if (!certError) {
    console.log('Certificates table exists.');
  } else {
    console.error('Other certificates error:', certError.message);
  }
}

checkAndCleanup();
