"use client";

import { Analyze } from "@/components/analyze";
import useAuthGuard from "../../hooks/useauthguard";

export default function Home() {
  const allowed = useAuthGuard();

  if (!allowed) return null; 

  return <Analyze />;
}
