# Fix: Row Level Security Policy Error

## Error Message
```
Failed to upload file: new row violates row-level security policy
```

## Problem
The `proofs` table exists, but the Row Level Security (RLS) policies are not configured correctly, or they don't allow you to insert proofs.

## Solution: Fix RLS Policies

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run This SQL to Fix Policies

Copy and paste this SQL into the SQL Editor:

```sql
-- First, drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Proofs are viewable by everyone" ON proofs;
DROP POLICY IF EXISTS "Users can insert their own proofs" ON proofs;
DROP POLICY IF EXISTS "Users can update their own proofs" ON proofs;
DROP POLICY IF EXISTS "Users can delete their own proofs" ON proofs;

-- Create policy: Users can view all proofs (public proofs)
CREATE POLICY "Proofs are viewable by everyone"
  ON proofs FOR SELECT
  USING (true);

-- Create policy: Users can insert their own proofs
CREATE POLICY "Users can insert their own proofs"
  ON proofs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own proofs
CREATE POLICY "Users can update their own proofs"
  ON proofs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own proofs
CREATE POLICY "Users can delete their own proofs"
  ON proofs FOR DELETE
  USING (auth.uid() = user_id);
```

### Step 3: Verify Policies
1. Go to **Database** → **Tables** → `proofs`
2. Click on **Policies** tab
3. You should see 4 policies:
   - Proofs are viewable by everyone (SELECT)
   - Users can insert their own proofs (INSERT)
   - Users can update their own proofs (UPDATE)
   - Users can delete their own proofs (DELETE)

### Step 4: Test Upload
1. Refresh your application
2. Try uploading a proof again
3. It should work now!

## Alternative: Complete Table Setup

If the table doesn't exist or you want to recreate it with correct policies, run this complete SQL:

```sql
-- Create proofs table if it doesn't exist
CREATE TABLE IF NOT EXISTS proofs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS proofs_user_id_idx ON proofs(user_id);
CREATE INDEX IF NOT EXISTS proofs_skill_idx ON proofs(skill);

-- Enable RLS (Row Level Security)
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Proofs are viewable by everyone" ON proofs;
DROP POLICY IF EXISTS "Users can insert their own proofs" ON proofs;
DROP POLICY IF EXISTS "Users can update their own proofs" ON proofs;
DROP POLICY IF EXISTS "Users can delete their own proofs" ON proofs;

-- Create policy: Users can view all proofs (public proofs)
CREATE POLICY "Proofs are viewable by everyone"
  ON proofs FOR SELECT
  USING (true);

-- Create policy: Users can insert their own proofs
CREATE POLICY "Users can insert their own proofs"
  ON proofs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own proofs
CREATE POLICY "Users can update their own proofs"
  ON proofs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own proofs
CREATE POLICY "Users can delete their own proofs"
  ON proofs FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_proofs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_proofs_updated_at ON proofs;
CREATE TRIGGER update_proofs_updated_at
  BEFORE UPDATE ON proofs
  FOR EACH ROW
  EXECUTE FUNCTION update_proofs_updated_at();
```

## Understanding the Policies

### SELECT Policy
- **Policy**: "Proofs are viewable by everyone"
- **Effect**: Anyone can view all proofs (public)
- **Reason**: Allows users to see proof documents on profiles

### INSERT Policy
- **Policy**: "Users can insert their own proofs"
- **Effect**: Users can only insert proofs where `user_id` matches their authenticated user ID
- **Reason**: Prevents users from uploading proofs for other users

### UPDATE Policy
- **Policy**: "Users can update their own proofs"
- **Effect**: Users can only update proofs they own
- **Reason**: Allows users to edit their own proof metadata

### DELETE Policy
- **Policy**: "Users can delete their own proofs"
- **Effect**: Users can only delete proofs they own
- **Reason**: Allows users to remove their own proofs

## Troubleshooting

### Still Getting RLS Error?
1. Make sure you're logged in (authentication required)
2. Verify RLS is enabled: `ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;`
3. Check that policies exist in the Database → Tables → proofs → Policies tab
4. Try dropping and recreating all policies (use the SQL above)

### "Policy already exists" Error?
- The SQL uses `DROP POLICY IF EXISTS` to avoid this
- If you still get this error, manually delete policies in the Supabase UI first

### "Permission denied" Error?
- Make sure you're authenticated
- Check that the INSERT policy uses `WITH CHECK (auth.uid() = user_id)`
- Verify your user ID matches the `user_id` in the insert

## Quick Fix Command

If you just need to fix the policies quickly, run this:

```sql
DROP POLICY IF EXISTS "Users can insert their own proofs" ON proofs;
CREATE POLICY "Users can insert their own proofs"
  ON proofs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

This will fix the most common issue (INSERT permission).

