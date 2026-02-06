import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Mock data for fallback when Supabase is not available
const mockMemories = [
  {
    id: 'demo-1',
    guest_name: 'Sarah Johnson',
    message: 'Congratulations on your special day! Wishing you a lifetime of love and happiness together.',
    type: 'image',
    url: 'https://picsum.photos/seed/wedding1/400/300.jpg',
    created_at: new Date('2026-02-01T10:30:00Z').toISOString()
  },
  {
    id: 'demo-2', 
    guest_name: 'Michael Chen',
    message: 'What a beautiful wedding! The ceremony was perfect and reception was amazing.',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    created_at: new Date('2026-02-01T14:15:00Z').toISOString()
  }
];

export const prerender = false;

export async function GET() {
  try {
    // Try to use Supabase if available
    if (supabase) {
      console.log('Attempting to connect to Supabase...');
      
      try {
        // Fetch memories from database, ordered by most recent first
        const { data: memories, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          // Fall back to mock data
          return new Response(JSON.stringify({
            success: true,
            count: mockMemories.length,
            memories: mockMemories,
            fallback: true
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log('Successfully connected to Supabase, found memories:', memories.length);
        return new Response(JSON.stringify({
          success: true,
          count: memories.length,
          memories: memories
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (supabaseError) {
        console.error('Supabase connection failed:', supabaseError);
        // Fall back to mock data
        return new Response(JSON.stringify({
          success: true,
          count: mockMemories.length,
          memories: mockMemories,
          fallback: true,
          error: 'Supabase connection failed'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // No Supabase credentials, return mock data
      console.log('No Supabase credentials, returning mock data');
      return new Response(JSON.stringify({
        success: true,
        count: mockMemories.length,
        memories: mockMemories,
        fallback: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Memories API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle other HTTP methods
export async function POST() {
  return new Response(JSON.stringify({ 
    error: 'Method not allowed' 
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
