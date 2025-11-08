-- Create proofs table if it doesn't exist
CREATE TABLE IF NOT EXISTS proofs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT proofs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
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

-- Add comment to table
COMMENT ON TABLE proofs IS 'Stores proof documents uploaded by users for their skills';
COMMENT ON COLUMN proofs.user_id IS 'Reference to the user who uploaded the proof';
COMMENT ON COLUMN proofs.skill IS 'The skill name this proof demonstrates';
COMMENT ON COLUMN proofs.file_url IS 'Public URL of the uploaded proof file';
COMMENT ON COLUMN proofs.file_type IS 'Type of file: pdf, image, or video';

