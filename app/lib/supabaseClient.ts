import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const SUPABASE_URL = 'https://svtfvzbyfufhogoeqxuy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dGZ2emJ5ZnVmaG9nb2VxeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1MTQ0OTcsImV4cCI6MjA0MjA5MDQ5N30.NJcQWMxSnPiLjvV2Ik7oTbpA9pDwBwuEBW5E6coB_ys';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
