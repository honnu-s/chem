"use client";

import { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Magic() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  useEffect(() => {
    if (!API_BASE) {
      console.error("❌ NEXT_PUBLIC_API_BASE is NOT set");
      router.replace("/sign-in");
      return;
    }

    if (!token) {
      router.replace("/sign-in");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.post(`${API_BASE}/auth/verify-magic`, {
          token,
        });

        if (res.data.ok) {
          localStorage.setItem("jwt", res.data.token);
          router.replace("/check");
        } else {
          router.replace("/sign-in");
        }
      } catch (err) {
        console.error(err);
        router.replace("/sign-in");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Verifying Magic Link
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your secure login link...
        </p>

        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-emerald-600"></div>
        </div>
      </div>
    </div>
  );
}
