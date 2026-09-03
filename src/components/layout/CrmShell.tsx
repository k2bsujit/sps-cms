"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  Database,
  Sun,
  LogOut,
  Plus,
  Search,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Zap,
  Building2,
  Calendar,
  CheckCircle2,
  UserCheck,
  Sliders,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

export const CrmShell: React.FC<Props> = ({ children }) => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalLeads: 5,
    installationsCount: 2,
    totalInstalledKw: 18,
  });

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/stats")
        .then((res) => res.json())
        .then((data) => setLiveStats(data))
        .catch(() => {});
    }
  }, [isAuthenticated, pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 animate-pulse shadow-xl">
            <Sun className="w-10 h-10 fill-slate-950" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Authenticating SP Surya CRM...</h2>
          <p className="text-xs text-slate-400">Loading PM Surya Ghar Customer & Quotation Pipeline</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    {
      name: "Command Center",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Leads & Pipeline",
      href: "/leads",
      icon: Users,
      badge: `${liveStats.totalLeads}`,
    },
    {
      name: "6-Page Quotation Engine",
      href: "/quotations",
      icon: FileText,
      badge: "PRO",
    },
    {
      name: "Post-Installation Grid",
      href: "/customers",
      icon: Database,
      badge: `${liveStats.installationsCount}`,
    },
    {
      name: "Template & Settings",
      href: "/settings",
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100/90 text-slate-900">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* CRM Fixed Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                <Sun className="w-6 h-6 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  SP SURYA <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded">CRM</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  PM Surya Ghar Portal • Odisha
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Nilagiri, Balasore</span>
            </div>
            <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 font-bold">
              TPNODL
            </Badge>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            CRM Modules
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-slate-950" : "text-amber-400"}`} />
                  <span>{link.name}</span>
                </div>

                {link.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-slate-950 text-amber-300"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Live Quick Stats
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Energized Capacity:</span>
              <span className="font-bold text-emerald-400">{liveStats.totalInstalledKw} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Active Leads:</span>
              <span className="font-bold text-amber-400">{liveStats.totalLeads}</span>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-xs shrink-0 shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || "Staff Member"}</p>
                <p className="text-[10px] text-amber-400 font-semibold truncate uppercase">
                  {user?.role?.replace("_", " ") || "STAFF"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main CRM Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads, customer name, mobile, consumer number..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/leads">
              <Button size="sm" variant="outline" className="text-xs font-bold border-slate-300 hover:bg-amber-50">
                <Plus className="w-3.5 h-3.5 mr-1 text-amber-600" />
                New Lead
              </Button>
            </Link>

            <Link href="/quotations">
              <Button size="sm" className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm">
                <FileText className="w-3.5 h-3.5 mr-1" />
                New Quote
              </Button>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold py-1">
                <Zap className="w-3 h-3 mr-1 text-emerald-600" /> PM Surya Ghar
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
