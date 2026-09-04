"use client";

import React, { useState, useEffect } from "react";
import { Lead, SolarBrand, SystemCategory, PhaseType, LeadStatus } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Zap, FileText, Phone, User, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => Promise<Lead | void>;
  initialData?: Lead | null;
}

export const LeadModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Lead>>({
    customerName: "",
    contactNumber: "",
    email: "",
    consumerNumber: "",
    location: "",
    district: "Balasore",
    pin: "756040",
    category: "RESIDENTIAL",
    capacityKw: 3.0,
    phase: "SINGLE_PHASE",
    brandPreference: "WAAREE",
    source: "PM Surya Ghar Portal",
    status: "NEW",
    notes: "",
    followUpDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setErrorMsg(null);
    if (initialData) {
      setFormData({
        ...initialData,
        email: initialData.email || "",
        consumerNumber: initialData.consumerNumber || "",
        followUpDate: initialData.followUpDate ? initialData.followUpDate.split("T")[0] : "",
      });
    } else {
      setFormData({
        customerName: "",
        contactNumber: "",
        email: "",
        consumerNumber: "",
        location: "",
        district: "Balasore",
        pin: "756040",
        category: "RESIDENTIAL",
        capacityKw: 3.0,
        phase: "SINGLE_PHASE",
        brandPreference: "WAAREE",
        source: "PM Surya Ghar Portal",
        status: "NEW",
        notes: "",
        followUpDate: "",
      });
    }
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    if (!formData.customerName || formData.customerName.trim().length < 2) {
      setErrorMsg("Please enter a valid Customer Name.");
      return false;
    }
    const cleanPhone = (formData.contactNumber || "").replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!formData.location || formData.location.trim().length < 2) {
      setErrorMsg("Please enter the Village or Town address.");
      return false;
    }
    return true;
  };

  const handleSave = async (andCreateQuote = false) => {
    setErrorMsg(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const saved = await onSave(formData);
      onClose();

      if (andCreateQuote) {
        const params = new URLSearchParams({
          name: formData.customerName || "",
          mobile: formData.contactNumber || "",
          email: formData.email || "",
          consumerNumber: formData.consumerNumber || "",
          village: formData.location || "",
          district: formData.district || "Balasore",
          pin: formData.pin || "756040",
          capacity: String(formData.capacityKw || 3),
          phase: formData.phase || "SINGLE_PHASE",
          brand: formData.brandPreference || "WAAREE",
          category: formData.category || "RESIDENTIAL",
        });
        router.push(`/quotations?${params.toString()}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            {initialData ? "Edit Lead Details" : "Add New Solar Lead"}
          </DialogTitle>
          <DialogDescription>
            Capture prospect customer details, rooftop capacity requirement, and brand preference.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-4 pt-2">
          {/* Customer Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
              <Input
                value={formData.customerName || ""}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. NARENDRA KUMAR NAYAK"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
              <Input
                value={formData.contactNumber || ""}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="e.g. 9810155834"
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Optional Email & Consumer Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Consumer Number</span>
                <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                value={formData.consumerNumber || ""}
                onChange={(e) => setFormData({ ...formData, consumerNumber: e.target.value })}
                placeholder="e.g. 324322030589 (TPNODL)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. customer@gmail.com"
              />
            </div>
          </div>

          {/* Location & District */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Village / Town / Address *</label>
              <Input
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Sergarh, Nilgiri"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">District *</label>
              <Input
                value={formData.district || "Balasore"}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Balasore"
                required
              />
            </div>
          </div>

          {/* Category & Capacity & Phase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Template / Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SystemCategory })}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500"
              >
                <option value="RESIDENTIAL">Residential (PM Surya Ghar)</option>
                <option value="COMMERCIAL">Commercial & Industrial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Required Capacity (kW)</label>
              <Input
                type="number"
                step="0.5"
                min="1"
                value={formData.capacityKw || 3}
                onChange={(e) => setFormData({ ...formData, capacityKw: parseFloat(e.target.value) || 3 })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Electrical Phase</label>
              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value as PhaseType })}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500"
              >
                <option value="SINGLE_PHASE">Single Phase (230V)</option>
                <option value="THREE_PHASE">Three Phase (415V)</option>
              </select>
            </div>
          </div>

          {/* Brand Preference & Source & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Brand Preference</label>
              <select
                value={formData.brandPreference}
                onChange={(e) => setFormData({ ...formData, brandPreference: e.target.value as SolarBrand })}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500"
              >
                <option value="WAAREE">WAAREE</option>
                <option value="TATA Solar">TATA Solar</option>
                <option value="Eastman">Eastman</option>
                <option value="Adani Solar">Adani Solar</option>
                <option value="UTL Solar">UTL Solar</option>
                <option value="Vikram Solar">Vikram Solar</option>
                <option value="Goldi Solar">Goldi Solar</option>
                <option value="Other">Other Tier 1</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Lead Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500"
              >
                <option value="PM Surya Ghar Portal">PM Surya Ghar Portal</option>
                <option value="Direct Walk-in">Direct Walk-in</option>
                <option value="Field Campaign">Field Campaign</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website Form</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Pipeline Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500"
              >
                <option value="NEW">New Lead</option>
                <option value="CONTACTED">Contacted</option>
                <option value="SURVEY_SCHEDULED">Survey Scheduled</option>
                <option value="QUOTATION_CREATED">Quotation Created</option>
                <option value="WON">Won (Converted)</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>

          {/* Follow-up Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Next Follow-up Date</label>
              <Input
                type="date"
                value={formData.followUpDate || ""}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Notes / Remarks</label>
              <Input
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Roof shadow free, wants loan support"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3 border-t border-slate-100 sm:justify-between flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => handleSave(true)}
                className="bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-semibold"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Save & Create Quote
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                {isSubmitting ? "Saving Lead..." : initialData ? "Update Lead" : "Add Lead"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
