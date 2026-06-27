"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-1 text-muted-foreground max-w-sm">
        An unexpected error occurred. You can try again or return to the home page.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
