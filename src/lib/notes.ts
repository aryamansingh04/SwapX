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



export async function myNotes(): Promise<Note[]> {
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



export async function createNote(noteData: CreateNoteData): Promise<Note> {
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

    if (!noteData.title || noteData.title.trim() === "") {
      throw new Error("Note title is required.");
    }

    if (!noteData.body || noteData.body.trim() === "") {
      throw new Error("Note body is required.");
    }

    
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



export async function updateNote(
  id: number,
  patch: UpdateNoteData
): Promise<Note> {
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

    if (!id || id <= 0) {
      throw new Error("Valid note ID is required.");
    }

    
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

    
    if (note.author !== user.id) {
      throw new Error(
        "Unauthorized: You can only update your own notes."
      );
    }

    
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



export async function deleteNote(id: number): Promise<void> {
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

    if (!id || id <= 0) {
      throw new Error("Valid note ID is required.");
    }

    
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

    
    if (note.author !== user.id) {
      throw new Error(
        "Unauthorized: You can only delete your own notes."
      );
    }

    
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

