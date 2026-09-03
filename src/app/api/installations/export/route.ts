import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exportInstallationsToExcel, generateSampleExcelTemplate } from "@/lib/excel-helper";
import { InstallationRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isSample = searchParams.get("sample") === "true";

    if (isSample) {
      const buffer = generateSampleExcelTemplate();
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="SP_Surya_Installations_Template.xlsx"',
        },
      });
    }

    let records: InstallationRecord[] = [];
    try {
      const dbRecords = await prisma.installation.findMany({
        orderBy: { createdAt: "desc" },
      });
      records = dbRecords.map((r) => ({
        id: r.id,
        customerName: r.customerName,
        contactNumber: r.contactNumber,
        email: r.email || undefined,
        consumerNumber: r.consumerNumber || undefined,
        location: r.location,
        district: r.district,
        category: r.category as any,
        projectSizeKw: r.projectSizeKw,
        brand: r.brand,
        phase: r.phase,
        projectCost: r.projectCost,
        gnMeterInclusion: r.gnMeterInclusion,
        paymentType: r.paymentType,
        demandNoteCharges: r.demandNoteCharges,
        bankQuotation: r.bankQuotation,
        invoiceCost: r.invoiceCost,
        subsidyStatus: r.subsidyStatus,
        installationDate: r.installationDate?.toISOString() || null,
        meterConnectionDate: r.meterConnectionDate?.toISOString() || null,
        nextMaintenanceDate: r.nextMaintenanceDate?.toISOString() || null,
        remarks: r.remarks,
        createdAt: r.createdAt?.toISOString(),
        updatedAt: r.updatedAt?.toISOString(),
      }));
    } catch (err) {
      // Fallback
    }

    const buffer = exportInstallationsToExcel(records);
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="SP_Surya_Installations_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export Excel file" }, { status: 500 });
  }
}
