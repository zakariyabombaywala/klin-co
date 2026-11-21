import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface SpinnerProps {
  className?: string;
  /** Accessible label. Omit when a parent already announces the loading state. */
  label?: string;
}

export function Spinner({ className, label }: SpinnerProps) {
  return (
    <>
      <LoaderCircle aria-hidden="true" className={cn("size-4 animate-spin motion-reduce:animate-none", className)} />
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  );
}
