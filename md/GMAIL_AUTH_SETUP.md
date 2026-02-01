# Gmail Authentication Setup for Admin Panel

## Overview
This guide explains how to set up Gmail/Google authentication for the admin panel instead of using dummy credentials.

## Prerequisites
- Supabase project with Google OAuth configured
- Google Cloud Platform account
- Admin email addresses that will have access

## Setup Steps

### 1. Configure Google OAuth in Supabase

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to "Authentication" → "Providers"
   - Enable "Google"

2. **Get Google OAuth Credentials**
   - Go to Google Cloud Console
   - Create credentials for OAuth 2.0
   - Add your domain to authorized origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Add redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`

3. **Configure in Supabase**
   - Client ID: Your Google Client ID
   - Secret: Your Google Client Secret
   - Redirect URL: Your callback URL

### 2. Create Admin Users in Supabase

Run this SQL in your Supabase SQL Editor:

```sql
-- Create admin user with Gmail
INSERT INTO staff_members (
  first_name, 
  last_name, 
  email, 
  phone, 
  role_id, 
  password_hash, 
  avatar_url, 
  is_active
) 
SELECT 
  'Your', 
  'Name', 
  'your.email@gmail.com',  -- Replace with actual Gmail
  '+91-9876543210',
  sr.id, 
  '',  -- No password hash needed for OAuth
  'https://ui-avatars.com/api/?name=Your+Name&background=3b82f6&color=ffffff',
  true
FROM staff_roles sr 
WHERE sr.name_en = 'Administrator'
ON CONFLICT (email) 
DO UPDATE SET 
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role_id = EXCLUDED.role_id,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
```

### 3. Update Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test the Setup

1. Visit `/admin` on your site
2. Click "Sign in with Gmail" button
3. Use your configured Gmail account
4. You should be redirected to admin dashboard

## Security Notes

- Only configured Gmail addresses will have access
- No dummy credentials are used in production
- All activities are still monitored as per security notice
- Session management handled by Supabase Auth

## Troubleshooting

**Common Issues:**
- "Invalid redirect URI" - Check your Google Cloud Console configuration
- "User not found" - Make sure the email exists in staff_members table
- "Insufficient permissions" - Verify the user has admin role

**Debug Steps:**
1. Check browser console for errors
2. Verify Supabase auth logs
3. Confirm Google OAuth configuration
4. Ensure user exists in staff database