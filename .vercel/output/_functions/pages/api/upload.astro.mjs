import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const supabaseUrl = "https://dwzcdegrrtfmvxcxgeey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3emNkZWdycnRmbXZ4Y3hnZWV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5NjQyMywiZXhwIjoyMDg1OTcyNDIzfQ.nGDU0capHjsQ2-6l4QLzCbTjHDcHX6zKxgM3M8thAkA";
createClient(supabaseUrl, supabaseKey) ;
const VALID_TYPES = {
  // Image formats
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  // Audio formats
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/m4a": "m4a",
  "audio/webm": "webm",
  // Add support for recorded audio
  "audio/webm;codecs=opus": "webm",
  // Chrome recording format
  // Video formats
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi"
};
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const prerender = false;
async function POST({ request }) {
  console.log("🚀 Upload API called");
  try {
    console.log("📝 Parsing form data...");
    const formData = await request.formData();
    const guestName = formData.get("guestName");
    const message = formData.get("message");
    const files = formData.getAll("files");
    console.log("📋 Form data:", {
      guestName,
      message,
      fileCount: files.length,
      files: files.map((f) => f.name)
    });
    for (const file of files) {
      if (!file || !(file instanceof File)) {
        console.log("❌ Invalid file upload");
        return new Response(JSON.stringify({
          error: "Invalid file upload"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (!VALID_TYPES[file.type]) {
        console.log("❌ Invalid file type:", file.type);
        return new Response(JSON.stringify({
          error: `Invalid file type. Allowed types: ${Object.keys(VALID_TYPES).join(", ")}`
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (file.size > MAX_FILE_SIZE) {
        console.log("❌ File too large:", file.size);
        const limitMB = file.type.startsWith("video/") ? "15MB" : "10MB";
        return new Response(JSON.stringify({
          error: `File size exceeds ${limitMB} limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    console.log("✅ File validation passed");
    const uploadedMemories = [];
    for (const file of files) {
      console.log(`📁 Processing file: ${file.name}`);
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = VALID_TYPES[file.type];
      const fileName = `${timestamp}-${randomString}-${file.name}.${fileExtension}`;
      console.log("📁 Generated filename:", fileName);
      console.log("📖 Reading file buffer...");
      const fileBuffer = await file.arrayBuffer();
      try {
        const fs = await import('fs');
        const path = await import('path');
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localFilePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(localFilePath, Buffer.from(fileBuffer));
        const localUrl = `/uploads/${fileName}`;
        console.log("✅ File saved locally:", localUrl);
        const memory = {
          id: `local-${timestamp}`,
          guest_name: guestName,
          message,
          type: file.type.startsWith("audio/") ? "audio" : file.type.startsWith("video/") ? "video" : "image",
          url: localUrl,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        uploadedMemories.push(memory);
      } catch (localError) {
        console.error("❌ Local storage failed for", file.name, ":", localError);
        const mockUrl = `data:image/svg+xml;base64,${btoa(`
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#f0f8ff"/>
            <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Arial" font-size="20">
              ${guestName}'s Wedding Memory
            </text>
          </svg>
        `)}`;
        const memory = {
          id: `demo-${timestamp}`,
          guest_name: guestName,
          message,
          type: file.type.startsWith("audio/") ? "audio" : file.type.startsWith("video/") ? "video" : "image",
          url: mockUrl,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        uploadedMemories.push(memory);
      }
    }
    console.log(`✅ Successfully processed ${uploadedMemories.length} files`);
    return new Response(JSON.stringify({
      success: true,
      message: `${uploadedMemories.length} memory(ies) uploaded successfully`,
      data: uploadedMemories
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("💥 Upload handler error:", error);
    console.error("💥 Error stack:", error.stack);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function GET() {
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
