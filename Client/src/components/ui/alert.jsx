// src/components/ui/alert.jsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Info, CheckCircle2, XCircle } from "lucide-react";

const Alert = React.forwardRef(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-background text-foreground border",
      destructive:
        "bg-destructive/15 text-destructive dark:bg-destructive/25 border-destructive/50",
      warning:
        "bg-warning/15 text-warning dark:bg-warning/25 border-warning/50",
      success:
        "bg-success/15 text-success dark:bg-success/25 border-success/50",
      info: "bg-info/15 text-info dark:bg-info/25 border-info/50",
    };

    const icons = {
      default: <Info className="h-4 w-4" />,
      destructive: <XCircle className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />,
      success: <CheckCircle2 className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
          variants[variant],
          className
        )}
        {...props}
      >
        {icons[variant]}
        <div className="flex flex-col space-y-2">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };