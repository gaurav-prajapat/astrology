# JSONB Syntax Correction Note

## Issue
The original `fix_user_permissions.sql` file had incorrect JSONB syntax that caused a PostgreSQL syntax error:
```
ERROR:  42601: syntax error at or near "["
```

## Root Cause
The file was using incorrect JSONB operators:
- `sr.permissions @> '["admin"]'::jsonb` - This syntax is for checking if a JSON document contains another JSON document
- The square brackets `[...]` were causing the syntax error because they weren't properly escaped

## Solution Applied
Changed the JSONB operators to the correct syntax for checking if a JSONB array contains a specific value:
- `sr.permissions @> '["admin"]'::jsonb` → `sr.permissions ? 'admin'`
- The `?` operator correctly checks if the specified string exists as a key or value in the JSONB object/array

## PostgreSQL JSONB Operators Reference
- `?` → Checks if the right operand exists as a key or value in the left operand JSONB
- `?|` → Checks if any of the right operand's keys exist in the left operand JSONB  
- `?&` → Checks if all of the right operand's keys exist in the left operand JSONB
- `@>` → Checks if left operand contains right operand (for JSON documents)
- `<@` → Checks if right operand contains left operand (for JSON documents)

## Impact
- Fixed the syntax error in the SQL file
- Now the RLS policy properly checks if the 'admin', 'content_management', or 'staff_management' permissions exist in the JSONB array
- The file can now be executed successfully in PostgreSQL