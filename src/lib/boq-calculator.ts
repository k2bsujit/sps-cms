import { BOQItem, QuotationFinancials, QuotationData, SolarBrand, SystemCategory, PhaseType, BankDetails, TemplateTerms } from "@/types";

export function numberToWordsIndian(num: number): string {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero Only";

  function convert(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
    if (n < 100000)
      return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    if (n < 10000000)
      return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
  }

  const rounded = Math.round(num);
  const result = convert(rounded).trim();
  return result + " Only.";
}

export function calculateSubsidies(capacityKw: number, category: SystemCategory) {
  if (category === "COMMERCIAL") {
    return {
      centralSubsidy: 0,
      stateSubsidy: 0,
      totalSubsidy: 0,
    };
  }

  let centralSubsidy = 0;
  if (capacityKw <= 1) {
    centralSubsidy = 30000;
  } else if (capacityKw <= 2) {
    centralSubsidy = 60000;
  } else {
    centralSubsidy = 78000; // 3kW+ capped under PM Surya Ghar
  }

  // Odisha State Subsidy: up to ₹20,000/kW (max ₹60,000)
  const stateSubsidy = Math.min(60000, Math.round(capacityKw * 20000));

  return {
    centralSubsidy,
    stateSubsidy,
    totalSubsidy: centralSubsidy + stateSubsidy,
  };
}

export function calculateQuotation(
  capacityKw: number,
  category: SystemCategory = "RESIDENTIAL",
  brand: SolarBrand = "WAAREE",
  phase: PhaseType = "SINGLE_PHASE",
  customGrandTotal?: number
): QuotationFinancials {
  const moduleWattage = 580; // 580Wp Mono Half-Cut Bifacial TOPCon
  const targetWatts = capacityKw * 1000;
  const moduleCount = Math.max(1, Math.ceil(targetWatts / moduleWattage));
  const totalDcCapacityWp = moduleCount * moduleWattage;

  let grandTotal = 0;
  if (customGrandTotal && customGrandTotal > 0) {
    grandTotal = customGrandTotal;
  } else if (category === "RESIDENTIAL") {
    if (capacityKw === 3) grandTotal = 200000;
    else if (capacityKw === 1) grandTotal = 75000;
    else if (capacityKw === 2) grandTotal = 145000;
    else grandTotal = Math.round(capacityKw * 65000);
  } else {
    grandTotal = Math.round(capacityKw * 48000);
  }

  const baseCost = grandTotal;
  const gstPercent = 0;
  const gstAmount = 0;

  const { centralSubsidy, stateSubsidy, totalSubsidy } = calculateSubsidies(capacityKw, category);
  const netCustomerPayable = Math.max(0, grandTotal - totalSubsidy);

  const estimatedUnitsPerMonth = Math.round(capacityKw * 120);
  const estimatedMonthlySavings = Math.round(estimatedUnitsPerMonth * 6.5);
  const amountInWords = numberToWordsIndian(grandTotal);

  return {
    capacityKw,
    category,
    brand,
    phase,
    moduleCount,
    moduleWattage,
    totalDcCapacityWp,
    baseCost,
    gstPercent,
    gstAmount,
    grandTotal,
    centralSubsidy,
    stateSubsidy,
    totalSubsidy,
    netCustomerPayable,
    estimatedUnitsPerMonth,
    estimatedMonthlySavings,
    amountInWords,
  };
}

