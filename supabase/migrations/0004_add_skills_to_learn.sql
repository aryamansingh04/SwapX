-- Add skills_to_learn column to profiles table
-- This migration adds a text array column to store skills the user wants to learn

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skills_to_learn TEXT[] DEFAULT '{}';

-- Add a comment to document the column
COMMENT ON COLUMN profiles.skills_to_learn IS 'Array of skills that the user wants to learn';

