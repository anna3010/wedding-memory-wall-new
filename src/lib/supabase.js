import { createClient } from '@supabase/supabase-js';

// Supabase configuration for client-side usage
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Realtime features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Memory table operations
export const memoriesApi = {
  // Subscribe to realtime updates
  subscribeToMemories: (callback) => {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not available for realtime updates');
      return null;
    }

    const subscription = supabase
      .channel('memories_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'memories' },
        (payload) => {
          console.log('New memory received:', payload.new);
          callback(payload.new);
        }
      )
      .subscribe();

    return subscription;
  },

  // Unsubscribe from realtime updates
  unsubscribeFromMemories: (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },

  // Fetch all memories
  fetchMemories: async () => {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  // Upload file and create memory record
  uploadMemory: async (file, guestName, message) => {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('memories')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('memories')
      .getPublicUrl(fileName);

    // Insert memory record
    const { error: insertError } = await supabase.from('memories').insert({
      file_url: data.publicUrl,
      file_type: file.type.startsWith('audio') ? 'audio' : 'image',
      guest_name: guestName,
      message: message
    });

    if (insertError) {
      throw insertError;
    }

    return data.publicUrl;
  }
};
