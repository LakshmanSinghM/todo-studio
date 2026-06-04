import React from "react";
import { ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
    searchQuery: string;
}

export default function EmptyState({ searchQuery }: EmptyStateProps) {
    return (
        <Card className="flex flex-col items-center justify-center border-dashed border-border/80 bg-card/20 py-16 px-4 text-center backdrop-blur-sm shadow-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
                <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">No tasks here</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                {searchQuery
                    ? "No tasks match your search description."
                    : "Get started by adding a task."}
            </p>
        </Card>
    );
}
