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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeBrandTab, setActiveBrandTab] = useState("WAAREE");

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
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

  if (isLoading || !settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading template & corporate settings...
      </div>
    );
  }

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
              Configure default company information, primary bank details (PNB Bank), default pricing, and brand warranty master templates.
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
            <span>Master template settings and bank details successfully updated!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Company Profile & Primary Bank Details */}
        <div className="lg:col-span-6 space-y-6">
          {/* Company Profile Card */}
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

          {/* Primary Banking Details (PNB Bank) */}
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

        {/* Right Column: Pricing Defaults & Master Brand Warranties */}
        <div className="lg:col-span-6 space-y-6">
          {/* Commercial & Milestone Defaults */}
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

          {/* Master Brand Warranties Template */}
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
    </div>
  );
}
