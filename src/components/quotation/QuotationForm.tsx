"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  PhaseType,
  QuotationData,
  SolarBrand,
  SystemCategory,
  BOQItem,
  BankDetails,
  TemplateTerms,
} from "@/types";
import {
  calculateQuotation,
  generateDefaultBOQList,
  defaultSPBankDetails,
  getDefaultTermsForBrand,
} from "@/lib/boq-calculator";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  FileText,
  Download,
  Building2,
  Home,
  CheckCircle2,
  IndianRupee,
  Eye,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  ShieldAlert,
  Percent,
  Layers,
  Save,
  Check,
  Sparkles,
  ArrowRight,
  History,
  Copy,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export interface QuoteVariant {
  id: string;
  variantLabel: string;
  category: SystemCategory;
  brand: SolarBrand;
  capacityKw: number;
  phase: PhaseType;
  customGrandTotal: number;
  boqList: BOQItem[];
  terms: TemplateTerms;
  demandNoteAmount: number;
  validityDays: number;
}
export const QuotationForm: React.FC = () => {
  const searchParams = useSearchParams();

  // Customer Contact Info (Shared across all brand variants for this customer)
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("Balasore");
  const [pin, setPin] = useState("756040");
  const [bankDetails, setBankDetails] = useState<BankDetails>(defaultSPBankDetails);

  // Multi-Quote Brand Variants for this customer
  const [variants, setVariants] = useState<QuoteVariant[]>([
    {
      id: "var-1",
      variantLabel: "Option 1: WAAREE",
      category: "RESIDENTIAL",
      brand: "WAAREE",
      capacityKw: 3.0,
      phase: "SINGLE_PHASE",
      customGrandTotal: 200000,
      boqList: generateDefaultBOQList(3.0, 6, "WAAREE"),
      terms: getDefaultTermsForBrand("WAAREE"),
      demandNoteAmount: 3747,
      validityDays: 15,
    },
  ]);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<"GENERAL" | "BOQ" | "TERMS" | "BANK">("GENERAL");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const [customerHistoryQuotes, setCustomerHistoryQuotes] = useState<any[]>([]);

  const currentVariant = variants[activeVariantIndex] || variants[0];

  // Helper to update current active variant
  const updateCurrentVariant = (updates: Partial<QuoteVariant>) => {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === activeVariantIndex ? { ...v, ...updates } : v))
    );
  };

  useEffect(() => {
    // Load Master Settings & Bank Details
    fetch("/api/settings")
      .then((res) => res.json())
      .then((settings) => {
        if (settings && settings.bank) {
          setBankDetails(settings.bank);
        }
      })
      .catch(() => {});

    const leadName = searchParams.get("name");
    if (leadName) {
      setCustomerName(leadName);
      if (searchParams.get("mobile")) setMobile(searchParams.get("mobile")!);
      if (searchParams.get("email")) setEmail(searchParams.get("email")!);
      if (searchParams.get("consumerNumber")) setConsumerNumber(searchParams.get("consumerNumber")!);
      if (searchParams.get("village")) setVillage(searchParams.get("village")!);
      if (searchParams.get("district")) setDistrict(searchParams.get("district")!);
      if (searchParams.get("pin")) setPin(searchParams.get("pin")!);

      const initialBrand = (searchParams.get("brand") as SolarBrand) || "WAAREE";
      const initialKw = parseFloat(searchParams.get("capacity")!) || 3.0;
      const initialPhase = (searchParams.get("phase") as PhaseType) || "SINGLE_PHASE";
      const initialCat = (searchParams.get("category") as SystemCategory) || "RESIDENTIAL";

      setVariants([
        {
          id: `var-${Date.now()}`,
          variantLabel: `Option 1: ${initialBrand}`,
          category: initialCat,
          brand: initialBrand,
          capacityKw: initialKw,
          phase: initialPhase,
          customGrandTotal: initialCat === "RESIDENTIAL" ? 200000 : initialKw * 48000,
          boqList: generateDefaultBOQList(initialKw, Math.ceil((initialKw * 1000) / 580), initialBrand),
          terms: getDefaultTermsForBrand(initialBrand),
          demandNoteAmount: initialPhase === "SINGLE_PHASE" ? 3747 : 4334,
          validityDays: 15,
        },
      ]);
    }
  }, [searchParams]);

  // Fetch saved quotes for this customer's mobile
  useEffect(() => {
    if (mobile && mobile.length >= 10) {
      fetch(`/api/quotations?contactNumber=${encodeURIComponent(mobile)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCustomerHistoryQuotes(data);
        })
        .catch(() => {});
    }
  }, [mobile]);

  const currentFinancials = useMemo(() => {
    return calculateQuotation(
      currentVariant.capacityKw,
      currentVariant.category,
      currentVariant.brand,
      currentVariant.phase,
      currentVariant.customGrandTotal
    );
  }, [
    currentVariant.capacityKw,
    currentVariant.category,
    currentVariant.brand,
    currentVariant.phase,
    currentVariant.customGrandTotal,
  ]);
  // Add a new brand variant for this customer
  const handleAddBrandVariant = (newBrand: SolarBrand) => {
    const nextIndex = variants.length + 1;
    const defaultTerms = getDefaultTermsForBrand(newBrand);
    const kw = currentVariant.capacityKw;
    const cat = currentVariant.category;
    const ph = currentVariant.phase;

    // Estimate price per brand
    let price = currentVariant.customGrandTotal;
    if (newBrand === "TATA Solar") price = Math.round(price * 1.04);
    else if (newBrand === "Adani Solar") price = Math.round(price * 1.02);
    else if (newBrand === "Eastman") price = Math.round(price * 0.98);

    const newVariant: QuoteVariant = {
      id: `var-${Date.now()}-${nextIndex}`,
      variantLabel: `Option ${nextIndex}: ${newBrand}`,
      category: cat,
      brand: newBrand,
      capacityKw: kw,
      phase: ph,
      customGrandTotal: price,
      boqList: generateDefaultBOQList(kw, Math.ceil((kw * 1000) / 580), newBrand),
      terms: defaultTerms,
      demandNoteAmount: ph === "SINGLE_PHASE" ? 3747 : 4334,
      validityDays: 15,
    };

    setVariants((prev) => [...prev, newVariant]);
    setActiveVariantIndex(variants.length);
  };

  const handleDuplicateVariant = (idx: number) => {
    const source = variants[idx];
    const newVariant: QuoteVariant = {
      ...source,
      id: `var-dup-${Date.now()}`,
      variantLabel: `${source.variantLabel} (Copy)`,
    };
    setVariants((prev) => [...prev, newVariant]);
    setActiveVariantIndex(variants.length);
  };

  const handleDeleteVariant = (idx: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== idx));
    if (activeVariantIndex >= idx && activeVariantIndex > 0) {
      setActiveVariantIndex(activeVariantIndex - 1);
    }
  };

  // Build PDF payload for a specific variant
  const getPayloadForVariant = (variant: QuoteVariant): QuotationData => {
    const today = new Date();
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + variant.validityDays);

    const financials = calculateQuotation(
      variant.capacityKw,
      variant.category,
      variant.brand,
      variant.phase,
      variant.customGrandTotal
    );

    return {
      quotationNumber: `SPS-${variant.category === "COMMERCIAL" ? "COM" : "RES"}-${today.getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      date: today.toLocaleDateString("en-GB"),
      validUntil: validDate.toLocaleDateString("en-GB"),
      category: variant.category,
      brand: variant.brand,
      customer: {
        name: customerName,
        mobile,
        email: email || undefined,
        consumerNumber: consumerNumber || undefined,
        village,
        district,
        pin,
        phase: variant.phase,
        discom: "TPNODL",
      },
      financials,
      boqList: variant.boqList,
      bankDetails,
      terms: variant.terms,
      demandNoteAmount: variant.demandNoteAmount,
      validityDays: variant.validityDays,
      status: "DRAFT",
    };
  };

  const handleDownloadPdf = async (variantToDownload: QuoteVariant = currentVariant) => {
    setIsGeneratingPdf(true);
    try {
      const payload = getPayloadForVariant(variantToDownload);
      const response = await fetch("/api/quotations/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotationData: payload }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SP_Surya_${variantToDownload.brand.replace(/\s+/g, "_")}_${payload.quotationNumber}_${customerName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert("Error building 6-Page PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveAllQuotesToDb = async () => {
    setIsSavingToDb(true);
    setSaveSuccessMsg("");
    try {
      const payloads = variants.map((v) => getPayloadForVariant(v));
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotations: payloads }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaveSuccessMsg(`Successfully saved ${data.count || variants.length} brand quotes for ${customerName}!`);
        // Refresh customer quote history
        const updatedHistory = await fetch(`/api/quotations?contactNumber=${encodeURIComponent(mobile)}`).then((r) =>
          r.json()
        );
        if (Array.isArray(updatedHistory)) setCustomerHistoryQuotes(updatedHistory);
      }
    } catch (err) {
      console.error("Save quotes error:", err);
      alert("Failed to save quotes to database.");
    } finally {
      setIsSavingToDb(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 rounded-2xl shadow-xl border border-amber-500/20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="default" className="bg-amber-400 text-slate-950 font-bold px-3 py-1">
                Customer: {customerName}
              </Badge>
              <Badge variant="outline" className="text-amber-300 border-amber-400/40 font-semibold">
                {variants.length} Brand Quote Option{variants.length > 1 ? "s" : ""}
              </Badge>
              <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                {currentVariant.category === "RESIDENTIAL" ? "PM Surya Ghar (Odisha)" : "Commercial"}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Multi-Brand Quotation Management
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Create and compare multiple brand quotes (Waaree, TATA, Adani, Eastman, UTL) for <strong>{customerName}</strong>. Download individual PDFs or save the complete portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <Button
              variant="secondary"
              onClick={() => setIsCompareOpen(true)}
              className="flex-1 lg:flex-none border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              <Layers className="w-4 h-4 mr-1.5 text-amber-400" />
              Compare ({variants.length}) Brands
            </Button>
            <Button
              onClick={handleSaveAllQuotesToDb}
              disabled={isSavingToDb}
              variant="outline"
              className="flex-1 lg:flex-none border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-bold"
            >
              {isSavingToDb ? (
                <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1.5 text-emerald-400" />
              )}
              Save All to DB
            </Button>
            <Button
              onClick={() => handleDownloadPdf(currentVariant)}
              disabled={isGeneratingPdf}
              className="flex-1 lg:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1.5" />
                  Download {currentVariant.brand} PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Save Success Message */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Multi-Quote Brand Switcher Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Brand Quote Variants for {customerName}:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 hidden sm:inline">1-Click Add Brand Quote:</span>
              {(["WAAREE", "TATA Solar", "Adani Solar", "Eastman", "UTL Solar"] as SolarBrand[])
                .filter((b) => !variants.some((v) => v.brand === b))
                .slice(0, 3)
                .map((b) => (
                  <button
                    key={b}
                    onClick={() => handleAddBrandVariant(b)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold border border-slate-700 transition-colors"
                  >
                    + {b}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {variants.map((variant, idx) => {
              const active = idx === activeVariantIndex;
              return (
                <div
                  key={variant.id}
                  className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    active
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/40"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveVariantIndex(idx)}
                    className="text-left flex items-center gap-1.5"
                  >
                    <span>{variant.variantLabel}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                        active ? "bg-slate-950 text-amber-300" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {formatINR(variant.customGrandTotal)}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 pl-1 border-l border-current/20">
                    <button
                      onClick={() => handleDuplicateVariant(idx)}
                      title="Duplicate Quote"
                      className="p-1 hover:opacity-75"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {variants.length > 1 && (
                      <button
                        onClick={() => handleDeleteVariant(idx)}
                        title="Delete Quote Variant"
                        className="p-1 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Custom Brand Add Dropdown */}
            <div className="relative inline-block">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) handleAddBrandVariant(e.target.value as SolarBrand);
                }}
                className="h-8 rounded-xl bg-slate-900 border border-dashed border-amber-400/50 text-amber-300 px-3 text-xs font-bold hover:bg-slate-800 cursor-pointer focus:outline-none"
              >
                <option value="">+ Add Another Brand Quote...</option>
                <option value="WAAREE">WAAREE</option>
                <option value="TATA Solar">TATA Power Solar</option>
                <option value="Adani Solar">Adani Solar</option>
                <option value="Eastman">Eastman Solar</option>
                <option value="UTL Solar">UTL Solar</option>
                <option value="Vikram Solar">Vikram Solar</option>
                <option value="Goldi Solar">Goldi Solar</option>
                <option value="Other">Other Approved Brand</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected Variant Top Selectors */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              1. Active Brand Make
            </label>
            <select
              value={currentVariant.brand}
              onChange={(e) => {
                const b = e.target.value as SolarBrand;
                updateCurrentVariant({
                  brand: b,
                  variantLabel: `Option ${activeVariantIndex + 1}: ${b}`,
                  terms: getDefaultTermsForBrand(b),
                  boqList: generateDefaultBOQList(
                    currentVariant.capacityKw,
                    Math.ceil((currentVariant.capacityKw * 1000) / 580),
                    b
                  ),
                });
              }}
              className="w-full h-9 rounded-lg bg-slate-800 border border-slate-700 text-white px-3 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
            >
              <option value="WAAREE">WAAREE (Primary Franchise)</option>
              <option value="TATA Solar">TATA Power Solar</option>
              <option value="Eastman">Eastman Solar</option>
              <option value="Adani Solar">Adani Solar</option>
              <option value="UTL Solar">UTL Solar</option>
              <option value="Vikram Solar">Vikram Solar</option>
              <option value="Goldi Solar">Goldi Solar</option>
              <option value="Other">Other Tier 1 Approved</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              2. System Capacity (kW)
            </label>
            <select
              value={currentVariant.capacityKw}
              onChange={(e) => {
                const kw = parseFloat(e.target.value);
                updateCurrentVariant({
                  capacityKw: kw,
                  boqList: generateDefaultBOQList(kw, Math.ceil((kw * 1000) / 580), currentVariant.brand),
                });
              }}
              className="w-full h-9 rounded-lg bg-slate-800 border border-slate-700 text-white px-3 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
            >
              <option value={1}>1 kW System</option>
              <option value={2}>2 kW System</option>
              <option value={3}>3 kW System (Standard ₹2 Lakh)</option>
              <option value={4}>4 kW System</option>
              <option value={5}>5 kW System</option>
              <option value={6}>6 kW System</option>
              <option value={8}>8 kW System</option>
              <option value={10}>10 kW System</option>
              <option value={15}>15 kW Commercial</option>
              <option value={25}>25 kW Commercial</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              3. Grid Phase
            </label>
            <select
              value={currentVariant.phase}
              onChange={(e) => {
                const ph = e.target.value as PhaseType;
                updateCurrentVariant({
                  phase: ph,
                  demandNoteAmount: ph === "SINGLE_PHASE" ? 3747 : 4334,
                });
              }}
              className="w-full h-9 rounded-lg bg-slate-800 border border-slate-700 text-white px-3 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
            >
              <option value="SINGLE_PHASE">Single Phase (230V) - DN: ₹3,747</option>
              <option value="THREE_PHASE">Three Phase (415V) - DN: ₹4,334</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              4. Category Type
            </label>
            <select
              value={currentVariant.category}
              onChange={(e) => updateCurrentVariant({ category: e.target.value as SystemCategory })}
              className="w-full h-9 rounded-lg bg-slate-800 border border-slate-700 text-white px-3 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
            >
              <option value="RESIDENTIAL">Residential PM Surya Ghar</option>
              <option value="COMMERCIAL">Commercial & Industrial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("GENERAL")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "GENERAL"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Customer & Pricing Parameters
        </button>
        <button
          onClick={() => setActiveTab("BOQ")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === "BOQ"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-500" />
          Editable BOQ Items ({currentVariant.boqList.length})
        </button>
        <button
          onClick={() => setActiveTab("TERMS")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === "TERMS"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-slate-900" />
          {currentVariant.brand} Warranties & Milestones
        </button>
        <button
          onClick={() => setActiveTab("BANK")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "BANK"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Bank Details & DISCOM
        </button>
      </div>
      {/* TAB 1: General & Financials */}
      {activeTab === "GENERAL" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-bold text-slate-900">
                  Customer & Site Details (Page 1)
                </CardTitle>
                <CardDescription>
                  Client information is shared across all brand proposals generated for this customer.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. ADITYA KUMAR BARIK"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
                    <Input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. 9437102938"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Consumer Number</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <Input
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      placeholder="e.g. TPNODL-BLS-88349"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Email Address</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aditya@gmail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Village / Address *</label>
                    <Input
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="Bartana, Somanathpur, Khantapada"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">District *</label>
                    <Input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Balasore"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Package Value for {currentVariant.brand} (₹)
                    </label>
                    <Input
                      type="number"
                      value={currentVariant.customGrandTotal}
                      onChange={(e) => updateCurrentVariant({ customGrandTotal: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Quotation Validity (Days)</label>
                    <Input
                      type="number"
                      value={currentVariant.validityDays}
                      onChange={(e) => updateCurrentVariant({ validityDays: parseInt(e.target.value) || 15 })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Quotes History for this Customer */}
            {customerHistoryQuotes.length > 0 && (
              <Card className="border border-slate-200 shadow-sm bg-slate-50/50">
                <CardHeader className="py-3 px-4 border-b border-slate-200">
                  <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-amber-600" />
                    Saved Quotes in Database for {customerName} ({customerHistoryQuotes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {customerHistoryQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{q.brand}</span> • {q.capacityKw} kW (
                        {formatINR(q.grandTotal)})
                        <span className="text-[10px] text-slate-400 block">{q.quotationNumber} • {new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            handleAddBrandVariant(q.brand as SolarBrand);
                          }}
                          className="h-7 text-[11px] text-amber-700 hover:bg-amber-50"
                        >
                          Load as Variant
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="border-amber-200 bg-gradient-to-b from-amber-50/40 via-white to-white shadow-md">
              <CardHeader className="border-b border-amber-100 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-amber-600" />
                    {currentVariant.brand} Proposal
                  </CardTitle>
                  <Badge variant="default" className="bg-amber-500 text-slate-950 font-bold">
                    {currentFinancials.capacityKw} kW • {currentVariant.brand}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                    Total Contract Amount
                  </span>
                  <span className="text-2xl font-black text-slate-900 block mt-0.5">
                    {formatINR(currentFinancials.grandTotal)}
                  </span>
                  <div className="text-[10px] text-slate-400 italic mt-1">
                    {currentFinancials.amountInWords}
                  </div>
                </div>

                {currentVariant.category === "RESIDENTIAL" ? (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Central Subsidy (MNRE):
                      </span>
                      <span className="font-bold text-emerald-700">- {formatINR(currentFinancials.centralSubsidy)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Odisha State Subsidy:
                      </span>
                      <span className="font-bold text-emerald-700">- {formatINR(currentFinancials.stateSubsidy)}</span>
                    </div>
                    <div className="border-t border-emerald-200 pt-2 flex justify-between items-center text-xs font-bold">
                      <span className="text-emerald-900">Net Effective Out-of-Pocket:</span>
                      <span className="text-emerald-800 text-base">{formatINR(currentFinancials.netCustomerPayable)}*</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                    <div className="font-bold">Commercial Rooftop Tax Benefits:</div>
                    <div>• 40% Accelerated Depreciation in Year 1</div>
                    <div>• 100% GST Input Tax Credit (ITC) claimable</div>
                  </div>
                )}

                <div className="border border-slate-200 rounded-xl p-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Array Modules:</span>
                    <span className="font-semibold text-slate-900">
                      {currentFinancials.moduleCount}x 580Wp {currentVariant.brand} TOPCon
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inverter:</span>
                    <span className="font-semibold text-slate-900">
                      {currentVariant.capacityKw <= 3.3 ? "3.3 kW" : currentVariant.capacityKw + " kW"} Gen 4 ({currentVariant.brand})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>TPNODL Demand Note:</span>
                    <span className="font-semibold text-slate-900">{formatINR(currentVariant.demandNoteAmount)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    onClick={() => handleDownloadPdf(currentVariant)}
                    disabled={isGeneratingPdf}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-5 shadow-md"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download {currentVariant.brand} PDF
                  </Button>
                  <Button
                    onClick={() => setIsCompareOpen(true)}
                    variant="outline"
                    className="border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs py-5"
                  >
                    <Layers className="w-4 h-4 mr-1.5 text-amber-600" />
                    Compare ({variants.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {/* TAB 2: Editable BOQ for current variant */}
      {activeTab === "BOQ" && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Itemized Bill of Quantities (BOQ) for {currentVariant.brand}
              </CardTitle>
              <CardDescription>
                Customize components, makes, and quantities for this specific brand proposal.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateCurrentVariant({
                    boqList: generateDefaultBOQList(
                      currentVariant.capacityKw,
                      currentFinancials.moduleCount,
                      currentVariant.brand
                    ),
                  })
                }
                className="text-xs"
              >
                Reset to {currentVariant.brand} Defaults
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {(["A", "B", "C", "D"] as const).map((sectionKey) => {
              const sectionItems = currentVariant.boqList.filter((i) => i.section === sectionKey);
              const sectionLabels = {
                A: "Section A: Photovoltaic Modules & Structure",
                B: "Section B: Inverter(s)",
                C: "Section C: Fittings & Other Accessories",
                D: "Section D: Installation, Documentation & Commissioning",
              };

              return (
                <div key={sectionKey} className="space-y-2">
                  <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-md">
                    <span className="text-xs font-bold text-slate-800">{sectionLabels[sectionKey]}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newItem: BOQItem = {
                          id: `boq-custom-${Date.now()}`,
                          slNo: sectionItems.length + 1,
                          section: sectionKey,
                          description: "New Custom Component",
                          make: currentVariant.brand,
                          uom: "Nos.",
                          qty: 1,
                          warranty: "Standard",
                        };
                        updateCurrentVariant({ boqList: [...currentVariant.boqList, newItem] });
                      }}
                      className="h-6 text-[11px] text-amber-700 hover:text-amber-800"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Line Item
                    </Button>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 text-xs">
                          <TableHead className="w-12 text-center">#</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-40">Make / Brand</TableHead>
                          <TableHead className="w-20 text-center">UOM</TableHead>
                          <TableHead className="w-28 text-center">Qty</TableHead>
                          <TableHead className="w-16 text-right">Del</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectionItems.map((item, idx) => (
                          <TableRow key={item.id || idx} className="text-xs">
                            <TableCell className="text-center font-bold text-slate-500">{item.slNo}</TableCell>
                            <TableCell>
                              <input
                                className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-1 py-0.5"
                                value={item.description}
                                onChange={(e) => {
                                  const updated = currentVariant.boqList.map((i) =>
                                    i.id === item.id ? { ...i, description: e.target.value } : i
                                  );
                                  updateCurrentVariant({ boqList: updated });
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-1 py-0.5 font-semibold text-slate-800"
                                value={item.make}
                                onChange={(e) => {
                                  const updated = currentVariant.boqList.map((i) =>
                                    i.id === item.id ? { ...i, make: e.target.value } : i
                                  );
                                  updateCurrentVariant({ boqList: updated });
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                className="w-full text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-1 py-0.5"
                                value={item.uom}
                                onChange={(e) => {
                                  const updated = currentVariant.boqList.map((i) =>
                                    i.id === item.id ? { ...i, uom: e.target.value } : i
                                  );
                                  updateCurrentVariant({ boqList: updated });
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                className="w-full text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-1 py-0.5 font-bold"
                                value={item.qty}
                                onChange={(e) => {
                                  const updated = currentVariant.boqList.map((i) =>
                                    i.id === item.id ? { ...i, qty: e.target.value } : i
                                  );
                                  updateCurrentVariant({ boqList: updated });
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <button
                                onClick={() => {
                                  const updated = currentVariant.boqList.filter((i) => i.id !== item.id);
                                  updateCurrentVariant({ boqList: updated });
                                }}
                                className="text-slate-400 hover:text-red-600 p-1"
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
      )}

      {/* TAB 3: Editable Brand Terms for current variant */}
      {activeTab === "TERMS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 bg-amber-50/40">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    {currentVariant.brand} Warranty Coverage
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Appears on Page 5 of the {currentVariant.brand} PDF.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateCurrentVariant({ terms: getDefaultTermsForBrand(currentVariant.brand) })}
                  className="text-xs"
                >
                  Reset {currentVariant.brand} Terms
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Solar Inverter Warranty</label>
                <Input
                  value={currentVariant.terms.inverterWarranty}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, inverterWarranty: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Solar Module Product Warranty</label>
                <Input
                  value={currentVariant.terms.moduleProductWarranty}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, moduleProductWarranty: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Solar Module Power Output Warranty</label>
                <Input
                  value={currentVariant.terms.modulePowerWarranty}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, modulePowerWarranty: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">AMC Duration</label>
                <Input
                  value={currentVariant.terms.amcDuration}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, amcDuration: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">AMC Inclusions</label>
                <textarea
                  className="w-full h-20 rounded-md border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-amber-500"
                  value={currentVariant.terms.amcScopeText}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, amcScopeText: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" />
                Payment Milestones for {currentVariant.brand}
              </CardTitle>
              <CardDescription className="text-xs">
                Appears on Page 4 & Page 5 of the PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Token (₹)</label>
                  <Input
                    type="number"
                    value={currentVariant.terms.bookingTokenAmount}
                    onChange={(e) =>
                      updateCurrentVariant({
                        terms: { ...currentVariant.terms, bookingTokenAmount: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Dispatch Adv (%)</label>
                  <Input
                    type="number"
                    value={currentVariant.terms.dispatchAdvancePercent}
                    onChange={(e) =>
                      updateCurrentVariant({
                        terms: { ...currentVariant.terms, dispatchAdvancePercent: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Install Final (%)</label>
                  <Input
                    type="number"
                    value={currentVariant.terms.installationBalancePercent}
                    onChange={(e) =>
                      updateCurrentVariant({
                        terms: {
                          ...currentVariant.terms,
                          installationBalancePercent: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">TPNODL Inspection Turnaround</label>
                <textarea
                  className="w-full h-16 rounded-md border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-amber-500"
                  value={currentVariant.terms.inspectionTurnaroundText}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, inspectionTurnaroundText: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Net Meter Energizing Description</label>
                <textarea
                  className="w-full h-16 rounded-md border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-amber-500"
                  value={currentVariant.terms.meterEnergizingText}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, meterEnergizingText: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Custom Notes / Brand Special Offer</label>
                <Input
                  value={currentVariant.terms.customNotes || ""}
                  onChange={(e) =>
                    updateCurrentVariant({
                      terms: { ...currentVariant.terms, customNotes: e.target.value },
                    })
                  }
                  placeholder="e.g. Special festive pricing or fast-track liaisoning"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: Bank Details */}
      {activeTab === "BANK" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900">
                SP Surya Bank Details (Page 4)
              </CardTitle>
              <CardDescription>Official banking information displayed on proposals.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Bank & Branch Name</label>
                <Input
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Account Number</label>
                <Input
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">IFSC Code</label>
                <Input
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Beneficiary / Account Name</label>
                <Input
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900">
                DISCOM & Demand Note Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  TPNODL Meter Demand Note Fee (₹)
                </label>
                <Input
                  type="number"
                  value={currentVariant.demandNoteAmount}
                  onChange={(e) => updateCurrentVariant({ demandNoteAmount: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold">Active Payment Milestones:</div>
                <div>1. Agreement Signing: ₹{currentVariant.terms.bookingTokenAmount.toLocaleString("en-IN")} Token</div>
                <div>2. Material Dispatch: {currentVariant.terms.dispatchAdvancePercent}% Advance</div>
                <div>3. Installation Day: {currentVariant.terms.installationBalancePercent}% Final Balance</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Side-by-Side Brand Comparison Dialog */}
      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Layers className="w-5 h-5 text-amber-500" />
              Side-by-Side Brand Quotes Comparison for {customerName}
            </DialogTitle>
            <DialogDescription>
              Comparing {variants.length} quote option{variants.length > 1 ? "s" : ""} generated for this customer.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100 text-xs">
                    <TableHead className="font-bold">Specification</TableHead>
                    {variants.map((v, i) => (
                      <TableHead key={v.id} className="text-center font-bold text-slate-900 min-w-[180px]">
                        <div className="text-amber-700 font-extrabold">{v.brand}</div>
                        <div className="text-[10px] text-slate-500 font-normal">Option {i + 1}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  <TableRow>
                    <TableCell className="font-semibold text-slate-700">System Capacity</TableCell>
                    {variants.map((v) => (
                      <TableCell key={v.id} className="text-center font-bold">
                        {v.capacityKw} kW ({v.phase === "SINGLE_PHASE" ? "1-Ph" : "3-Ph"})
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="bg-slate-50">
                    <TableCell className="font-semibold text-slate-700">PV Modules</TableCell>
                    {variants.map((v) => (
                      <TableCell key={v.id} className="text-center">
                        {Math.ceil((v.capacityKw * 1000) / 580)}x 580Wp {v.brand} TOPCon
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-slate-700">Inverter Warranty</TableCell>
                    {variants.map((v) => (
                      <TableCell key={v.id} className="text-center text-emerald-800 font-medium">
                        {v.terms.inverterWarranty}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="bg-slate-50">
                    <TableCell className="font-semibold text-slate-700">Module Warranty</TableCell>
                    {variants.map((v) => (
                      <TableCell key={v.id} className="text-center">
                        {v.terms.moduleProductWarranty} / {v.terms.modulePowerWarranty}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-slate-700">Free AMC</TableCell>
                    {variants.map((v) => (
                      <TableCell key={v.id} className="text-center font-bold text-amber-800">
                        {v.terms.amcDuration}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="bg-amber-50/50 font-bold border-t border-amber-200">
                    <TableCell className="text-slate-900">Total Contract Package</TableCell>
                    {variants.map((v) => (
                      <TableCell key={v.id} className="text-center text-sm font-black text-slate-900">
                        {formatINR(v.customGrandTotal)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="bg-emerald-50 text-emerald-900 font-bold">
                    <TableCell>Total Govt Subsidy</TableCell>
                    {variants.map((v) => {
                      const fin = calculateQuotation(v.capacityKw, v.category, v.brand, v.phase, v.customGrandTotal);
                      return (
                        <TableCell key={v.id} className="text-center">
                          - {formatINR(fin.totalSubsidy)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow className="bg-emerald-100/70 font-black text-emerald-950 border-t-2 border-emerald-300">
                    <TableCell>Net Out-of-Pocket</TableCell>
                    {variants.map((v) => {
                      const fin = calculateQuotation(v.capacityKw, v.category, v.brand, v.phase, v.customGrandTotal);
                      return (
                        <TableCell key={v.id} className="text-center text-sm text-emerald-900">
                          {formatINR(fin.netCustomerPayable)}*
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-slate-700">Download 6-Page PDF</TableCell>
                    {variants.map((v) => (
                      <TableCell key={v.id} className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleDownloadPdf(v)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] h-8 w-full"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          {v.brand} PDF
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <Button
              onClick={handleSaveAllQuotesToDb}
              disabled={isSavingToDb}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save All {variants.length} Quotes to Database
            </Button>
            <Button variant="outline" onClick={() => setIsCompareOpen(false)}>
              Close Comparison
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
