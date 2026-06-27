"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function RemoveBookmarkButton({
  type,
  resourceId,
  articleId,
}: {
  type: "RESOURCE" | "ARTICLE";
  resourceId?: string;
  articleId?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleRemove() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/bookmarks?type=${type}&resourceId=${resourceId ?? ""}&articleId=${articleId ?? ""}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove bookmark");
      toast({ title: "Removed from bookmarks" });
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0"
      onClick={handleRemove}
      disabled={loading}
      aria-label="Remove bookmark"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
    </Button>
  );
}
