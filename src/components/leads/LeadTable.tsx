"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Lead, LeadStatus, SolarBrand, SystemCategory } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Filter,
  FileText,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Zap,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { LeadModal } from "./LeadModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LeadTable: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const router = useRouter();

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        !searchTerm ||
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contactNumber.includes(searchTerm) ||
        lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.consumerNumber && lead.consumerNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = selectedStatus === "ALL" || lead.status === selectedStatus;
      const matchBrand = selectedBrand === "ALL" || lead.brandPreference === selectedBrand;
      const matchCategory = selectedCategory === "ALL" || lead.category === selectedCategory;

      return matchSearch && matchStatus && matchBrand && matchCategory;
    });
  }, [leads, searchTerm, selectedStatus, selectedBrand, selectedCategory]);

  const handleSaveLead = async (data: Partial<Lead>) => {
    const isEdit = !!editingLead;
    const url = isEdit ? `/api/leads?id=${editingLead.id}` : "/api/leads";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEditingLead(null);
      await fetchLeads();
    } else {
      throw new Error("Failed to save lead");
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete lead for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting lead.");
    }
  };

  const handleCreateQuotationForLead = (lead: Lead) => {
    // Navigate to /quotations with query params to prefill the exact quotation builder
    const params = new URLSearchParams({
      leadId: lead.id,
      name: lead.customerName,
      mobile: lead.contactNumber,
      email: lead.email || "",
      consumerNumber: lead.consumerNumber || "",
      village: lead.location,
      district: lead.district || "Balasore",
      pin: lead.pin || "756019",
      capacity: String(lead.capacityKw || 3),
      phase: lead.phase,
      brand: lead.brandPreference,
      category: lead.category,
    });
    router.push(`/quotations?${params.toString()}`);
  };

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case "WON":
        return "success";
      case "QUOTATION_CREATED":
        return "info";
      case "SURVEY_SCHEDULED":
        return "warning";
      case "CONTACTED":
        return "secondary";
      case "LOST":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by customer, mobile, email, consumer no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLeads}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
                title="Refresh leads"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setEditingLead(null);
                  setIsModalOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add New Lead
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              Filters:
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Categories</option>
              <option value="RESIDENTIAL">Residential (PM Surya Ghar)</option>
              <option value="COMMERCIAL">Commercial & Industrial</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Stages</option>
              <option value="NEW">New Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="SURVEY_SCHEDULED">Survey Scheduled</option>
              <option value="QUOTATION_CREATED">Quotation Created</option>
              <option value="WON">Closed Won</option>
              <option value="LOST">Lost</option>
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Brands</option>
              <option value="WAAREE">WAAREE</option>
              <option value="TATA Solar">TATA Solar</option>
              <option value="Eastman">Eastman</option>
              <option value="Adani Solar">Adani Solar</option>
              <option value="UTL Solar">UTL Solar</option>
              <option value="Vikram Solar">Vikram Solar</option>
              <option value="Goldi Solar">Goldi Solar</option>
            </select>

            {(searchTerm || selectedStatus !== "ALL" || selectedBrand !== "ALL" || selectedCategory !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("ALL");
                  setSelectedBrand("ALL");
                  setSelectedCategory("ALL");
                }}
                className="h-8 text-xs text-slate-500 hover:text-red-600 px-2"
              >
                Clear
              </Button>
            )}

            <div className="ml-auto text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredLeads.length}</span> of {leads.length} leads
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table Grid */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-900 text-white hover:bg-slate-900">
                <TableHead className="text-white text-xs font-bold py-3.5">Customer & Contacts</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Location & District</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Category & Size</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Brand & Phase</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Source & Follow-up</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5">Pipeline Status</TableHead>
                <TableHead className="text-white text-xs font-bold py-3.5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    Loading CRM leads...
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500 space-y-2">
                    <p className="text-sm font-semibold text-slate-700">No leads found</p>
                    <p className="text-xs text-slate-400">Click "Add New Lead" to register a customer inquiry.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead, idx) => (
                  <TableRow
                    key={lead.id}
                    className={`text-xs ${idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"} hover:bg-amber-50/40`}
                  >
                    {/* Customer & Contacts */}
                    <TableCell>
                      <div className="font-bold text-slate-900">{lead.customerName}</div>
                      <div className="text-[11px] text-slate-600 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> +91 {lead.contactNumber}
                      </div>
                      {lead.email && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5 text-slate-400" /> {lead.email}
                        </div>
                      )}
                      {lead.consumerNumber && (
                        <div className="text-[10px] font-mono text-amber-800 bg-amber-50/80 px-1 rounded inline-block mt-0.5">
                          CA: {lead.consumerNumber}
                        </div>
                      )}
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <div className="font-medium text-slate-800">{lead.location}</div>
                      <div className="text-[10px] text-slate-500">{lead.district} {lead.pin && `(${lead.pin})`}</div>
                    </TableCell>

                    {/* Category & Size */}
                    <TableCell>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        {lead.capacityKw} kW
                      </div>
                      <Badge
                        variant={lead.category === "RESIDENTIAL" ? "default" : "secondary"}
                        className="text-[9px] px-1.5 py-0 mt-0.5"
                      >
                        {lead.category === "RESIDENTIAL" ? "Residential" : "Commercial"}
                      </Badge>
                    </TableCell>

                    {/* Brand & Phase */}
                    <TableCell>
                      <div className="font-semibold text-slate-900 text-amber-700">{lead.brandPreference}</div>
                      <div className="text-[10px] text-slate-500">
                        {lead.phase === "SINGLE_PHASE" ? "1-Phase (230V)" : "3-Phase (415V)"}
                      </div>
                    </TableCell>

                    {/* Source & Follow-up */}
                    <TableCell>
                      <div className="text-slate-700 font-medium">{lead.source}</div>
                      {lead.followUpDate ? (
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold mt-0.5">
                          <Calendar className="w-2.5 h-2.5" /> Next: {lead.followUpDate}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">No date set</div>
                      )}
                    </TableCell>

                    {/* Pipeline Status */}
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(lead.status)} className="text-[10px] px-2 py-0.5">
                        {lead.status.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleCreateQuotationForLead(lead)}
                          className="h-7 text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5"
                          title="Generate quotation with pre-populated details"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Quote
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingLead(lead);
                            setIsModalOpen(true);
                          }}
                          className="h-7 w-7 text-slate-600 hover:text-amber-600"
                          title="Edit lead"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLead(lead.id, lead.customerName)}
                          className="h-7 w-7 text-slate-600 hover:text-red-600"
                          title="Delete lead"
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
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialData={editingLead}
      />
    </div>
  );
};
