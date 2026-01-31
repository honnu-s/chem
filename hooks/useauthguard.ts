"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function useAuthGuard(): boolean {
  const { status } = useSession();
  const router = useRouter();

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated" && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/sign-in");
    }
  }, [status, router]);

  if (status === "authenticated") return true;

  return false;
}
