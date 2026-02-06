export const prerender = false;

export async function POST({ request }) {
  console.log('🧪 Test upload API called');
  
  try {
    console.log('📝 Parsing form data...');
    const formData = await request.formData();
    
    const guestName = formData.get('guestName');
    const message = formData.get('message');
    const type = formData.get('type');
    const file = formData.get('file');
    
    console.log('📋 Form data received:', { 
      guestName, 
      message, 
      type, 
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    });

    // Simple success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Test upload successful',
      data: {
        guest_name: guestName,
        message: message,
        type: type,
        file_info: {
          name: file?.name,
          size: file?.size,
          type: file?.type
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Test upload error:', error);
    console.error('💥 Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: 'Test upload failed',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
