import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Universal container component for all layouts.
 * Provides a full-width, flex-column base.
 */
export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "flex px-4 min-h-screen w-full flex-col bg-background text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
