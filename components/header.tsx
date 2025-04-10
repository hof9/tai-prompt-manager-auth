// components/header.tsx
"use client";

// Import Clerk components
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"; // Ensure Button is imported
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Prompts", href: "/prompts" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section (remains the same) */}
          <motion.div /* ... */ >
            <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Prompt Manager
            </span>
          </motion.div>

          {/* Navigation & Auth Section */}
          <nav className="flex items-center gap-6">
            {/* Render nav items - decide if they show always or only when signed in */}
            {/* For this app, let's show them always */}
            {navItems.map((item) => (
              <motion.div key={item.href} /* ... */ >
                <Link href={item.href} className={`... ${pathname === item.href ? "..." : "..."}`} >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* --- Clerk Auth Components --- */}
            {/* Content shown only when the user IS signed in */}
            <SignedIn>
              <UserButton /> {/* Clerk's user profile button */}
            </SignedIn>

            {/* Content shown only when the user IS NOT signed in */}
            <SignedOut>
              {/* SignInButton wraps our custom button, making it trigger the sign-in flow */}
              <SignInButton mode="modal">
                {/* You can style this button however you like */}
                <Button>Sign in</Button>
              </SignInButton>
            </SignedOut>
            {/* --- End Clerk Auth Components --- */}

          </nav>
        </div>
      </div>
    </header>
  );
};