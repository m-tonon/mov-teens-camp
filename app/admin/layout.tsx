"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth");
    if (!auth && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname]);

  if (!authorized) return null;

  if (pathname === "/admin/login") return <>{children}</>;

  return <AdminSidebar>{children}</AdminSidebar>;
}
