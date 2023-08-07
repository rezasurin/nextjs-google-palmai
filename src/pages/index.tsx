import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data: session } = useSession();

  console.log(session, "<< ceksession");

  useEffect(() => {
    if (session && !isRedirecting && router.isReady) {
      // display some message to the user that he is being redirected
      setIsRedirecting(true);
      setTimeout(() => {
        // redirect to the return url or home page
        router.push(router.query.returnUrl as string || '/home' );
      }, 500);
    }
  }, [session, isRedirecting, router]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {!session ? (
        <>
          <p>Not signed in</p>
          <br />
          <button onClick={async () => await signIn("google")}>Sign in</button>
        </>
      ) : (
        <>
          <p>Signed in as {session?.user.name}</p>
          <button onClick={async () => await signOut()}>Sign Out</button>
        </>
      )}
    </main>
  );
}
