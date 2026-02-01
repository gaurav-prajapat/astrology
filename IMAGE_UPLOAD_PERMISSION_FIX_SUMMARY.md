# Image Upload Permission Fix Summary

## Problem
The admin panel was showing "permission denied for user table" error when users tried to add images from the admin panel. This occurred because:

1. The application was using the client-side Supabase client (anon key) for image uploads
2. The RLS (Row Level Security) policies in the database were restricting access based on user authentication
3. The policies were checking for specific hardcoded email addresses rather than proper admin permissions

## Solution Implemented

### 1. Created a Secure API Endpoint
- Created `/api/admin/upload-image/route.ts` - a server-side API route that uses the Supabase service role key
- This route validates that the user is authenticated and has admin permissions before allowing image uploads
- Uses proper authentication checks by verifying the user session and permissions in the staff_members table

### 2. Updated All Modal Components
All modal components that handle image uploads were updated to use the new secure API endpoint:

- `AddCarouselModal.tsx` - Updated image upload handler
- `EditCarouselModal.tsx` - Updated image upload handler  
- `AddGalleryModal.tsx` - Updated image upload handler
- `EditGalleryModal.tsx` - Updated image upload handler
- `AddAstrologerModal.tsx` - Updated both separate and form submission image uploads
- `EditAstrologerModal.tsx` - Updated both separate and form submission image uploads
- `AddStaffModal.tsx` - Updated both separate and form submission avatar uploads
- `EditStaffModal.tsx` - Updated both separate and form submission avatar uploads

### 3. How the New System Works
- When an admin user selects an image to upload, the modal sends the file to the new `/api/admin/upload-image` endpoint
- The API endpoint verifies the user's session and admin permissions using the service role key
- Only if the user is authenticated and has proper admin permissions, the image is uploaded to Supabase Storage
- The public URL is returned to the frontend to complete the form submission

### 4. Security Improvements
- Images are now uploaded server-side with proper authentication checks
- The service role key is used only in the secure API route, not exposed to the client
- Admin permissions are properly validated against the staff_members and staff_roles tables
- Prevents unauthorized users from accessing storage buckets

### 5. Files Modified
- `app/api/admin/upload-image/route.ts` - New secure API endpoint
- `lib/supabaseAdmin.ts` - Helper functions for admin validation
- All modal components in `admin-components/modals/` directory
- `fix_user_permissions.sql` - SQL script for updating RLS policies (reference only)

## Result
- Admin users can now successfully upload images through the admin panel
- No more "permission denied for user table" errors
- Proper authentication and authorization implemented
- Enhanced security for image upload functionality