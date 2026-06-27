"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadTrackButton({
  trackEndpoint,
  fileUrl,
  label = "Download",
  size = "lg",
}: {
  trackEndpoint: string;
  fileUrl: string;
  label?: string;
  size?: "sm" | "default" | "lg" | "icon";
}) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await fetch(trackEndpoint, { method: "POST" });
    } catch {
      // tracking failure shouldn't block the download
    } finally {
      setLoading(false);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} size={size}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
