/**
 * Generate a unique user ID from email address
 * Uses a simple hash function to create a consistent ID for each email
 */
export function generateUserIdFromEmail(email: string): string {
  // Simple hash function to convert email to a unique ID
  let hash = 0;
  const normalizedEmail = email.toLowerCase().trim();
  for (let i = 0; i < normalizedEmail.length; i++) {
    const char = normalizedEmail.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to positive number and ensure it's a string
  return Math.abs(hash).toString();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

