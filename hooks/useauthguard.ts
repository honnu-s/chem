import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAuthGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      router.replace("/sign-in");
    } else {
      setReady(true);
    }
  }, [router]);

  return ready;
}
