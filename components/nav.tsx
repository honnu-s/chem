"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export  function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
    const router=useRouter();


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        
        setShow(false);
      } else {
        
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="backdrop-blur-md bg-white/30 shadow-md border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="text-2xl font-thin text-gray-900 tracking-wide">
            ChemGuard
          </div>

          <button onClick={()=>{
            router.push('/check')
          }} className="px-5 py-2 hover:bg-white   font-semibold shadow-lg bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </nav>
    </div>
  );
}
