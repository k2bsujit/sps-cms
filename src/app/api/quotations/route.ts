import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

let memoryQuotations: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contactNumber = searchParams.get("contactNumber");
    const leadId = searchParams.get("leadId");

    const where: any = {};
    if (contactNumber) where.contactNumber = contactNumber;
    if (leadId) where.leadId = leadId;

    try {
      const dbQuotations = await prisma.quotation.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      if (dbQuotations && dbQuotations.length > 0) {
        return NextResponse.json(dbQuotations);
      }
    } catch (dbErr) {
      console.warn("Prisma GET quotations fallback to memory:", dbErr);
    }

    let filtered = memoryQuotations;
    if (contactNumber) {
      filtered = filtered.filter((q) => q.contactNumber === contactNumber);
    }
    if (leadId) {
      filtered = filtered.filter((q) => q.leadId === leadId);
    }
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (Array.isArray(body.quotations)) {
      const createdQuotes = [];
      for (const quotationData of body.quotations) {
        const quoteObj = {
          quotationNumber: quotationData.quotationNumber,
          category: quotationData.category || "RESIDENTIAL",
          brand: quotationData.brand || "WAAREE",
          customerName: quotationData.customer.name,
          contactNumber: quotationData.customer.mobile,
          email: quotationData.customer.email || null,
          consumerNumber: quotationData.customer.consumerNumber || null,
          location: quotationData.customer.village,
          district: quotationData.customer.district || "Balasore",
          pin: quotationData.customer.pin || "756019",
          capacityKw: quotationData.financials.capacityKw,
          phase: quotationData.customer.phase === "THREE_PHASE" ? "THREE_PHASE" : "SINGLE_PHASE",
          moduleCount: quotationData.financials.moduleCount,
          moduleWattage: quotationData.financials.moduleWattage,
          baseCost: quotationData.financials.baseCost || quotationData.financials.grandTotal,
          gstPercent: 0,
          gstAmount: 0,
          grandTotal: quotationData.financials.grandTotal,
          centralSubsidy: quotationData.financials.centralSubsidy || 0,
          stateSubsidy: quotationData.financials.stateSubsidy || 0,
          netPayable: quotationData.financials.netCustomerPayable || quotationData.financials.grandTotal,
          boqData: JSON.stringify(quotationData.boqList || []),
          bankDetails: JSON.stringify(quotationData.bankDetails || {}),
          termsData: JSON.stringify(quotationData.terms || {}),
          demandNoteAmount: quotationData.demandNoteAmount || 3747,
          validityDays: quotationData.validityDays || 15,
          status: "DRAFT",
        };

        try {
          const dbQuote = await prisma.quotation.create({ data: quoteObj });
          createdQuotes.push(dbQuote);
          memoryQuotations = [dbQuote, ...memoryQuotations];
        } catch (dbErr) {
          const memQuote = { id: `quote-${Date.now()}-${Math.random()}`, ...quoteObj, createdAt: new Date().toISOString() };
          createdQuotes.push(memQuote);
          memoryQuotations = [memQuote, ...memoryQuotations];
        }
      }
      return NextResponse.json({ success: true, count: createdQuotes.length, quotations: createdQuotes });
    }

    const { quotationData } = body;
    const singleQuoteObj = {
      quotationNumber: quotationData.quotationNumber,
      category: quotationData.category || "RESIDENTIAL",
      brand: quotationData.brand || "WAAREE",
      customerName: quotationData.customer.name,
      contactNumber: quotationData.customer.mobile,
      email: quotationData.customer.email || null,
      consumerNumber: quotationData.customer.consumerNumber || null,
      location: quotationData.customer.village,
      district: quotationData.customer.district || "Balasore",
      pin: quotationData.customer.pin || "756019",
      capacityKw: quotationData.financials.capacityKw,
      phase: quotationData.customer.phase === "THREE_PHASE" ? "THREE_PHASE" : "SINGLE_PHASE",
      moduleCount: quotationData.financials.moduleCount,
      moduleWattage: quotationData.financials.moduleWattage,
      baseCost: quotationData.financials.baseCost || quotationData.financials.grandTotal,
      gstPercent: 0,
      gstAmount: 0,
      grandTotal: quotationData.financials.grandTotal,
      centralSubsidy: quotationData.financials.centralSubsidy || 0,
      stateSubsidy: quotationData.financials.stateSubsidy || 0,
      netPayable: quotationData.financials.netCustomerPayable || quotationData.financials.grandTotal,
      boqData: JSON.stringify(quotationData.boqList || []),
      bankDetails: JSON.stringify(quotationData.bankDetails || {}),
      termsData: JSON.stringify(quotationData.terms || {}),
      demandNoteAmount: quotationData.demandNoteAmount || 3747,
      validityDays: quotationData.validityDays || 15,
      status: "DRAFT",
    };

    try {
      const quotation = await prisma.quotation.create({ data: singleQuoteObj });
      memoryQuotations = [quotation, ...memoryQuotations];
      return NextResponse.json({ success: true, quotation });
    } catch (dbErr) {
      const memQuote = { id: `quote-${Date.now()}`, ...singleQuoteObj, createdAt: new Date().toISOString() };
      memoryQuotations = [memQuote, ...memoryQuotations];
      return NextResponse.json({ success: true, quotation: memQuote });
    }
  } catch (error: any) {
    console.error("POST /api/quotations error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
      await prisma.quotation.delete({ where: { id } });
    } catch (dbErr) {}

    memoryQuotations = memoryQuotations.filter((q) => q.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
