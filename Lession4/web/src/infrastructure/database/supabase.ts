import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jlpcnlvhdplqtftymnhb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7g9zDbuXO6mwoq4GoT3tiQ_kpEC01Si';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
