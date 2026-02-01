# Manual Admin User Setup Guide

## Why Auth is Failing

The issue is that when you insert a user directly into the `staff_members` table, Supabase Auth doesn't know about that user. Authentication requires the user to be created through Supabase's authentication system first.

## Solution Options

### Option 1: Manual Setup (Recommended for Quick Testing)

1. **Create Auth User in Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** → **Users**
   - Click **+ Invite User**
   - Email: `admin@gmail.com`
   - Password: `admin123`
   - Click **Invite User**

2. **Get the User ID**
   - After creating the user, copy the **User ID** (UUID)
   - It will look something like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

3. **Link to Staff Members Table**
   - Go to **SQL Editor**
   - Run this query (replace `USER_ID_HERE` with the actual ID):

```sql
-- Link Auth user to staff_members table
INSERT INTO staff_members (
    id,  -- This must match the Auth User ID
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
    'USER_ID_HERE',  -- Replace with actual Auth User ID
    'Admin', 
    'User', 
    'admin@gmail.com', 
    '+91-9876543210',
    sr.id, 
    '',  -- Empty since using Supabase Auth
    'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=ffffff',
    true
FROM staff_roles sr 
WHERE sr.name_en = 'Administrator'
ON CONFLICT (id) DO UPDATE SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    role_id = EXCLUDED.role_id,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
```

### Option 2: Automated Setup (Recommended for Production)

1. **Get Service Role Key**
   - Go to Supabase Dashboard
   - Project Settings → API
   - Copy the **service_role key** (not the anon key)

2. **Set Environment Variables**
   Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run the Setup Script**
   ```bash
   node scripts/setup-admin-auth.js
   ```

## Testing the Setup

After setup, you should be able to:
1. Visit `/admin`
2. Enter `admin@gmail.com` and `admin123`
3. Successfully log in to the admin dashboard

## Troubleshooting

**If login still fails:**
- Check that the user exists in both Supabase Auth and staff_members table
- Verify the user ID matches in both systems
- Check browser console for specific error messages
- Ensure RLS policies are properly configured

**Common Issues:**
- **"User not found"**: User doesn't exist in Supabase Auth
- **"Insufficient permissions"**: User exists but role assignment failed
- **"Invalid credentials"**: Password mismatch or user not properly linked

The key insight is that **authentication happens at the Supabase Auth level**, and the `staff_members` table is just for additional user metadata and permissions management.