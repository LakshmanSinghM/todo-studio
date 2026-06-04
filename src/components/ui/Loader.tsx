import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
    className?: string;
    size?: number;
}

export default function Loader({ className = "text-primary", size = 32 }: LoaderProps) {
    return (
        <div className="flex items-center justify-center p-4">
            <Loader2 className={`animate-spin ${className}`} style={{ width: size, height: size }} />
        </div>
    );
}
