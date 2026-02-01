# Supabase Service Role Key Setup

To enable admin user creation functionality, you need to configure your Supabase service role key in the environment variables.

## Getting Your Service Role Key

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Project Settings** > **API**
4. Look for the **Service Role Key** (usually starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
5. Copy this key

## Updating Environment Variables

1. Open your `.env` file
2. Replace `YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE` with your actual service role key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_ADMIN_CREATION_TOKEN=my_secure_admin_token_123
```

## Why is the Service Role Key Needed?

The service role key is required for:
- Creating new admin users via the Supabase Auth API
- Performing administrative operations that bypass Row Level Security (RLS) policies
- Managing users with elevated privileges

The service role key has full access to your database and should be kept secure. It's only used server-side in API routes.

## Alternative Authentication Method

If you prefer not to use the service role key for creating new users, you can:
1. Manually create admin users in the Supabase dashboard
2. Use the admin login form to authenticate as an existing admin user
3. The admin panel will work normally with any authenticated admin user