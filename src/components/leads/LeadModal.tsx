"use client";

import React, { useState, useEffect } from "react";
import { Lead, SolarBrand, SystemCategory, PhaseType, LeadStatus } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => Promise<void>;
  initialData?: Lead | null;
}

export const LeadModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    customerName: "",
    contactNumber: "",
    email: "",
    consumerNumber: "",
    location: "",
    district: "Balasore",
    pin: "756019",
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

  useEffect(() => {
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
        pin: "756019",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.contactNumber || !formData.location) {
      alert("Please fill in Customer Name, Contact Number, and Location.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Lead Details" : "Add New Solar Lead"}
          </DialogTitle>
          <DialogDescription>
            Capture prospect customer details, rooftop capacity requirement, and brand preference.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Customer Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
              <Input
                value={formData.customerName || ""}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. ADITYA KUMAR BARIK"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
              <Input
                value={formData.contactNumber || ""}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="e.g. 9437102938"
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Optional Email & Consumer Number (Non-mandatory as requested) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Consumer Number</span>
                <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                value={formData.consumerNumber || ""}
                onChange={(e) => setFormData({ ...formData, consumerNumber: e.target.value })}
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
                placeholder="e.g. Bartana, Somanathpur, Khantapada"
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

          {/* Project Technical Sizing & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Template / Category</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.category || "RESIDENTIAL"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SystemCategory })}
              >
                <option value="RESIDENTIAL">Residential (PM Surya Ghar)</option>
                <option value="COMMERCIAL">Commercial & Industrial (C&I)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Required Capacity (kW)</label>
              <Input
                type="number"
                step="0.5"
                value={formData.capacityKw || 3.0}
                onChange={(e) => setFormData({ ...formData, capacityKw: parseFloat(e.target.value) || 3.0 })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Electrical Phase</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.phase || "SINGLE_PHASE"}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value as PhaseType })}
              >
                <option value="SINGLE_PHASE">Single Phase (230V)</option>
                <option value="THREE_PHASE">Three Phase (415V)</option>
              </select>
            </div>
          </div>

          {/* Brand Preference & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Brand Preference</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.brandPreference || "WAAREE"}
                onChange={(e) => setFormData({ ...formData, brandPreference: e.target.value as SolarBrand })}
              >
                <option value="WAAREE">WAAREE</option>
                <option value="TATA Solar">TATA Solar</option>
                <option value="Eastman">Eastman</option>
                <option value="Adani Solar">Adani Solar</option>
                <option value="UTL Solar">UTL Solar</option>
                <option value="Vikram Solar">Vikram Solar</option>
                <option value="Goldi Solar">Goldi Solar</option>
                <option value="Other">Other Tier-1</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Lead Source</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.source || "PM Surya Ghar Portal"}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option value="PM Surya Ghar Portal">PM Surya Ghar Portal</option>
                <option value="Direct Walk-in">Direct Walk-in / Office</option>
                <option value="Referral">Customer Referral</option>
                <option value="Field Campaign">Field Campaign / Camp</option>
                <option value="Social Media">Social Media / Website</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Pipeline Status</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.status || "NEW"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
              >
                <option value="NEW">New Lead</option>
                <option value="CONTACTED">Contacted</option>
                <option value="SURVEY_SCHEDULED">Survey Scheduled</option>
                <option value="QUOTATION_CREATED">Quotation Created</option>
                <option value="WON">Closed / Won</option>
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
                placeholder="e.g. Roof shadow free, wants loan support."
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
              {isSubmitting ? "Saving Lead..." : initialData ? "Update Lead" : "Add Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
