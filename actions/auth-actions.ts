// actions/auth-actions.ts
"use server"; // Mark functions in this file as Server Actions/server-only

import { auth } from "@clerk/nextjs/server"; // Import server-side auth helper

/**
 * Gets the Clerk user ID for the current session.
 * Throws an error if the user is not authenticated.
 *
 * @returns {Promise<string>} The authenticated user's ID.
 * @throws {Error} If the user is not authenticated.
 */
export async function requireUserId(): Promise<string> {
  // Get the authentication context
  const { userId } = await auth();

  // Check if userId exists
  if (!userId) {
    // Throw an error if the user is not logged in
    // This error will be caught by the calling Server Action's try/catch block
    throw new Error("Unauthorized: User must be logged in.");
  }

  // Return the userId if authenticated
  return userId;
}