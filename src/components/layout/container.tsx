import { cn } from "@/lib/utils";
import { useVyomaSelector } from "@/store/use-vyoma-store";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Whether to apply global UI opacity settings to this container */
  applyUiOpacity?: boolean;
  /** Whether to apply the Tactical Industrial aesthetic */
  tactical?: boolean;
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
  tactical = false,
  as: Component = "div",
  style,
  ...props
}: ContainerProps) {
  const { uiOpacity } = useVyomaSelector(["uiOpacity"]);

  return (
    <Component
      className={cn(tactical && "tactical-glass", className)}
      style={{
        ...style,
        ...(applyUiOpacity || tactical
          ? ({ "--container-opacity": uiOpacity / 100 } as React.CSSProperties)
          : {}),
        ...(tactical
          ? { backgroundColor: `rgba(26, 26, 26, ${uiOpacity / 100})` }
          : {}),
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
