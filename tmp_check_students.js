const { createClient } = require('@supabase/supabase-client');

const supabaseUrl = 'https://mtjlcatypgdayxppmgey.supabase.co';
const supabaseKey = 'sb_publishable_OW1BcVXwMPpbHV6r56Fcew_n2Gb3X5F';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStudents() {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, role')
    .eq('role', 'student')
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Students:', JSON.stringify(data, null, 2));
}

checkStudents();
