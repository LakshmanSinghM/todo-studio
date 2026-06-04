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
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
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

             
            <div className="flex rounded-lg border border-input p-1 space-x-1 bg-background">
                {(["all", "active", "completed"] as const).map((filter) => (
                    <Button
                        key={filter}
                        variant={statusFilter === filter ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setStatusFilter(filter)}
                        className={`text-xs font-semibold uppercase tracking-wider h-7.5 px-3.5 rounded-md ${
                            statusFilter === filter
                                ? "bg-primary text-primary-foreground shadow"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {filter}
                    </Button>
                ))}
            </div>
        </div>
    );
}
