-- Fix RLS policies to properly check for authenticated admin users
-- Instead of checking for specific email addresses, check if user is authenticated
-- and has admin permissions by joining with staff_members table

-- Update policies for gallery_images table
DROP POLICY IF EXISTS "Only admins can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can delete gallery images" ON gallery_images;

CREATE POLICY "Admin users can insert gallery images" ON gallery_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions ? 'admin' OR sr.permissions ? 'content_management')
                )
            )
        )
    );

CREATE POLICY "Admin users can update gallery images" ON gallery_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions ? 'admin' OR sr.permissions ? 'content_management')
                )
            )
        )
    );

CREATE POLICY "Admin users can delete gallery images" ON gallery_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions ? 'admin' OR sr.permissions ? 'content_management')
                )
            )
        )
    );

-- Update policies for carousel_items table
DROP POLICY IF EXISTS "Enable all access for admin users" ON carousel_items;

CREATE POLICY "Admin users can manage carousel items" ON carousel_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions ? 'admin' OR sr.permissions ? 'content_management')
                )
            )
        )
    );

CREATE POLICY "Admin users can insert carousel items" ON carousel_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions ? 'admin' OR sr.permissions ? 'content_management')
                )
            )
        )
    );

-- Update policies for videos table
DROP POLICY IF EXISTS "Enable all access for admin users" ON videos;

CREATE POLICY "Admin users can manage videos" ON videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions ? 'admin' OR sr.permissions ? 'content_management')
                )
            )
        )
    );

CREATE POLICY "Admin users can insert videos" ON videos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '["admin"]'::jsonb OR sr.permissions @> '["content_management"]::jsonb)
                )
            )
        )
    );

-- Update policies for staff_members table
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON staff_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON staff_members;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON staff_members;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON staff_members;

CREATE POLICY "Staff members can read staff data" ON staff_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '"admin"'::jsonb OR sr.permissions @> '"staff_management"'::jsonb)
                )
            )
        )
    );

CREATE POLICY "Admin users can insert staff members" ON staff_members
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '"admin"'::jsonb OR sr.permissions @> '"staff_management"'::jsonb)
                )
            )
        )
    );

CREATE POLICY "Admin users can update staff members" ON staff_members
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '"admin"'::jsonb OR sr.permissions @> '"staff_management"'::jsonb)
                )
            )
        )
    );

CREATE POLICY "Admin users can delete staff members" ON staff_members
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '"admin"'::jsonb OR sr.permissions @> '"staff_management"'::jsonb)
                )
            )
        )
    );

-- Update policies for staff_roles table
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON staff_roles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON staff_roles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON staff_roles;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON staff_roles;

CREATE POLICY "Staff can read roles" ON staff_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '"admin"'::jsonb OR sr.permissions @> '"staff_management"'::jsonb)
                )
            )
        )
    );

CREATE POLICY "Admin users can manage roles" ON staff_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '"admin"'::jsonb OR sr.permissions @> '"staff_management"'::jsonb)
                )
            )
        )
    );

CREATE POLICY "Admin users can insert roles" ON staff_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM staff_members sm
                WHERE sm.id = auth.users.id
                AND sm.is_active = true
                AND EXISTS (
                    SELECT 1 FROM staff_roles sr
                    WHERE sr.id = sm.role_id
                    AND (sr.permissions @> '"admin"'::jsonb OR sr.permissions @> '"staff_management"'::jsonb)
                )
            )
        )
    );