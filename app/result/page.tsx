'use client'
import { Result } from "@/components/result"
import useAuthGuard from "../../hooks/useauthguard"
export default function Home(){
    const allowed = useAuthGuard();
    
      if (!allowed) return null; 
    return(<Result/>)
}