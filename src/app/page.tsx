"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const a = 6;

  return (
    <div className="flex gap-4 items-center justify-center">
      <Button variant="default" onClick={() => router.push("/sign-up")}>
        Sign Up
      </Button>
      <Button variant="secondary" onClick={() => router.push("/sign-in")}>
        Sign In
      </Button>
    </div>
  );
}
