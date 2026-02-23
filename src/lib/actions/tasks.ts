"use server";

import { prisma } from "../prisma";

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
  userId: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

// Create a new task
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority || "MEDIUM",
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId: input.userId,
    },
  });
  return task as Task;
}

// Get all tasks for a user
export async function getTasks(userId: string): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return tasks as Task[];
}

// Get a single task by ID
export async function getTask(id: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({
    where: { id },
  });
  return task as Task | null;
}

// Update a task
export async function updateTask(input: UpdateTaskInput): Promise<Task> {
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

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  await prisma.task.delete({
    where: { id },
  });
}

// Toggle task completion status
export async function toggleTaskStatus(id: string): Promise<Task> {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new Error("Task not found");

  const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
  const updated = await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });
  return updated as Task;
}
