const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSections() {
  const { data, error } = await supabase
    .from('page_sections')
    .select('id, section_key, page_type, is_published, section_type');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sections:', JSON.stringify(data, null, 2));
  }
}

checkSections();
