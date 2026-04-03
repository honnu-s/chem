"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function useAuthGuard(): boolean {
  const { status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    setHasToken(false);
    setTokenChecked(true);
    return;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("auth_token");
      setHasToken(false);
    } else {
      setHasToken(true);
    }
  } catch {
    localStorage.removeItem("auth_token");
    setHasToken(false);
  }
  setTokenChecked(true);
}, [status]);

useEffect(() => {
  if (!tokenChecked) return;
  if (status === "loading") return;

  const fullyAuthenticated = status === "authenticated" && hasToken;

  if (!fullyAuthenticated && !hasRedirected.current) {
    hasRedirected.current = true;
    router.replace("/sign-in");
  }
}, [status, hasToken, tokenChecked, router]);

// Don't redirect while still checking
if (!tokenChecked || status === "loading") return false;
if (status === "authenticated" && hasToken) return true;
return false;
}