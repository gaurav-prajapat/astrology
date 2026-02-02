import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create a Supabase client with service role key (full access)
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // For enhanced security, we can implement different authorization mechanisms:
    // Option 1: Check for an admin creation token in headers
    const adminCreationToken = request.headers.get('X-Admin-Creation-Token');
    const envToken = process.env.ADMIN_CREATION_TOKEN;
    
    // If environment token is set, require it in the request
    if (envToken && adminCreationToken !== envToken) {
      return Response.json(
        { error: 'Unauthorized: Invalid admin creation token' },
        { status: 401 }
      );
    }

    // Parse the request body
    const { firstName, lastName, email, password, role_name = 'Administrator' } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role_name to ensure it's a valid role and get the role ID
    const { data: validRole, error: roleError } = await supabase
      .from('staff_roles')
      .select('id')
      .eq('name_en', role_name)
      .single();

    if (roleError || !validRole) {
      return Response.json(
        { error: `Invalid role specified: ${role_name}` },
        { status: 400 }
      );
    }

    const role_id = validRole.id;

    // Check if user already exists in staff_members table
    const { data: existingStaff, error: staffCheckError } = await supabase
      .from('staff_members')
      .select('id')
      .eq('email', email)
      .single();

    if (existingStaff) {
      return Response.json(
        { error: 'User with this email already exists in staff database' },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      if (authError.message.includes('User already registered')) {
        return Response.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      return Response.json(
        { error: authError.message || 'Failed to create user' },
        { status: 400 }
      );
    }

    if (!authData?.user) {
      return Response.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Insert user into staff_members table
    const { error: staffError } = await supabase
      .from('staff_members')
      .insert([{
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        role_id: role_id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);

    if (staffError) {
      // Rollback: delete the user from auth if staff insertion fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return Response.json(
        { error: staffError.message || 'Failed to create staff record' },
        { status: 500 }
      );
    }

    // Return success response (don't expose sensitive information)
    return Response.json({
      message: 'Admin account created successfully'
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}