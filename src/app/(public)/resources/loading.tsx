import { GridSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-64 bg-muted rounded-md animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded-md animate-pulse" />
      </div>
      <GridSkeleton count={6} />
    </div>
  );
}
