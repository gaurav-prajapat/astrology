-- Manual Admin User Setup for Divinerituals Astrology Platform
-- Use this SQL script to manually create an admin user in Supabase

-- Step 1: Create an administrator role (if it doesn't exist)
INSERT INTO staff_roles (
    id,
    name_en,
    name_hi,
    description_en,
    description_hi,
    permissions,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Administrator',
    'प्रशासक',
    'Full access to all admin features',
    'सभी एडमिन सुविधाओं तक पूर्ण पहुंच',
    '["admin", "staff_management", "content_management", "user_management", "settings_management"]',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (name_en) DO NOTHING;

-- Step 2: Get the administrator role ID
-- Note: Execute this separately and note the ID
-- SELECT id FROM staff_roles WHERE name_en = 'Administrator';

-- Step 3: Create the admin user in Supabase Auth manually via the dashboard
-- Go to your Supabase dashboard -> Authentication -> Users -> Invite User
-- Email: admin@divinerituals.com
-- Password: YourSecurePassword123

-- Step 4: After creating the user in Auth, get their User ID from the Auth Users page
-- Then run the following query with the actual User ID from Auth:

/*
-- Uncomment and run this after getting the Auth User ID
INSERT INTO staff_members (
    id,                    -- This MUST match the User ID from Supabase Auth
    first_name,
    last_name,
    email,
    phone,
    role_id,
    password_hash,
    avatar_url,
    is_active,
    last_login,
    created_at,
    updated_at
) 
SELECT 
    'AUTH_USER_ID_HERE',   -- REPLACE WITH ACTUAL USER ID FROM SUPABASE AUTH
    'Admin',
    'User',
    'admin@divinerituals.com',
    '+91-9876543210',
    sr.id,
    '',                    -- Empty since using Supabase Auth
    'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=ffffff',
    true,
    NOW(),
    NOW(),
    NOW()
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
*/

-- For development purposes, you can create a local development admin user:
-- First, get the administrator role ID:
DO $$
DECLARE admin_role_id UUID;
BEGIN
  SELECT id INTO admin_role_id FROM staff_roles WHERE name_en = 'Administrator' LIMIT 1;
  
  -- Insert a development admin user (replace YOUR_DEV_USER_ID with an actual UUID)
  INSERT INTO staff_members (
    id,
    first_name,
    last_name,
    email,
    phone,
    role_id,
    password_hash,
    avatar_url,
    is_active,
    last_login,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(), -- Use a generated UUID for development
    'Dev',
    'Admin',
    'admin@gmail.com',
    '+91-1234567890',
    admin_role_id,
    '', -- Will be ignored since we're using Supabase Auth
    'https://ui-avatars.com/api/?name=Dev+Admin&background=10b981&color=ffffff',
    true,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    role_id = EXCLUDED.role_id,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
END $$;