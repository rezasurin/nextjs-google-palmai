import React from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import "@/styles/globals.css";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from 'react-query';

const ProtectedLayout = React.lazy(
  () => import("@/components/layouts/ProtectedLayout")
);
// import ProtectedLayout from '@/components/layouts/ProtectedLayout';

type AppPropsWithAuth = AppProps & {
  Component: {
    requireAuth?: boolean;
  };
} & { session: Session };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          {Component.requireAuth ? (
            <ProtectedLayout>
              <Component {...pageProps} />
            </ProtectedLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </RecoilRoot>

      </QueryClientProvider>
    </SessionProvider>
  );
}
