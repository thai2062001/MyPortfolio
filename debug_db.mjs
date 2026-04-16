import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: fonts, error: fError } = await supabase.from('fonts').select('*');
    const { data: settings, error: sError } = await supabase.from('site_settings').select('*').single();
    
    console.log("FONTS IN DB:", JSON.stringify(fonts, null, 2));
    console.log("SETTINGS IN DB:", JSON.stringify(settings, null, 2));
}

check();
