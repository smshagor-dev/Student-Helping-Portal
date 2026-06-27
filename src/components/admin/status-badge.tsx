import { Badge } from "@/components/ui/badge";
import type { Status } from "@prisma/client";

export function StatusBadge({ status }: { status: Status }) {
  const variant =
    status === "PUBLISHED"
      ? "success"
      : status === "DRAFT"
      ? "secondary"
      : "outline";

  return <Badge variant={variant}>{status}</Badge>;
}
