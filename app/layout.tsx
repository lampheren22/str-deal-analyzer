import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "STR Deal Analyzer",
  description: "Analyze short-term rental investment deals with MART, cash flow, and depreciation calculations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="md:ml-52 flex-1 min-h-screen pt-14 md:pt-0" style={{ background: "#F8FAFC" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
