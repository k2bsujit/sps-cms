"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Users,
  FileText,
  Database,
  IndianRupee,
  ArrowRight,
  Zap,
  CheckCircle2,
  Calendar,
  Building2,
  Home,
  Plus,
  RefreshCw,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { Lead } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 5,
    residentialLeads: 3,
    commercialLeads: 2,
    quotationsCount: 4,
    installationsCount: 2,
    totalInstalledKw: 18.0,
    totalPipelineValue: 950000,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/leads"),
        ]);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setRecentLeads(leadsData.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 shadow-xl border border-amber-500/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              PM Surya Ghar Muft Bijli Yojana • Nilagiri, Balasore (Odisha)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.name || "SP Surya Team"}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Solar CRM Command Center. Monitor active residential & commercial leads, generate 6-page proposals, and track post-installation net metering.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/leads">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Lead
              </Button>
            </Link>
            <Link href="/quotations">
              <Button size="sm" variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Build 6-Page Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Leads</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalLeads} Leads</h3>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                {stats.residentialLeads} Residential • {stats.commercialLeads} C&I
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quotes Created</p>
              <h3 className="text-2xl font-black text-blue-900 mt-0.5">{stats.quotationsCount} Proposals</h3>
              <p className="text-[11px] text-blue-700 font-medium mt-0.5">₹{(stats.totalPipelineValue / 100000).toFixed(1)}L Pipeline</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Installed Plants</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{stats.installationsCount} Projects</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{stats.totalInstalledKw} kW Energized</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subsidies Claimed</p>
              <h3 className="text-2xl font-black text-purple-900 mt-0.5">₹1.38L / 3kW</h3>
              <p className="text-[11px] text-purple-700 font-medium mt-0.5">Central + Odisha State DBT</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Leads & CRM Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Leads Table */}
        <Card className="lg:col-span-8 border border-slate-200 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Recent Leads Pipeline
              </CardTitle>
              <CardDescription className="text-xs">
                Live leads fetched from your integrated SQLite database.
              </CardDescription>
            </div>
            <Link href="/leads">
              <Button variant="ghost" size="sm" className="text-xs text-amber-700 hover:text-amber-800 font-bold">
                View All Leads ({stats.totalLeads}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading database records...</div>
            ) : recentLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No leads found in database.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 text-xs">
                      <TableHead>Customer</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLeads.map((lead) => (
                      <TableRow key={lead.id} className="text-xs hover:bg-slate-50/80">
                        <TableCell>
                          <div className="font-bold text-slate-900">{lead.customerName}</div>
                          <div className="text-[11px] text-slate-500">{lead.contactNumber}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{lead.capacityKw} kW</div>
                          <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal">
                            {lead.category === "RESIDENTIAL" ? "Residential" : "Commercial"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                            {lead.brandPreference}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div>{lead.location}</div>
                          <div className="text-[10px] text-slate-400">{lead.district}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[10px] font-bold ${
                              lead.status === "QUOTATION_CREATED"
                                ? "bg-blue-100 text-blue-800"
                                : lead.status === "SURVEY_SCHEDULED"
                                ? "bg-amber-100 text-amber-800"
                                : lead.status === "WON"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {lead.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/quotations?name=${encodeURIComponent(lead.customerName)}&mobile=${encodeURIComponent(
                              lead.contactNumber
                            )}&email=${encodeURIComponent(lead.email || "")}&consumerNumber=${encodeURIComponent(
                              lead.consumerNumber || ""
                            )}&village=${encodeURIComponent(lead.location)}&district=${encodeURIComponent(
                              lead.district
                            )}&capacity=${lead.capacityKw}&brand=${encodeURIComponent(
                              lead.brandPreference
                            )}&category=${lead.category}`}
                          >
                            <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                              Quote
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Launchpad */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Corporate Quotation Engine
              </CardTitle>
              <CardDescription className="text-xs">
                Generate 6-page proposals with SP Surya branding, chosen PV brands & editable BOQ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Residential PM Surya Ghar
                </div>
                <p className="text-[11px] text-slate-500">
                  Automatic ₹78,000 Central + ₹60,000 Odisha State Subsidy calculation.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Commercial & Industrial
                </div>
                <p className="text-[11px] text-slate-500">
                  40% Accelerated Depreciation tax benefits & commercial ROI.
                </p>
              </div>

              <Link href="/quotations" className="block pt-1">
                <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-5 shadow-sm">
                  Launch 6-Page Quotation Builder <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Post-Installation Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-slate-600">
                Track completed projects, TPNODL inspection visits, and auto-calculated <strong>+90-day</strong> maintenance service dates.
              </p>
              <Link href="/customers" className="block pt-1">
                <Button variant="outline" className="w-full text-xs font-semibold border-slate-300 hover:bg-slate-50">
                  View Customers Grid
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
