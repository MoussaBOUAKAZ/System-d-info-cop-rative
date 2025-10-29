"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    // Redirect authenticated users to /home/dashboard
    if (status === "authenticated") {
      router.replace("/home");
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex h-screen bg-background">
        <div className="m-auto text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  // Prevent rendering anything else while redirecting
  return null;
}
