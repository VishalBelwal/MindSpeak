"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth"; //this User here contains all the session data
import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const word = [
    {
      text: "MindSpeak"
    }
  ]

  return (
    <nav className="p-4 md:p-5 text-white bg-[#242424]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xs font-bold mb-4 md:mb-0">
          <TypewriterEffectSmooth words={word} />
        </a>
        {session ? (
          <>
            <span className="mr-4 tracking-tight font-semibold text-lg">
              Welcome, {user.userName?.toLocaleUpperCase() || user.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto p-4 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 z-20" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto p-4 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" variant='outline'>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
