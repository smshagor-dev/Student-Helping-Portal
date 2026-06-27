"use client";

import * as React from "react";

export function ViewTracker({ endpoint }: { endpoint: string }) {
  React.useEffect(() => {
    fetch(endpoint, { method: "POST" }).catch(() => {
      // silently ignore tracking failures
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
