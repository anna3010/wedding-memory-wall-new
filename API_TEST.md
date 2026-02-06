# 🧪 API Testing Guide

## Test API Routes

### **1. Test Basic Routing**
Visit these URLs to test if API routes work:

- **Test Route**: `http://localhost:4321/api/test`
  Should return: `{"message":"API route is working!","timestamp":"...","environment":"test"}`

- **Memories Route**: `http://localhost:4321/api/memories`
  Should return mock data with fallback: `{"success":true,"count":2,"memories":[...]}`

### **2. Check Server Logs**
Look in your terminal for these messages:
- ✅ `"Attempting to connect to Supabase..."` (trying Supabase)
- ✅ `"No Supabase credentials, returning mock data"` (fallback working)
- ❌ `"Supabase connection failed: ..."` (connection issues)

### **3. Debug Steps**

If still getting 404 errors:

1. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Check file structure**:
   ```
   src/pages/api/
   ├── upload.js    ✅
   ├── memories.js  ✅
   └── test.js      ✅
   ```

3. **Verify environment variables**:
   - Check `.env.local` exists
   - Check variables have `PUBLIC_` prefix
   - Check no typos in variable names

### **4. Expected Behavior**

**Without Supabase Setup:**
- Gallery shows demo memories
- Upload shows success with mock data
- No 404 errors

**With Supabase Setup:**
- Gallery shows real memories from database
- Upload stores files in Supabase Storage
- Realtime updates work

### **Current Status**
✅ API routes created in correct location
✅ Environment variables configured for Astro
✅ Fallback logic implemented
✅ Test route added for debugging

The memories API should now work without 404 errors! 🎯
