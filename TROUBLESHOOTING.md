# Troubleshooting Guide

## Common Issues and Solutions

### 1. "This endpoint requires a valid Bearer token" Error

**Problem**: When trying to create a new admin user, you encounter the error "This endpoint requires a valid Bearer token".

**Root Cause**: The admin creation API endpoint requires a Supabase Service Role Key to authenticate with Supabase's authentication system for creating users.

**Solutions**:

#### Option A: Add Service Role Key (Recommended for Production)
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Project Settings** > **API**
4. Copy the **Service Role Key** (looks like a JWT token)
5. Add it to your `.env` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_copied_service_role_key_here
   ```
6. Restart your application

#### Option B: Use Existing Admin Account (Quick Fix)
1. Use the default development credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`
2. Or create a user manually in the Supabase Dashboard:
   - Go to Authentication > Users
   - Click "Invite User" or "Create User"
   - After creating the user, manually add them to the `staff_members` table in the Database section

#### Option C: Manual Database Entry
1. Create the user in Supabase Auth via dashboard
2. Get the User ID from the Auth Users page
3. Use the SQL script in `helpers/manual-admin-setup.sql` to create the corresponding staff member entry

### 2. 500 Internal Server Error

**Problem**: Getting 500 errors when accessing admin sections.

**Solution**:
1. Check that database migrations have been run
2. Verify that required tables (`staff_members`, `staff_roles`, `site_settings`) exist
3. Ensure your Supabase URL and keys are correct in environment variables

### 3. Permission Denied / Insufficient Permissions

**Problem**: Logging in but unable to access admin features.

**Solution**:
1. Verify the user exists in both Supabase Auth and the `staff_members` table
2. Check that the user's role has the required permissions
3. Ensure the `role_id` in `staff_members` correctly references a valid role in `staff_roles`

### 4. Development Mode vs Production Mode

**Problem**: Features work in development but not in production.

**Solution**:
1. Ensure environment variables are properly set in production
2. Check that service role keys are properly configured for production
3. Verify that RLS (Row Level Security) policies are correctly set up

### 5. Database Migration Issues

**Problem**: Tables don't exist or schema is outdated.

**Solution**:
1. Run the latest migrations from `supabase/migrations/`
2. Use the Supabase CLI: `npx supabase db push`
3. Or run the SQL directly in the SQL Editor in Supabase Dashboard

## Quick Checks

- Is the `SUPABASE_SERVICE_ROLE_KEY` set in environment variables?
- Are all required tables present in your database?
- Does the user exist in both Supabase Auth and the staff_members table?
- Are the RLS policies configured correctly?
- Have you restarted your application after changing environment variables?

## Need Help?

1. Check the browser console for specific error messages
2. Review the server logs for detailed error information
3. Refer to the setup documentation in `ADMIN_SETUP.md`
4. Check the manual setup guide in `MANUAL_ADMIN_SETUP.md`