import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

const DialogContext = React.createContext<{
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}>({});

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-all duration-200 animate-in fade-in"
                        onClick={() => onOpenChange?.(false)}
                    />
                    <div className="z-50 w-full max-w-md relative animate-in zoom-in-95 duration-200">
                        {children}
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
}

const DialogTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext);
    return (
        <button
            type="button"
            ref={ref}
            onClick={() => onOpenChange?.(true)}
            className={className}
            {...props}
        />
    );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext);
    return (
        <div
            ref={ref}
            className={cn(
                "grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg rounded-lg md:w-full",
                className
            )}
            {...props}
        >
            {children}
            <button
                type="button"
                onClick={() => onOpenChange?.(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Close</span>
            </button>
        </div>
    );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

export {
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
