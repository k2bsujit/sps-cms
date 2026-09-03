import React from "react";
import { InstallationTable } from "@/components/installations/InstallationTable";

export default function InstallationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Post-Installation Customer Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Excel-style data grid tracking completed solar rooftop projects, meter connections, demand notes, and maintenance.
          </p>
        </div>
      </div>
      <InstallationTable />
    </div>
  );
}
