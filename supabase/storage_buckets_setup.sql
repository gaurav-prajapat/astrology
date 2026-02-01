-- Supabase Storage Bucket Setup
-- This SQL script sets up the necessary storage buckets for the astrology platform

-- Note: Storage buckets are typically created via the Supabase dashboard or CLI
-- This script provides the necessary configuration and policies

-- 1. Create storage buckets via Supabase Dashboard or CLI:
-- supabase storage create_bucket --name carousel-images --public
-- supabase storage create_bucket --name astrologer-photos --public
-- supabase storage create_bucket --name gallery-images --public
-- supabase storage create_bucket --name video-thumbnails --public
-- supabase storage create_bucket --name staff-avatars --public

-- 2. Set up RLS policies for storage buckets
-- These policies need to be applied in the Supabase dashboard under Storage -> Policies

-- For carousel-images bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types) 
VALUES ('carousel-images', 'carousel-images', true, false, 5242880, '{image/png,image/jpeg,image/gif,image/webp}') 
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    avif_autodetection = false,
    file_size_limit = 5242880,
    allowed_mime_types = '{image/png,image/jpeg,image/gif,image/webp}';

-- For astrologer-photos bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types) 
VALUES ('astrologer-photos', 'astrologer-photos', true, false, 5242880, '{image/png,image/jpeg,image/gif,image/webp}') 
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    avif_autodetection = false,
    file_size_limit = 5242880,
    allowed_mime_types = '{image/png,image/jpeg,image/gif,image/webp}';

-- For gallery-images bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types) 
VALUES ('gallery-images', 'gallery-images', true, false, 5242880, '{image/png,image/jpeg,image/gif,image/webp}') 
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    avif_autodetection = false,
    file_size_limit = 5242880,
    allowed_mime_types = '{image/png,image/jpeg,image/gif,image/webp}';

-- For video-thumbnails bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types) 
VALUES ('video-thumbnails', 'video-thumbnails', true, false, 5242880, '{image/png,image/jpeg,image/gif,image/webp}') 
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    avif_autodetection = false,
    file_size_limit = 5242880,
    allowed_mime_types = '{image/png,image/jpeg,image/gif,image/webp}';

-- For staff-avatars bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types) 
VALUES ('staff-avatars', 'staff-avatars', true, false, 5242880, '{image/png,image/jpeg,image/gif,image/webp}') 
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    avif_autodetection = false,
    file_size_limit = 5242880,
    allowed_mime_types = '{image/png,image/jpeg,image/gif,image/webp}';

-- Storage bucket policies for public read access
-- These policies allow public read access to all buckets
CREATE POLICY "Allow public read access for carousel images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'carousel-images');

CREATE POLICY "Allow public read access for astrologer photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'astrologer-photos');

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

-- Update existing records to use public URLs if they're stored as relative paths
-- This assumes there are existing image URLs in the database that need to be converted to public URLs
UPDATE carousel_items 
SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/carousel-images/' || split_part(image_url, '/', array_length(string_to_array(image_url, '/'), 1))
WHERE image_url LIKE '%carousel-images/%' AND image_url NOT LIKE 'https://%';

UPDATE astrologers 
SET photo_url = 'https://your-project.supabase.co/storage/v1/object/public/astrologer-photos/' || split_part(photo_url, '/', array_length(string_to_array(photo_url, '/'), 1))
WHERE photo_url LIKE '%astrologer-photos/%' AND photo_url NOT LIKE 'https://%';

UPDATE gallery_images 
SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/gallery-images/' || split_part(image_url, '/', array_length(string_to_array(image_url, '/'), 1))
WHERE image_url LIKE '%gallery-images/%' AND image_url NOT LIKE 'https://%';

UPDATE videos 
SET thumbnail_url = 'https://your-project.supabase.co/storage/v1/object/public/video-thumbnails/' || split_part(thumbnail_url, '/', array_length(string_to_array(thumbnail_url, '/'), 1))
WHERE thumbnail_url LIKE '%video-thumbnails/%' AND thumbnail_url NOT LIKE 'https://%';

UPDATE staff_members 
SET avatar_url = 'https://your-project.supabase.co/storage/v1/object/public/staff-avatars/' || split_part(avatar_url, '/', array_length(string_to_array(avatar_url, '/'), 1))
WHERE avatar_url LIKE '%staff-avatars/%' AND avatar_url NOT LIKE 'https://%';