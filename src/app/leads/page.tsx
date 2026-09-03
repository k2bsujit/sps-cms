import React from "react";
import { LeadTable } from "@/components/leads/LeadTable";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Solar Leads & Pipeline Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Capture prospective PM Surya Ghar & Commercial solar rooftop leads, manage site surveys, and generate commercial quotations.
          </p>
        </div>
      </div>
      <LeadTable />
    </div>
  );
}
