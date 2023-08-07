import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactElement;
}): JSX.Element {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") return;

    if (status === "unauthenticated") {
      router.push({
        pathname: "/",
      });
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading ...</p>;
  }

  return status === "authenticated" ? (
    <main className="w-screen  px-5 py-4 h-screen inline-block ">
      <p className="text-center font-bold text-4xl text-gray-600">
        Google PalmAI
      </p>
      {children}
    </main>
  ) : (
    <></>
  );
}
