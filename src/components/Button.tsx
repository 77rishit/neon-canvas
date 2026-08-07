import { forwardRef, useCallback, useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";
import { useMagnetic } from "@/hooks/useMagnetic";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground glow-primary hover:brightness-110 border border-transparent",
  secondary:
    "bg-secondary text-secondary-foreground glow-secondary hover:brightness-110 border border-transparent",
  outline:
    "bg-transparent text-primary border border-primary/50 hover:border-primary hover:bg-primary/10",
  ghost: "bg-transparent text-foreground/80 hover:text-primary hover:bg-primary/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

type Ripple = { id: number; x: number; y: number; size: number };

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  /** Pointer-follow magnetic drift. Default on. */
  magnetic?: boolean;
  /** Shows an inline spinner and blocks interaction. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    magnetic = true,
    loading = false,
    disabled,
    onPointerDown,
    children,
    ...props
  },
  ref,
) {
  const magneticRef = useMagnetic<HTMLButtonElement>(0.3);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const id = ++idRef.current;
      setRipples((r) => [
        ...r,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top, size },
      ]);
      setTimeout(() => setRipples((r) => r.filter((it) => it.id !== id)), 650);
      onPointerDown?.(e);
    },
    [onPointerDown],
  );

  return (
    <motion.button
      ref={magnetic ? magneticRef : ref}
      onPointerDown={handlePointerDown}
      whileHover={disabled || loading ? {} : { scale: 1.03 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "relative isolate overflow-hidden inline-flex" items-center justify-center gap-2 rounded-md font-display font-semibold uppercase tracking-[0.14em]",
        "transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute -z-0 rounded-full border border-current bg-current/10 animate-shockwave"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading && (
          <span
            aria-hidden
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children as React.ReactNode}
      </span>
    </motion.button>
  );
});

export default Button;
