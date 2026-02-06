export async function GET() {
  return new Response(JSON.stringify({
    message: 'API route is working!',
    timestamp: new Date().toISOString(),
    environment: 'test'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
