"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function BookmarkButton({
  type,
  resourceId,
  articleId,
  initialBookmarked,
  isLoggedIn,
}: {
  type: "RESOURCE" | "ARTICLE";
  resourceId?: string;
  articleId?: string;
  initialBookmarked: boolean;
  isLoggedIn: boolean;
}) {
  const [bookmarked, setBookmarked] = React.useState(initialBookmarked);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function toggle() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      if (bookmarked) {
        const res = await fetch(
          `/api/bookmarks?type=${type}&resourceId=${resourceId ?? ""}&articleId=${articleId ?? ""}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to remove bookmark");
        setBookmarked(false);
        toast({ title: "Removed from bookmarks", variant: "default" });
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, resourceId, articleId }),
        });
        if (!res.ok) throw new Error("Failed to add bookmark");
        setBookmarked(true);
        toast({ title: "Saved to bookmarks", variant: "success" });
      }
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
    <Button variant={bookmarked ? "secondary" : "outline"} onClick={toggle} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {bookmarked ? "Saved" : "Save"}
    </Button>
  );
}