export function getDefaultTermsForBrand(brand: SolarBrand = "WAAREE"): TemplateTerms {
  switch (brand) {
    case "TATA Solar":
      return {
        inverterWarranty: "5 to 8 Years Manufacturer Warranty",
        moduleProductWarranty: "10 to 12 Years Product Warranty",
        modulePowerWarranty: "25 to 30 Years Linear Power Output Warranty",
        amcDuration: "5 Years Free Annual Maintenance Contract",
        amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
        bookingTokenAmount: 10000,
        dispatchAdvancePercent: 75,
        installationBalancePercent: 25,
        inspectionTurnaroundText: "15 to 20 days for DISCOM (TPNODL) site inspection post installation.",
        meterEnergizingText: "7 to 10 days post-inspection for net meter energizing visit.",
        customNotes: "Genuine TATA Power Solar Tier-1 Monocrystalline modules with ALMM and BIS certification.",
      };
    case "Eastman":
      return {
        inverterWarranty: "5 Years Standard Inverter Warranty",
        moduleProductWarranty: "10 Years Product Warranty",
        modulePowerWarranty: "25 Years Linear Performance Warranty",
        amcDuration: "5 Years Free Annual Maintenance Contract",
        amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
        bookingTokenAmount: 10000,
        dispatchAdvancePercent: 75,
        installationBalancePercent: 25,
        inspectionTurnaroundText: "15 to 20 days for DISCOM (TPNODL) site inspection post installation.",
        meterEnergizingText: "7 to 10 days post-inspection for net meter energizing visit.",
        customNotes: "Eastman Solar high-efficiency PV modules and on-grid inverter system.",
      };
    case "Adani Solar":
      return {
        inverterWarranty: "8 Years Manufacturer Warranty",
        moduleProductWarranty: "12 Years Product Warranty",
        modulePowerWarranty: "30 Years Linear Power Output Warranty (Bifacial TOPCon)",
        amcDuration: "5 Years Free Annual Maintenance Contract",
        amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
        bookingTokenAmount: 10000,
        dispatchAdvancePercent: 75,
        installationBalancePercent: 25,
        inspectionTurnaroundText: "15 to 20 days for DISCOM (TPNODL) site inspection post installation.",
        meterEnergizingText: "7 to 10 days post-inspection for net meter energizing visit.",
        customNotes: "Adani Solar DCR compliant N-Type Bifacial TOPCon modules with high bifaciality factor.",
      };
    case "UTL Solar":
      return {
        inverterWarranty: "5 Years Manufacturer Warranty",
        moduleProductWarranty: "10 Years Product Warranty",
        modulePowerWarranty: "25 Years Linear Performance Warranty",
        amcDuration: "5 Years Free Annual Maintenance Contract",
        amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
        bookingTokenAmount: 10000,
        dispatchAdvancePercent: 75,
        installationBalancePercent: 25,
        inspectionTurnaroundText: "15 to 20 days for DISCOM (TPNODL) site inspection post installation.",
        meterEnergizingText: "7 to 10 days post-inspection for net meter energizing visit.",
        customNotes: "UTL Solar high-reliability rooftop installation.",
      };
    case "Vikram Solar":
    case "Goldi Solar":
      return {
        inverterWarranty: "8 Years Manufacturer Warranty",
        moduleProductWarranty: "12 Years Product Warranty",
        modulePowerWarranty: "30 Years Linear Power Output Warranty",
        amcDuration: "5 Years Free Annual Maintenance Contract",
        amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
        bookingTokenAmount: 10000,
        dispatchAdvancePercent: 75,
        installationBalancePercent: 25,
        inspectionTurnaroundText: "15 to 20 days for DISCOM (TPNODL) site inspection post installation.",
        meterEnergizingText: "7 to 10 days post-inspection for net meter energizing visit.",
        customNotes: `${brand} high-efficiency monocrystalline PERC/TOPCon solar modules.`,
      };
    case "WAAREE":
    default:
      return {
        inverterWarranty: "8 Years Manufacturer Warranty",
        moduleProductWarranty: "12 Years Product Warranty",
        modulePowerWarranty: "30 Years Linear Power Output Warranty (N-Type Bifacial TOPCon)",
        amcDuration: "5 Years Free Annual Maintenance Contract",
        amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
        bookingTokenAmount: 10000,
        dispatchAdvancePercent: 75,
        installationBalancePercent: 25,
        inspectionTurnaroundText: "15 to 20 days for DISCOM (TPNODL) site inspection post installation.",
        meterEnergizingText: "7 to 10 days post-inspection for net meter energizing visit.",
        customNotes: "Waaree Authorized Franchise Partner installation with Waacab certified balance-of-systems.",
      };
  }
}

