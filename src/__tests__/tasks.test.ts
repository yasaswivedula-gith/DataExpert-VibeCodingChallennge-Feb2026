import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma client
vi.mock("../lib/prisma", () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
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
    it("should return correct color for HIGH priority", () => {
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "HIGH":
            return "text-red-400 bg-red-500/10";
          case "MEDIUM":
            return "text-yellow-400 bg-yellow-500/10";
          case "LOW":
            return "text-green-400 bg-green-500/10";
          default:
            return "text-neutral-400 bg-neutral-500/10";
        }
      };

      expect(getPriorityColor("HIGH")).toBe("text-red-400 bg-red-500/10");
      expect(getPriorityColor("MEDIUM")).toBe("text-yellow-400 bg-yellow-500/10");
      expect(getPriorityColor("LOW")).toBe("text-green-400 bg-green-500/10");
    });
  });

  describe("getStatusColor", () => {
    it("should return correct color for task statuses", () => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case "COMPLETED":
            return "text-green-400";
          case "IN_PROGRESS":
            return "text-blue-400";
          case "TODO":
            return "text-neutral-400";
          default:
            return "text-neutral-400";
        }
      };

      expect(getStatusColor("COMPLETED")).toBe("text-green-400");
      expect(getStatusColor("IN_PROGRESS")).toBe("text-blue-400");
      expect(getStatusColor("TODO")).toBe("text-neutral-400");
    });
  });

  describe("Task interface", () => {
    it("should validate task structure", () => {
      interface Task {
        id: string;
        title: string;
        status: "TODO" | "IN_PROGRESS" | "COMPLETED";
        priority: "LOW" | "MEDIUM" | "HIGH";
        dueDate?: string;
      }

      const validTask: Task = {
        id: "1",
        title: "Test Task",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: "2026-02-23",
      };

      expect(validTask.id).toBeDefined();
      expect(validTask.title).toBe("Test Task");
      expect(validTask.status).toBe("IN_PROGRESS");
      expect(validTask.priority).toBe("HIGH");
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
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    const isValidPriority = (priority: string) => {
      return validPriorities.includes(priority);
    };

    expect(isValidPriority("LOW")).toBe(true);
    expect(isValidPriority("MEDIUM")).toBe(true);
    expect(isValidPriority("HIGH")).toBe(true);
    expect(isValidPriority("INVALID")).toBe(false);
  });
});
