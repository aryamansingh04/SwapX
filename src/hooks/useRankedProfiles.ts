import { useState, useEffect } from "react";
import { getAllProfiles } from "@/lib/profile";
import { scoreProfile } from "@/lib/match";
import { Profile } from "@/types/db";

export interface RankedProfile {
  profile: Profile;
  score: number;
}

interface UseRankedProfilesReturn {
  ranked: RankedProfile[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and rank profiles based on desired skills
 */
export function useRankedProfiles(
  desiredSkillsInput: string | string[]
): UseRankedProfilesReturn {
  const [ranked, setRanked] = useState<RankedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRank = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all profiles
        const profiles = await getAllProfiles();

        // Normalize desired skills
        const desiredArray = typeof desiredSkillsInput === "string"
          ? desiredSkillsInput.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
          : desiredSkillsInput;

        // Score and rank profiles
        const rankedProfiles: RankedProfile[] = profiles.map((profile) => ({
          profile,
          score: scoreProfile(desiredSkillsInput, profile),
        }));

        // Sort: by score desc, then rating desc, then created_at desc
        rankedProfiles.sort((a, b) => {
          // Primary: score
          if (Math.abs(a.score - b.score) > 0.001) {
            return b.score - a.score;
          }

          // Secondary: rating
          const ratingA = a.profile.rating ?? 0;
          const ratingB = b.profile.rating ?? 0;
          if (ratingA !== ratingB) {
            return ratingB - ratingA;
          }

          // Tertiary: created_at (newer first)
          const dateA = a.profile.created_at ? new Date(a.profile.created_at).getTime() : 0;
          const dateB = b.profile.created_at ? new Date(b.profile.created_at).getTime() : 0;
          return dateB - dateA;
        });

        setRanked(rankedProfiles);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load profiles";
        setError(errorMessage);
        setRanked([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRank();
  }, [desiredSkillsInput]);

  return { ranked, loading, error };
}

