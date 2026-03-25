import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mtjlcatypgdayxppmgey.supabase.co';
const supabaseKey = 'sb_publishable_OW1BcVXwMPpbHV6r56Fcew_n2Gb3X5F';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log('--- Checking Certificates Table ---');
  const { data: certs, error: certsError } = await supabase.from('certificates').select('*').limit(1);
  if (certsError) {
    console.error('Certificates Table Error:', certsError.message);
  } else {
    console.log('Certificates Table found! Record count:', certs.length);
  }

  console.log('--- Checking Storage Buckets ---');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
     console.error('Storage List Buckets Error:', bucketsError.message);
  } else {
     const certsBucket = buckets.find(b => b.name === 'certificates');
     console.log('Buckets list:', buckets.map(b => b.name));
     if (certsBucket) console.log('✅ Certificates bucket EXISTS in storage.');
     else console.error('❌ Certificates bucket MISSING in storage.');
  }
}

debug();
