"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Users,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Inscrições",
    href: "/admin",
    icon: Users,
  },
  // Add future pages here:
];

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-sm">⛺</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-foreground tracking-tight leading-none">
              MovTeens
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
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
          onClick={() => setTheme(isDark ? "light" : "dark")}
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
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <Menu className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Recolher menu</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 flex-shrink-0 ${
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
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-xs">⛺</span>
            </div>
            <span className="text-sm font-bold">MovTeens Admin</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold">MovTeens Admin</span>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
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
