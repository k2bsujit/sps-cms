"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Landmark,
  ShieldCheck,
  Save,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Receipt,
  RotateCcw,
  Package,
  Plus,
  Trash2,
  Layers,
  Info,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BOQItem } from "@/types";
import { defaultMasterBOQItems } from "@/lib/boq-calculator";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"BOQ" | "COMPANY" | "PRICING">("BOQ");
  const [activeBrandTab, setActiveBrandTab] = useState("WAAREE");

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (!data.boqTemplate || !Array.isArray(data.boqTemplate) || data.boqTemplate.length === 0) {
          data.boqTemplate = defaultMasterBOQItems;
        }
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetBOQToDefaults = () => {
    if (confirm("Reset all BOQ template items to factory standard defaults? Any custom items added here will be replaced.")) {
      setSettings({
        ...settings,
        boqTemplate: JSON.parse(JSON.stringify(defaultMasterBOQItems)),
      });
    }
  };

  const handleAddBOQItem = (section: "A" | "B" | "C" | "D") => {
    const currentList: BOQItem[] = settings.boqTemplate || [];
    const sectionItems = currentList.filter((i) => i.section === section);
    const newItem: BOQItem = {
      id: `boq-custom-${Date.now()}`,
      slNo: sectionItems.length + 1,
      section,
      description: "New Standard Component",
      make: "Standard Make",
      uom: "Nos.",
      qty: "1",
      warranty: "5 Years",
    };
    setSettings({
      ...settings,
      boqTemplate: [...currentList, newItem],
    });
  };

  const handleUpdateBOQItem = (id: string, updates: Partial<BOQItem>) => {
    const currentList: BOQItem[] = settings.boqTemplate || [];
    const updated = currentList.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setSettings({
      ...settings,
      boqTemplate: updated,
    });
  };

  const handleDeleteBOQItem = (id: string) => {
    const currentList: BOQItem[] = settings.boqTemplate || [];
    if (currentList.length <= 1) {
      alert("At least one BOQ item must remain in template.");
      return;
    }
    const updated = currentList.filter((item) => item.id !== id);
    setSettings({
      ...settings,
      boqTemplate: updated,
    });
  };

  if (isLoading || !settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading template & corporate settings...
      </div>
    );
  }

  const boqList: BOQItem[] = settings.boqTemplate || defaultMasterBOQItems;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-amber-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-amber-400 text-slate-950 font-bold px-3 py-1 text-xs">
                Master Template Configurator
              </Badge>
              <Badge variant="outline" className="text-amber-300 border-amber-400/40 text-xs">
                SQLite Persistent
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Company & Quotation Template Settings
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Configure master Bill of Quantities (BOQ) components, primary bank details (PNB), default pricing, and brand warranties.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-5 px-6 shadow-md"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Master Settings
          </Button>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Master template settings and BOQ components successfully saved and updated!</span>
          </div>
        )}

        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab("BOQ")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "BOQ"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Master BOQ Items Template</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === "BOQ" ? "bg-slate-950 text-amber-300" : "bg-slate-700 text-slate-300"}`}>
              {boqList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("COMPANY")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "COMPANY"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company Profile & Bank Account (PNB)</span>
          </button>

          <button
            onClick={() => setActiveTab("PRICING")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PRICING"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Commercial Pricing & Warranties</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER BOQ ITEMS TEMPLATE */}
      {activeTab === "BOQ" && (
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  Master Bill of Quantities (BOQ) Component Library
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Set standard descriptions, default makes (e.g. Waacab, APPOLO, Forecast), UOM, and quantities. These values serve as the default baseline whenever a new quotation is created. Specific proposals can still be fine-tuned in the Quotation Management page.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetBOQToDefaults}
                  className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Reset to Factory Defaults
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Dynamic Fields Rule:</span> In Section A (PV Modules) and Section B (Inverters), the Make will dynamically reflect the customer's selected brand (WAAREE, TATA, Eastman, Adani, etc.) and quantities will auto-calculate according to the kW rating. All auxiliary fittings (Section C) and installation services (Section D) will automatically pull the standard makes and specs configured below!
                </div>
              </div>

              {(["A", "B", "C", "D"] as const).map((sectionKey) => {
                const sectionItems = boqList.filter((i) => i.section === sectionKey);
                const sectionMeta = {
                  A: {
                    title: "Section A: Photovoltaic Modules & Structure",
                    subtitle: "Solar PV modules, mounting structure profile & hardware",
                  },
                  B: {
                    title: "Section B: Inverter(s)",
                    subtitle: "On-grid solar string inverter with integrated DC isolator",
                  },
                  C: {
                    title: "Section C: Fittings & Other Accessories",
                    subtitle: "DC/AC cables, earthing kits, DCDB/ACDB, MC4 connectors, Lightning Arrestor",
                  },
                  D: {
                    title: "Section D: Installation, Documentation & Commissioning",
                    subtitle: "Certified technician commissioning, DISCOM net meter processing, and AMC",
                  },
                };

                const currentMeta = sectionMeta[sectionKey];

                return (
                  <div key={sectionKey} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border bg-slate-100/80 gap-2">
                      <div>
                        <span className="text-xs font-black text-slate-900">{currentMeta.title}</span>
                        <span className="text-[11px] text-slate-500 block">{currentMeta.subtitle}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddBOQItem(sectionKey)}
                        className="h-7 text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-100/50 self-start sm:self-auto font-bold"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Line Item
                      </Button>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50/80 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead className="min-w-[280px]">Item Description / Specification</TableHead>
                            <TableHead className="w-48">Default Make / Brand</TableHead>
                            <TableHead className="w-24 text-center">UOM</TableHead>
                            <TableHead className="w-36 text-center">Default Qty / Length</TableHead>
                            <TableHead className="w-32 text-center">Warranty</TableHead>
                            <TableHead className="w-14 text-right">Del</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sectionItems.map((item, idx) => (
                            <TableRow key={item.id || idx} className="text-xs hover:bg-amber-50/30">
                              <TableCell className="text-center font-bold text-slate-500">
                                {idx + 1}
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.description}
                                  onChange={(e) => handleUpdateBOQItem(item.id, { description: e.target.value })}
                                  className="h-8 text-xs bg-transparent border-slate-200 focus:bg-white"
                                  placeholder="Item description"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.make}
                                  onChange={(e) => handleUpdateBOQItem(item.id, { make: e.target.value })}
                                  className="h-8 text-xs font-semibold text-slate-800 bg-transparent border-slate-200 focus:bg-white"
                                  placeholder="Make (e.g. Waacab)"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  value={item.uom}
                                  onChange={(e) => handleUpdateBOQItem(item.id, { uom: e.target.value })}
                                  className="h-8 text-xs text-center bg-transparent border-slate-200 focus:bg-white"
                                  placeholder="UOM"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  value={String(item.qty)}
                                  onChange={(e) => handleUpdateBOQItem(item.id, { qty: e.target.value })}
                                  className="h-8 text-xs text-center font-bold bg-transparent border-slate-200 focus:bg-white"
                                  placeholder="Qty"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  value={item.warranty || ""}
                                  onChange={(e) => handleUpdateBOQItem(item.id, { warranty: e.target.value })}
                                  className="h-8 text-xs text-center text-slate-600 bg-transparent border-slate-200 focus:bg-white"
                                  placeholder="Warranty"
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBOQItem(item.id)}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: COMPANY PROFILE & BANKING */}
      {activeTab === "COMPANY" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Company Profile Card */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  Company Profile & Official Contacts
                </CardTitle>
                <CardDescription className="text-xs">
                  Appears on Page 1 & Page 6 of generated 6-page PDF quotations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Company Name</label>
                    <Input
                      value={settings.company.name}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          company: { ...settings.company, name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">GSTIN No.</label>
                    <Input
                      value={settings.company.gstin}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          company: { ...settings.company, gstin: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Official Office Address</label>
                  <Input
                    value={settings.company.address}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, address: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Contact Phone</label>
                    <Input
                      value={settings.company.phone}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          company: { ...settings.company, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Official Email</label>
                    <Input
                      value={settings.company.email}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          company: { ...settings.company, email: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Vendor Status Badge</label>
                  <Input
                    value={settings.company.vendorStatus}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, vendorStatus: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Primary Banking Details (PNB Bank) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 bg-amber-50/40">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-600" />
                  Primary Company Bank Account (Page 4 PDF)
                </CardTitle>
                <CardDescription className="text-xs">
                  Official payment destination for customer token, advances, and RTGS/NEFT transfers.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Bank Name</label>
                    <Input
                      value={settings.bank.bankName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bank: { ...settings.bank, bankName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Branch Name</label>
                    <Input
                      value={settings.bank.branch}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bank: { ...settings.bank, branch: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Account Number</label>
                    <Input
                      value={settings.bank.accountNumber}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bank: { ...settings.bank, accountNumber: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">IFSC Code</label>
                    <Input
                      value={settings.bank.ifscCode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bank: { ...settings.bank, ifscCode: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Account Holder Name</label>
                    <Input
                      value={settings.bank.accountName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bank: { ...settings.bank, accountName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">UPI ID</label>
                    <Input
                      value={settings.bank.upiId || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bank: { ...settings.bank, upiId: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: PRICING & BRAND WARRANTIES */}
      {activeTab === "PRICING" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Commercial & Milestone Defaults */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Default Pricing & Payment Milestones
                </CardTitle>
                <CardDescription className="text-xs">
                  Default package pricing applied when generating new proposals.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Res 1 kW (₹)</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.residential1Kw}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            residential1Kw: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Res 2 kW (₹)</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.residential2Kw}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            residential2Kw: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Res 3 kW (₹)</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.residential3Kw}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            residential3Kw: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Token Booking (₹)</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.tokenBookingAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            tokenBookingAmount: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Advance %</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.advancePercent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            advancePercent: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Final Balance %</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.finalPercent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            finalPercent: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">TPNODL 1-Phase Demand Note (₹)</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.demandNoteSinglePhase}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            demandNoteSinglePhase: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">TPNODL 3-Phase Demand Note (₹)</label>
                    <Input
                      type="number"
                      value={settings.pricingDefaults.demandNoteThreePhase}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricingDefaults: {
                            ...settings.pricingDefaults,
                            demandNoteThreePhase: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Master Brand Warranties Template */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Master Brand Warranty Templates
                </CardTitle>
                <CardDescription className="text-xs">
                  Select a brand to configure its standard manufacturer warranty terms.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Brand Tabs */}
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
                  {Object.keys(settings.brandTerms || {}).map((b) => (
                    <button
                      key={b}
                      onClick={() => setActiveBrandTab(b)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeBrandTab === b
                          ? "bg-amber-500 text-slate-950 shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                {settings.brandTerms[activeBrandTab] && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Inverter Warranty ({activeBrandTab})
                      </label>
                      <Input
                        value={settings.brandTerms[activeBrandTab].inverterWarranty}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            brandTerms: {
                              ...settings.brandTerms,
                              [activeBrandTab]: {
                                ...settings.brandTerms[activeBrandTab],
                                inverterWarranty: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Module Product Warranty ({activeBrandTab})
                      </label>
                      <Input
                        value={settings.brandTerms[activeBrandTab].moduleProductWarranty}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            brandTerms: {
                              ...settings.brandTerms,
                              [activeBrandTab]: {
                                ...settings.brandTerms[activeBrandTab],
                                moduleProductWarranty: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Module Power Output Warranty ({activeBrandTab})
                      </label>
                      <Input
                        value={settings.brandTerms[activeBrandTab].modulePowerWarranty}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            brandTerms: {
                              ...settings.brandTerms,
                              [activeBrandTab]: {
                                ...settings.brandTerms[activeBrandTab],
                                modulePowerWarranty: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">AMC Duration</label>
                      <Input
                        value={settings.brandTerms[activeBrandTab].amcDuration}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            brandTerms: {
                              ...settings.brandTerms,
                              [activeBrandTab]: {
                                ...settings.brandTerms[activeBrandTab],
                                amcDuration: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
