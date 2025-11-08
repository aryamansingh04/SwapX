import { supabase } from "./supabase";
import { Profile } from "@/types/db";


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



export async function getAllProfiles(): Promise<Profile[]> {
  try {
    
    let { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, bio, skills, skills_to_learn, desired_skills, rating, created_at")
      .order("created_at", { ascending: false });

    
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



export async function createMyProfile(
  profileData: CreateProfileData
): Promise<Profile> {
  try {
    
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

    
    
    const insertData: Record<string, any> = {
      id: user.id,
      username: profileData.username,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url || null,
      bio: profileData.bio || null,
      skills: profileData.skills || [],
    };
    
    
    if (profileData.skills_to_learn !== undefined) {
      insertData.skills_to_learn = profileData.skills_to_learn || [];
    }
    
    
    
    if (profileData.desired_skills !== undefined) {
      insertData.desired_skills = profileData.desired_skills || [];
    } else if (profileData.skills_to_learn !== undefined) {
      
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
      
      if (error.message?.includes("skills_to_learn") || error.code === "42703") {
        console.warn("skills_to_learn column may not exist in database. Attempting insert without it...");
        
        const retryInsertData: Record<string, any> = {
          id: user.id,
          username: profileData.username,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url || null,
          bio: profileData.bio || null,
          skills: profileData.skills || [],
        };
        
        
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



export async function getMyProfile(): Promise<Profile | null> {
  try {
    
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

    
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    
    if (error && (error.message?.includes("skills_to_learn") || error.message?.includes("desired_skills") || error.code === "42703")) {
      console.warn("Optional columns may not exist. Fetching without them...");
      
      let retryResult = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, skills, desired_skills, rating, created_at")
        .eq("id", user.id)
        .single();
      
      
      if (retryResult.error && (retryResult.error.message?.includes("desired_skills") || retryResult.error.code === "42703")) {
        retryResult = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, bio, skills, rating, created_at")
          .eq("id", user.id)
          .single();
      }
      
      if (retryResult.error) {
        
        if (retryResult.error.code === "PGRST116" || retryResult.error.message?.includes("No rows")) {
          return null;
        }
        throw new Error(`Failed to get profile: ${retryResult.error.message}`);
      }
      
      return {
        ...retryResult.data,
        skills_to_learn: retryResult.data?.skills_to_learn || [],
        desired_skills: retryResult.data?.desired_skills || [],
      };
    }

    if (error) {
      
      
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        return null;
      }
      throw new Error(`Failed to get profile: ${error.message}`);
    }

    
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



export async function updateMyProfile(
  patch: UpdateProfileData
): Promise<Profile> {
  try {
    
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

    
    const updateData: Record<string, any> = {};
    if (patch.username !== undefined) updateData.username = patch.username;
    if (patch.full_name !== undefined) updateData.full_name = patch.full_name;
    if (patch.avatar_url !== undefined) updateData.avatar_url = patch.avatar_url;
    if (patch.bio !== undefined) updateData.bio = patch.bio;
    if (patch.skills !== undefined) updateData.skills = patch.skills || [];
    
    
    const hasSkillsToLearn = patch.skills_to_learn !== undefined;
    if (hasSkillsToLearn) {
      updateData.skills_to_learn = patch.skills_to_learn || [];
    }
    
    
    if (patch.desired_skills !== undefined) {
      updateData.desired_skills = patch.desired_skills || [];
    } else if (hasSkillsToLearn) {
      
      
      updateData.desired_skills = patch.skills_to_learn || [];
      console.log("Syncing desired_skills with skills_to_learn:", updateData.desired_skills);
    }

    console.log("Sending update to Supabase:", updateData);

    
    let { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      
      if ((error.message?.includes("skills_to_learn") || error.message?.includes("desired_skills") || error.code === "42703")) {
        console.warn("Optional columns may not exist in database. Attempting update without them...");
        
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



export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    
    if (error && (error.message?.includes("skills_to_learn") || error.message?.includes("desired_skills") || error.code === "42703")) {
      console.warn("Optional columns may not exist. Fetching without them...");
      
      let retryResult = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, skills, desired_skills, rating, created_at")
        .eq("id", id)
        .single();
      
      
      if (retryResult.error && (retryResult.error.message?.includes("desired_skills") || retryResult.error.code === "42703")) {
        retryResult = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, bio, skills, rating, created_at")
          .eq("id", id)
          .single();
      }
      
      if (retryResult.error) {
        
        if (retryResult.error.code === "PGRST116" || retryResult.error.message?.includes("No rows")) {
          return null;
        }
        throw new Error(`Failed to get profile: ${retryResult.error.message}`);
      }
      
      return {
        ...retryResult.data,
        skills_to_learn: retryResult.data?.skills_to_learn || [],
        desired_skills: retryResult.data?.desired_skills || [],
      };
    }

    if (error) {
      
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        return null;
      }
      throw new Error(`Failed to get profile: ${error.message}`);
    }

    
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



export async function updateDesiredSkills(skills: string[]): Promise<Profile> {
  try {
    
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

    
    let { data, error } = await supabase
      .from("profiles")
      .update({ desired_skills: skills || [] })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      
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

