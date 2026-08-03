"use client";

import { AdminAuthShell } from "@/components/admin/admin-auth-shell";

export default function EbdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthShell>{children}</AdminAuthShell>;
}
