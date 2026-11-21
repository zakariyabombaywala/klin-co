export type ToastTone = "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Optional action, e.g. "View cart". Rendered as a link when `href` is set. */
  action?: { label: string; href?: string; onClick?: () => void };
  /** Milliseconds before auto-dismiss. Errors stay a little longer by default. */
  duration?: number;
}

export interface ToastRecord extends Required<Pick<ToastOptions, "title" | "tone" | "duration">> {
  id: string;
  description?: string;
  action?: ToastOptions["action"];
  open: boolean;
}

type Listener = () => void;

let toasts: ToastRecord[] = [];
const listeners = new Set<Listener>();
let counter = 0;
const MAX_VISIBLE = 3;
// Must be the same array every call: React compares snapshots by reference.
const SERVER_SNAPSHOT: ToastRecord[] = [];

function emit() {
  for (const listener of listeners) listener();
}

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): ToastRecord[] {
    return toasts;
  },
  getServerSnapshot(): ToastRecord[] {
    return SERVER_SNAPSHOT;
  },
  dismiss(id: string) {
    toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
    emit();
  },
  remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
};

/** Show a toast from anywhere in client code: toast({ title: "Added to cart", tone: "success" }). */
export function toast(options: ToastOptions): string {
  counter += 1;
  const id = `toast-${counter}`;
  const tone = options.tone ?? "info";
  const record: ToastRecord = {
    id,
    title: options.title,
    description: options.description,
    action: options.action,
    tone,
    duration: options.duration ?? (tone === "error" ? 8000 : 5000),
    open: true,
  };
  toasts = [...toasts, record].slice(-MAX_VISIBLE);
  emit();
  return id;
}

toast.success = (title: string, description?: string) => toast({ title, description, tone: "success" });
toast.error = (title: string, description?: string) => toast({ title, description, tone: "error" });
toast.info = (title: string, description?: string) => toast({ title, description, tone: "info" });
