"use client";
import useGetMe from "@/hooks/useGetMe";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const RefreshTokenProvider = ({ children }: { children: ReactNode }) => {
  const { isAccess, isPending } = useGetMe();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/auth") return children;

  if (!isPending && !isAccess) router.replace("/auth");

  return !isPending && isAccess && children;
};

export default RefreshTokenProvider;
