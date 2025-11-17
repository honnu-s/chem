'use client'

import { Analyze } from "@/components/analyze";
import useAuthGuard from "../../hooks/useauthguard"

export default function Home(){
    const session = useAuthGuard();
    if (!session) return null;
    return(<Analyze/>)
}