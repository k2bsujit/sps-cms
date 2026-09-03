import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contactNumber = searchParams.get("contactNumber");
    const leadId = searchParams.get("leadId");

    const where: any = {};
    if (contactNumber) where.contactNumber = contactNumber;
    if (leadId) where.leadId = leadId;

    const quotations = await prisma.quotation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if batch array of quotations is sent
    if (Array.isArray(body.quotations)) {
      const createdQuotes = [];
      for (const quotationData of body.quotations) {
        const quotation = await prisma.quotation.create({
          data: {
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
          },
        });
        createdQuotes.push(quotation);
      }
      return NextResponse.json({ success: true, count: createdQuotes.length, quotations: createdQuotes });
    }

    const { quotationData } = body;
    const quotation = await prisma.quotation.create({
      data: {
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
      },
    });

    return NextResponse.json({ success: true, quotation });
  } catch (error: any) {
    console.error("POST /api/quotations error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.quotation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
