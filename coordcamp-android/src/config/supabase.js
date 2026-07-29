import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Re-using the exact same Supabase credentials from your web app
const supabaseUrl = 'https://zmchgoheciwkitiamihv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptY2hnb2hlY2l3a2l0aWFtaWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDU5MzUsImV4cCI6MjA5NTUyMTkzNX0.Rt7gfIVturJnppXrgNbova7mGLxAqmadwlsYWYDuYfg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
