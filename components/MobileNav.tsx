"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calculator, BarChart3, Briefcase,
  MoreHorizontal, Brain, Zap, Trophy, TrendingUp,
  GitCompare, Download, X, Home,
} from "lucide-react";

const PRIMARY_TABS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze", icon: Calculator },
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
];

const MORE_ITEMS = [
  { href: "/predict", label: "Revenue Predictor", icon: Brain },
  { href: "/deal-finder", label: "Deal Finder", icon: Zap },
  { href: "/competitors", label: "Competitors", icon: Trophy },
  { href: "/seasonality", label: "Seasonality", icon: TrendingUp },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/export", label: "Export", icon: Download },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analyze": "Deal Analyzer",
  "/predict": "Revenue Predictor",
  "/deal-finder": "Deal Finder",
  "/market": "Market Analytics",
  "/competitors": "Competitors",
  "/seasonality": "Seasonality & Risk",
  "/portfolio": "My Portfolio",
  "/compare": "Compare Deals",
  "/export": "Export",
};

export default function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const pageTitle = PAGE_TITLES[pathname] ?? "STR Analyzer";
  const isMoreActive = MORE_ITEMS.some((item) => pathname === item.href);

  return (
    <>
      {/* Top header bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-3"
        style={{ background: "#0F172A", borderBottom: "1px solid #1E293B" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#2563EB" }}
        >
          <Home className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm font-semibold text-white">{pageTitle}</p>
      </div>

      {/* Backdrop */}
      {moreOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(15,23,42,0.55)" }}
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* "More" slide-up sheet */}
      <div
        className="md:hidden fixed left-0 right-0 z-50 rounded-t-2xl overflow-hidden"
        style={{
          bottom: 64,
          background: "#fff",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
          transform: moreOpen ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "#E2E8F0" }} />
        </div>

        {/* Sheet header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>More Tools</p>
          <button
            onClick={() => setMoreOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "#F1F5F9", color: "#64748B" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-column grid of tools */}
        <div className="p-4 grid grid-cols-3 gap-3 pb-6">
          {MORE_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMoreOpen(false)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                style={{
                  background: active ? "#EFF6FF" : "#F8FAFC",
                  border: `1px solid ${active ? "#BFDBFE" : "#E2E8F0"}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: active ? "#DBEAFE" : "#fff",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: active ? "#2563EB" : "#64748B" }} />
                </div>
                <span
                  className="text-[11px] font-medium leading-tight"
                  style={{ color: active ? "#2563EB" : "#374151" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom tab bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch"
        style={{
          height: 64,
          background: "#fff",
          borderTop: "1px solid #E2E8F0",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {PRIMARY_TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
            >
              <div
                className="w-12 h-7 rounded-lg flex items-center justify-center"
                style={{ background: active ? "#EFF6FF" : "transparent" }}
              >
                <Icon className="w-5 h-5" style={{ color: active ? "#2563EB" : "#94A3B8" }} />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "#2563EB" : "#94A3B8" }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* More tab */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5"
        >
          <div
            className="w-12 h-7 rounded-lg flex items-center justify-center"
            style={{ background: isMoreActive || moreOpen ? "#EFF6FF" : "transparent" }}
          >
            <MoreHorizontal
              className="w-5 h-5"
              style={{ color: isMoreActive || moreOpen ? "#2563EB" : "#94A3B8" }}
            />
          </div>
          <span
            className="text-[10px] font-medium"
            style={{ color: isMoreActive || moreOpen ? "#2563EB" : "#94A3B8" }}
          >
            More
          </span>
        </button>
      </div>
    </>
  );
}
