# Add `skills_to_learn` and `desired_skills` Columns to Supabase Database

The `skills_to_learn` and `desired_skills` columns may be missing from your Supabase `profiles` table. This document explains how to add them.

## Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the following SQL:

```sql
-- Add skills_to_learn column (for profile display)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skills_to_learn TEXT[] DEFAULT '{}';

COMMENT ON COLUMN profiles.skills_to_learn IS 'Array of skills that the user wants to learn (displayed on profile)';

-- Add desired_skills column (for matching algorithm)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS desired_skills TEXT[] DEFAULT '{}';

COMMENT ON COLUMN profiles.desired_skills IS 'Array of skills that the user wants to learn (used for matching algorithm)';
```

4. Click **Run** to execute the SQL
5. Verify the column was added by checking the Table Editor

## Option 2: Using Supabase CLI

If you have Supabase CLI set up:

```bash
cd grow-share
supabase db push
```

This will apply the migration file located at `supabase/migrations/0004_add_skills_to_learn.sql`

## Option 3: Manual SQL Execution

Run this SQL directly in your Supabase SQL Editor:

```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skills_to_learn TEXT[] DEFAULT '{}';
```

## Verification

After adding the column, the application will automatically:
- Save "skills to learn" data when you complete your profile
- Load "skills to learn" data when editing your profile
- Display "skills to learn" on profile pages

## Note

The application is designed to handle the missing column gracefully:
- If the column doesn't exist, other profile data will still be saved
- You'll see a warning message that the column is missing
- Once you add the column, all future saves will include "skills to learn" data

