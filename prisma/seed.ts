import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@taskflow.ai" },
    update: {},
    create: {
      email: "demo@taskflow.ai",
      name: "Demo User",
      passwordHash: "hashed_Demo123!", // In production, use proper hashing
    },
  });

  console.log("✅ Created demo user:", demoUser.email);

  // Create sample tasks
  const tasks = [
    { title: "Review project proposal", status: "IN_PROGRESS" as const, priority: "HIGH" as const, dueDate: new Date("2026-02-23") },
    { title: "Update client documentation", status: "TODO" as const, priority: "MEDIUM" as const, dueDate: new Date("2026-02-24") },
    { title: "Prepare weekly report", status: "COMPLETED" as const, priority: "LOW" as const, dueDate: new Date("2026-02-22") },
    { title: "Schedule team meeting", status: "TODO" as const, priority: "MEDIUM" as const },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        userId: demoUser.id,
      },
    });
  }

  console.log("✅ Created sample tasks");

  // Create sample workflows
  const workflows = [
    { name: "Daily Standup Reminder", trigger: "9:00 AM daily", status: "ACTIVE" as const, actions: 2 },
    { name: "Task Assignment AI", trigger: "On task created", status: "ACTIVE" as const, actions: 3 },
    { name: "Weekly Report Generator", trigger: "Every Friday", status: "PAUSED" as const, actions: 5 },
  ];

  for (const workflow of workflows) {
    await prisma.workflow.create({
      data: {
        ...workflow,
        userId: demoUser.id,
      },
    });
  }

  console.log("✅ Created sample workflows");

  // Create AI suggestions
  const suggestions = [
    { title: "Optimize workflow: Auto-assign tasks based on team workload", impact: "High", savings: "5 hrs/week" },
    { title: "Add automation: Send follow-up reminders for overdue tasks", impact: "Medium", savings: "2 hrs/week" },
    { title: "Recommendation: Prioritize tasks by deadline urgency", impact: "High", savings: "3 hrs/week" },
  ];

  for (const suggestion of suggestions) {
    await prisma.aISuggestion.create({
      data: {
        ...suggestion,
        userId: demoUser.id,
      },
    });
  }

  console.log("✅ Created AI suggestions");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
