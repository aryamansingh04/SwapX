import { supabase } from "./supabase";

export interface Message {
  id: number;
  connection_id: number;
  sender: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Send a message in a connection
 * @param connectionId - The connection ID to send the message to
 * @param content - The message content
 * @returns The inserted message
 * @throws Error if user is not authenticated, connection ID is invalid, or insertion fails
 */
export async function sendMessage(
  connectionId: number,
  content: string
): Promise<Message> {
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

    if (!connectionId || connectionId <= 0) {
      throw new Error("Valid connection ID is required.");
    }

    if (!content || content.trim() === "") {
      throw new Error("Message content is required.");
    }

    // Insert message
    const { data, error } = await supabase
      .from("messages")
      .insert({
        connection_id: connectionId,
        sender: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to send message: No data returned");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to send message: Unknown error occurred");
  }
}

/**
 * Get all messages for a connection
 * @param connectionId - The connection ID to get messages for
 * @returns Array of messages ordered by created_at ascending
 * @throws Error if user is not authenticated, connection ID is invalid, or query fails
 */
export async function getMessages(connectionId: number): Promise<Message[]> {
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

    if (!connectionId || connectionId <= 0) {
      throw new Error("Valid connection ID is required.");
    }

    // Get messages for the connection
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch messages: Unknown error occurred");
  }
}

