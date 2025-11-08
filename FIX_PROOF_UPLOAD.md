# Fix: Proof Upload Not Working

## Problem
Proof uploads are not working because either:
1. The `proofs` table doesn't exist in your database
2. The `proofs` storage bucket doesn't exist
3. Storage policies are not configured

## Solution: Complete Setup

### Step 1: Create the Storage Bucket

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket**
5. Enter bucket name: `proofs`
6. Make it **Public** (toggle "Public bucket")
7. Click **Create bucket**

### Step 2: Set Up Storage Policies

1. Click on the `proofs` bucket you just created
2. Go to **Policies** tab
3. Click **New Policy**
4. Create these policies:

**Policy 1: Allow authenticated users to upload**
- Policy name: `Allow authenticated uploads`
- Allowed operation: `INSERT`
- Policy definition:
```sql
bucket_id = 'proofs' AND auth.role() = 'authenticated'
```

**Policy 2: Allow public read access**
- Policy name: `Allow public read`
- Allowed operation: `SELECT`
- Policy definition:
```sql
bucket_id = 'proofs'
```

### Step 3: Create the Proofs Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste this SQL:

```sql
-- Create proofs table
CREATE TABLE IF NOT EXISTS proofs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS proofs_user_id_idx ON proofs(user_id);

-- Create index on skill for filtering
CREATE INDEX IF NOT EXISTS proofs_skill_idx ON proofs(skill);

-- Enable RLS (Row Level Security)
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;

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
CREATE TRIGGER update_proofs_updated_at
  BEFORE UPDATE ON proofs
  FOR EACH ROW
  EXECUTE FUNCTION update_proofs_updated_at();
```

3. Click **Run** to execute the SQL

### Step 4: Verify Setup

1. Check **Storage** → `proofs` bucket exists and is public
2. Check **Table Editor** → `proofs` table exists
3. Check **Storage Policies** → Policies are configured
4. Check **Database Policies** → RLS policies are set

### Step 5: Test Upload

1. Refresh your application
2. Go to your profile
3. Upload a proof for one of your skills
4. The proof should appear immediately
5. Refresh the page - proof should still be there

## Quick Checklist

- [ ] `proofs` storage bucket exists and is **public**
- [ ] Storage policies allow uploads and reads
- [ ] `proofs` table exists in database
- [ ] RLS policies are enabled on `proofs` table
- [ ] Database policies allow insert/select for authenticated users

## Common Errors

### "Bucket not found"
→ Create the `proofs` storage bucket (Step 1)

### "Proofs table does not exist"
→ Run the SQL migration (Step 3)

### "Permission denied"
→ Check storage and database policies (Steps 2 & 3)

### "Failed to upload file"
→ Verify bucket is public and policies allow uploads

## Still Not Working?

1. Check browser console (F12) for detailed error messages
2. Verify you're logged in (proofs require authentication)
3. Check file size (Supabase has upload limits)
4. Verify all steps above are completed
5. Try uploading a small test file first

