# Proof Upload Setup Guide

This guide explains how to ensure proof uploads are properly stored in Supabase and displayed on your profile.

## Prerequisites

1. **Supabase Storage Bucket**: You need a `proofs` storage bucket in your Supabase project.
2. **Proofs Table**: The `proofs` table must exist in your Supabase database.

## Setup Steps

### Step 1: Create the Proofs Storage Bucket

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Storage**
3. Click **New bucket**
4. Name it `proofs`
5. Make it **Public** (so proof URLs can be accessed)
6. Click **Create bucket**

### Step 2: Set Up Storage Policies

1. In the Storage section, click on the `proofs` bucket
2. Go to **Policies**
3. Add the following policies:

**Policy 1: Allow authenticated users to upload proofs**
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

Run the migration file `supabase/migrations/0006_create_proofs_table.sql` in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/migrations/0006_create_proofs_table.sql`
3. Paste and run it

Alternatively, if you have Supabase CLI set up:

```bash
cd grow-share
supabase db push
```

### Step 4: Verify Setup

1. Upload a proof on your profile page
2. Check the browser console for logs confirming:
   - File uploaded to storage
   - Proof saved to database
   - Proofs reloaded from Supabase
3. Refresh the page and verify the proof still appears
4. Check Supabase Storage to see the uploaded file
5. Check Supabase Database (`proofs` table) to see the proof record

## How It Works

1. **File Upload**: When you upload a proof, the file is uploaded to Supabase Storage (`proofs` bucket)
2. **Database Save**: The proof metadata (user_id, skill, file_url, file_type) is saved to the `proofs` table
3. **Display**: Proofs are loaded from Supabase when viewing a profile
4. **Persistence**: Proofs are permanently stored in Supabase and will persist across page reloads

## Troubleshooting

### Proofs don't appear after upload

1. Check browser console for errors
2. Verify the `proofs` table exists in Supabase
3. Verify the `proofs` storage bucket exists and is public
4. Check that storage policies are set correctly
5. Verify you're logged in (proofs require authentication)

### "Proofs table does not exist" error

Run the migration file `0006_create_proofs_table.sql` to create the table.

### "Failed to upload file" error

1. Check that the `proofs` storage bucket exists
2. Verify storage policies allow uploads
3. Check file size limits (Supabase has a default limit)

### Proofs disappear after page refresh

1. Check browser console for errors when loading proofs
2. Verify proofs exist in the `proofs` table in Supabase
3. Check that `getUserProofs()` or `getMyProofs()` is working correctly

## Testing

1. Upload a proof for a skill on your profile
2. Verify it appears immediately in the UI
3. Refresh the page
4. Verify the proof still appears
5. Check another device/browser (if logged in) to verify persistence
6. Check Supabase dashboard to verify the file and database record exist

