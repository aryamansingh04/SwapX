import { supabase } from "./supabase";

export interface Proof {
  id: number;
  user_id: string;
  skill: string;
  file_url: string;
  file_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProofWithSkill {
  type: string;
  url: string;
  skill: string;
}

/**
 * Get all proofs for a specific user
 * @param userId - The user ID to get proofs for
 * @returns Array of proofs
 */
export async function getUserProofs(userId: string): Promise<ProofWithSkill[]> {
  try {
    const { data, error } = await supabase
      .from("proofs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist or no proofs, return empty array
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        return [];
      }
      throw new Error(`Failed to fetch proofs: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform database proofs to the format expected by the UI
    return data.map((proof: Proof) => ({
      type: proof.file_type || "pdf",
      url: proof.file_url,
      skill: proof.skill,
    }));
  } catch (error) {
    console.error("Error fetching proofs:", error);
    // Return empty array on error instead of throwing
    return [];
  }
}

/**
 * Get proofs for the current authenticated user
 * @returns Array of proofs
 */
export async function getMyProofs(): Promise<ProofWithSkill[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    return getUserProofs(user.id);
  } catch (error) {
    console.error("Error fetching my proofs:", error);
    return [];
  }
}

/**
 * Save a proof to the database
 * @param skill - The skill name
 * @param fileUrl - The URL of the uploaded file
 * @param fileType - The type of file (pdf, video, image)
 * @returns The created proof
 * @throws Error if save fails or user is not authenticated
 */
export async function saveProof(
  skill: string,
  fileUrl: string,
  fileType: string
): Promise<Proof> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    if (!user) {
      throw new Error("User is not authenticated. Please sign in first.");
    }

    if (!skill || skill.trim() === "") {
      throw new Error("Skill name is required.");
    }

    if (!fileUrl || fileUrl.trim() === "") {
      throw new Error("File URL is required.");
    }

    // Insert proof into database
    console.log("Inserting proof into database:", {
      user_id: user.id,
      skill: skill.trim(),
      file_url: fileUrl,
      file_type: fileType || "pdf",
    });
    
    const { data, error } = await supabase
      .from("proofs")
      .insert({
        user_id: user.id,
        skill: skill.trim(),
        file_url: fileUrl,
        file_type: fileType || "pdf",
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting proof:", error);
      // Check if it's a table doesn't exist error
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        throw new Error(`Proofs table does not exist in database. Please run the migration to create it. Error: ${error.message}`);
      }
      throw new Error(`Failed to save proof: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to save proof: No data returned");
    }

    console.log("Proof saved successfully to database:", data);
    
    // Verify the proof was saved by fetching it immediately
    const { data: verifyData, error: verifyError } = await supabase
      .from("proofs")
      .select("*")
      .eq("id", data.id)
      .single();
    
    if (verifyError) {
      console.warn("Warning: Could not verify proof was saved:", verifyError);
    } else if (verifyData) {
      console.log("Verified proof exists in database:", verifyData);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to save proof: Unknown error occurred");
  }
}

