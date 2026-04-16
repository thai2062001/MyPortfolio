import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSections() {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('section_type', 'faq');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sections:', JSON.stringify(data, null, 2));
  }
}

checkSections();
