"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuthGuard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const jwt = localStorage.getItem("jwt");
      console.log(jwt)
      if (!jwt) {
        router.replace("/sign-in");
        return;
      }

      setChecked(true);
    };

    setTimeout(checkAuth, 50);
  }, [router]);

  return checked; 
}
