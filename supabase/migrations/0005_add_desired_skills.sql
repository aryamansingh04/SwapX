-- Add desired_skills column to profiles table
-- This migration adds a text array column to store skills the user wants to learn (for matching)

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS desired_skills TEXT[] DEFAULT '{}';

-- Add a comment to document the column
COMMENT ON COLUMN profiles.desired_skills IS 'Array of skills that the user wants to learn (used for matching algorithm)';

