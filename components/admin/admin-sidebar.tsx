"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminTheme } from "@/components/admin/admin-theme-provider";
import {
  Users,
  ClipboardList,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { AdminLogoMark } from "@/components/admin/admin-logo-mark";
import { clearAdminSession, getAdminRole, type AdminRole } from "@/lib/admin-session";

const NAV_ITEMS: {
  label: string;
  href: string;
  icon: typeof Users;
  roles: AdminRole[];
}[] = [
  {
    label: "Inscrições",
    href: "/admin",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Chamada EBD",
    href: "/ebd",
    icon: ClipboardList,
    roles: ["admin", "guest"],
  },
];

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isDark, toggleTheme } = useAdminTheme();
  const [role, setRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    setRole(getAdminRole());
  }, []);

  const navItems = role
    ? NAV_ITEMS.filter((item) => item.roles.includes(role))
    : [];

  const handleLogout = () => {
    clearAdminSession();
    setMobileOpen(false);
    router.replace("/admin/login");
  };

  const SidebarContent = ({ showLogo = true }: { showLogo?: boolean }) => (
    <div className="flex flex-col h-full">
      {showLogo ? (
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? "justify-center" : ""}`}
        >
          <AdminLogoMark size="md" />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground tracking-tight leading-none">
                MovTeens
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : item.href === "/ebd"
                ? pathname === "/ebd" || pathname.startsWith("/ebd/")
                : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className={`px-2 pb-4 space-y-1 border-t border-border pt-4`}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Moon className="w-4 h-4 flex-shrink-0" />
          )}
          {!collapsed && <span>{isDark ? "Modo claro" : "Modo escuro"}</span>}
        </button>

        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          {collapsed ? (
            <PanelLeft className="w-4 h-4 flex-shrink-0" />
          ) : (
            <PanelLeftClose className="w-4 h-4 flex-shrink-0" />
          )}
          {!collapsed && <span>Recolher menu</span>}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 flex-shrink-0 h-full ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AdminLogoMark size="sm" />
          <span className="text-sm font-bold">
            {role === "guest" ? "Chamada EBD" : "MovTeens Admin"}
          </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent showLogo={false} />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold">
            {role === "guest" ? "Chamada EBD" : "MovTeens Admin"}
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
