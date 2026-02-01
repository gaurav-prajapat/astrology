import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create a service role client for admin operations
const getServiceRoleClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL configuration');
  }
  
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing Supabase SERVICE_ROLE_KEY. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables. This is required for admin user creation. You can find this in your Supabase dashboard under Project Settings > API.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      phone, 
      role_id, 
      avatar_url, 
      is_active,
      admin_token 
    } = body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !role_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate admin token (basic security)
    const expectedToken = process.env.ADMIN_CREATION_TOKEN;
    if (!expectedToken || admin_token !== expectedToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin token' },
        { status: 401 }
      );
    }

    // Validate role_id is UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(role_id)) {
      return NextResponse.json(
        { error: 'Invalid role ID format' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    // Create user in Supabase Auth with service role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: `Authentication error: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: 'Failed to create auth user' },
        { status: 500 }
      );
    }

    // Insert staff member record
    const { error: staffError } = await supabase
      .from('staff_members')
      .insert([{
        id: authData.user.id,
        first_name,
        last_name,
        email,
        phone: phone || '',
        role_id,
        password_hash: '', // Empty since using Supabase Auth
        avatar_url: avatar_url || '',
        is_active: is_active !== undefined ? is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);

    if (staffError) {
      // Rollback auth user if staff creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.error('Staff creation error:', staffError);
      return NextResponse.json(
        { error: `Database error: ${staffError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        first_name,
        last_name
      }
    });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}