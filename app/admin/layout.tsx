"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "ダッシュボード" },
  { href: "/admin/menus", icon: UtensilsCrossed, label: "メニュー管理" },
  { href: "/admin/categories", icon: FolderOpen, label: "カテゴリ管理" },
  { href: "/admin/inquiries", icon: Mail, label: "お問い合わせ" },
  { href: "/admin/settings", icon: Settings, label: "設定" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 sticky top-0 h-screen",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-gray-800">Simulator</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                管理画面
              </span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-emerald-600")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>折りたたむ</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find(
                (item) =>
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
              )?.label || "ダッシュボード"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 text-sm font-medium">管</span>
              </div>
              {/* Removed admin text for cleaner look */}
            </div>
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>サイトへ戻る</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
