"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calculator, Brain, Zap,
  BarChart3, Trophy, TrendingUp,
  Briefcase, GitCompare, Download, Home,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Deal Tools",
    items: [
      { href: "/analyze", label: "Deal Analyzer", icon: Calculator },
      { href: "/predict", label: "Revenue Predictor", icon: Brain },
      { href: "/deal-finder", label: "Deal Finder", icon: Zap },
    ],
  },
  {
    label: "Market Intel",
    items: [
      { href: "/market", label: "Market Analytics", icon: BarChart3 },
      { href: "/competitors", label: "Competitor Analysis", icon: Trophy },
      { href: "/seasonality", label: "Seasonality & Risk", icon: TrendingUp },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/portfolio", label: "My Portfolio", icon: Briefcase },
      { href: "/compare", label: "Compare", icon: GitCompare },
      { href: "/export", label: "Export", icon: Download },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex w-52 min-h-screen flex-col fixed left-0 top-0 bottom-0 z-20"
      style={{ background: "#0F172A" }}
    >
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

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={active ? { background: "#2563EB", color: "#fff" } : { color: "#94A3B8" }}
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
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid #1E293B" }}>
        <p className="text-[10px]" style={{ color: "#475569" }}>STR Deal Analyzer v2.0</p>
      </div>
    </aside>
  );
}
