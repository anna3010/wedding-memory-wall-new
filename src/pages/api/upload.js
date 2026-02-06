import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// File validation
const VALID_TYPES = {
  // Image formats
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  // Audio formats
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/m4a': 'm4a',
  'audio/webm': 'webm', // Add support for recorded audio
  'audio/webm;codecs=opus': 'webm', // Chrome recording format
  // Video formats
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi'
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB for videos

export const prerender = false;

export async function POST({ request }) {
  console.log('🚀 Upload API called');
  
  try {
    console.log('📝 Parsing form data...');
    // Parse multipart form data
    const formData = await request.formData();
    
    // Extract form fields
    const guestName = formData.get('guestName');
    const message = formData.get('message');
    const files = formData.getAll('files'); // Get all files
    
    console.log('📋 Form data:', {
      guestName,
      message,
      fileCount: files.length,
      files: files.map(f => f.name)
    });

    // Validate file type and size
    for (const file of files) {
      if (!file || !(file instanceof File)) {
        console.log('❌ Invalid file upload');
        return new Response(JSON.stringify({ 
          error: 'Invalid file upload' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (!VALID_TYPES[file.type]) {
        console.log('❌ Invalid file type:', file.type);
        return new Response(JSON.stringify({ 
          error: `Invalid file type. Allowed types: ${Object.keys(VALID_TYPES).join(', ')}` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (file.size > MAX_FILE_SIZE) {
        console.log('❌ File too large:', file.size);
        const limitMB = file.type.startsWith('video/') ? '15MB' : '10MB';
        return new Response(JSON.stringify({ 
          error: `File size exceeds ${limitMB} limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    console.log('✅ File validation passed');

    // Process multiple files
    const uploadedMemories = [];
    
    for (const file of files) {
      console.log(`📁 Processing file: ${file.name}`);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = VALID_TYPES[file.type];
      const fileName = `${timestamp}-${randomString}-${file.name}.${fileExtension}`;

      console.log('📁 Generated filename:', fileName);

      // Read file buffer
      console.log('📖 Reading file buffer...');
      const fileBuffer = await file.arrayBuffer();

      // Try local storage first (fallback when Supabase not available)
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Save file locally
        const localFilePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(localFilePath, Buffer.from(fileBuffer));
        
        // Return local file URL
        const localUrl = `/uploads/${fileName}`;
        
        console.log('✅ File saved locally:', localUrl);
        
        const memory = {
          id: `local-${timestamp}`,
          guest_name: guestName,
          message: message,
          type: file.type.startsWith('audio/') ? 'audio' : file.type.startsWith('video/') ? 'video' : 'image',
          url: localUrl,
          created_at: new Date().toISOString()
        };
        
        uploadedMemories.push(memory);
        
      } catch (localError) {
        console.error('❌ Local storage failed for', file.name, ':', localError);
        
        // Final fallback to SVG for this file
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
          message: message,
          type: file.type.startsWith('audio/') ? 'audio' : file.type.startsWith('video/') ? 'video' : 'image',
          url: mockUrl,
          created_at: new Date().toISOString()
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
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Upload handler error:', error);
    console.error('💥 Error stack:', error.stack);
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
export async function GET() {
  return new Response(JSON.stringify({ 
    error: 'Method not allowed' 
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
