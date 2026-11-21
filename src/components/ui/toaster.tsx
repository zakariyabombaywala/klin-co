"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Toast as ToastPrimitive } from "radix-ui";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { toastStore, type ToastTone } from "./toast-store";

const toneIcon: Record<ToastTone, React.ReactNode> = {
  success: <CircleCheck aria-hidden="true" className="text-success" />,
  error: <CircleAlert aria-hidden="true" className="text-danger" />,
  info: <Info aria-hidden="true" className="text-link" />,
};

/**
 * Renders queued toasts. Mounted once in the root layout. Radix announces
 * each toast through an aria-live region; errors use the assertive "foreground" type.
 */
export function Toaster() {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getServerSnapshot);

  return (
    <ToastPrimitive.Provider swipeDirection="right" label="Notifications">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          open={t.open}
          duration={t.duration}
          type={t.tone === "error" ? "foreground" : "background"}
          onOpenChange={(open) => {
            if (!open) toastStore.dismiss(t.id);
          }}
          onAnimationEnd={() => {
            if (!t.open) toastStore.remove(t.id);
          }}
          className={cn(
            "group pointer-events-auto relative flex w-full items-start gap-3 rounded-md border border-line bg-surface p-4 pr-10 shadow-lg",
            "data-[state=closed]:animate-toast-out data-[state=open]:animate-toast-in",
            "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-slide-out-right data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)",
            "[&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0",
          )}
        >
          {toneIcon[t.tone]}
          <div className="grid flex-1 gap-1">
            <ToastPrimitive.Title className="text-sm font-semibold text-fg">{t.title}</ToastPrimitive.Title>
            {t.description ? (
              <ToastPrimitive.Description className="text-sm text-fg-muted">{t.description}</ToastPrimitive.Description>
            ) : null}
            {t.action ? (
              <ToastPrimitive.Action altText={t.action.label} asChild>
                {t.action.href ? (
                  <Link
                    href={t.action.href}
                    className="mt-1 w-fit text-sm font-medium text-link underline underline-offset-4 hover:decoration-2"
                  >
                    {t.action.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={t.action.onClick}
                    className="mt-1 w-fit text-sm font-medium text-link underline underline-offset-4 hover:decoration-2"
                  >
                    {t.action.label}
                  </button>
                )}
              </ToastPrimitive.Action>
            ) : null}
          </div>
          <ToastPrimitive.Close
            aria-label="Dismiss notification"
            className="absolute top-3 right-3 grid size-7 place-items-center rounded-xs text-fg-muted hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X aria-hidden="true" className="size-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed right-0 bottom-0 z-60 flex w-full max-w-sm flex-col gap-2 p-4 outline-none sm:right-4 sm:bottom-4 sm:p-0" />
    </ToastPrimitive.Provider>
  );
}
