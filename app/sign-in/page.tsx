"use client";
import { signIn, useSession } from "next-auth/react";
import { useState,useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const API_BASE='http://localhost:8080'
 useEffect(() => {
    const sendGoogleUserToBackend = async () => {
      if (session?.user?.email) {
        try {
          const res = await axios.post(`${API_BASE}/auth/google-login`, {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          });

          if (res.data.ok) {
            localStorage.setItem("jwt", res.data.token);
            router.replace("/");
          }
        } catch (err) {
          console.error("Google backend login failed:", err);
        }
      }
    };

    const storedToken = localStorage.getItem("jwt");

    if (status === "authenticated") {
      sendGoogleUserToBackend();
    } else if (storedToken) {
      router.replace("/");
    }
  }, [session, status, router]);


  async function sendMagic() {
    if (!email) {
      toast({ title: "Enter your email first" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/auth/send-magic-link`, { email });
      toast({ title: "Magic link sent! Check your inbox." });
      setLinkSent(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to send magic link", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (linkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p className="text-gray-700">
            We’ve sent a magic login link to <strong>{email}</strong>. Click the link to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>

        {/* Google Button */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 mb-6"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </button>

        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-3 text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Email input */}
        <input
          type="email"
          placeholder="Enter email to verify"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-black border p-3 rounded-lg mb-4"
        />

        {/* Verify Button */}
        <button
          onClick={sendMagic}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-800 text-white py-3 rounded-lg font-medium hover:bg-emerald-600"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Sending..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
}
