import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

function loadEnv() {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
        const match = line.match(/^\s*([^#\s=]+)\s*=\s*(.*)$/);
        if (match) {
            const key = match[1];
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            process.env[key] = value;
        }
    }
}

if (fs.existsSync(envPath)) {
    loadEnv();
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking expertise_tool_items table...");
    const { data: tools, error: tError } = await supabase.from('expertise_tool_items').select('*').limit(1);
    
    if (tError) {
        console.error("Error fetching expertise_tool_items:", tError.message);
    } else if (tools && tools.length > 0) {
        console.log("Columns in expertise_tool_items:", Object.keys(tools[0]));
        const hasVi = Object.keys(tools[0]).some(k => k.endsWith('_vi'));
        console.log("Has _vi columns?", hasVi);
    } else {
        console.log("expertise_tool_items is empty or error. Status:", tools);
    }

    console.log("\nChecking projects table...");
    const { data: projects, error: pError } = await supabase.from('projects').select('*').limit(1);
    if (pError) {
        console.error("Error fetching projects:", pError.message);
    } else if (projects && projects.length > 0) {
        console.log("Columns in projects:", Object.keys(projects[0]));
        const hasVi = Object.keys(projects[0]).some(k => k.endsWith('_vi'));
        console.log("Has _vi columns?", hasVi);
    }
}

checkSchema();
