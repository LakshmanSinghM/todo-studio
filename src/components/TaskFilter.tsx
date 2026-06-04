import React from "react";
import { Search } from "lucide-react";
import { StatusFilter } from "@/hooks/useTasks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaskFilterProps {
    searchVal: string;
    setSearchVal: (val: string) => void;
    statusFilter: StatusFilter;
    setStatusFilter: (status: StatusFilter) => void;
}

export default function TaskFilter({
    searchVal,
    setSearchVal,
    statusFilter,
    setStatusFilter,
}: TaskFilterProps) {

    const filters = [
        { value: "all", label: "All" },
        { value: "active", label: "Pending" },
        { value: "completed", label: "Completed" },
    ] as const;

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search tasks by title..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="pl-9 h-9"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-lg border border-input p-1 space-x-1 bg-background">
                {filters.map((filter) => (
                    <Button
                        key={filter.value}
                        variant={statusFilter === filter.value ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setStatusFilter(filter.value as StatusFilter)}
                        className="text-xs font-semibold uppercase tracking-wider h-7.5 px-3.5 rounded-md"
                    >
                        {filter.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
