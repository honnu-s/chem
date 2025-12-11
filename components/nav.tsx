"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  
  const jwt = typeof window !== "undefined" 
    ? localStorage.getItem("jwt")
    : null;
  console.log(jwt)

  const handleLogout = () => {
    localStorage.removeItem("jwt");

   signOut({ redirect: false });

  

  window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShow(current < lastScrollY || current <= 50);
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"}`}>
      <nav className="backdrop-blur-md bg-white/30 shadow-md border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="text-lg md:text-2xl font-thin text-gray-900 tracking-wide">
            ChemGuard
          </div>

          <div className="flex items-center gap-4">
            {jwt ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-xs md:text-base px-2 md:px-5 py-2 bg-emerald-600 text-white font-semibold  hover:bg-emerald-700 transition"
                >
                  Log-Out
                </button>

                <button
                  onClick={() => router.push("/analytics")}
                  className="text-gray-800 hover:underline text-md tracking-wide"
                >
                  Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="px-5 py-2 bg-emerald-600 text-white font-semibold  hover:bg-emerald-700 transition"
                >
                  Sign In
                </button>

                <button
                  onClick={() => router.push("/analytics")}
                  className="text-gray-800 hover:underline text-md tracking-wide"
                >
                  Analytics
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
