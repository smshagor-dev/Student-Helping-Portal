import Link from "next/link";
import { GraduationCap, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <GraduationCap className="h-12 w-12 text-primary mb-4" />
      <h1 className="font-display text-4xl font-semibold">404</h1>
      <p className="mt-2 text-lg font-medium">Page not found</p>
      <p className="mt-1 text-muted-foreground max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">
            <Search className="h-4 w-4" /> Search
          </Link>
        </Button>
      </div>
    </div>
  );
}
