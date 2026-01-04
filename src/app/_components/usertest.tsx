'use client';

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function AuthButtons() {
  const { isSignedIn } = useUser();

  return (
    <div>
      {!isSignedIn && <SignInButton />}
      {isSignedIn && <SignOutButton />}
    </div>
  );
}
