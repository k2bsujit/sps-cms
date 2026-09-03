"use client";

import React, { useState, useEffect } from "react";
import { InstallationRecord } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDays } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<InstallationRecord>) => Promise<void>;
  initialData?: InstallationRecord | null;
}

export const InstallationModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<InstallationRecord>>({
    customerName: "",
    contactNumber: "",
    location: "",
    district: "Balasore",
    projectSizeKw: 3.0,
    brand: "WAAREE",
    phase: "Single Phase",
    projectCost: 150000,
    gnMeterInclusion: "Including cost",
    paymentType: "Loan SBI",
    demandNoteCharges: 3747,
    bankQuotation: 150000,
    invoiceCost: 150000,
    subsidyStatus: "Pending",
    installationDate: "",
    meterConnectionDate: "",
    nextMaintenanceDate: "",
    remarks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        installationDate: initialData.installationDate ? initialData.installationDate.split("T")[0] : "",
        meterConnectionDate: initialData.meterConnectionDate ? initialData.meterConnectionDate.split("T")[0] : "",
        nextMaintenanceDate: initialData.nextMaintenanceDate ? initialData.nextMaintenanceDate.split("T")[0] : "",
      });
    } else {
      setFormData({
        customerName: "",
        contactNumber: "",
        location: "",
        district: "Balasore",
        projectSizeKw: 3.0,
        brand: "WAAREE",
        phase: "Single Phase",
        projectCost: 150000,
        gnMeterInclusion: "Including cost",
        paymentType: "Loan SBI",
        demandNoteCharges: 3747,
        bankQuotation: 150000,
        invoiceCost: 150000,
        subsidyStatus: "Pending",
        installationDate: "",
        meterConnectionDate: "",
        nextMaintenanceDate: "",
        remarks: "",
      });
    }
  }, [initialData, isOpen]);

  // Handle auto-calculation of next maintenance date when meterConnectionDate changes
  const handleMeterConnectionDateChange = (dateStr: string) => {
    let nextMaint = "";
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const nextD = addDays(d, 90);
        nextMaint = nextD.toISOString().split("T")[0];
      }
    }
    setFormData((prev) => ({
      ...prev,
      meterConnectionDate: dateStr,
      nextMaintenanceDate: nextMaint,
    }));
  };

  const handlePhaseChange = (phaseVal: string) => {
    setFormData((prev) => ({
      ...prev,
      phase: phaseVal,
      demandNoteCharges: phaseVal.includes("Three") ? 4334 : 3747,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.contactNumber || !formData.location) {
      alert("Please fill in the required customer details (Name, Contact, Location).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving installation record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Installation Record" : "Add Completed Solar Installation"}
          </DialogTitle>
          <DialogDescription>
            Record post-installation details, meter synchronization, subsidies, and warranty tracking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Section 1: Customer Profile */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 p-2 rounded">
              1. Customer Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
                <Input
                  value={formData.customerName || ""}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Ramesh Chandra Patra"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Number *</label>
                <Input
                  value={formData.contactNumber || ""}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="e.g. 9437102938"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location / Village *</label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remuna Golei"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical & Brand Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 p-2 rounded">
              2. Technical & Equipment Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Project Size (kW)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.projectSizeKw || 3}
                  onChange={(e) => setFormData({ ...formData, projectSizeKw: parseFloat(e.target.value) || 3 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Brand (Make)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.brand || "WAAREE"}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                >
                  <option value="WAAREE">WAAREE</option>
                  <option value="TATA">TATA Power Solar</option>
                  <option value="ADANI">ADANI Solar</option>
                  <option value="VIKRAM">VIKRAM Solar</option>
                  <option value="GOLDEN">GOLDEN SUN</option>
                  <option value="PREMIER">PREMIER Energies</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phase</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.phase || "Single Phase"}
                  onChange={(e) => handlePhaseChange(e.target.value)}
                >
                  <option value="Single Phase">Single Phase (230V)</option>
                  <option value="Three Phase">Three Phase (415V)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">GN Meter Inclusion</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.gnMeterInclusion || "Including cost"}
                  onChange={(e) => setFormData({ ...formData, gnMeterInclusion: e.target.value })}
                >
                  <option value="Including cost">Including cost</option>
                  <option value="Client Direct">Client Direct</option>
                  <option value="Excluded">Excluded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Financials & Payment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 p-2 rounded">
              3. Commercials, Invoicing & Payment Mode
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Project Cost (₹)</label>
                <Input
                  type="number"
                  value={formData.projectCost || 150000}
                  onChange={(e) => setFormData({ ...formData, projectCost: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Payment Type</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.paymentType || "Cash"}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                >
                  <option value="Cash">Cash</option>
                  <option value="Loan SBI">Loan SBI (Surya Ghar)</option>
                  <option value="Loan PNB">Loan PNB</option>
                  <option value="Loan Canara">Loan Canara</option>
                  <option value="Loan Union">Loan Union</option>
                  <option value="Other Loan">Other Bank Loan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Demand Note Fee (₹)</label>
                <Input
                  type="number"
                  value={formData.demandNoteCharges || 3747}
                  onChange={(e) => setFormData({ ...formData, demandNoteCharges: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Invoice Cost (₹)</label>
                <Input
                  type="number"
                  value={formData.invoiceCost || 150000}
                  onChange={(e) => setFormData({ ...formData, invoiceCost: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Bank Quotation (₹)</label>
                <Input
                  type="number"
                  value={formData.bankQuotation || 150000}
                  onChange={(e) => setFormData({ ...formData, bankQuotation: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Subsidy Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.subsidyStatus || "Pending"}
                  onChange={(e) => setFormData({ ...formData, subsidyStatus: e.target.value })}
                >
                  <option value="Both Subsidy Came">Both Subsidy Came (Central + Odisha State)</option>
                  <option value="Central Came">Central Came (State Pending)</option>
                  <option value="State Came">State Came (Central Pending)</option>
                  <option value="Pending">Pending (Under Portal Verification)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Operational Dates & Next Maintenance (+90d) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 p-2 rounded">
              4. Installation Timelines & Automated AMC (+90 Days)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Installation Date</label>
                <Input
                  type="date"
                  value={formData.installationDate || ""}
                  onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Meter Connection Date</label>
                <Input
                  type="date"
                  value={formData.meterConnectionDate || ""}
                  onChange={(e) => handleMeterConnectionDateChange(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
                  <span>Next Maintenance Date</span>
                  <span className="text-[10px] text-emerald-600 font-bold">(Auto +90 Days)</span>
                </label>
                <Input
                  type="date"
                  value={formData.nextMaintenanceDate || ""}
                  onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                  className="bg-emerald-50/50 border-emerald-300 font-bold text-emerald-900"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Remarks / Inverter & Module Serial Numbers</label>
            <Input
              value={formData.remarks || ""}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="e.g. Waaree 580Wp TOPCon, Solis 3.3kW Inverter S/N: 24089912. TPNODL test report approved."
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
              {isSubmitting ? "Saving..." : initialData ? "Update Installation" : "Create Installation Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
