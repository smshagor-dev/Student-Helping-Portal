"use client";

import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg animate-in slide-in-from-bottom-2",
            t.variant === "destructive" && "border-destructive/50 bg-destructive/5",
            t.variant === "success" && "border-emerald-500/50 bg-emerald-50"
          )}
        >
          <div className="mt-0.5 shrink-0">
            {t.variant === "destructive" && (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
            {t.variant === "success" && (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            )}
            {(!t.variant || t.variant === "default") && (
              <Info className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && (
              <p className="text-sm text-muted-foreground">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
