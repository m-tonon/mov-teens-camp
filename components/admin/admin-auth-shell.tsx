"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";
import { RegisterSw } from "@/components/admin/register-sw";
import { AdminInstallBanner } from "@/components/admin/admin-install-banner";
import {
  defaultPathForRole,
  getAdminRole,
  isPathAllowedForRole,
} from "@/lib/admin-session";

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login";
}

function isAdminAreaPath(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/ebd");
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
    const role = getAdminRole();

    if (!role && isProtectedAdminPath(pathname)) {
      const from = encodeURIComponent(pathname);
      router.replace(`/admin/login?from=${from}`);
      return;
    }

    if (role && isProtectedAdminPath(pathname) && !isPathAllowedForRole(pathname, role)) {
      router.replace(defaultPathForRole(role));
      return;
    }

    setAuthorized(true);
  }, [pathname, router]);

  if (!authorized) return null;

  return (
    <AdminThemeProvider>
      {isAdminAreaPath(pathname) ? <RegisterSw /> : null}
      {isAdminLoginPath(pathname) ? (
        children
      ) : (
        <AdminSidebar>{children}</AdminSidebar>
      )}
      {isAdminAreaPath(pathname) ? <AdminInstallBanner /> : null}
    </AdminThemeProvider>
  );
}
