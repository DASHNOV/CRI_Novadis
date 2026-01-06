import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Variables Supabase manquantes ou non chargées via Expo.');
}

// Initialize Supabase Client with React Native configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Log initialization
console.log('✅ [Supabase] Client initialized');
console.log(`🔗 [Supabase] URL: ${supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined'}`);

// Only test connection if running in development
if (__DEV__) {
    supabase.from('sites').select('count', { count: 'exact', head: true })
        .then(({ count, error }) => {
            if (error) {
                console.error('❌ [Supabase] Connection test failed:', error.message);
                console.error('👉 Hint: Check your RLS policies in Supabase!');
            } else {
                console.log(`✅ [Supabase] Connected! Found ${count} sites.`);
            }
        });
}