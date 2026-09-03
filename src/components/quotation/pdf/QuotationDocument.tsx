import React from "react";
import { Document } from "@react-pdf/renderer";
import { QuotationData } from "@/types";
import { Page1Overview } from "./Page1Overview";
import { Page2DocRules } from "./Page2DocRules";
import { Page3BOQ } from "./Page3BOQ";
import { Page4PaymentTerms } from "./Page4PaymentTerms";
import { Page5Turnaround } from "./Page5Turnaround";
import { Page6ScopeMatrix } from "./Page6ScopeMatrix";

interface QuotationDocumentProps {
  data: QuotationData;
}

export const QuotationDocument: React.FC<QuotationDocumentProps> = ({ data }) => {
  return (
    <Document
      title={`Quotation_${data.quotationNumber}_${data.customer.name}`}
      author="SP Surya Solar Solutions"
      subject={`Solar Rooftop Proposal - ${data.financials.capacityKw} kW`}
      keywords="SP Surya, PM Surya Ghar, Solar Rooftop, Odisha, Balasore"
    >
      <Page1Overview data={data} />
      <Page2DocRules data={data} />
      <Page3BOQ data={data} />
      <Page4PaymentTerms data={data} />
      <Page5Turnaround data={data} />
      <Page6ScopeMatrix data={data} />
    </Document>
  );
};

export default QuotationDocument;
