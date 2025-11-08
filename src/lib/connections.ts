import { supabase } from "./supabase";

export interface Connection {
  id: number;
  user_id: string;
  partner_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at?: string;
  updated_at?: string;
}



export async function requestConnection(partnerId: string): Promise<Connection> {
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

    if (!partnerId || partnerId.trim() === "") {
      throw new Error("Partner ID is required.");
    }

    if (user.id === partnerId) {
      throw new Error("Cannot request a connection with yourself.");
    }

    
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



export async function acceptConnection(id: number): Promise<Connection> {
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

    
    if (connection.user_id !== user.id && connection.partner_id !== user.id) {
      throw new Error(
        "Unauthorized: You can only accept connections that involve you."
      );
    }

    
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



export async function myConnections(): Promise<Connection[]> {
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

