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
import TaskFormDialog from "@/components/TaskFormDialog";
import { Task } from "@/types/todoTypes";

export default function Home() {
  const {
    tasks,
    stats,
    loading,
    statsLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    createTask,
    toggleTask,
    editTask,
    deleteTask,
    reorderTasks,
  } = useTasks();

  const [isMounted, setIsMounted] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // prevent Next.js hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchVal);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchVal, setSearchQuery]);

  const handleDragStart = (e: React.DragEvent, id: string, index: number) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (draggedIndex !== null && draggedIndex !== index) {
      await reorderTasks(id, index);
    }
    setDraggedIndex(null);
  };

  const handleFormSubmit = async (data: { title: string; description?: string; dueDate?: string }) => {
    if (selectedTask) {
      return await editTask(selectedTask.id, data);
    } else {
      return await createTask(data);
    }
  };

  const handleAddClick = () => {
    setSelectedTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      await deleteTask(id);
    }
  };

  const dragDisabled = !!searchQuery || statusFilter !== "all";

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <Loader size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
       
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center justify-between">
         
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Todo-App
              </h1>
            

            <Button
              onClick={handleAddClick}
              variant="default"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>
        </header>

       
        <TaskStats stats={stats} statsLoading={statsLoading} />

   
        <TaskFilter
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

 
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive bg-destructive/10 p-4 text-destructive backdrop-blur-md">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

 
        <div className="space-y-3">
          {loading && tasks.length === 0 ? (
            <Loader size={32} />
          ) : tasks.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onToggle={toggleTask}
                onToggleDisabled={false}
                onEditClick={handleEditClick}
                onEditDisabled={false}
                onDeleteClick={handleDeleteClick}
                onDeleteDisabled={false}
                dragDisabled={dragDisabled}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
              />
            ))
          )}
        </div>
      </div>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        task={selectedTask}
      />
    </div>
  );
}