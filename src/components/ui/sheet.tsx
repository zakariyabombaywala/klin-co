"use client";

import type { ComponentProps, ReactNode } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { DialogOverlay } from "./dialog";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sideClass = {
  right:
    "inset-y-0 right-0 h-dvh w-full max-w-md border-l data-[state=closed]:animate-slide-out-right data-[state=open]:animate-slide-in-right",
  left: "inset-y-0 left-0 h-dvh w-[85%] max-w-sm border-r data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left",
  bottom:
    "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-lg border-t data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom",
} as const;

export interface SheetContentProps extends Omit<ComponentProps<typeof DialogPrimitive.Content>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  side?: keyof typeof sideClass;
  /** Sticky area at the bottom, e.g. checkout button. */
  footer?: ReactNode;
}

/** Drawer that slides in from an edge. Same focus-trap behaviour as Dialog. */
export function SheetContent({
  title,
  description,
  side = "right",
  footer,
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn("fixed z-50 flex flex-col border-line bg-surface shadow-lg", sideClass[side], className)}
        {...(description ? {} : { "aria-describedby": undefined })}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="grid gap-0.5">
            <DialogPrimitive.Title className="text-xl text-fg">{title}</DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-sm text-fg-muted">{description}</DialogPrimitive.Description>
            ) : null}
          </div>
          <DialogPrimitive.Close
            className="-mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Close"
          >
            <X aria-hidden="true" className="size-5" />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-line px-5 py-4">{footer}</div> : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
