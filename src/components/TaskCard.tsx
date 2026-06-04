import React from "react";
import { Task } from "@/types/todoTypes";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, GripVertical, Edit3, Trash2 } from "lucide-react";

interface TaskCardProps {
    task: Task;
    index: number;
    onToggleDisabled?: boolean;
    onToggle?: (id: string) => void;
    onEditDisabled?: boolean;
    onEditClick?: (task: Task) => void;
    onDeleteDisabled?: boolean;
    onDeleteClick?: (id: string) => void;
    dragDisabled?: boolean;
    onDragStart?: (e: React.DragEvent, id: string, index: number) => void;
    onDragOver?: (e: React.DragEvent, index: number) => void;
    onDragEnd?: (e: React.DragEvent) => void;
}

export default function TaskCard({
    task,
    index,
    onToggleDisabled = true,
    onToggle,
    onEditDisabled = true,
    onEditClick,
    onDeleteDisabled = true,
    onDeleteClick,
    dragDisabled = true,
    onDragStart,
    onDragOver,
    onDragEnd,
}: TaskCardProps) {
    const checkIfOverdue = (dueDateStr?: string, completed?: boolean) => {
        if (!dueDateStr || completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(dueDateStr);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const formatDueDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isOverdue = checkIfOverdue(task.dueDate, task.completed);

    return (
        <Card
            draggable={!dragDisabled}
            onDragStart={(e) => onDragStart?.(e, task.id, index)}
            onDragOver={(e) => onDragOver?.(e, index)}
            onDragEnd={onDragEnd}
            className={`group relative flex items-center justify-between gap-4 p-4 transition-all duration-250 ${
                task.completed
                    ? "opacity-60 bg-muted/40"
                    : isOverdue
                    ? "border-destructive bg-destructive/10"
                    : "bg-card hover:bg-muted/30"
            } ${!dragDisabled ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
            <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">
                    <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onToggle?.(task.id)}
                        disabled={onToggleDisabled}
                    />
                </div>

                {!dragDisabled && (
                    <div className="mt-1 flex-shrink-0 text-muted-foreground md:block hidden">
                        <GripVertical className="h-4 w-4" />
                    </div>
                )}

                <div className="space-y-1 min-w-0">
                    <h4
                        className={`font-semibold tracking-tight break-words text-sm text-foreground ${
                            task.completed ? "line-through text-muted-foreground" : ""
                        }`}
                    >
                        {task.title}
                    </h4>
                    {task.description && (
                        <p
                            className={`text-xs text-muted-foreground break-words line-clamp-2 ${
                                task.completed ? "line-through opacity-80" : ""
                            }`}
                        >
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {task.dueDate && (
                            <Badge
                                variant={isOverdue ? "destructive" : "secondary"}
                                className="gap-1 px-1.5 py-0.5 text-[10px] font-medium"
                            >
                                <Calendar className="h-3 w-3" />
                                {formatDueDate(task.dueDate)}
                            </Badge>
                        )}

                        {isOverdue && (
                            <Badge
                                variant="destructive"
                                className="gap-1 px-1.5 py-0.5 text-[10px] font-semibold animate-pulse"
                            >
                                <AlertTriangle className="h-3 w-3" />
                                Overdue
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    disabled={onEditDisabled}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEditClick?.(task)}
                    title="Edit Task"
                >
                    <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                    disabled={onDeleteDisabled}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeleteClick?.(task.id)}
                    title="Delete Task"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </Card>
    );
}
