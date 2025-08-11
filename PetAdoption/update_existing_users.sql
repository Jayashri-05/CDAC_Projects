-- SQL script to update existing users with original passwords
-- This script should be run after adding the original_password column

-- First, add the original_password column if it doesn't exist
ALTER TABLE app_user ADD COLUMN IF NOT EXISTS original_password VARCHAR(255);

-- Update existing users with a default password (you should change this to actual passwords)
-- For security reasons, you should manually update each user's original_password
-- with their actual password

-- Example: Update a specific user (replace with actual email and password)
-- UPDATE app_user SET original_password = 'user123' WHERE email = 'adoptocare11@gmail.com';

-- Example: Update multiple users
-- UPDATE app_user SET original_password = 'password123' WHERE email = 'user1@example.com';
-- UPDATE app_user SET original_password = 'password456' WHERE email = 'user2@example.com';

-- Check current users
SELECT id, username, email, original_password FROM app_user;

-- Note: For production, you should manually set the original_password for each user
-- based on their actual passwords. This is just a template. 