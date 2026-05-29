import { cn } from "@/lib/utils";

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
