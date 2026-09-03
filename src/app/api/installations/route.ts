import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InstallationRecord } from "@/types";

export const dynamic = "force-dynamic";

let inMemoryInstallations: InstallationRecord[] = [
  {
    id: "inst-1",
    customerName: "ADITYA KUMAR BARIK",
    contactNumber: "9437102938",
    email: "aditya.barik@gmail.com",
    consumerNumber: "TPNODL-BLS-88349",
    location: "Bartana, Somanathpur, Khantapada",
    district: "Balasore",
    category: "RESIDENTIAL",
    projectSizeKw: 3.0,
    brand: "WAAREE",
    phase: "Single Phase",
    projectCost: 200000,
    gnMeterInclusion: "Including cost",
    paymentType: "Loan SBI",
    demandNoteCharges: 3747,
    bankQuotation: 200000,
    invoiceCost: 200000,
    subsidyStatus: "Both Subsidy Came",
    installationDate: "2026-05-10T00:00:00.000Z",
    meterConnectionDate: "2026-05-25T00:00:00.000Z",
    nextMaintenanceDate: "2026-08-23T00:00:00.000Z",
    remarks: "580Wp Waaree TOPCon Bifacial. TPNODL net meter energized.",
  },
  {
    id: "inst-2",
    customerName: "Ramesh Chandra Mahapatra",
    contactNumber: "9861234567",
    location: "Remuna Golei",
    district: "Balasore",
    category: "RESIDENTIAL",
    projectSizeKw: 3.0,
    brand: "TATA Solar",
    phase: "Single Phase",
    projectCost: 200000,
    gnMeterInclusion: "Including cost",
    paymentType: "Cash",
    demandNoteCharges: 3747,
    bankQuotation: 200000,
    invoiceCost: 200000,
    subsidyStatus: "Pending",
    installationDate: "2026-08-01T00:00:00.000Z",
    meterConnectionDate: "2026-08-15T00:00:00.000Z",
    nextMaintenanceDate: "2026-11-13T00:00:00.000Z",
    remarks: "State subsidy claim submitted on national portal.",
  },
  {
    id: "inst-3",
    customerName: "Balasore Cold Storage Plant",
    contactNumber: "9778019283",
    email: "manager@balasorecoldstorage.com",
    consumerNumber: "TPNODL-HT-44910",
    location: "Kuruda Industrial Area",
    district: "Balasore",
    category: "COMMERCIAL",
    projectSizeKw: 25.0,
    brand: "Adani Solar",
    phase: "Three Phase",
    projectCost: 1100000,
    gnMeterInclusion: "Including cost",
    paymentType: "Loan PNB",
    demandNoteCharges: 4334,
    bankQuotation: 1100000,
    invoiceCost: 1100000,
    subsidyStatus: "Not Applicable",
    installationDate: "2026-06-12T00:00:00.000Z",
    meterConnectionDate: "2026-07-02T00:00:00.000Z",
    nextMaintenanceDate: "2026-09-30T00:00:00.000Z",
    remarks: "Commercial 25kW Three Phase system. Inverter Wi-Fi online.",
  },
];

export async function GET() {
  try {
    const list = await prisma.installation.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (list.length > 0) {
      return NextResponse.json(list);
    }
  } catch (err) {
    // Return in-memory list
  }
  return NextResponse.json(inMemoryInstallations);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    try {
      const record = await prisma.installation.create({
        data: {
          customerName: data.customerName,
          contactNumber: data.contactNumber,
          email: data.email || null,
          consumerNumber: data.consumerNumber || null,
          location: data.location,
          district: data.district || "Balasore",
          category: data.category || "RESIDENTIAL",
          projectSizeKw: parseFloat(data.projectSizeKw) || 3,
          brand: data.brand || "WAAREE",
          phase: data.phase || "Single Phase",
          projectCost: parseFloat(data.projectCost) || 200000,
          gnMeterInclusion: data.gnMeterInclusion || "Including cost",
          paymentType: data.paymentType || "Cash",
          demandNoteCharges: parseFloat(data.demandNoteCharges) || 3747,
          bankQuotation: parseFloat(data.bankQuotation) || 200000,
          invoiceCost: parseFloat(data.invoiceCost) || 200000,
          subsidyStatus: data.subsidyStatus || "Pending",
          installationDate: data.installationDate ? new Date(data.installationDate) : null,
          meterConnectionDate: data.meterConnectionDate ? new Date(data.meterConnectionDate) : null,
          nextMaintenanceDate: data.nextMaintenanceDate ? new Date(data.nextMaintenanceDate) : null,
          remarks: data.remarks || null,
        },
      });
      return NextResponse.json(record);
    } catch (dbErr) {
      const newRec: InstallationRecord = {
        id: `inst-${Date.now()}`,
        ...data,
      };
      inMemoryInstallations.unshift(newRec);
      return NextResponse.json(newRec);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
      const updated = await prisma.installation.update({
        where: { id },
        data: {
          ...data,
          installationDate: data.installationDate ? new Date(data.installationDate) : null,
          meterConnectionDate: data.meterConnectionDate ? new Date(data.meterConnectionDate) : null,
          nextMaintenanceDate: data.nextMaintenanceDate ? new Date(data.nextMaintenanceDate) : null,
        },
      });
      return NextResponse.json(updated);
    } catch (dbErr) {
      inMemoryInstallations = inMemoryInstallations.map((item) =>
        item.id === id ? { ...item, ...data } : item
      );
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
      await prisma.installation.delete({ where: { id } });
    } catch (dbErr) {
      inMemoryInstallations = inMemoryInstallations.filter((item) => item.id !== id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
