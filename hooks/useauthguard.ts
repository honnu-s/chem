"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function useAuthGuard() {
  const router = useRouter();
  const { status } = useSession(); 
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () => {
      const jwt = localStorage.getItem("jwt");

      if (status === "authenticated") {
        setChecked(true);
        return;
      }

      if (jwt) {
        setChecked(true);
        return;
      }

      if (status !== "loading") {
        router.replace("/sign-in");
      }
    };

    check();
  }, [status, router]);

  return checked;
}
