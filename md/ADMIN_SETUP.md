# Admin System Setup Instructions

## Database Migration Required

Before the staff management and site settings features will work, you need to run the database migration.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/20260129120000_create_staff_management_system.sql`
4. Paste and run the query

### Option 2: Using Supabase CLI (If configured)

```bash
npx supabase db push
```

## After Migration Completion

Once the migration is successful, you'll have:
- ✅ `staff_members` table
- ✅ `staff_roles` table  
- ✅ `site_settings` table
- ✅ Default roles and admin user
- ✅ RLS policies for security

## Default Admin Credentials

### Option 1: Development Login (Immediate Access)
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Local development only - for testing admin panel

### Option 2: Production Login (After Migration)
**Main Admin Account:**
- **Email**: admin@divinerituals.com
- **Password**: You'll need to set this up in Supabase Auth
- **Role**: Administrator (full access)

**Test Content Manager Account:**
- **Email**: content@divinerituals.com
- **Password**: You'll need to set this up in Supabase Auth
- **Role**: Content Manager (content management only)

**Legacy Account (from original migration):**
- **Email**: admin@astrology.com
- **Password**: You'll need to set this up in Supabase Auth

## Testing the System

1. Run the migration first
2. Navigate to `/admin` 
3. You should see the new Staff, Roles, and Settings tabs
4. The staff management section will show "No staff members found" initially
5. The roles section will show default roles
6. The settings section will show default site settings

## Environment Configuration

### Service Role Key (Required for Admin Creation)

To enable admin user creation functionality, you need to configure your Supabase service role key:

1. Go to your Supabase Dashboard
2. Select your project
3. Navigate to **Project Settings** > **API**
4. Copy the **Service Role Key**
5. Add to your `.env` file:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_ADMIN_CREATION_TOKEN=your_secure_token
   ```

### Admin Creation Token

The admin creation token is used as an additional security measure for creating new admin users. Set a strong, unique value for `NEXT_PUBLIC_ADMIN_CREATION_TOKEN`.

## How to Resolve the "Bearer Token" Error

If you're encountering the error "This endpoint requires a valid Bearer token", it means you're trying to create a new admin user but the system lacks the required service role key. Here's how to fix it:

### Step 1: Get Your Service Role Key
1. Go to your Supabase Dashboard
2. Select your project
3. Navigate to **Project Settings** > **API**
4. Copy the **Service Role Key** (this looks like a JWT token starting with `eyJhbGciOi...`)

### Step 2: Update Your Environment Variables
Add the service role key to your `.env` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_copied_service_role_key_here
NEXT_PUBLIC_ADMIN_CREATION_TOKEN=your_secure_token
```

### Step 3: Restart Your Application
After updating the environment variables, restart your Next.js application to load the new settings.

### Alternative: Use Existing Admin Account
If you don't want to create new admin users, you can use an existing admin account. The system comes with a default development account:
- Email: `admin@gmail.com`
- Password: `admin123`

This account can be used for immediate access without needing the service role key.

## Troubleshooting

**500 Errors**: This indicates the tables don't exist yet. Run the migration.

**Permission Errors**: Make sure you're logged in as admin@astrology.com with proper permissions.

**Bearer Token Error**: If you see "This endpoint requires a valid Bearer token", you need to add the `SUPABASE_SERVICE_ROLE_KEY` to your environment variables.

**Missing Icons**: The system will now use favicon.ico instead of the missing PNG files.