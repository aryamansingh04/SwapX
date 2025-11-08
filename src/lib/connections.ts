import { supabase } from "./supabase";

export interface Connection {
  id: number;
  user_id: string;
  partner_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at?: string;
  updated_at?: string;
}

/**
 * Request a connection with a partner
 * @param partnerId - The ID of the user to connect with
 * @returns Created connection request
 * @throws Error if user is not authenticated, partner ID is invalid, or creation fails
 */
export async function requestConnection(partnerId: string): Promise<Connection> {
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

    if (!partnerId || partnerId.trim() === "") {
      throw new Error("Partner ID is required.");
    }

    if (user.id === partnerId) {
      throw new Error("Cannot request a connection with yourself.");
    }

    // Insert connection request
    const { data, error } = await supabase
      .from("connections")
      .insert({
        user_id: user.id,
        partner_id: partnerId,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to request connection: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to request connection: No data returned");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to request connection: Unknown error occurred");
  }
}

/**
 * Accept a connection request
 * Only works if the current user is either the user_id or partner_id
 * @param id - The connection ID to accept
 * @returns Updated connection
 * @throws Error if user is not authenticated, not authorized, or update fails
 */
export async function acceptConnection(id: number): Promise<Connection> {
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

    // First, verify that this connection involves the current user
    const { data: connection, error: fetchError } = await supabase
      .from("connections")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch connection: ${fetchError.message}`);
    }

    if (!connection) {
      throw new Error("Connection not found.");
    }

    // Verify the user is authorized (must be either user_id or partner_id)
    if (connection.user_id !== user.id && connection.partner_id !== user.id) {
      throw new Error(
        "Unauthorized: You can only accept connections that involve you."
      );
    }

    // Update connection status to accepted
    const { data, error } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to accept connection: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to accept connection: No data returned");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to accept connection: Unknown error occurred");
  }
}

/**
 * Get all connections for the current user
 * Returns connections where the user is either user_id or partner_id
 * @returns Array of connections ordered by created_at descending
 * @throws Error if user is not authenticated or query fails
 */
export async function myConnections(): Promise<Connection[]> {
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

    // Get connections where user is either user_id or partner_id
    const { data, error } = await supabase
      .from("connections")
      .select("*")
      .or(`user_id.eq.${user.id},partner_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch connections: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch connections: Unknown error occurred");
  }
}

