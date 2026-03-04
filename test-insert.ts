import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    const { data, error } = await supabase.from("members").insert([
        {
            full_name: "Test User",
            barcode: "TEST-" + Math.floor(Math.random() * 10000),
            password: "password123",
            membership_type: "Public",
            status: "Active",
        },
    ]);

    if (error) {
        fs.writeFileSync('error.json', JSON.stringify(error, null, 2));
        console.error("Wrote to error.json");
    } else {
        console.log("SUCCESS:", data);
    }
}

testInsert();
