// actions/prompts-actions.ts
"use server";

import { db } from "@/db";
import { prompts } from "@/db/schema/prompts-schema";
import { devDelay } from "@/lib/dev-delay";
// Import Drizzle operators 'and' and 'eq' (equals)
import { and, desc, eq } from "drizzle-orm";
// Import our auth helper
import { requireUserId } from "./auth-actions";

// --- GET Prompts ---
export async function getPrompts() {
  try {
    // Get user ID; throws error if not logged in
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: Fetching prompts for user ${userId}...`);
    // Add WHERE clause to filter by user_id
    const userPrompts = await db
      .select()
      .from(prompts)
      .where(eq(prompts.user_id, userId)) // Only select prompts matching the user ID
      .orderBy(desc(prompts.created_at));

    console.log(`Server Action: Fetched ${userPrompts.length} prompts.`);
    return userPrompts;
  } catch (error) {
    console.error("Server Action Error (getPrompts):", error);
    // Propagate the specific "Unauthorized" error or a generic one
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    throw new Error("Failed to fetch prompts.");
  }
}

// --- CREATE Prompt ---
export async function createPrompt({ name, description, content }: { name: string; description: string; content: string }) {
  try {
    // Get user ID; throws error if not logged in
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: Creating prompt for user ${userId}...`);
    // Include user_id in the values being inserted
    const [newPrompt] = await db
      .insert(prompts)
      .values({
        name,
        description,
        content,
        user_id: userId, // Associate prompt with the logged-in user
      })
      .returning();

    console.log("Server Action: Prompt created:", newPrompt);
    return newPrompt;
  } catch (error) {
    console.error("Server Action Error (createPrompt):", error);
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    throw new Error("Failed to create prompt.");
  }
}

// --- UPDATE Prompt ---
export async function updatePrompt({ id, name, description, content }: { id: number; name: string; description: string; content: string }) {
  try {
    // Get user ID; throws error if not logged in
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: Updating prompt ${id} for user ${userId}...`);
    // Add user_id condition to the WHERE clause using 'and'
    const [updatedPrompt] = await db
      .update(prompts)
      .set({ name, description, content, updated_at: new Date() })
      .where(
        // Ensure BOTH the prompt ID matches AND the user ID matches
        and(eq(prompts.id, id), eq(prompts.user_id, userId))
      )
      .returning();

    // Check if a prompt was actually updated (it wouldn't if ID exists but belongs to another user)
    if (!updatedPrompt) {
      throw new Error("Prompt not found or user unauthorized to update.");
    }

    console.log("Server Action: Prompt updated:", updatedPrompt);
    return updatedPrompt;
  } catch (error) {
    console.error("Server Action Error (updatePrompt):", error);
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    // Handle the specific "not found/unauthorized" case
    if (error instanceof Error && error.message.includes("Prompt not found or user unauthorized")) {
       throw error;
    }
    throw new Error("Failed to update prompt.");
  }
}

// --- DELETE Prompt ---
export async function deletePrompt(id: number) {
  try {
    // Get user ID; throws error if not logged in
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: Deleting prompt ${id} for user ${userId}...`);
    // Add user_id condition to the WHERE clause using 'and'
    const [deletedPrompt] = await db
      .delete(prompts)
      .where(
        // Ensure BOTH the prompt ID matches AND the user ID matches
        and(eq(prompts.id, id), eq(prompts.user_id, userId))
      )
      .returning();

    // Check if a prompt was actually deleted
    if (!deletedPrompt) {
      throw new Error("Prompt not found or user unauthorized to delete.");
    }

    console.log("Server Action: Prompt deleted:", deletedPrompt);
    return deletedPrompt;
  } catch (error) {
    console.error("Server Action Error (deletePrompt):", error);
     if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    if (error instanceof Error && error.message.includes("Prompt not found or user unauthorized")) {
       throw error;
    }
    throw new Error("Failed to delete prompt.");
  }
}