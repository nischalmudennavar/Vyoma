import { cn } from "@/lib/utils";
import { useVyomaSelector } from "@/store/use-vyoma-store";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Whether to apply global UI opacity settings to this container */
  applyUiOpacity?: boolean;
  /** The HTML element to render as */
  as?: React.ElementType;
}

/**
 * Universal container component for all layouts and overlays.
 * Optionally synchronizes with the global UI opacity setting.
 */
export function Container({
  children,
  className,
  applyUiOpacity = false,
  as: Component = "div",
  style,
  ...props
}: ContainerProps) {
  const { uiOpacity } = useVyomaSelector(["uiOpacity"]);

  return (
    <Component
      className={cn(className)}
      style={{
        ...style,
        ...(applyUiOpacity ? { opacity: uiOpacity / 100 } : {}),
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
