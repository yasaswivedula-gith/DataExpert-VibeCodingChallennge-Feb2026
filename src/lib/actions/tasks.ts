"use server";

import { prisma } from "../prisma";
import { requireAuthor } from "../auth";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

// Create a new task - userId derived from session
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const author = await requireAuthor();
  
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority || "MEDIUM",
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId: author.id,
    },
  });
  return task as Task;
}

// Get all tasks for the authenticated user
export async function getTasks(): Promise<Task[]> {
  const author = await requireAuthor();
  
  const tasks = await prisma.task.findMany({
    where: { userId: author.id },
    orderBy: { createdAt: "desc" },
  });
  return tasks as Task[];
}

// Get a single task by ID - with ownership validation
export async function getTask(id: string): Promise<Task | null> {
  const author = await requireAuthor();
  
  const task = await prisma.task.findFirst({
    where: { id, userId: author.id },
  });
  return task as Task | null;
}

// Update a task - with ownership validation
export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const author = await requireAuthor();
  
  // First verify ownership
  const existing = await prisma.task.findFirst({
    where: { id: input.id, userId: author.id },
  });
  
  if (!existing) {
    throw new Error("Task not found or access denied");
  }
  
  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.dueDate !== undefined) updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;

  const task = await prisma.task.update({
    where: { id: input.id },
    data: updateData,
  });
  return task as Task;
}

// Delete a task - with ownership validation
export async function deleteTask(id: string): Promise<void> {
  const author = await requireAuthor();
  
  // First verify ownership
  const existing = await prisma.task.findFirst({
    where: { id, userId: author.id },
  });
  
  if (!existing) {
    throw new Error("Task not found or access denied");
  }
  
  await prisma.task.delete({
    where: { id },
  });
}

// Toggle task completion status - with ownership validation
export async function toggleTaskStatus(id: string): Promise<Task> {
  const author = await requireAuthor();
  
  // First verify ownership
  const task = await prisma.task.findFirst({
    where: { id, userId: author.id },
  });
  
  if (!task) {
    throw new Error("Task not found or access denied");
  }

  const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
  const updated = await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });
  return updated as Task;
}
