# Fix: Skills to Learn Not Showing

## Problem
The "Skills I Want to Learn" feature is not working because the required database columns don't exist in your Supabase database.

## Solution: Add the Missing Columns

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration SQL
Copy and paste this SQL into the SQL Editor:

```sql
-- Add skills_to_learn column (for profile display)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skills_to_learn TEXT[] DEFAULT '{}';

-- Add desired_skills column (for matching algorithm)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS desired_skills TEXT[] DEFAULT '{}';

-- Add comments to document the columns
COMMENT ON COLUMN profiles.skills_to_learn IS 'Array of skills that the user wants to learn (displayed on profile)';
COMMENT ON COLUMN profiles.desired_skills IS 'Array of skills that the user wants to learn (used for matching algorithm)';
```

### Step 3: Execute the SQL
1. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the success message

### Step 4: Verify the Columns
1. Go to **Table Editor** in the left sidebar
2. Select the `profiles` table
3. You should see two new columns: `skills_to_learn` and `desired_skills`

### Step 5: Test the Feature
1. Refresh your application
2. Go to your profile
3. Click "Edit" (pencil icon)
4. Add skills under "Skills I Want to Learn"
5. Save the profile
6. The skills should now appear on your profile page!

## Why This Happened
The migration files exist in your codebase (`supabase/migrations/0004_add_skills_to_learn.sql` and `0005_add_desired_skills.sql`), but they haven't been applied to your Supabase database yet.

## Alternative: Using Supabase CLI
If you have Supabase CLI installed:

```bash
cd grow-share
supabase link --project-ref your-project-ref
supabase db push
```

## Still Not Working?
1. Check the browser console (F12) for any errors
2. Verify the columns exist in the Table Editor
3. Try refreshing the page after adding the columns
4. Make sure you're logged in when testing

