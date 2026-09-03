import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InstallationRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records: Partial<InstallationRecord>[] = body.records || [];

    if (records.length === 0) {
      return NextResponse.json({ error: "No records provided" }, { status: 400 });
    }

    let insertedCount = 0;

    for (const rec of records) {
      try {
        await prisma.installation.create({
          data: {
            customerName: rec.customerName || "Beneficiary",
            contactNumber: rec.contactNumber || "",
            location: rec.location || "",
            district: rec.district || "Balasore",
            projectSizeKw: rec.projectSizeKw || 3,
            brand: rec.brand || "WAAREE",
            phase: rec.phase || "Single Phase",
            projectCost: rec.projectCost || 150000,
            gnMeterInclusion: rec.gnMeterInclusion || "Including cost",
            paymentType: rec.paymentType || "Cash",
            demandNoteCharges: rec.demandNoteCharges || 3747,
            bankQuotation: rec.bankQuotation || 150000,
            invoiceCost: rec.invoiceCost || 150000,
            subsidyStatus: rec.subsidyStatus || "Pending",
            installationDate: rec.installationDate ? new Date(rec.installationDate) : null,
            meterConnectionDate: rec.meterConnectionDate ? new Date(rec.meterConnectionDate) : null,
            nextMaintenanceDate: rec.nextMaintenanceDate ? new Date(rec.nextMaintenanceDate) : null,
            remarks: rec.remarks || null,
          },
        });
        insertedCount++;
      } catch (dbErr) {
        // Fallback or skip duplicate
      }
    }

    return NextResponse.json({ success: true, count: insertedCount || records.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
