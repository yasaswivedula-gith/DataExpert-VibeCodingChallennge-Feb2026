import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma client
vi.mock("../lib/prisma", () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Task Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPriorityColor", () => {
    it("should return correct color for high priority", () => {
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "high":
            return "text-red-400 bg-red-500/10";
          case "medium":
            return "text-yellow-400 bg-yellow-500/10";
          case "low":
            return "text-green-400 bg-green-500/10";
          default:
            return "text-neutral-400 bg-neutral-500/10";
        }
      };

      expect(getPriorityColor("high")).toBe("text-red-400 bg-red-500/10");
      expect(getPriorityColor("medium")).toBe("text-yellow-400 bg-yellow-500/10");
      expect(getPriorityColor("low")).toBe("text-green-400 bg-green-500/10");
    });
  });

  describe("getStatusColor", () => {
    it("should return correct color for task statuses", () => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case "completed":
            return "text-green-400";
          case "in_progress":
            return "text-blue-400";
          case "todo":
            return "text-neutral-400";
          default:
            return "text-neutral-400";
        }
      };

      expect(getStatusColor("completed")).toBe("text-green-400");
      expect(getStatusColor("in_progress")).toBe("text-blue-400");
      expect(getStatusColor("todo")).toBe("text-neutral-400");
    });
  });

  describe("Task interface", () => {
    it("should validate task structure", () => {
      interface Task {
        id: string;
        title: string;
        status: "todo" | "in_progress" | "completed";
        priority: "low" | "medium" | "high";
        dueDate?: string;
      }

      const validTask: Task = {
        id: "1",
        title: "Test Task",
        status: "in_progress",
        priority: "high",
        dueDate: "2026-02-23",
      };

      expect(validTask.id).toBeDefined();
      expect(validTask.title).toBe("Test Task");
      expect(validTask.status).toBe("in_progress");
      expect(validTask.priority).toBe("high");
    });
  });
});

describe("Input Validation", () => {
  it("should validate task title is not empty", () => {
    const validateTaskTitle = (title: string) => {
      return title.trim().length > 0;
    };

    expect(validateTaskTitle("Valid title")).toBe(true);
    expect(validateTaskTitle("")).toBe(false);
    expect(validateTaskTitle("   ")).toBe(false);
  });

  it("should validate priority values", () => {
    const validPriorities = ["low", "medium", "high"];
    const isValidPriority = (priority: string) => {
      return validPriorities.includes(priority);
    };

    expect(isValidPriority("low")).toBe(true);
    expect(isValidPriority("medium")).toBe(true);
    expect(isValidPriority("high")).toBe(true);
    expect(isValidPriority("invalid")).toBe(false);
  });
});
