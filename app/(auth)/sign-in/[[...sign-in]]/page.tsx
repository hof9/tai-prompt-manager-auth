// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    // Center the sign-in component on the page
    <div className="flex justify-center items-center min-h-screen w-full">
      {/* Render Clerk's pre-built Sign In component */}
      {/* This component handles email/password, social logins, etc. */}
      <SignIn />
    </div>
  );
}