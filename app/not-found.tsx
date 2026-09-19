import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have
        moved.
      </p>
      <Link href="/dashboard" className="mt-2">
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  );
}
