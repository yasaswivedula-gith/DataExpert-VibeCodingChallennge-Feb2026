"use server";

import { prisma } from "../prisma";
import { getAuthenticatedAuthor } from "../auth";
import { rateLimit } from "../rate-limit";

export interface AISuggestionInput {
  taskTitle?: string;
  taskPriority?: string;
}

// Generate AI-powered task suggestions
// userId is derived from authenticated session, not client input
export async function generateAISuggestion(input: AISuggestionInput) {
  // Derive userId from authenticated session - NEVER trust client input
  const author = await getAuthenticatedAuthor();
  if (!author) {
    throw new Error("Unauthorized - must be logged in");
  }
  
  // Apply rate limiting to protect costs (5 suggestions per hour per user)
  const rateLimitResult = rateLimit(author.id, 5, 60 * 60 * 1000);
  if (!rateLimitResult.allowed) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(rateLimitResult.resetIn / 60000)} minutes.`);
  }
  
  const userId = author.id; // Use the authenticated user's ID
  const { taskTitle, taskPriority } = input;

  // Check if OpenAI API key is available
  const openaiApiKey = process.env.OPENAI_API_KEY;

  let suggestion: {
    title: string;
    impact: string;
    savings: string;
  };

  if (openaiApiKey && openaiApiKey.startsWith("sk-")) {
    // Real AI integration (placeholder - would need actual OpenAI call)
    suggestion = {
      title: `AI Analysis: Optimize "${taskTitle || 'your workflow'}" based on priority patterns`,
      impact: "High",
      savings: "3-5 hrs/week",
    };
  } else {
    // Smart rules-based fallback engine
    suggestion = generateRuleBasedSuggestion(taskTitle, taskPriority);
  }

  // Save the suggestion to database using authenticated userId
  const savedSuggestion = await prisma.aISuggestion.create({
    data: {
      title: suggestion.title,
      impact: suggestion.impact,
      savings: suggestion.savings,
      userId: userId, // Use the authenticated user's ID
      applied: false,
    },
  });

  return savedSuggestion;
}

// Rules-based suggestion engine
function generateRuleBasedSuggestion(title?: string, priority?: string): {
  title: string;
  impact: string;
  savings: string;
} {
  const suggestions = [
    {
      title: "Auto-assign tasks based on team workload distribution",
      impact: "High",
      savings: "5 hrs/week",
    },
    {
      title: "Set up overdue task reminders to prevent bottlenecks",
      impact: "Medium",
      savings: "2 hrs/week",
    },
    {
      title: "Priority-based scheduling: High priority tasks first",
      impact: "High",
      savings: "3 hrs/week",
    },
    {
      title: "Batch similar tasks together for efficient processing",
      impact: "Medium",
      savings: "2 hrs/week",
    },
    {
      title: "Create recurring workflow for weekly reviews",
      impact: "High",
      savings: "4 hrs/week",
    },
  ];

  // If task has specific title/priority, tailor the suggestion
  if (title && priority) {
    if (priority === "HIGH") {
      return {
        title: `Break down "${title}" into subtasks for better tracking`,
        impact: "Medium",
        savings: "1 hr/week",
      };
    }
    if (title.toLowerCase().includes("meeting")) {
      return {
        title: "Automate meeting follow-ups and action item extraction",
        impact: "High",
        savings: "3 hrs/week",
      };
    }
  }

  // Return random suggestion
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

// Get all AI suggestions for authenticated user
export async function getAISuggestions() {
  const author = await getAuthenticatedAuthor();
  if (!author) {
    throw new Error("Unauthorized");
  }

  const suggestions = await prisma.aISuggestion.findMany({
    where: { userId: author.id },
    orderBy: { createdAt: "desc" },
  });
  return suggestions;
}

// Apply an AI suggestion (mark as applied)
export async function applyAISuggestion(suggestionId: string) {
  const author = await getAuthenticatedAuthor();
  if (!author) {
    throw new Error("Unauthorized");
  }

  // Verify the suggestion belongs to the authenticated user
  const existingSuggestion = await prisma.aISuggestion.findFirst({
    where: {
      id: suggestionId,
      userId: author.id,
    },
  });

  if (!existingSuggestion) {
    throw new Error("Suggestion not found or access denied");
  }

  const suggestion = await prisma.aISuggestion.update({
    where: { id: suggestionId },
    data: { applied: true },
  });
  return suggestion;
}
