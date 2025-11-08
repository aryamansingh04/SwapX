export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  skills: string[];
  skills_to_learn?: string[] | null;
  desired_skills?: string[] | null;
  rating?: number | null;
  created_at?: string;
}

