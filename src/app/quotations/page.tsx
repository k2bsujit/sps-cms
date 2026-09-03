import React, { Suspense } from "react";
import { QuotationForm } from "@/components/quotation/QuotationForm";

export default function QuotationsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Quotation Builder...</div>}>
        <QuotationForm />
      </Suspense>
    </div>
  );
}
