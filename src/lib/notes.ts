import { supabase } from "./supabase";

export interface Note {
  id: number;
  author: string;
  title: string;
  body: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNoteData {
  title: string;
  body: string;
  is_public: boolean;
}

export interface UpdateNoteData {
  title?: string;
  body?: string;
  is_public?: boolean;
}

/**
 * Get all public notes
 * @returns Array of public notes ordered by created_at descending
 * @throws Error if the query fails
 */
export async function listPublicNotes(): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch public notes: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch public notes: Unknown error occurred");
  }
}

/**
 * Get all notes authored by the current user
 * @returns Array of user's notes ordered by created_at descending
 * @throws Error if user is not authenticated or query fails
 */
export async function myNotes(): Promise<Note[]> {
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

    // Get notes authored by the current user
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("author", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch notes: Unknown error occurred");
  }
}

/**
 * Create a new note
 * @param noteData - Note data to create
 * @returns Created note
 * @throws Error if user is not authenticated or creation fails
 */
export async function createNote(noteData: CreateNoteData): Promise<Note> {
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

    if (!noteData.title || noteData.title.trim() === "") {
      throw new Error("Note title is required.");
    }

    if (!noteData.body || noteData.body.trim() === "") {
      throw new Error("Note body is required.");
    }

    // Insert note with author = current user's ID
    const { data, error } = await supabase
      .from("notes")
      .insert({
        author: user.id,
        title: noteData.title.trim(),
        body: noteData.body.trim(),
        is_public: noteData.is_public,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to create note: No data returned");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create note: Unknown error occurred");
  }
}

/**
 * Update a note
 * Only the note author can update their own notes
 * @param id - The note ID to update
 * @param patch - Partial note data to update
 * @returns Updated note
 * @throws Error if user is not authenticated, not authorized, or update fails
 */
export async function updateNote(
  id: number,
  patch: UpdateNoteData
): Promise<Note> {
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

    if (!id || id <= 0) {
      throw new Error("Valid note ID is required.");
    }

    // First, verify that this note belongs to the current user
    const { data: note, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch note: ${fetchError.message}`);
    }

    if (!note) {
      throw new Error("Note not found.");
    }

    // Verify the user is the author
    if (note.author !== user.id) {
      throw new Error(
        "Unauthorized: You can only update your own notes."
      );
    }

    // Prepare update data (only include defined fields)
    const updateData: Record<string, any> = {};
    if (patch.title !== undefined) {
      if (patch.title.trim() === "") {
        throw new Error("Note title cannot be empty.");
      }
      updateData.title = patch.title.trim();
    }
    if (patch.body !== undefined) {
      if (patch.body.trim() === "") {
        throw new Error("Note body cannot be empty.");
      }
      updateData.body = patch.body.trim();
    }
    if (patch.is_public !== undefined) {
      updateData.is_public = patch.is_public;
    }

    // Update note
    const { data, error } = await supabase
      .from("notes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update note: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to update note: No data returned");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update note: Unknown error occurred");
  }
}

/**
 * Delete a note
 * Only the note author can delete their own notes
 * @param id - The note ID to delete
 * @throws Error if user is not authenticated, not authorized, or deletion fails
 */
export async function deleteNote(id: number): Promise<void> {
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

    if (!id || id <= 0) {
      throw new Error("Valid note ID is required.");
    }

    // First, verify that this note belongs to the current user
    const { data: note, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch note: ${fetchError.message}`);
    }

    if (!note) {
      throw new Error("Note not found.");
    }

    // Verify the user is the author
    if (note.author !== user.id) {
      throw new Error(
        "Unauthorized: You can only delete your own notes."
      );
    }

    // Delete note
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete note: Unknown error occurred");
  }
}

