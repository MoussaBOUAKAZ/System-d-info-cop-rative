"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionWatcher({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    let timer: NodeJS.Timeout;

    const logout = () => {
      signOut({ redirect: false });
      router.replace("/login");
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, 10 * 60 * 1000); 
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer); // clicks
    window.addEventListener("scroll", resetTimer);    // scrolls
    window.addEventListener("touchstart", resetTimer); // mobile

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [status, router]);

  return <>{children}</>;
}
