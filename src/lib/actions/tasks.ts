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

// Input validation helpers
function validateTaskStatus(status: string): status is TaskStatus {
  return ["TODO", "IN_PROGRESS", "COMPLETED"].includes(status);
}

function validateTaskPriority(priority: string): priority is TaskPriority {
  return ["LOW", "MEDIUM", "HIGH"].includes(priority);
}

function validateCreateTaskInput(input: CreateTaskInput): void {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error("Title is required");
  }
  if (input.title.trim().length > 200) {
    throw new Error("Title must be 200 characters or less");
  }
  if (input.description && input.description.length > 1000) {
    throw new Error("Description must be 1000 characters or less");
  }
  if (input.priority && !validateTaskPriority(input.priority)) {
    throw new Error("Invalid priority. Must be LOW, MEDIUM, or HIGH");
  }
  if (input.dueDate) {
    const date = new Date(input.dueDate);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid due date format");
    }
  }
}

function validateUpdateTaskInput(input: UpdateTaskInput): void {
  if (input.title !== undefined && input.title.trim().length === 0) {
    throw new Error("Title cannot be empty");
  }
  if (input.title && input.title.trim().length > 200) {
    throw new Error("Title must be 200 characters or less");
  }
  if (input.description && input.description.length > 1000) {
    throw new Error("Description must be 1000 characters or less");
  }
  if (input.status && !validateTaskStatus(input.status)) {
    throw new Error("Invalid status. Must be TODO, IN_PROGRESS, or COMPLETED");
  }
  if (input.priority && !validateTaskPriority(input.priority)) {
    throw new Error("Invalid priority. Must be LOW, MEDIUM, or HIGH");
  }
  if (input.dueDate) {
    const date = new Date(input.dueDate);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid due date format");
    }
  }
}

// Create a new task - userId derived from session
export async function createTask(input: CreateTaskInput): Promise<Task> {
  validateCreateTaskInput(input);
  
  const author = await requireAuthor();
  
  const task = await prisma.task.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim(),
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
  validateUpdateTaskInput(input);
  
  const author = await requireAuthor();
  
  // First verify ownership
  const existing = await prisma.task.findFirst({
    where: { id: input.id, userId: author.id },
  });
  
  if (!existing) {
    throw new Error("Task not found or access denied");
  }
  
  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.description !== undefined) updateData.description = input.description?.trim();
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
