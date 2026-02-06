import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const supabaseUrl = "https://dwzcdegrrtfmvxcxgeey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3emNkZWdycnRmbXZ4Y3hnZWV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5NjQyMywiZXhwIjoyMDg1OTcyNDIzfQ.nGDU0capHjsQ2-6l4QLzCbTjHDcHX6zKxgM3M8thAkA";
const supabase = createClient(supabaseUrl, supabaseKey) ;
const mockMemories = [
  {
    id: "demo-1",
    guest_name: "Sarah Johnson",
    message: "Congratulations on your special day! Wishing you a lifetime of love and happiness together.",
    type: "image",
    url: "https://picsum.photos/seed/wedding1/400/300.jpg",
    created_at: (/* @__PURE__ */ new Date("2026-02-01T10:30:00Z")).toISOString()
  },
  {
    id: "demo-2",
    guest_name: "Michael Chen",
    message: "What a beautiful wedding! The ceremony was perfect and reception was amazing.",
    type: "audio",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    created_at: (/* @__PURE__ */ new Date("2026-02-01T14:15:00Z")).toISOString()
  }
];
const prerender = false;
async function GET() {
  try {
    if (supabase) {
      console.log("Attempting to connect to Supabase...");
      try {
        const { data: memories, error } = await supabase.from("memories").select("*").order("created_at", { ascending: false });
        if (error) {
          console.error("Supabase error:", error);
          return new Response(JSON.stringify({
            success: true,
            count: mockMemories.length,
            memories: mockMemories,
            fallback: true
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        console.log("Successfully connected to Supabase, found memories:", memories.length);
        return new Response(JSON.stringify({
          success: true,
          count: memories.length,
          memories
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (supabaseError) {
        console.error("Supabase connection failed:", supabaseError);
        return new Response(JSON.stringify({
          success: true,
          count: mockMemories.length,
          memories: mockMemories,
          fallback: true,
          error: "Supabase connection failed"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      console.log("No Supabase credentials, returning mock data");
      return new Response(JSON.stringify({
        success: true,
        count: mockMemories.length,
        memories: mockMemories,
        fallback: true
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Memories API error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function POST() {
  return new Response(JSON.stringify({
    error: "Method not allowed"
  }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
