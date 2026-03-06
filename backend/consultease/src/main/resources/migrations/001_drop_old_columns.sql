-- Migration: Remove orphaned columns from users table
-- Run this SQL in your Supabase SQL Editor to synchronize with the updated User entity

-- Drop orphaned columns that no longer exist in the Java entity
ALTER TABLE users DROP COLUMN IF EXISTS is_active;
ALTER TABLE users DROP COLUMN IF EXISTS is_temporary_password;
ALTER TABLE users DROP COLUMN IF EXISTS must_change_password;
ALTER TABLE users DROP COLUMN IF EXISTS updated_at;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
