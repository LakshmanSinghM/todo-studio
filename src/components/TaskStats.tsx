import React from "react";
import { TaskStats as TaskStatsType } from "@/hooks/useTasks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";

interface TaskStatsProps {
    stats: TaskStatsType;
    statsLoading: boolean;
}

export default function TaskStats({ stats, statsLoading }: TaskStatsProps) {
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <Card className="relative overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl"></div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    {statsLoading ? (
                        <Loader size={24} className="text-indigo-400" />
                    ) : (
                        <span className="text-3xl font-bold tracking-tight text-foreground">
                            {stats.total}
                        </span>
                    )}
                </CardContent>
            </Card>


            <Card className="relative overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-amber-500/10 blur-2xl"></div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    {statsLoading ? (
                        <Loader size={24} className="text-amber-400" />
                    ) : (
                        <span className="text-3xl font-bold tracking-tight text-amber-500">
                            {stats.active}
                        </span>
                    )}
                </CardContent>
            </Card>


            <Card className="relative overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/10 blur-2xl"></div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent className="flex items-baseline gap-2">
                    {statsLoading ? (
                        <Loader size={24} className="text-emerald-400" />
                    ) : (
                        <>
                            <span className="text-3xl font-bold tracking-tight text-emerald-500">
                                {stats.completed}
                            </span>
                            {stats.total > 0 && (
                                <span className="text-xs font-semibold text-emerald-500/80">
                                    {completionRate}% rate
                                </span>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
