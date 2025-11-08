import { supabase } from "./supabase";

/**
 * Upload a proof file to Supabase Storage
 * @param file - The file to upload
 * @returns Public URL of the uploaded file
 * @throws Error if upload fails or file is invalid
 */
export async function uploadProof(file: File): Promise<string> {
  try {
    // Validate file
    if (!file) {
      throw new Error("File is required.");
    }

    // Extract file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!fileExtension) {
      throw new Error("File must have an extension.");
    }

    // Generate secure random filename
    const randomUUID = crypto.randomUUID();
    const fileName = `${randomUUID}.${fileExtension}`;
    const filePath = fileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("proofs")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to upload file: No data returned");
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("proofs")
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file");
    }

    return urlData.publicUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload proof: Unknown error occurred");
  }
}

