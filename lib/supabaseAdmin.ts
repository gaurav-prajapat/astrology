import { createClient } from '@supabase/supabase-js';

// Create a service role client for admin operations
export const createAdminSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL configuration');
  }
  
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing Supabase SERVICE_ROLE_KEY. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables. This is required for admin operations.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Function to verify if a user has admin permissions
export const hasAdminPermissions = async (userId: string) => {
  const adminClient = createAdminSupabaseClient();
  
  const { data: staffData, error } = await adminClient
    .from('staff_members')
    .select('id, is_active, staff_roles')
    .eq('id', userId)
    .single();

  if (error || !staffData || !staffData.is_active) {
    return false;
  }

  // Extract permissions from the role
  const roleData = staffData.staff_roles as any;
  const permissions = Array.isArray(roleData?.permissions) ? roleData.permissions : [];
  return permissions.includes('admin') || permissions.includes('content_management') || permissions.includes('staff_management');
};