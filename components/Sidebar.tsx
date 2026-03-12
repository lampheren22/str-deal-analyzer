"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart2, GitCompare, Sparkles, Download, Home } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze", icon: BarChart2 },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/deal-finder", label: "Deal Finder", icon: Sparkles },
  { href: "/export", label: "Export", icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-20" style={{ background: "#0F172A" }}>
      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid #1E293B" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2563EB" }}>
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">STR Analyzer</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "#64748B" }}>Deal Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                active
                  ? { background: "#2563EB", color: "#fff" }
                  : { color: "#94A3B8" }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "#1E293B";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                }
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid #1E293B" }}>
        <p className="text-[10px]" style={{ color: "#475569" }}>STR Deal Analyzer v1.0</p>
      </div>
    </aside>
  );
}
