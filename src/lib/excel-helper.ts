import * as XLSX from "xlsx";
import { InstallationRecord } from "@/types";

export function parseInstallationsFromExcel(buffer: ArrayBuffer): Partial<InstallationRecord>[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<any>(worksheet, { defval: "" });

  return rawRows.map((row) => {
    // Flexible header mapping
    const customerName = row["Customer Name"] || row["customerName"] || row["Name"] || "";
    const contactNumber = String(row["Contact Number"] || row["contactNumber"] || row["Mobile"] || "");
    const location = row["Location"] || row["location"] || row["Village"] || "";
    const district = row["District"] || row["district"] || "Balasore";
    const projectSizeKw = parseFloat(row["Project Size (kW)"] || row["projectSizeKw"] || row["Size"] || "3") || 3;
    const brand = row["Brand"] || row["brand"] || "WAAREE";
    const phase = row["Phase"] || row["phase"] || "Single Phase";
    const projectCost = parseFloat(row["Project Cost"] || row["projectCost"] || "150000") || 150000;
    const gnMeterInclusion = row["GN Meter Inclusion"] || row["gnMeterInclusion"] || "Including cost";
    const paymentType = row["Payment Type"] || row["paymentType"] || "Cash";
    const demandNoteCharges = parseFloat(row["Demand Note Charges"] || row["demandNoteCharges"] || "3747") || 3747;
    const bankQuotation = parseFloat(row["Bank Quotation"] || row["bankQuotation"] || "150000") || 150000;
    const invoiceCost = parseFloat(row["Invoice Cost"] || row["invoiceCost"] || "150000") || 150000;
    const subsidyStatus = row["Subsidy Status"] || row["subsidyStatus"] || "Pending";

    // Date parsing
    const installDateVal = row["Installation Date"] || row["installationDate"];
    const meterConnDateVal = row["Meter Connection Date"] || row["meterConnectionDate"];

    let installationDate: string | undefined;
    let meterConnectionDate: string | undefined;
    let nextMaintenanceDate: string | undefined;

    if (installDateVal) {
      const d = new Date(installDateVal);
      if (!isNaN(d.getTime())) installationDate = d.toISOString();
    }

    if (meterConnDateVal) {
      const d = new Date(meterConnDateVal);
      if (!isNaN(d.getTime())) {
        meterConnectionDate = d.toISOString();
        // Exactly 90 days after meter connection
        const nextDate = new Date(d);
        nextDate.setDate(nextDate.getDate() + 90);
        nextMaintenanceDate = nextDate.toISOString();
      }
    }

    const remarks = row["Remarks"] || row["remarks"] || "";

    return {
      customerName,
      contactNumber,
      location,
      district,
      projectSizeKw,
      brand,
      phase,
      projectCost,
      gnMeterInclusion,
      paymentType,
      demandNoteCharges,
      bankQuotation,
      invoiceCost,
      subsidyStatus,
      installationDate,
      meterConnectionDate,
      nextMaintenanceDate,
      remarks,
    };
  });
}

export function exportInstallationsToExcel(records: InstallationRecord[]): Uint8Array {
  const exportData = records.map((rec) => ({
    "Customer Name": rec.customerName,
    "Contact Number": rec.contactNumber,
    "Location": rec.location,
    "District": rec.district,
    "Project Size (kW)": rec.projectSizeKw,
    "Brand": rec.brand,
    "Phase": rec.phase,
    "Project Cost": rec.projectCost,
    "GN Meter Inclusion": rec.gnMeterInclusion,
    "Payment Type": rec.paymentType,
    "Demand Note Charges": rec.demandNoteCharges,
    "Bank Quotation": rec.bankQuotation,
    "Invoice Cost": rec.invoiceCost,
    "Subsidy Status": rec.subsidyStatus,
    "Installation Date": rec.installationDate ? rec.installationDate.split("T")[0] : "",
    "Meter Connection Date": rec.meterConnectionDate ? rec.meterConnectionDate.split("T")[0] : "",
    "Next Maintenance Date (Auto +90d)": rec.nextMaintenanceDate ? rec.nextMaintenanceDate.split("T")[0] : "",
    "Remarks": rec.remarks || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  worksheet["!cols"] = [
    { wch: 22 }, // Customer Name
    { wch: 15 }, // Contact Number
    { wch: 18 }, // Location
    { wch: 14 }, // District
    { wch: 16 }, // Project Size
    { wch: 14 }, // Brand
    { wch: 14 }, // Phase
    { wch: 14 }, // Project Cost
    { wch: 18 }, // GN Meter Inclusion
    { wch: 14 }, // Payment Type
    { wch: 18 }, // Demand Note Charges
    { wch: 16 }, // Bank Quotation
    { wch: 14 }, // Invoice Cost
    { wch: 18 }, // Subsidy Status
    { wch: 16 }, // Installation Date
    { wch: 18 }, // Meter Connection Date
    { wch: 22 }, // Next Maintenance Date
    { wch: 24 }, // Remarks
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Installations");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Uint8Array(wbout);
}

export function generateSampleExcelTemplate(): Uint8Array {
  const sampleData = [
    {
      "Customer Name": "Ramesh Chandra Patra",
      "Contact Number": "9437102938",
      "Location": "Remuna",
      "District": "Balasore",
      "Project Size (kW)": 3.0,
      "Brand": "WAAREE",
      "Phase": "Single Phase",
      "Project Cost": 150000,
      "GN Meter Inclusion": "Including cost",
      "Payment Type": "Loan SBI",
      "Demand Note Charges": 3747,
      "Bank Quotation": 150000,
      "Invoice Cost": 150000,
      "Subsidy Status": "Both Subsidy Came",
      "Installation Date": "2026-05-10",
      "Meter Connection Date": "2026-05-25",
      "Next Maintenance Date (Auto +90d)": "2026-08-23",
      "Remarks": "580Wp TOPCon Bifacial. TPNODL inspection cleared.",
    },
    {
      "Customer Name": "Pravakar Mohanty",
      "Contact Number": "9861234567",
      "Location": "Basta",
      "District": "Balasore",
      "Project Size (kW)": 3.0,
      "Brand": "TATA",
      "Phase": "Single Phase",
      "Project Cost": 150000,
      "GN Meter Inclusion": "Including cost",
      "Payment Type": "Cash",
      "Demand Note Charges": 3747,
      "Bank Quotation": 150000,
      "Invoice Cost": 150000,
      "Subsidy Status": "Pending",
      "Installation Date": "2026-08-01",
      "Meter Connection Date": "2026-08-15",
      "Next Maintenance Date (Auto +90d)": "2026-11-13",
      "Remarks": "State subsidy application submitted on portal.",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Uint8Array(wbout);
}
