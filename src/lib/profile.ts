import { supabase } from "./supabase";
import { Profile } from "@/types/db";

// Re-export Profile type for backwards compatibility
export type { Profile };

export interface CreateProfileData {
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  skills_to_learn?: string[];
  desired_skills?: string[];
}

export interface UpdateProfileData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  skills_to_learn?: string[];
  desired_skills?: string[];
}

/**
 * Get all profiles ordered by created_at descending
 * @returns Array of profiles
 * @throws Error if the query fails
 */
export async function getProfiles(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch profiles: Unknown error occurred");
  }
}

/**
 * Get all profiles with specific fields including rating
 * @returns Array of profiles with id, username, full_name, avatar_url, bio, skills, rating, created_at
 * @throws Error if the query fails
 */
export async function getAllProfiles(): Promise<Profile[]> {
  try {
    // Try to select with all columns first
    let { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, bio, skills, skills_to_learn, desired_skills, rating, created_at")
      .order("created_at", { ascending: false });

    // If column doesn't exist, retry without optional columns
    if (error && (error.message?.includes("skills_to_learn") || error.message?.includes("desired_skills") || error.code === "42703")) {
      console.warn("Optional columns may not exist. Fetching without them...");
      const retryResult = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, skills, rating, created_at")
        .order("created_at", { ascending: false });
      
      if (retryResult.error) {
        throw new Error(`Failed to fetch profiles: ${retryResult.error.message}`);
      }
      data = retryResult.data;
    } else if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    // Normalize data: ensure skills, skills_to_learn, and desired_skills are always arrays and rating defaults to 0
    return (data || []).map((profile: any) => ({
      ...profile,
      skills: profile.skills || [],
      skills_to_learn: profile.skills_to_learn || [],
      desired_skills: profile.desired_skills || [],
      rating: profile.rating ?? 0,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch profiles: Unknown error occurred");
  }
}

/**
 * Create a profile for the currently authenticated user
 * @param profileData - Profile data to create
 * @returns Created profile
 * @throws Error if user is not authenticated or creation fails
 */
export async function createMyProfile(
  profileData: CreateProfileData
): Promise<Profile> {
  try {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    if (!user) {
      throw new Error("User is not authenticated. Please sign in first.");
    }

    // Insert profile with user's ID
    // Build insert data object, only including skills_to_learn and desired_skills if provided
    const insertData: Record<string, any> = {
      id: user.id,
      username: profileData.username,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url || null,
      bio: profileData.bio || null,
      skills: profileData.skills || [],
    };
    
    // Only include skills_to_learn if provided (handle missing column gracefully)
    if (profileData.skills_to_learn !== undefined) {
      insertData.skills_to_learn = profileData.skills_to_learn || [];
    }
    
    // Include desired_skills if provided, otherwise sync with skills_to_learn
    // This ensures skills_to_learn and desired_skills stay in sync
    if (profileData.desired_skills !== undefined) {
      insertData.desired_skills = profileData.desired_skills || [];
    } else if (profileData.skills_to_learn !== undefined) {
      // If desired_skills not provided but skills_to_learn is, sync them
      insertData.desired_skills = profileData.skills_to_learn || [];
    } else {
      insertData.desired_skills = [];
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // Check if error is due to missing column
      if (error.message?.includes("skills_to_learn") || error.code === "42703") {
        console.warn("skills_to_learn column may not exist in database. Attempting insert without it...");
        // Retry without skills_to_learn (but keep desired_skills if it exists)
        const retryInsertData: Record<string, any> = {
          id: user.id,
          username: profileData.username,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url || null,
          bio: profileData.bio || null,
          skills: profileData.skills || [],
        };
        
        // Try to include desired_skills if it doesn't cause errors
        if (profileData.desired_skills !== undefined) {
          retryInsertData.desired_skills = profileData.desired_skills || [];
        }
        
        const { data: retryData, error: retryError } = await supabase
          .from("profiles")
          .insert(retryInsertData)
          .select()
          .single();
        
        if (retryError) {
          throw new Error(`Failed to create profile: ${retryError.message}`);
        }
        return retryData;
      }
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to create profile: No data returned");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create profile: Unknown error occurred");
  }
}

/**
 * Get the profile of the currently authenticated user
 * @returns User's profile or null if not found
 * @throws Error if user is not authenticated
 */
export async function getMyProfile(): Promise<Profile | null> {
  try {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    if (!user) {
      throw new Error("User is not authenticated. Please sign in first.");
    }

    // Get profile - try with all columns first
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // If error is due to missing column, try selecting specific columns
    if (error && (error.message?.includes("skills_to_learn") || error.message?.includes("desired_skills") || error.code === "42703")) {
      console.warn("Optional columns may not exist. Fetching without them...");
      // Try with desired_skills but without skills_to_learn
      let retryResult = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, skills, desired_skills, rating, created_at")
        .eq("id", user.id)
        .single();
      
      // If that also fails, try without both optional columns
      if (retryResult.error && (retryResult.error.message?.includes("desired_skills") || retryResult.error.code === "42703")) {
        retryResult = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, bio, skills, rating, created_at")
          .eq("id", user.id)
          .single();
      }
      
      if (retryResult.error) {
        // Profile not found is not an error - return null
        if (retryResult.error.code === "PGRST116" || retryResult.error.message?.includes("No rows")) {
          return null;
        }
        throw new Error(`Failed to get profile: ${retryResult.error.message}`);
      }
      // Add empty arrays for missing columns
      return {
        ...retryResult.data,
        skills_to_learn: retryResult.data?.skills_to_learn || [],
        desired_skills: retryResult.data?.desired_skills || [],
      };
    }

    if (error) {
      // Profile not found is not an error - return null
      // PGRST116 = no rows returned
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        return null;
      }
      throw new Error(`Failed to get profile: ${error.message}`);
    }

    // Ensure skills_to_learn and desired_skills exist in response
    return {
      ...data,
      skills_to_learn: data.skills_to_learn || [],
      desired_skills: data.desired_skills || [],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get profile: Unknown error occurred");
  }
}

/**
 * Update the profile of the currently authenticated user
 * @param patch - Partial profile data to update
 * @returns Updated profile
 * @throws Error if user is not authenticated or update fails
 */
export async function updateMyProfile(
  patch: UpdateProfileData
): Promise<Profile> {
  try {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    if (!user) {
      throw new Error("User is not authenticated. Please sign in first.");
    }

    console.log("Updating profile for user:", user.id, "with data:", patch);

    // Prepare update data (only include defined fields)
    const updateData: Record<string, any> = {};
    if (patch.username !== undefined) updateData.username = patch.username;
    if (patch.full_name !== undefined) updateData.full_name = patch.full_name;
    if (patch.avatar_url !== undefined) updateData.avatar_url = patch.avatar_url;
    if (patch.bio !== undefined) updateData.bio = patch.bio;
    if (patch.skills !== undefined) updateData.skills = patch.skills || [];
    
    // Only include skills_to_learn if provided (handle missing column gracefully)
    const hasSkillsToLearn = patch.skills_to_learn !== undefined;
    if (hasSkillsToLearn) {
      updateData.skills_to_learn = patch.skills_to_learn || [];
    }
    
    // Include desired_skills if provided, otherwise sync with skills_to_learn
    if (patch.desired_skills !== undefined) {
      updateData.desired_skills = patch.desired_skills || [];
    } else if (hasSkillsToLearn) {
      // If desired_skills not provided but skills_to_learn is, sync them
      // This ensures when skills_to_learn is updated, desired_skills is also updated
      updateData.desired_skills = patch.skills_to_learn || [];
      console.log("Syncing desired_skills with skills_to_learn:", updateData.desired_skills);
    }

    console.log("Sending update to Supabase:", updateData);

    // Update profile
    let { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      // Check if error is due to missing column
      if ((error.message?.includes("skills_to_learn") || error.message?.includes("desired_skills") || error.code === "42703")) {
        console.warn("Optional columns may not exist in database. Attempting update without them...");
        // Remove optional columns from update data and retry
        const { skills_to_learn, desired_skills, ...updateDataWithoutOptional } = updateData;
        const { data: retryData, error: retryError } = await supabase
          .from("profiles")
          .update(updateDataWithoutOptional)
          .eq("id", user.id)
          .select()
          .single();
        
        if (retryError) {
          throw new Error(`Failed to update profile: ${retryError.message}`);
        }
        console.warn("Profile updated successfully, but some optional columns were not saved");
        // Ensure optional fields are set to empty arrays or provided values
        return {
          ...retryData,
          skills_to_learn: retryData.skills_to_learn || updateData.skills_to_learn || [],
          desired_skills: retryData.desired_skills || updateData.desired_skills || [],
        };
      }
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to update profile: No data returned");
    }

    console.log("Profile updated successfully:", {
      id: data.id,
      full_name: data.full_name,
      skills: data.skills,
      skills_to_learn: data.skills_to_learn,
      desired_skills: data.desired_skills,
    });

    // Ensure optional fields are always arrays
    return {
      ...data,
      skills: data.skills || [],
      skills_to_learn: data.skills_to_learn || [],
      desired_skills: data.desired_skills || [],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update profile: Unknown error occurred");
  }
}

/**
 * Get a profile by ID
 * @param id - The user ID to get the profile for
 * @returns Profile or null if not found
 * @throws Error if the query fails
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    // Try to select with all columns first
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    // If error is due to missing column, try selecting specific columns
    if (error && (error.message?.includes("skills_to_learn") || error.message?.includes("desired_skills") || error.code === "42703")) {
      console.warn("Optional columns may not exist. Fetching without them...");
      // Try with desired_skills but without skills_to_learn
      let retryResult = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, skills, desired_skills, rating, created_at")
        .eq("id", id)
        .single();
      
      // If that also fails, try without both optional columns
      if (retryResult.error && (retryResult.error.message?.includes("desired_skills") || retryResult.error.code === "42703")) {
        retryResult = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, bio, skills, rating, created_at")
          .eq("id", id)
          .single();
      }
      
      if (retryResult.error) {
        // Profile not found is not an error - return null
        if (retryResult.error.code === "PGRST116" || retryResult.error.message?.includes("No rows")) {
          return null;
        }
        throw new Error(`Failed to get profile: ${retryResult.error.message}`);
      }
      // Add empty arrays for missing columns
      return {
        ...retryResult.data,
        skills_to_learn: retryResult.data?.skills_to_learn || [],
        desired_skills: retryResult.data?.desired_skills || [],
      };
    }

    if (error) {
      // Profile not found is not an error - return null
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        return null;
      }
      throw new Error(`Failed to get profile: ${error.message}`);
    }

    // Ensure skills_to_learn and desired_skills exist in response
    return {
      ...(data || {}),
      skills_to_learn: data?.skills_to_learn || [],
      desired_skills: data?.desired_skills || [],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get profile: Unknown error occurred");
  }
}

/**
 * Update desired skills for the currently authenticated user
 * @param skills - Array of desired skills to set
 * @returns Updated profile
 * @throws Error if user is not authenticated or update fails
 */
export async function updateDesiredSkills(skills: string[]): Promise<Profile> {
  try {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    if (!user) {
      throw new Error("User is not authenticated. Please sign in first.");
    }

    // Update only desired_skills
    let { data, error } = await supabase
      .from("profiles")
      .update({ desired_skills: skills || [] })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      // Check if error is due to missing column
      if (error.message?.includes("desired_skills") || error.code === "42703") {
        console.warn("desired_skills column doesn't exist. Please add it to the database.");
        throw new Error(
          "The 'desired_skills' column doesn't exist in the database. Please add it first using: ALTER TABLE profiles ADD COLUMN desired_skills TEXT[] DEFAULT '{}';"
        );
      }
      throw new Error(`Failed to update desired skills: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to update desired skills: No data returned");
    }

    return {
      ...data,
      desired_skills: data.desired_skills || [],
      skills_to_learn: data.skills_to_learn || [],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update desired skills: Unknown error occurred");
  }
}

