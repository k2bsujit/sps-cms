import React, { Suspense } from "react";
import { QuotationForm } from "@/components/quotation/QuotationForm";

export default function QuotationLegacyPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Quotation Generator...</div>}>
        <QuotationForm />
      </Suspense>
    </div>
  );
}
