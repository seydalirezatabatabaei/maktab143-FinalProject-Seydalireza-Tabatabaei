"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";
import type { NavigationSection } from "@/app/types/types";

export default function AdminShell({
  children,
  navigationData,
}: {
  children: React.ReactNode;
  navigationData: NavigationSection[];
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/register";

  return (
    <div lang="fa" dir="rtl" className="admin-shell min-h-screen bg-white">
      {!isLoginPage && <Navbar navigationData={navigationData} showAdminLogout />}
      <div className="admin-content bg-white">{children}</div>
    </div>
  );
}
