# Admin Authentication Test Guide

## Test Scenarios

### 1. Development Mode Login (Local Testing)
- **URL**: http://localhost:3001/admin
- **Credentials**: 
  - Email: `admin@gmail.com` 
  - Password: `admin123`
- **Expected**: Should login successfully and redirect to admin dashboard

### 2. Admin Signup (Development)
- **URL**: http://localhost:3001/admin/signup
- **Process**: 
  1. Fill in first name, last name, email, password
  2. Leave admin creation token blank (not required in dev mode)
  3. Submit form
- **Expected**: Account created successfully with message

### 3. Supabase Login (Production Mode)
- **Requirements**: Proper Supabase configuration
- **Process**: Use real email/password registered in Supabase auth
- **Expected**: Login with staff member validation

## Common Issues & Solutions

### Issue 1: "User not found in staff database"
**Solution**: Ensure the user exists in both:
- `auth.users` table (Supabase Auth)
- `staff_members` table with proper role permissions

### Issue 2: "Insufficient permissions"
**Solution**: Check that the staff role has either:
- `admin` permission
- `staff_management` permission

### Issue 3: Development credentials not working
**Solution**: Make sure you're accessing from localhost/127.0.0.1

## Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Database Tables Required
- `staff_members` - User accounts
- `staff_roles` - Role definitions with permissions
- `auth.users` - Supabase authentication (auto-created)