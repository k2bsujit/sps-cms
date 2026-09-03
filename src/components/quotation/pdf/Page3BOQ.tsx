import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { QuotationData } from "@/types";

interface Props {
  data: QuotationData;
}

export const Page3BOQ: React.FC<Props> = ({ data }) => {
  const { boqList, financials, brand, assets } = data;

  const sectionA = boqList.filter((i) => i.section === "A");
  const sectionB = boqList.filter((i) => i.section === "B");
  const sectionC = boqList.filter((i) => i.section === "C");
  const sectionD = boqList.filter((i) => i.section === "D");

  return (
    <Page size="A4" style={styles.page}>
      <PdfHeader brand={brand} assets={assets} />

      {/* Verification Notice Banner */}
      <View style={{ marginBottom: 6, padding: 6, backgroundColor: "#eff6ff", borderWidth: 1, borderColor: "#bfdbfe", borderRadius: 4 }}>
        <Text style={{ fontSize: 8, color: "#1e40af", fontFamily: "Helvetica-Bold" }}>
          Notice: Please verify all customer documentation carefully. Consistent name and bank details ensure direct DBT subsidy crediting to your account without delays.
        </Text>
      </View>

      <Text style={styles.sectionHeading}>1. Bill of Quantities (BOQ) / Component Details</Text>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={{ width: "8%", textAlign: "center" }}>SL No.</Text>
          <Text style={{ width: "50%" }}>DESCRIPTION</Text>
          <Text style={{ width: "22%" }}>MAKE / BRAND</Text>
          <Text style={{ width: "10%", textAlign: "center" }}>UOM</Text>
          <Text style={{ width: "10%", textAlign: "center" }}>QTY</Text>
        </View>

        {/* Section A */}
        <View style={styles.tableSectionHeader}>
          <Text style={{ width: "8%", textAlign: "center" }}>A</Text>
          <Text style={{ width: "92%" }}>Photovoltaic Modules & Structure</Text>
        </View>
        {sectionA.map((item, idx) => (
          <View key={item.id || idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={{ width: "8%", textAlign: "center" }}>{item.slNo}.</Text>
            <Text style={{ width: "50%" }}>{item.description}</Text>
            <Text style={{ width: "22%", fontFamily: "Helvetica-Bold" }}>{item.make}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.uom}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.qty}</Text>
          </View>
        ))}

        {/* Section B */}
        <View style={styles.tableSectionHeader}>
          <Text style={{ width: "8%", textAlign: "center" }}>B</Text>
          <Text style={{ width: "92%" }}>Inverter(s)</Text>
        </View>
        {sectionB.map((item, idx) => (
          <View key={item.id || idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={{ width: "8%", textAlign: "center" }}>{item.slNo}.</Text>
            <Text style={{ width: "50%" }}>{item.description}</Text>
            <Text style={{ width: "22%", fontFamily: "Helvetica-Bold" }}>{item.make}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.uom}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.qty}</Text>
          </View>
        ))}

        {/* Section C */}
        <View style={styles.tableSectionHeader}>
          <Text style={{ width: "8%", textAlign: "center" }}>C</Text>
          <Text style={{ width: "92%" }}>Fittings & Other Accessories</Text>
        </View>
        {sectionC.map((item, idx) => (
          <View key={item.id || idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={{ width: "8%", textAlign: "center" }}>{item.slNo}.</Text>
            <Text style={{ width: "50%" }}>{item.description}</Text>
            <Text style={{ width: "22%" }}>{item.make}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.uom}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.qty}</Text>
          </View>
        ))}

        {/* Section D */}
        {sectionD.map((item, idx) => (
          <View key={item.id || idx} style={[styles.tableRow, { backgroundColor: "#f1f5f9", borderTopWidth: 1, borderTopColor: "#cbd5e1" }]}>
            <Text style={{ width: "8%", textAlign: "center", fontFamily: "Helvetica-Bold" }}>D</Text>
            <Text style={{ width: "50%", fontFamily: "Helvetica-Bold" }}>{item.description}</Text>
            <Text style={{ width: "22%" }}>{item.make}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.uom}</Text>
            <Text style={{ width: "10%", textAlign: "center" }}>{item.qty}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionHeading}>2. Supply, Installation & Commissioning Commercial Proposal</Text>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={{ width: "8%", textAlign: "center" }}>SL No.</Text>
          <Text style={{ width: "52%" }}>DESCRIPTION OF SERVICE</Text>
          <Text style={{ width: "10%", textAlign: "center" }}>QTY</Text>
          <Text style={{ width: "15%", textAlign: "right" }}>RATE [INR]</Text>
          <Text style={{ width: "15%", textAlign: "right" }}>AMOUNT [INR]</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={{ width: "8%", textAlign: "center" }}>1</Text>
          <Text style={{ width: "52%" }}>
            Supply, Installation, Testing & Commissioning of {financials.capacityKw} KW On-Grid Solar PV System
          </Text>
          <Text style={{ width: "10%", textAlign: "center" }}>1</Text>
          <Text style={{ width: "15%", textAlign: "right" }}>
            {financials.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={{ width: "15%", textAlign: "right" }}>
            {financials.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={[styles.tableRow, { backgroundColor: "#f1f5f9", borderTopWidth: 1.5, borderTopColor: "#0f2e5c" }]}>
          <Text style={{ width: "70%", textAlign: "right", fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>
            Total Contract Amount
          </Text>
          <Text style={{ width: "30%", textAlign: "right", fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>
            Rs. {financials.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 8.8, fontFamily: "Helvetica-Bold", color: "#0f172a", marginTop: 4 }}>
        Amount In Words: {financials.amountInWords}
      </Text>

      {/* Standards & Quality Assurance Box */}
      <View style={{ marginTop: 8, padding: 6, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 4 }}>
        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#0f2e5c", marginBottom: 2 }}>
          Technical Standards & Certifications:
        </Text>
        <Text style={{ fontSize: 7.6, color: "#475569" }}>
          * All PV Modules are ALMM (Approved List of Models and Manufacturers) & BIS / IEC 61215 / 61730 certified.
        </Text>
        <Text style={{ fontSize: 7.6, color: "#475569", marginTop: 1 }}>
          * Inverters feature IP65 weather protection, high efficiency MPPT tracking, and built-in anti-islanding protection.
        </Text>
      </View>

      <Text style={styles.pageNumberBox}>Page 3</Text>
    </Page>
  );
};
