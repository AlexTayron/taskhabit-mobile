import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjualfmlsaiubqaiifxd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdWFsZm1sc2FpdWJxYWlpZnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDA4MjEsImV4cCI6MjA2Mzg3NjgyMX0.AlQFUsMwIrHX9sn0QY_Geboy5_wTUdfQhXRgnPp3E4E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 