export function generateDefaultBOQList(
  capacityKw: number,
  moduleCount: number,
  brand: SolarBrand = "WAAREE"
): BOQItem[] {
  const brandName = brand === "Other" ? "Tier 1 Approved" : brand;
  const inverterRating = capacityKw <= 3.3 ? "3.3 KW -Gen 4" : `${capacityKw} KW -Gen 4`;

  return [
    {
      id: "boq-1",
      slNo: 1,
      section: "A",
      description: `580 WP (DCR) Modules - Mono Half -Cut Bifacial topcon`,
      make: brandName,
      uom: "Nos.",
      qty: moduleCount,
      rating: "580 Wp",
      warranty: "12/30 Years",
    },
    {
      id: "boq-2",
      slNo: 2,
      section: "A",
      description: `Module Mounting Structure - Standardized 4:3 ft leg profile with rafter–purlin layout scaled to kW-specific structural load.`,
      make: "APPOLO",
      uom: "SET",
      qty: 1,
      warranty: "10 Years",
    },
    {
      id: "boq-3",
      slNo: 1,
      section: "B",
      description: `${inverterRating} Solar On-grid Inverter`,
      make: brandName,
      uom: "Nos.",
      qty: 1,
      rating: `${inverterRating}`,
      warranty: "8 Years",
    },
    {
      id: "boq-4",
      slNo: 1,
      section: "C",
      description: "DC Cable @ 4 Sq. mm – Red & Black",
      make: "Waacab",
      uom: "Mtrs.",
      qty: "30 mtr",
    },
    {
      id: "boq-5",
      slNo: 2,
      section: "C",
      description: "AC Cable @ 4 Sq. mm – Red & Black",
      make: "Waacab",
      uom: "Mtrs.",
      qty: "30 mtr",
    },
    {
      id: "boq-6",
      slNo: 3,
      section: "C",
      description: "Earthing Cable – Green Wire @ 6 Sq. mm",
      make: "Waacab",
      uom: "Mtrs.",
      qty: "Upto 40 mtr",
    },
    {
      id: "boq-7",
      slNo: 4,
      section: "C",
      description: "2 in 1 Connector, MC4 Connectors",
      make: "Waacab",
      uom: "Set",
      qty: "As per Requirement",
    },
    {
      id: "boq-8",
      slNo: 5,
      section: "C",
      description: "DCDB & ACDB",
      make: "Waacab",
      uom: "Nos.",
      qty: "1 Each",
    },
    {
      id: "boq-9",
      slNo: 6,
      section: "C",
      description: "Pin & Ring Terminals",
      make: "Dowell’s/Equivalent",
      uom: "Set",
      qty: "As per Requirement",
    },
    {
      id: "boq-10",
      slNo: 7,
      section: "C",
      description: "Earthing Electrode with Earthing Chemical",
      make: "Forecast/Equivalent",
      uom: "Set",
      qty: 1,
    },
    {
      id: "boq-11",
      slNo: 8,
      section: "C",
      description: "Copper Bonded Lightning Arrestor",
      make: "Forecast/GreenRays/Equivalent",
      uom: "Nos.",
      qty: 1,
    },
    {
      id: "boq-12",
      slNo: 1,
      section: "D",
      description: "Installation, Documentation & Commissioning",
      make: "SP Surya Certified Team",
      uom: "Lot",
      qty: 1,
    },
  ];
}

export const defaultSPBankDetails: BankDetails = {
  bankName: "Punjab National Bank (PNB)",
  branch: "Nilagiri / Balasore Branch",
  accountNumber: "0849002100028491",
  ifscCode: "PUNB0084900",
  accountName: "SP SURYA",
};
