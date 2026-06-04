import { useState, useEffect, useCallback } from "react";
import { Task } from "@/types/todoTypes";
import { ApiResponse } from "@/types/apiTypes";

export interface TaskStats {
    total: number;
    active: number;
    completed: number;
}

export type StatusFilter = "all" | "active" | "completed";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<TaskStats>({ total: 0, active: 0, completed: 0 });
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch Stats
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const res = await fetch("/api/tasks/stats");
            const data: ApiResponse<TaskStats> = await res.json();
            if (data.success && data.data) {
                setStats(data.data);
            }
        } catch (err: unknown) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // Fetch Tasks list
    const fetchTasks = useCallback(async (status: StatusFilter, query: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (status !== "all") params.append("status", status);
            if (query) params.append("q", query);

            const res = await fetch(`/api/tasks?${params.toString()}`);
            const data: ApiResponse<Task[]> = await res.json();
            if (data.success && data.data) {
                setTasks(data.data);
            } else {
                setError(data.message || "Failed to fetch tasks");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    // Trigger fetch on filter or search changes
    useEffect(() => {
        fetchTasks(statusFilter, searchQuery);
        fetchStats();
    }, [statusFilter, searchQuery, fetchTasks, fetchStats]);

    // Create Task
    const createTask = async (data: { title: string; description?: string; dueDate?: string }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const responseData: ApiResponse<Task> = await res.json();
            if (responseData.success && responseData.data) {
                // Add to list and refresh stats
                setTasks((prev) => [responseData.data!, ...prev]);
                fetchStats();
                return { success: true, data: responseData.data };
            } else {
                setError(responseData.message || "Failed to create task");
                return { success: false, error: responseData.message };
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to create task";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // Toggle Task status
    const toggleTask = async (id: string) => {
        setError(null);
        
        // Optimistic update
        let originalTasks: Task[] = [];
        setTasks((prev) => {
            originalTasks = [...prev];
            return prev.map((t) => {
                if (t.id === id) {
                    const nextCompleted = !t.completed;
                    // Update stats locally
                    setStats((currStats) => {
                        const activeDiff = nextCompleted ? -1 : 1;
                        const completedDiff = nextCompleted ? 1 : -1;
                        return {
                            ...currStats,
                            active: Math.max(0, currStats.active + activeDiff),
                            completed: Math.max(0, currStats.completed + completedDiff),
                        };
                    });
                    return { ...t, completed: nextCompleted };
                }
                return t;
            });
        });

        try {
            const res = await fetch(`/api/tasks/${id}/toggle`, { method: "PATCH" });
            const responseData: ApiResponse<Task> = await res.json();
            if (!responseData.success || !responseData.data) {
                // Revert optimistic update
                setTasks(originalTasks);
                fetchStats();
                setError(responseData.message || "Failed to toggle task");
            } else {
                // Keep the exact server updated task
                setTasks((prev) =>
                    prev.map((t) => (t.id === id ? responseData.data! : t))
                );
            }
        } catch (err: unknown) {
            // Revert optimistic update
            setTasks(originalTasks);
            fetchStats();
            setError(err instanceof Error ? err.message : "Failed to toggle task");
        }
    };

    // Edit/Update Task details
    const editTask = async (
        id: string,
        data: { title: string; description?: string; dueDate?: string }
    ) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const responseData: ApiResponse<Task> = await res.json();
            if (responseData.success && responseData.data) {
                setTasks((prev) =>
                    prev.map((t) => (t.id === id ? responseData.data! : t))
                );
                fetchStats();
                return { success: true, data: responseData.data };
            } else {
                setError(responseData.message || "Failed to edit task");
                return { success: false, error: responseData.message };
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to edit task";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // Delete Task
    const deleteTask = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            if (res.ok || res.status === 204) {
                setTasks((prev) => prev.filter((t) => t.id !== id));
                fetchStats();
                return { success: true };
            } else {
                const data: ApiResponse = await res.json();
                setError(data.message || "Failed to delete task");
                return { success: false, error: data.message };
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to delete task";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // Reorder Tasks
    const reorderTasks = async (taskId: string, newPosition: number) => {
        setError(null);

        // Optimistic reorder
        let originalTasks: Task[] = [];
        setTasks((prev) => {
            originalTasks = [...prev];
            const updated = [...prev];
            const index = updated.findIndex((t) => t.id === taskId);
            if (index !== -1) {
                const [task] = updated.splice(index, 1);
                updated.splice(newPosition, 0, task);
                // Update position fields locally
                return updated.map((t, idx) => ({ ...t, position: idx }));
            }
            return prev;
        });

        try {
            const res = await fetch("/api/tasks/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, newPosition }),
            });
            const responseData: ApiResponse<Task[]> = await res.json();
            if (responseData.success && responseData.data) {
                setTasks(responseData.data);
            } else {
                // Revert
                setTasks(originalTasks);
                setError(responseData.message || "Failed to reorder tasks");
            }
        } catch (err: unknown) {
            // Revert
            setTasks(originalTasks);
            setError(err instanceof Error ? err.message : "Failed to reorder tasks");
        }
    };

    return {
        tasks,
        stats,
        loading,
        statsLoading,
        error,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        fetchTasks: () => fetchTasks(statusFilter, searchQuery),
        createTask,
        toggleTask,
        editTask,
        deleteTask,
        reorderTasks,
    };
}
