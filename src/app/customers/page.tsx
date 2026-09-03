import React from "react";
import { InstallationTable } from "@/components/installations/InstallationTable";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Customer Management & Post-Installation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track completed solar plants, TPNODL net meter connections, auto +90-day next maintenance dates, and Central & State DBT subsidies.
          </p>
        </div>
      </div>
      <InstallationTable />
    </div>
  );
}
