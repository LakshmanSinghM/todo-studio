import React, { useState, useEffect } from "react";
import { Task } from "@/types/todoTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { title: string; description?: string; dueDate?: string }) => Promise<{ success: boolean; error?: string }>;
    task?: Task; // If passed, dialog is in Edit Mode; otherwise, Create Mode.
}

export default function TaskFormDialog({
    open,
    onOpenChange,
    onSubmit,
    task,
}: TaskFormDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync form values with selected task or reset
    useEffect(() => {
        if (open) {
            if (task) {
                setTitle(task.title || "");
                setDescription(task.description || "");
                // Format date string from API (usually YYYY-MM-DD or full date) to YYYY-MM-DD for input
                if (task.dueDate) {
                    try {
                        const dateObj = new Date(task.dueDate);
                        const yyyy = dateObj.getFullYear();
                        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                        const dd = String(dateObj.getDate()).padStart(2, "0");
                        setDueDate(`${yyyy}-${mm}-${dd}`);
                    } catch {
                        setDueDate("");
                    }
                } else {
                    setDueDate("");
                }
            } else {
                setTitle("");
                setDescription("");
                setDueDate("");
            }
            setValidationError(null);
        }
    }, [open, task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setValidationError("Title is required");
            return;
        }
        setValidationError(null);
        setIsSubmitting(true);
        const result = await onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate || undefined,
        });
        setIsSubmitting(false);
        if (result.success) {
            onOpenChange(false);
        } else {
            setValidationError(result.error || "Something went wrong");
        }
    };

    const isEditMode = !!task;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Task" : "Add New Task"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Make changes to your task details below."
                            : "Create a task with a title, description, and optional due date."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {validationError && (
                        <div className="text-xs font-semibold text-destructive animate-pulse">
                            {validationError}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Title <span className="text-destructive">*</span>
                        </label>
                        <Input
                            placeholder="e.g. Finish project documentation"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe the task details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Due Date
                        </label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
