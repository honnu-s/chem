"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { InteractiveGridBg } from "@/components/interactivebgSignin";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

useEffect(() => {
  if (status !== "authenticated") return;

  // 🔒 Prevent infinite redirect
  const existingToken = localStorage.getItem("auth_token");
  if (existingToken) {
    router.replace("/");
    return;
  }

  const syncBackend = async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/google-login`, {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      });

      localStorage.setItem("auth_token", res.data.token);
      router.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  syncBackend();
}, [status, session, router]);




  return (
    <div className="relative min-h-screen">
      <InteractiveGridBg />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6">Sign-in</h1>

          <button
            onClick={async () => {
  try {
    setLoading(true);
    await signIn("google");
  } catch {
    setLoading(false);
    toast.error("Google authentication failed");
  }
}}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-emerald-700 to-emerald-600
              hover:from-emerald-600 hover:to-emerald-400
              text-white py-3 rounded-lg font-medium mb-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in
              </>
            ) : (
              <>
                <FcGoogle size={24} />
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
