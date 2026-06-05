import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";

interface StatsCardProps {
    title: string;
    value: number;
    loading: boolean;
    textColor: string;
    glowColor: string;
}

export function StatsCard({
    title,
    value,
    loading,
    textColor,
    glowColor,
}: StatsCardProps) {
    return (
        <Card className="relative overflow-hidden border-border/60 bg-card/50  backdrop-blur-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex items-baseline gap-2">
                {loading ? (<Loader size={24} className={textColor} />) : (
                    <>
                        <span className={`text-3xl font-bold tracking-tight ${textColor}`}>
                            {value}
                        </span>
                    </>
                )}
            </CardContent>
        </Card>
    );
}