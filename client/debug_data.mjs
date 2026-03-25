import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mtjlcatypgdayxppmgey.supabase.co';
const supabaseKey = 'sb_publishable_OW1BcVXwMPpbHV6r56Fcew_n2Gb3X5F';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log('--- Fetching Notes (Minimal columns) ---');
  const { data: notes, error: notesError } = await supabase.from('notes').select('*').limit(1);
  if (notesError) {
    console.error('Notes Error with *:', notesError.message);
    // Try even more minimal
    const { data: notesMin, error: notesMinError } = await supabase.from('notes').select('id, title').limit(1);
    if (notesMinError) console.error('Notes Error even with minimal:', notesMinError.message);
    else console.log('Notes (id, title) exists, first record:', notesMin);
  }
  else console.log('Notes columns:', Object.keys(notes[0] || { 'empty': true }));
}

debug();
