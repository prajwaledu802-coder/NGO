import { supabase } from './supabase.js';

export const connectDb = async () => {
  const { error } = await supabase.from('users').select('id', { head: true, count: 'exact' }).limit(1);
  if (error) {
    throw new Error(`Supabase connection check failed: ${error.message}`);
  }
  console.log('Supabase connected');
};
