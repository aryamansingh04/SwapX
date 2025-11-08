# Complete Setup Checklist for Proof Upload Feature

## Is It Supabase's Fault?
**No, it's not a bug or fault.** The proof upload feature requires proper configuration in your Supabase project. The code is correct, but you need to set up:
1. ✅ Storage bucket
2. ✅ Database table
3. ✅ RLS policies

## Complete Setup Steps

### ✅ Step 1: Create Storage Bucket

1. Go to **Supabase Dashboard** → https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket**
5. Enter bucket name: `proofs`
6. **Toggle "Public bucket" to ON** (important!)
7. Click **Create bucket**

**Verify:** You should see `proofs` bucket in the Storage list

---

### ✅ Step 2: Create Database Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste this complete SQL:

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

-- Drop existing policies if they exist (to avoid conflicts)
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

3. Click **Run** to execute

**Verify:** 
- Go to **Database** → **Tables** → You should see `proofs` table
- Click on `proofs` → **Policies** tab → You should see 4 policies

---

### ✅ Step 3: Verify Storage Policies (Optional but Recommended)

1. Go to **Storage** → Click on `proofs` bucket
2. Go to **Policies** tab
3. Verify or create these policies:

**Policy 1: Allow authenticated uploads**
- Click **New Policy**
- Policy name: `Allow authenticated uploads`
- Allowed operation: `INSERT`
- Policy definition:
```sql
bucket_id = 'proofs' AND auth.role() = 'authenticated'
```

**Policy 2: Allow public read**
- Click **New Policy**
- Policy name: `Allow public read`
- Allowed operation: `SELECT`
- Policy definition:
```sql
bucket_id = 'proofs'
```

**Note:** If the bucket is public, these policies might not be strictly necessary, but they provide better security.

---

### ✅ Step 4: Test the Feature

1. **Refresh your application**
2. **Log in** to your account
3. Go to **Profile** page
4. Under "Skills I Can Teach", you should see "Upload Proof" buttons
5. Click **Upload Proof** for a skill
6. Select a file (PDF, image, or video)
7. Click **Save Proof**
8. The proof should upload and appear immediately

---

## Verification Checklist

Before testing, verify:

- [ ] `proofs` storage bucket exists and is **public**
- [ ] `proofs` database table exists
- [ ] RLS is enabled on `proofs` table
- [ ] 4 RLS policies exist (SELECT, INSERT, UPDATE, DELETE)
- [ ] You are logged in (authentication required)
- [ ] You have skills added to your profile

---

## Common Errors and Solutions

### ❌ "Bucket not found"
**Solution:** Create the `proofs` storage bucket (Step 1)

### ❌ "Proofs table does not exist"
**Solution:** Run the SQL migration (Step 2)

### ❌ "new row violates row-level security policy"
**Solution:** Run the SQL migration to create RLS policies (Step 2)

### ❌ "Failed to upload file"
**Solution:** 
- Check that bucket is public
- Verify storage policies allow uploads
- Check file size limits

### ❌ Proofs don't appear after upload
**Solution:**
- Check browser console for errors
- Verify proofs exist in database (Table Editor)
- Verify file exists in storage bucket
- Try refreshing the page

---

## Quick Test

After setup, try this:

1. Upload a small PDF file (under 5MB)
2. Check browser console (F12) - should see success messages
3. Check Supabase Storage - file should be there
4. Check Supabase Database → `proofs` table - record should be there
5. Refresh page - proof should still appear

---

## Why This Happens

The application code is correct, but Supabase requires:
1. **Storage bucket** - Where files are stored
2. **Database table** - Where metadata is stored
3. **RLS policies** - Security rules for who can do what

These need to be set up once in your Supabase project. They're not created automatically because:
- You might have multiple projects
- You might want different configurations
- Supabase gives you control over your data

---

## Still Not Working?

1. **Check browser console (F12)** for detailed error messages
2. **Verify all steps above** are completed
3. **Check Supabase Dashboard** to verify:
   - Storage bucket exists
   - Database table exists
   - Policies exist
4. **Try a different file** (smaller size, different format)
5. **Check authentication** - make sure you're logged in

---

## Summary

**Is it Supabase's fault?** No, it's a configuration requirement.

**What you need to do:**
1. Create `proofs` storage bucket (public)
2. Create `proofs` database table with RLS policies
3. Test the upload feature

**Time required:** ~5 minutes

**Difficulty:** Easy (just copy/paste SQL)

Once set up, the feature will work perfectly!

