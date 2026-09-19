"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { IconLogOut, IconSparkles } from "@/components/ui/Icons";
import { getFriendlyErrorMessage } from "@/lib/errors";

export const Header = () => {
  const { user, status, logout } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast({ tone: "success", title: "Signed out" });
      router.push("/login");
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't sign out",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={status === "authenticated" ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
            <IconSparkles className="h-4 w-4" />
          </span>
          <span>Prep Kit</span>
        </Link>

        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[14rem] truncate text-sm text-muted-foreground sm:inline">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              leftIcon={<IconLogOut className="h-4 w-4" />}
            >
              Sign out
            </Button>
          </div>
        ) : status === "loading" ? (
          <div className="h-9 w-24" aria-hidden="true" />
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
