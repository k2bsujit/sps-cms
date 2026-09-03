import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const defaultAppSettings = {
  company: {
    name: "SP SURYA",
    tagline: "Empaneled Vendor - PM Surya Ghar Muft Bijli Yojana",
    address: "Nilgiri Womens' College road, Bypass Road, Nilagiri, Odisha 756040",
    phone: "+91 98532 89304",
    email: "spsurya025@gmail.com",
    gstin: "21HBYPS5035P1ZO",
    vendorStatus: "PM SURYAGHAR YOJANA REGISTERED VENDOR",
  },
  bank: {
    bankName: "Punjab National Bank (PNB)",
    branch: "Nilagiri / Balasore Branch",
    accountNumber: "0849002100028491",
    ifscCode: "PUNB0084900",
    accountName: "SP SURYA",
    upiId: "9853289304@pnb",
  },
  pricingDefaults: {
    residential1Kw: 75000,
    residential2Kw: 145000,
    residential3Kw: 200000,
    commercialPerKw: 48000,
    validityDays: 15,
    demandNoteSinglePhase: 3747,
    demandNoteThreePhase: 4334,
    tokenBookingAmount: 10000,
    advancePercent: 75,
    finalPercent: 25,
  },
  brandTerms: {
    WAAREE: {
      inverterWarranty: "8 Years Manufacturer Warranty",
      moduleProductWarranty: "12 Years Product Warranty",
      modulePowerWarranty: "30 Years Linear Power Output Warranty (N-Type Bifacial TOPCon)",
      amcDuration: "5 Years Free Annual Maintenance Contract",
      amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
    },
    "TATA Solar": {
      inverterWarranty: "5 to 8 Years Manufacturer Warranty",
      moduleProductWarranty: "10 to 12 Years Product Warranty",
      modulePowerWarranty: "25 to 30 Years Linear Power Output Warranty",
      amcDuration: "5 Years Free Annual Maintenance Contract",
      amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
    },
    "Adani Solar": {
      inverterWarranty: "8 Years Manufacturer Warranty",
      moduleProductWarranty: "12 Years Product Warranty",
      modulePowerWarranty: "30 Years Linear Power Output Warranty (Bifacial TOPCon)",
      amcDuration: "5 Years Free Annual Maintenance Contract",
      amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
    },
    Eastman: {
      inverterWarranty: "5 Years Standard Warranty",
      moduleProductWarranty: "10 Years Product Warranty",
      modulePowerWarranty: "25 Years Linear Performance Warranty",
      amcDuration: "5 Years Free Annual Maintenance Contract",
      amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
    },
    "UTL Solar": {
      inverterWarranty: "5 Years Manufacturer Warranty",
      moduleProductWarranty: "10 Years Product Warranty",
      modulePowerWarranty: "25 Years Linear Performance Warranty",
      amcDuration: "5 Years Free Annual Maintenance Contract",
      amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
    },
    "Vikram Solar": {
      inverterWarranty: "8 Years Manufacturer Warranty",
      moduleProductWarranty: "12 Years Product Warranty",
      modulePowerWarranty: "30 Years Linear Power Output Warranty",
      amcDuration: "5 Years Free Annual Maintenance Contract",
      amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
    },
    "Goldi Solar": {
      inverterWarranty: "8 Years Manufacturer Warranty",
      moduleProductWarranty: "12 Years Product Warranty",
      modulePowerWarranty: "30 Years Linear Power Output Warranty",
      amcDuration: "5 Years Free Annual Maintenance Contract",
      amcScopeText: "Covers regular performance checks, generation verification, and preventive maintenance.",
    },
  },
};

export async function GET() {
  try {
    const dbSetting = await prisma.setting.findUnique({
      where: { key: "app_settings" },
    });

    if (!dbSetting) {
      return NextResponse.json(defaultAppSettings);
    }

    const parsed = JSON.parse(dbSetting.value);
    return NextResponse.json({ ...defaultAppSettings, ...parsed });
  } catch (error) {
    return NextResponse.json(defaultAppSettings);
  }
}

export async function POST(req: NextRequest) {
  try {
    const updatedSettings = await req.json();

    const saved = await prisma.setting.upsert({
      where: { key: "app_settings" },
      create: {
        key: "app_settings",
        value: JSON.stringify(updatedSettings),
      },
      update: {
        value: JSON.stringify(updatedSettings),
      },
    });

    return NextResponse.json({ success: true, settings: JSON.parse(saved.value) });
  } catch (error: any) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
