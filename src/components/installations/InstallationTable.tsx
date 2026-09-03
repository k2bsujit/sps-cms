"use client";

import React, { useState, useEffect, useMemo } from "react";
import { InstallationRecord } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileSpreadsheet,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  Zap,
  RotateCcw,
  CheckCircle2,
  Clock,
  Wrench,
} from "lucide-react";
import { InstallationModal } from "./InstallationModal";
import { ExcelBulkUploadModal } from "./ExcelBulkUploadModal";

export const InstallationTable: React.FC = () => {
  const [records, setRecords] = useState<InstallationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubsidy, setSelectedSubsidy] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InstallationRecord | null>(null);

  // Fetch from API
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/installations");
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Failed to fetch installations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter options
  const locations = useMemo(() => {
    const set = new Set(records.map((r) => r.location).filter(Boolean));
    return Array.from(set);
  }, [records]);

  const brands = useMemo(() => {
    const set = new Set(records.map((r) => r.brand).filter(Boolean));
    return Array.from(set);
  }, [records]);

  // Filtered list
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        !searchTerm ||
        rec.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.contactNumber.includes(searchTerm) ||
        rec.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.remarks && rec.remarks.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSubsidy = selectedSubsidy === "ALL" || rec.subsidyStatus === selectedSubsidy;
      const matchesBrand = selectedBrand === "ALL" || rec.brand === selectedBrand;
      const matchesLoc = selectedLocation === "ALL" || rec.location === selectedLocation;

      return matchesSearch && matchesSubsidy && matchesBrand && matchesLoc;
    });
  }, [records, searchTerm, selectedSubsidy, selectedBrand, selectedLocation]);

  // Metric summaries
  const totalCapacity = useMemo(() => records.reduce((acc, r) => acc + (r.projectSizeKw || 0), 0), [records]);
  const subsidiesReceived = useMemo(
    () => records.filter((r) => r.subsidyStatus === "Both Subsidy Came").length,
    [records]
  );
  const subsidiesPending = useMemo(
    () => records.filter((r) => r.subsidyStatus === "Pending").length,
    [records]
  );

  // Handlers
  const handleSaveRecord = async (data: Partial<InstallationRecord>) => {
    const isEdit = !!editingRecord;
    const url = isEdit ? `/api/installations?id=${editingRecord.id}` : "/api/installations";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEditingRecord(null);
      await fetchRecords();
    } else {
      throw new Error("Failed to save");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete installation for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/installations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting record");
    }
  };

  const handleBulkImport = async (newRows: Partial<InstallationRecord>[]) => {
    const res = await fetch("/api/installations/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: newRows }),
    });

    if (res.ok) {
      await fetchRecords();
    } else {
      throw new Error("Import failed");
    }
  };

  const handleExportExcel = () => {
    window.open("/api/installations/export", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Completed Projects</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{records.length} Installations</h3>
              <p className="text-[11px] text-amber-700 font-medium">{totalCapacity.toFixed(1)} kW Total Capacity</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Zap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Subsidies Fully Received</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{subsidiesReceived} Beneficiaries</h3>
              <p className="text-[11px] text-emerald-600 font-medium">Central + Odisha State DBT</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Subsidy Verification Pending</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">{subsidiesPending} Applications</h3>
              <p className="text-[11px] text-orange-700 font-medium">TPNODL inspection/portal pipeline</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Quarterly AMC Pipeline</p>
              <h3 className="text-2xl font-bold text-blue-900 mt-1">90-Day Cycles</h3>
              <p className="text-[11px] text-blue-700 font-medium">Automated maintenance tracking</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Wrench className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Search, Filters, Add/Export/Upload Actions */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by customer, mobile, location, or remarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecords}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
                title="Refresh table"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportExcel}
                className="border-slate-300 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 font-medium"
              >
                <Download className="w-4 h-4 mr-1.5 text-emerald-600" />
                Export to Excel (.xlsx)
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsBulkUploadOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                <Upload className="w-4 h-4 mr-1.5 text-amber-400" />
                Bulk Import Excel
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setEditingRecord(null);
                  setIsAddModalOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Installation
              </Button>
            </div>
          </div>

          {/* Filter Dropdowns Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              Filters:
            </div>

            {/* Subsidy Status Filter */}
            <select
              value={selectedSubsidy}
              onChange={(e) => setSelectedSubsidy(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Subsidy Statuses</option>
              <option value="Both Subsidy Came">Both Subsidy Came</option>
              <option value="Central Came">Central Came</option>
              <option value="State Came">State Came</option>
              <option value="Pending">Pending</option>
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Brands (Waaree, Tata...)</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Locations (Balasore)</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {(searchTerm || selectedSubsidy !== "ALL" || selectedBrand !== "ALL" || selectedLocation !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubsidy("ALL");
                  setSelectedBrand("ALL");
                  setSelectedLocation("ALL");
                }}
                className="h-8 text-xs text-slate-500 hover:text-red-600 px-2"
              >
                Clear Filters
              </Button>
            )}

            <div className="ml-auto text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredRecords.length}</span> of {records.length} records
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Excel Data Grid Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-900 hover:bg-slate-900 text-white">
                <TableHead className="text-white text-xs font-bold py-3.5">Customer / Contact</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Location</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">System (kW) & Brand</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Cost & Payment Mode</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Demand Note / Inv</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Subsidy Status</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Meter Connected</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5 text-amber-300">
                  Next AMC (+90d)
                </TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                    Loading installation data grid...
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-slate-500 space-y-2">
                    <p className="text-sm font-semibold text-slate-700">No matching solar installations found</p>
                    <p className="text-xs text-slate-400">Add a new installation or upload your Excel spreadsheet.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    className={`text-xs ${idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"} hover:bg-amber-50/40`}
                  >
                    {/* Customer */}
                    <TableCell>
                      <div className="font-bold text-slate-900">{row.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">+91 {row.contactNumber}</div>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <div className="font-medium text-slate-800">{row.location}</div>
                      <div className="text-[10px] text-slate-500">{row.district}</div>
                    </TableCell>

                    {/* Size & Brand */}
                    <TableCell>
                      <div className="font-bold text-slate-900">{row.projectSizeKw} kW</div>
                      <div className="text-[11px] text-amber-700 font-semibold">{row.brand} ({row.phase})</div>
                    </TableCell>

                    {/* Cost & Payment */}
                    <TableCell>
                      <div className="font-bold text-slate-900">{formatINR(row.projectCost)}</div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {row.paymentType} • <span className="text-slate-400">{row.gnMeterInclusion}</span>
                      </div>
                    </TableCell>

                    {/* Demand Note & Invoice */}
                    <TableCell>
                      <div className="text-slate-800 font-medium">DN: {formatINR(row.demandNoteCharges)}</div>
                      <div className="text-[10px] text-slate-500">Inv: {formatINR(row.invoiceCost)}</div>
                    </TableCell>

                    {/* Subsidy Status Badge */}
                    <TableCell>
                      <Badge
                        variant={
                          row.subsidyStatus === "Both Subsidy Came"
                            ? "success"
                            : row.subsidyStatus === "Central Came"
                            ? "info"
                            : "warning"
                        }
                        className="text-[10px] px-2 py-0.5"
                      >
                        {row.subsidyStatus}
                      </Badge>
                    </TableCell>

                    {/* Meter Connection Date */}
                    <TableCell className="text-slate-700 font-medium">
                      {formatDate(row.meterConnectionDate)}
                    </TableCell>

                    {/* Next Maintenance Date (+90 days) */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-[11px]">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        {formatDate(row.nextMaintenanceDate)}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingRecord(row);
                            setIsAddModalOpen(true);
                          }}
                          className="h-7 w-7 text-slate-600 hover:text-amber-600"
                          title="Edit installation"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(row.id, row.customerName)}
                          className="h-7 w-7 text-slate-600 hover:text-red-600"
                          title="Delete installation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <InstallationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialData={editingRecord}
      />

      {/* Excel Bulk Upload Modal */}
      <ExcelBulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onImportComplete={handleBulkImport}
      />
    </div>
  );
};
