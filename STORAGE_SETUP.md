# Storage Setup Guide

This guide explains how to set up Supabase storage buckets for image uploads in the astrology platform.

## Required Storage Buckets

The application requires the following storage buckets for different types of images:

1. **carousel-images** - For carousel banner images
2. **astrologer-photos** - For astrologer profile photos
3. **gallery-images** - For gallery images
4. **video-thumbnails** - For video thumbnail images
5. **staff-avatars** - For staff member avatars

## Setting Up Storage Buckets

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to your project
3. Go to **Storage** section in the sidebar
4. Click **"New bucket"**
5. Create the following buckets with these names:
   - `carousel-images`
   - `astrologer-photos`
   - `gallery-images`
   - `video-thumbnails`
   - `staff-avatars`
6. For each bucket, make sure to:
   - Enable **Public** access (or set appropriate RLS policies)
   - Set file size limits as needed (recommended: 5MB)
   - Set allowed MIME types: `image/png, image/jpeg, image/gif, image/webp`

### Method 2: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Create the buckets
supabase storage create_bucket --name carousel-images --public
supabase storage create_bucket --name astrologer-photos --public
supabase storage create_bucket --name gallery-images --public
supabase storage create_bucket --name video-thumbnails --public
supabase storage create_bucket --name staff-avatars --public
```

## Setting Up Storage Policies

After creating the buckets, you need to set up Row Level Security (RLS) policies. Run the following SQL in your Supabase SQL Editor:

```sql
-- Storage bucket policies for public read access
CREATE POLICY "Allow public read access for carousel images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'carousel-images');

CREATE POLICY "Allow public read access for astrologer photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'astrologer-photos');

CREATE POLICY "Allow public read access for gallery images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'gallery-images');

CREATE POLICY "Allow public read access for video thumbnails" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Allow public read access for staff avatars" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'staff-avatars');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload carousel images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'carousel-images');

CREATE POLICY "Allow authenticated users to upload astrologer photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'astrologer-photos');

CREATE POLICY "Allow authenticated users to upload gallery images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Allow authenticated users to upload video thumbnails" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'video-thumbnails');

CREATE POLICY "Allow authenticated users to upload staff avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'staff-avatars');
```

## Troubleshooting

### "Bucket not found" Error

If you see the error "Bucket not found", it means one of the required storage buckets hasn't been created yet. Follow the steps above to create the missing bucket.

### "This endpoint requires a valid Bearer token" Error

This error occurs when trying to upload images without proper authentication. Make sure:
1. You're logged in as an admin user
2. Your Supabase service role key is properly configured in environment variables
3. The RLS policies are correctly set up

### Image Upload Issues

If images aren't uploading properly:

1. Verify that the bucket names match exactly what's in the code:
   - `carousel-images`
   - `astrologer-photos`
   - `gallery-images`
   - `video-thumbnails`
   - `staff-avatars`

2. Check that the MIME types allow the image formats you're trying to upload

3. Ensure the file size limits are appropriate (default is 5MB)

## Environment Variables

Make sure your `.env` file includes the necessary Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key is required for admin operations like image uploads.