"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";

const Provider = ({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null | undefined;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;
