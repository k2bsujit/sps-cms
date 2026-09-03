import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { QuotationData } from "@/types";

interface Props {
  data: QuotationData;
}

const scopeRows = [
  { sl: 1, item: "Power & Water Supply at Site during Erection", vendor: false, client: true },
  { sl: 2, item: "Safety Equipment & PPE Kits for Technicians", vendor: true, client: false },
  { sl: 3, item: "Engineering Design & Shadow Free Layout Analysis", vendor: true, client: false },
  { sl: 4, item: "Module Lifting to Rooftop / Site Handling", vendor: true, client: false },
  { sl: 5, item: "Module Mounting on HDGI / APPOLO Structure", vendor: true, client: false },
  { sl: 6, item: "Inverter & Distribution Device Wall Mounting", vendor: true, client: false },
  { sl: 7, item: "DC Cabling, MC4 Connectors & Conduit Laying", vendor: true, client: false },
  { sl: 8, item: "Inverter to LT Panel AC Cabling & Termination", vendor: true, client: false },
  { sl: 9, item: "LT Panel to Main Client Busbar Wiring", vendor: false, client: true },
  { sl: 10, item: "Plant Charging, Chemical Earthing & Testing", vendor: true, client: false },
  { sl: 11, item: "Routine Module Cleaning (Post-Commissioning)", vendor: false, client: true },
  { sl: 12, item: "Material Storage Security Post-Delivery", vendor: false, client: true },
  { sl: 13, item: "Plant Insurance (Post-Handover, Optional)", vendor: false, client: true },
  { sl: 14, item: "Rooftop Civil Works / Foundation (if required)", vendor: true, client: false },
  { sl: 15, item: "Liaisoning, Inspection & Net Metering (TPNODL)", vendor: true, client: false },
];

export const Page6ScopeMatrix: React.FC<Props> = ({ data }) => {
  const { brand, assets } = data;

  return (
    <Page size="A4" style={styles.page}>
      <PdfHeader brand={brand} assets={assets} />

      {/* 4. Scope of Work & Responsibility Matrix */}
      <Text style={styles.sectionHeading}>4. Scope of Work & Responsibility Matrix:</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={{ width: "8%", textAlign: "center" }}>Sl.</Text>
          <Text style={{ width: "62%" }}>Item / Activity Description</Text>
          <Text style={{ width: "15%", textAlign: "center" }}>Vendor Scope</Text>
          <Text style={{ width: "15%", textAlign: "center" }}>Client Scope</Text>
        </View>

        {scopeRows.map((row, idx) => (
          <View
            key={row.sl}
            style={[styles.matrixRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
          >
            <Text style={{ width: "8%", textAlign: "center" }}>{row.sl}</Text>
            <Text style={{ width: "62%" }}>{row.item}</Text>
            <Text style={[{ width: "15%" }, row.vendor ? styles.badgeYes : styles.badgeNo]}>
              {row.vendor ? "YES" : "—"}
            </Text>
            <Text style={[{ width: "15%" }, row.client ? styles.badgeYes : styles.badgeNo]}>
              {row.client ? "YES" : "—"}
            </Text>
          </View>
        ))}
      </View>

      {/* Quality Standards & Workmanship Assurance Box */}
      <View style={{ marginTop: 6, padding: 8, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 4 }}>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#0f2e5c", marginBottom: 2 }}>
          Quality & Workmanship Commitment:
        </Text>
        <Text style={{ fontSize: 7.8, color: "#334155", lineHeight: 1.35 }}>
          All civil, mechanical, and electrical installations are executed by certified solar engineers adhering strictly to CEA (Central Electricity Authority) guidelines and MNRE rooftop standards.
        </Text>
      </View>

      {/* Bottom Closing Box */}
      <View style={{ marginTop: 8, padding: 12, borderWidth: 1.5, borderColor: "#fed7aa", backgroundColor: "#fffaf5", borderRadius: 6, alignItems: "center" }}>
        <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: "#0f2e5c", textAlign: "center" }}>
          Thank you once again for choosing SP Surya!
        </Text>
        <Text style={{ fontSize: 8.2, color: "#78350f", textAlign: "center", marginTop: 3 }}>
          Empaneled Vendor - PM Surya Ghar Muft Bijli Yojana - Nilagiri, Balasore, Bhadrak & Mayurbhanj, Odisha
        </Text>
        <Text style={{ fontSize: 7.5, color: "#64748b", textAlign: "center", marginTop: 3 }}>
          For inquiries and support, contact: spsurya025@gmail.com | +91 98532 89304
        </Text>
      </View>

      <Text style={styles.pageNumberBox}>Page 6</Text>
    </Page>
  );
};
