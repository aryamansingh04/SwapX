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

        
        const profiles = await getAllProfiles();

        
        const desiredArray = typeof desiredSkillsInput === "string"
          ? desiredSkillsInput.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
          : desiredSkillsInput;

        
        const rankedProfiles: RankedProfile[] = profiles.map((profile) => ({
          profile,
          score: scoreProfile(desiredSkillsInput, profile),
        }));

        
        rankedProfiles.sort((a, b) => {
          
          if (Math.abs(a.score - b.score) > 0.001) {
            return b.score - a.score;
          }

          
          const ratingA = a.profile.rating ?? 0;
          const ratingB = b.profile.rating ?? 0;
          if (ratingA !== ratingB) {
            return ratingB - ratingA;
          }

          
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

