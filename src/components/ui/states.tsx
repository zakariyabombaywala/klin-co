import type { ComponentProps, ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/** Loading placeholder. Pair with an aria-busy container or a status message. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-sm bg-surface-sunken motion-reduce:animate-none", className)}
      {...props}
    />
  );
}

interface StateProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** Buttons or links, e.g. "Clear filters". */
  action?: ReactNode;
  className?: string;
  /** Heading level for the title so the page outline stays correct. */
  headingLevel?: "h2" | "h3";
}

/** Shown when a list has nothing in it: no results, empty cart, no orders yet. */
export function EmptyState({ icon, title, description, action, className, headingLevel = "h2" }: StateProps) {
  const Heading = headingLevel;
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-md border border-dashed border-line-strong px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="grid size-14 place-items-center rounded-full bg-surface-muted text-fg-muted [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      <Heading className="text-xl text-fg">{title}</Heading>
      {description ? <div className="max-w-sm text-sm text-fg-muted">{description}</div> : null}
      {action ? <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}

/** Shown when something failed to load. Always offer a way forward (retry, go back). */
export function ErrorState({ icon, title, description, action, className, headingLevel = "h2" }: StateProps) {
  const Heading = headingLevel;
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-md border border-danger/40 bg-danger-bg/40 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="grid size-14 place-items-center rounded-full bg-danger-bg text-danger-strong [&_svg]:size-6">
        {icon ?? <CircleAlert aria-hidden="true" />}
      </div>
      <Heading className="text-xl text-fg">{title}</Heading>
      {description ? <div className="max-w-sm text-sm text-fg-muted">{description}</div> : null}
      {action ? <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
