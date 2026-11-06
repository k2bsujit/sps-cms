export type PhaseType = "SINGLE_PHASE" | "THREE_PHASE";
export type SystemCategory = "RESIDENTIAL" | "COMMERCIAL";

export type SolarBrand =
  | "WAAREE"
  | "TATA Solar"
  | "Eastman"
  | "Adani Solar"
  | "UTL Solar"
  | "Vikram Solar"
  | "Goldi Solar"
  | "Other";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "SURVEY_SCHEDULED"
  | "QUOTATION_CREATED"
  | "WON"
  | "LOST";

export type SubsidyStatusType =
  | "Both Subsidy Came"
  | "Pending"
  | "Central Came"
  | "State Came"
  | "Not Applicable";

export type PaymentModeType =
  | "Cash"
  | "Loan SBI"
  | "Loan PNB"
  | "Loan Canara"
  | "Loan Union"
  | "Direct Transfer";

export interface Lead {
  id: string;
  customerName: string;
  contactNumber: string;
  email?: string;
  consumerNumber?: string;
  location: string;
  district: string;
  pin?: string;
  category: SystemCategory;
  capacityKw: number;
  phase: PhaseType;
  brandPreference: SolarBrand;
  source: string;
  status: LeadStatus;
  notes?: string;
  followUpDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BOQItem {
  id: string;
  slNo: number;
  section: "A" | "B" | "C" | "D"; // A: Modules & Structure, B: Inverters, C: Fittings & Accessories, D: Installation & Commissioning
  description: string;
  make: string;
  uom: string;
  qty: string | number;
  rating?: string;
  warranty?: string;
}

export interface BankDetails {
  bankName: string;
  branch: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  upiId?: string;
}

export interface TemplateTerms {
  inverterWarranty: string;
  moduleProductWarranty: string;
  modulePowerWarranty: string;
  amcDuration: string;
  amcScopeText?: string;
  bookingTokenAmount: number;
  dispatchAdvancePercent: number;
  installationBalancePercent: number;
  inspectionTurnaroundText?: string;
  meterEnergizingText?: string;
  customNotes?: string;
}

export interface QuotationFinancials {
  capacityKw: number;
  category: SystemCategory;
  brand: SolarBrand;
  phase: PhaseType;
  moduleCount: number;
  moduleWattage: number;
  totalDcCapacityWp: number;
  baseCost: number;
  gstPercent: number;
  gstAmount: number;
  grandTotal: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  netCustomerPayable: number;
  estimatedUnitsPerMonth: number;
  estimatedMonthlySavings: number;
  amountInWords: string;
}

export interface PdfAssets {
  logoDataUri?: string | null;
  rooftopImageDataUri?: string | null;
}

export interface QuotationData {
  assets?: PdfAssets;
  id?: string;
  quotationNumber: string;
  proposalTitle?: string;
  date: string;
  validUntil: string;
  category: SystemCategory;
  brand: SolarBrand;
  customer: {
    name: string;
    mobile: string;
    email?: string;
    consumerNumber?: string;
    village: string;
    district: string;
    pin: string;
    phase: PhaseType;
    discom: string;
  };
  financials: QuotationFinancials;
  boqList: BOQItem[];
  bankDetails: BankDetails;
  terms: TemplateTerms;
  demandNoteAmount: number;
  validityDays: number;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
}

export interface InstallationRecord {
  id: string;
  customerName: string;
  contactNumber: string;
  email?: string;
  consumerNumber?: string;
  location: string;
  district: string;
  category: SystemCategory;
  projectSizeKw: number;
  brand: string;
  phase: string;
  projectCost: number;
  gnMeterInclusion: string;
  paymentType: string;
  demandNoteCharges: number;
  bankQuotation: number;
  invoiceCost: number;
  subsidyStatus: string;
  installationDate?: string | null;
  meterConnectionDate?: string | null;
  nextMaintenanceDate?: string | null;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
