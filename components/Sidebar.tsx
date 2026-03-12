"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calculator, Brain, Zap,
  BarChart3, Trophy, TrendingUp,
  Briefcase, GitCompare, Download, Home, Menu, X,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function close() { setMobileOpen(false); }

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="flex md:hidden fixed top-0 left-0 right-0 z-30 items-center h-14 px-4"
        style={{ background: "#0F172A", borderBottom: "1px solid #1E293B" }}
      >
        <button onClick={() => setMobileOpen(true)} className="text-slate-400 mr-3">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#2563EB" }}>
            <Home className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-sm font-semibold text-white">STR Analyzer</p>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={close}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className="w-52 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40"
        style={{
          background: "#0F172A",
          transform: mobileOpen ? "translateX(0)" : undefined,
          transition: "transform 0.2s ease",
        }}
      >
        {/* On mobile: hide via CSS class unless open */}
        <style>{`
          @media (max-width: 767px) {
            aside {
              transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"};
            }
          }
        `}</style>

        {/* Logo */}
        <div className="px-4 py-5" style={{ borderBottom: "1px solid #1E293B" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2563EB" }}>
                <Home className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">STR Analyzer</p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: "#64748B" }}>Deal Intelligence</p>
              </div>
            </div>
            <button onClick={close} className="md:hidden" style={{ color: "#64748B" }}>
              <X className="w-4 h-4" />
            </button>
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
                      onClick={close}
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
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid #1E293B" }}>
          <p className="text-[10px]" style={{ color: "#475569" }}>STR Deal Analyzer v2.0</p>
        </div>
      </aside>
    </>
  );
}
