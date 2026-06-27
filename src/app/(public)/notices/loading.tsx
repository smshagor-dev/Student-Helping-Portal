import { TableSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
        <div className="h-4 w-80 bg-muted rounded-md animate-pulse" />
      </div>
      <TableSkeleton rows={6} />
    </div>
  );
}
