# Fix: Storage Bucket Policy Error

## Error Message
```
Failed to upload file: new row violates row-level security policy
```

## Problem
The `proofs` storage bucket exists, but the storage policies are not configured correctly to allow file uploads.

## Solution: Set Up Storage Policies

### Step 1: Open Storage Bucket Settings

1. Go to **Supabase Dashboard** → https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Click on the `proofs` bucket
5. Click on **Policies** tab

### Step 2: Create Storage Policies

You need to create policies that allow authenticated users to upload files. Here are two options:

#### Option A: Simple Policy (Recommended)

Create **ONE policy** that allows all authenticated operations:

1. Click **New Policy**
2. Choose **For full customization**
3. Policy name: `Allow authenticated operations`
4. Allowed operations: Select **INSERT** and **SELECT**
5. Policy definition:
```sql
bucket_id = 'proofs' AND auth.role() = 'authenticated'
```
6. Click **Review** → **Save policy**

#### Option B: Separate Policies (More Granular)

Create **TWO separate policies**:

**Policy 1: Allow authenticated uploads**
1. Click **New Policy**
2. Choose **For full customization**
3. Policy name: `Allow authenticated uploads`
4. Allowed operations: **INSERT**
5. Policy definition:
```sql
bucket_id = 'proofs' AND auth.role() = 'authenticated'
```
6. Click **Review** → **Save policy**

**Policy 2: Allow public read**
1. Click **New Policy**
2. Choose **For full customization**
3. Policy name: `Allow public read`
4. Allowed operations: **SELECT**
5. Policy definition:
```sql
bucket_id = 'proofs'
```
6. Click **Review** → **Save policy**

### Step 3: Verify Policies

After creating policies, you should see them listed in the **Policies** tab:
- ✅ Allow authenticated operations (or similar)
- ✅ INSERT and SELECT operations allowed

### Step 4: Test Upload

1. **Refresh your application**
2. Try uploading a proof again
3. It should work now!

## Alternative: Using SQL Editor

If you prefer using SQL, you can also create storage policies via SQL Editor:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'proofs');

-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'proofs');
```

**Note:** Storage policies are on the `storage.objects` table, not on your custom tables.

## Quick Fix Checklist

- [ ] `proofs` storage bucket exists
- [ ] Bucket is **public** (or policies allow access)
- [ ] Storage policy exists for **INSERT** operation
- [ ] Storage policy allows `auth.role() = 'authenticated'`
- [ ] You are **logged in** when testing

## Understanding Storage Policies

### Why Storage Policies?
Supabase Storage uses policies (similar to RLS) to control who can:
- **INSERT**: Upload files
- **SELECT**: Read/download files
- **UPDATE**: Update file metadata
- **DELETE**: Delete files

### Policy Syntax
```sql
bucket_id = 'proofs' AND auth.role() = 'authenticated'
```
- `bucket_id = 'proofs'`: Only applies to the `proofs` bucket
- `auth.role() = 'authenticated'`: Only allows authenticated (logged-in) users

### Public vs Private Buckets
- **Public bucket**: Files are accessible via public URL (no SELECT policy needed for public access)
- **Private bucket**: Requires SELECT policy to read files

## Troubleshooting

### Still Getting Policy Error?
1. **Verify you're logged in** (authentication required)
2. **Check policy exists** in Storage → proofs → Policies tab
3. **Verify policy allows INSERT** operation
4. **Check policy condition** includes `auth.role() = 'authenticated'`
5. **Try recreating the policy** (delete and create new)

### "Permission denied" Error?
- Make sure policy allows INSERT for authenticated users
- Verify bucket name is exactly `proofs` (case-sensitive)
- Check that you're logged in

### Policy Not Saving?
- Make sure you click **Review** and then **Save policy**
- Check for any error messages in the UI
- Try using SQL Editor method instead

## Complete Storage Setup

If you're setting up from scratch:

1. **Create bucket**: Storage → New bucket → Name: `proofs` → Public → Create
2. **Create policy**: Storage → proofs → Policies → New Policy → Allow authenticated uploads
3. **Test**: Upload a file from your app

## Summary

The error occurs because Supabase Storage requires policies to allow file uploads, just like database tables require RLS policies.

**Quick fix:**
1. Go to Storage → proofs bucket → Policies
2. Create policy: `bucket_id = 'proofs' AND auth.role() = 'authenticated'`
3. Allow INSERT operation
4. Save and test

That's it! Your uploads should work now.

