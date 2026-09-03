"use client";

import React, { useState, useRef } from "react";
import { InstallationRecord } from "@/types";
import { parseInstallationsFromExcel } from "@/lib/excel-helper";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (records: Partial<InstallationRecord>[]) => Promise<void>;
}

export const ExcelBulkUploadModal: React.FC<Props> = ({ isOpen, onClose, onImportComplete }) => {
  const [parsedRows, setParsedRows] = useState<Partial<InstallationRecord>[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    try {
      const buffer = await file.arrayBuffer();
      const rows = parseInstallationsFromExcel(buffer);
      setParsedRows(rows.filter((r) => r.customerName && r.customerName.trim() !== ""));
    } catch (err) {
      console.error("Error parsing Excel:", err);
      alert("Failed to parse Excel file. Please ensure it follows the standard columns.");
    }
  };

  const handleDownloadSample = () => {
    window.open("/api/installations/export?sample=true", "_blank");
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);
    try {
      await onImportComplete(parsedRows);
      setParsedRows([]);
      setFileName(null);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving imported rows to database.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Bulk Import Installations via Excel (.xlsx)
          </DialogTitle>
          <DialogDescription>
            Upload customer spreadsheet to bulk insert solar projects. Maintenance dates (+90 days) will be auto-calculated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Upload Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-amber-50/30 transition-all flex flex-col items-center justify-center space-y-2"
          >
            <UploadCloud className="w-10 h-10 text-slate-400" />
            <div className="text-sm font-semibold text-slate-700">
              {fileName ? fileName : "Click to browse or drop your .xlsx installation sheet"}
            </div>
            <p className="text-xs text-slate-500">
              Supports standard column headers: Customer Name, Contact Number, Location, Project Size (kW), Brand, Project Cost, GN Meter Inclusion, Payment Type, Subsidy Status, Meter Connection Date, Remarks.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadSample}
              className="text-slate-600 border-slate-300 hover:bg-slate-100"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Download Sample .xlsx Template
            </Button>

            {parsedRows.length > 0 && (
              <Badge variant="success" className="px-3 py-1">
                ✓ {parsedRows.length} Valid Records Ready for Import
              </Badge>
            )}
          </div>

          {/* Preview Table */}
          {parsedRows.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100">
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs">Contact</TableHead>
                    <TableHead className="text-xs">Location</TableHead>
                    <TableHead className="text-xs">Size (kW)</TableHead>
                    <TableHead className="text-xs">Brand</TableHead>
                    <TableHead className="text-xs">Subsidy Status</TableHead>
                    <TableHead className="text-xs">Meter Date</TableHead>
                    <TableHead className="text-xs">Next AMC (+90d)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.map((row, i) => (
                    <TableRow key={i} className="text-xs">
                      <TableCell className="font-semibold">{row.customerName}</TableCell>
                      <TableCell>{row.contactNumber}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.projectSizeKw} kW</TableCell>
                      <TableCell>{row.brand}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.subsidyStatus === "Both Subsidy Came"
                              ? "success"
                              : row.subsidyStatus === "Central Came"
                              ? "info"
                              : "warning"
                          }
                          className="text-[10px]"
                        >
                          {row.subsidyStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(row.meterConnectionDate)}</TableCell>
                      <TableCell className="text-emerald-700 font-semibold">
                        {formatDate(row.nextMaintenanceDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmImport}
            disabled={parsedRows.length === 0 || isProcessing}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            {isProcessing ? "Importing to Database..." : `Import ${parsedRows.length} Installations`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
