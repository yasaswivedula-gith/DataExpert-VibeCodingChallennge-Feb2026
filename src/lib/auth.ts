import { createSupabaseServerClient } from "./supabase/server";
import { prisma } from "./prisma";

export async function getAuthenticatedAuthor() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Look up user by supabaseUserId (the new approach)
  let author = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });

  // If not found by supabaseUserId, try by email (for backward compatibility)
  if (!author) {
    author = await prisma.user.findUnique({
      where: { email: user.email! },
    });
    
    // If found by email, update with supabaseUserId for future lookups
    if (author) {
      author = await prisma.user.update({
        where: { id: author.id },
        data: { supabaseUserId: user.id },
      });
    }
  }

  // If still not found, create a new user (sync with Supabase Auth)
  if (!author && user.email) {
    author = await prisma.user.create({
      data: {
        supabaseUserId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      },
    });
  }

  return author;
}

export async function requireAuthor() {
  const author = await getAuthenticatedAuthor();
  if (!author) {
    throw new Error("Unauthorized");
  }
  return author;
}
