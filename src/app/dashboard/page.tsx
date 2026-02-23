"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface Workflow {
  id: string;
  name: string;
  status: "active" | "paused";
  trigger: string;
  actions: number;
}

// Loading skeleton component
function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-neutral-800/30 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 bg-neutral-700 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-neutral-700 rounded" />
              <div className="h-3 w-24 bg-neutral-700 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-neutral-700 rounded" />
            <div className="h-6 w-20 bg-neutral-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ 
  title, 
  description, 
  actionLabel,
  onAction 
}: { 
  title: string; 
  description: string; 
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-neutral-400 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Error state component
function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Something went wrong</h3>
      <p className="text-neutral-400 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "workflows" | "ai">("tasks");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Review project proposal", status: "in_progress", priority: "high", dueDate: "2026-02-23" },
    { id: "2", title: "Update client documentation", status: "todo", priority: "medium", dueDate: "2026-02-24" },
    { id: "3", title: "Prepare weekly report", status: "completed", priority: "low", dueDate: "2026-02-22" },
    { id: "4", title: "Schedule team meeting", status: "todo", priority: "medium" },
  ]);

  const [workflows] = useState<Workflow[]>([
    { id: "1", name: "Daily Standup Reminder", status: "active", trigger: "9:00 AM daily", actions: 2 },
    { id: "2", name: "Task Assignment AI", status: "active", trigger: "On task created", actions: 3 },
    { id: "3", name: "Weekly Report Generator", status: "paused", trigger: "Every Friday", actions: 5 },
  ]);

  const [aiSuggestions] = useState([
    { id: "1", title: "Optimize workflow: Auto-assign tasks based on team workload", impact: "High", savings: "5 hrs/week" },
    { id: "2", title: "Add automation: Send follow-up reminders for overdue tasks", impact: "Medium", savings: "2 hrs/week" },
    { id: "3", title: "Recommendation: Prioritize tasks by deadline urgency", impact: "High", savings: "3 hrs/week" },
  ]);

  // Simulate loading state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "low": return "text-green-400 bg-green-500/10";
      default: return "text-neutral-400 bg-neutral-500/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400";
      case "in_progress": return "text-blue-400";
      case "todo": return "text-neutral-400";
      case "active": return "text-green-400";
      case "paused": return "text-yellow-400";
      default: return "text-neutral-400";
    }
  };

  const handleAddTask = () => {
    // Placeholder for add task functionality
    const newTask: Task = {
      id: String(Date.now()),
      title: "New task",
      status: "todo",
      priority: "medium",
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-neutral-900/50 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-white">
                TaskFlow AI
              </Link>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-300">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-neutral-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-neutral-400">Here&apos;s what&apos;s happening with your workflows today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <p className="text-neutral-400 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-white mt-1">24</p>
            <p className="text-green-400 text-sm mt-1">+3 this week</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <p className="text-neutral-400 text-sm">Active Workflows</p>
            <p className="text-2xl font-bold text-white mt-1">8</p>
            <p className="text-neutral-500 text-sm mt-1">2 paused</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <p className="text-neutral-400 text-sm">Tasks Automated</p>
            <p className="text-2xl font-bold text-white mt-1">156</p>
            <p className="text-green-400 text-sm mt-1">This month</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <p className="text-neutral-400 text-sm">Time Saved</p>
            <p className="text-2xl font-bold text-white mt-1">23h</p>
            <p className="text-green-400 text-sm mt-1">~15 hrs/week</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-neutral-900/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "tasks"
                ? "bg-blue-600 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("workflows")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "workflows"
                ? "bg-blue-600 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Workflows
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "ai"
                ? "bg-blue-600 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            AI Suggestions
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Your Tasks</h2>
              <button 
                onClick={handleAddTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Add Task
              </button>
            </div>
            {isLoading ? (
              <LoadingSkeleton lines={4} />
            ) : error ? (
              <ErrorState message={error} onRetry={() => setError(null)} />
            ) : tasks.length === 0 ? (
              <EmptyState 
                title="No tasks yet" 
                description="Create your first task to get started with TaskFlow AI"
                actionLabel="Create Task"
                onAction={handleAddTask}
              />
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => {
                          const newStatus = task.status === "completed" ? "todo" : "completed";
                          setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
                        }}
                        className="w-5 h-5 rounded bg-neutral-700 border-neutral-600 accent-blue-600"
                      />
                      <div>
                        <p className={`text-white font-medium ${task.status === "completed" ? "line-through text-neutral-500" : ""}`}>
                          {task.title}
                        </p>
                        {task.dueDate && (
                          <p className="text-neutral-500 text-sm">Due: {task.dueDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Workflows Tab */}
        {activeTab === "workflows" && (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Your Workflows</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                + Create Workflow
              </button>
            </div>
            {isLoading ? (
              <LoadingSkeleton lines={3} />
            ) : workflows.length === 0 ? (
              <EmptyState 
                title="No workflows yet" 
                description="Create your first workflow to automate your tasks"
                actionLabel="Create Workflow"
              />
            ) : (
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">{workflow.name}</p>
                        <p className="text-neutral-500 text-sm">Trigger: {workflow.trigger} · {workflow.actions} actions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                      <button className="text-neutral-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Suggestions Tab */}
        {activeTab === "ai" && (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                <p className="text-neutral-400 text-sm">Smart suggestions to optimize your workflows</p>
              </div>
            </div>
            {isLoading ? (
              <LoadingSkeleton lines={3} />
            ) : aiSuggestions.length === 0 ? (
              <EmptyState 
                title="No AI suggestions yet" 
                description="AI suggestions will appear as you use TaskFlow AI"
              />
            ) : (
              <>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{suggestion.title}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-neutral-400">
                              <span className="text-neutral-500">Impact:</span> {suggestion.impact}
                            </span>
                            <span className="text-xs text-green-400">
                              Save: {suggestion.savings}
                            </span>
                          </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-neutral-300 text-sm">
                    💡 <span className="font-medium">AI Tip:</span> Based on your workflow patterns, you could save 10+ hours per week by enabling automatic task prioritization.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
