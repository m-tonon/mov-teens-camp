"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login";
}

function isProtectedAdminPath(pathname: string) {
  if (isAdminLoginPath(pathname)) return false;
  return pathname.startsWith("/admin") || pathname.startsWith("/ebd");
}

export function AdminAuthShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth");
    if (!auth && isProtectedAdminPath(pathname)) {
      const from = encodeURIComponent(pathname);
      router.replace(`/admin/login?from=${from}`);
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized) return null;

  return (
    <AdminThemeProvider>
      {isAdminLoginPath(pathname) ? (
        children
      ) : (
        <AdminSidebar>{children}</AdminSidebar>
      )}
    </AdminThemeProvider>
  );
}
