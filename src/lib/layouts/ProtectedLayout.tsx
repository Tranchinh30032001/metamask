import React, { useEffect } from "react";
import { useAuth } from "../core/hooks/useAuth";
import DefaultLayout from "./DefaultLayout";
import { useRouter } from "next/router";

function ProtectedLayout({ children }: { children: React.ReactElement }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  if (isLoading || !isLoggedIn) {
    return <div>Loading...</div>;
  }

  return <DefaultLayout>{children}</DefaultLayout>;
}

export default ProtectedLayout;
