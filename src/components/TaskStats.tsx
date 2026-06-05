import React from "react";
import { TaskStats as TaskStatsType } from "@/hooks/useTasks";
import { StatsCard } from "./StatsCard";

interface TaskStatsProps {
    stats: TaskStatsType;
    statsLoading: boolean;
}

export default function TaskStats({
    stats,
    statsLoading,
}: TaskStatsProps) {
    

    return (
        <section className="grid grid-cols-3 gap-2 py-1 overflow-x-auto">
            <StatsCard
                title="Total"
                value={stats.total}
                loading={statsLoading}
                textColor="text-foreground"
                glowColor="bg-indigo-500/10"
            />

            <StatsCard
                title="Pending"
                value={stats.active}
                loading={statsLoading}
                textColor="text-amber-500"
                glowColor="bg-amber-500/10"
            />

            <StatsCard
                title="Completed"
                value={stats.completed}
                loading={statsLoading}
                textColor="text-emerald-500"
                glowColor="bg-emerald-500/10"
            />
        </section>
    );
}