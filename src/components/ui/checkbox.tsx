import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "role" | "aria-checked"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
        return (
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onCheckedChange?.(!checked)}
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center justify-center transition-all",
                    className
                )}
                data-state={checked ? "checked" : "unchecked"}
                ref={ref}
                {...props}
            >
                {checked && <Check className="h-3 w-3 stroke-[3px]" />}
            </button>
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
