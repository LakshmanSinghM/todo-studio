"use client";

import React, { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import TaskStats from "@/components/TaskStats";
import TaskFilter from "@/components/TaskFilter";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/EmptyState";

export default function Home() {
    const { tasks, stats, loading, statsLoading, error, statusFilter, setStatusFilter, searchQuery, setSearchQuery, } = useTasks();

    const [isMounted, setIsMounted] = useState(false);
    const [searchVal, setSearchVal] = useState("");

    //prevent Next.js hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchVal);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchVal, setSearchQuery]);

    if (!isMounted) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <Loader size={36} className="text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 text-slate-100 sm:p-6 md:p-8">
            <div className="mx-auto max-w-4xl space-y-8">


                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                            Task Studio
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Organize, track, and complete your tasks with a state-of-the-art manager.
                        </p>
                    </div>

                    <Button
                        disabled
                        className="flex items-center gap-2 px-4 py-2.5 font-semibold text-white opacity-50 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Task (Task 2)</span>
                    </Button>
                </header>


                <TaskStats stats={stats} statsLoading={statsLoading} />


                <TaskFilter
                    searchVal={searchVal}
                    setSearchVal={setSearchVal}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />


                {error && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-red-200 backdrop-blur-md">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}


                <div className="space-y-3">
                    {loading && tasks.length === 0 ? (
                        <Loader size={32} className="text-indigo-500" />
                    ) : tasks.length === 0 ? (
                        <EmptyState searchQuery={searchQuery} />
                    ) : (
                        tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onToggleDisabled={true}
                                onEditDisabled={true}
                                onDeleteDisabled={true}
                                dragDisabled={true}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}