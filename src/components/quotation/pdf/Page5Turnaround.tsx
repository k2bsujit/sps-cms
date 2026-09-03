import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { QuotationData } from "@/types";

interface Props {
  data: QuotationData;
}

export const Page5Turnaround: React.FC<Props> = ({ data }) => {
  const { demandNoteAmount, validityDays, brand, assets, terms } = data;

  const inverterWarranty = terms?.inverterWarranty || "8 Years Manufacturer Warranty";
  const moduleProductWarranty = terms?.moduleProductWarranty || "12 Years Product Warranty";
  const modulePowerWarranty = terms?.modulePowerWarranty || "30 Years Linear Power Output Warranty";
  const amcDuration = terms?.amcDuration || "5 Years Free Annual Maintenance Contract";
  const amcScopeText = terms?.amcScopeText || "Covers regular system health checks, generation verification, and preventive maintenance.";
  const inspectionText = terms?.inspectionTurnaroundText || "15 to 20 days for DISCOM (TPNODL) to schedule and conduct the technical site inspection.";
  const energizingText = terms?.meterEnergizingText || "7 to 10 days post-inspection for net meter energizing visit.";

  return (
    <Page size="A4" style={styles.page}>
      <PdfHeader brand={brand} assets={assets} />

      {/* Post-Installation Heading */}
      <Text style={styles.sectionHeading}>
        4. Post-Installation Process & Subsidy Initiation:
      </Text>

      <View style={{ marginBottom: 8, padding: 8, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 }}>
        <Text style={styles.bulletDesc}>
          - {inspectionText}
        </Text>
        <Text style={styles.bulletDesc}>
          - {energizingText}
        </Text>
        <Text style={styles.bulletDesc}>
          - The bi-directional generation/net meter is energized and tested during this visit.
        </Text>
        <Text style={styles.bulletDesc}>
          - Within 2 days after energizing, the commissioned project reflects on the PM Surya Ghar National Portal.
        </Text>
        <Text style={styles.bulletDesc}>
          - Once visible, our team submits the DBT subsidy claim on your behalf directly to your registered bank account.
        </Text>
      </View>

      {/* Demand Note Fees */}
      <View style={{ marginVertical: 6, padding: 8, backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a", borderRadius: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#92400e" }}>
          5. Demand Note Payments (Vendor-Scope)
        </Text>
        <View style={{ paddingLeft: 6, marginTop: 3 }}>
          <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#78350f" }}>
            Meter Demand Note Fee: Rs. {demandNoteAmount.toLocaleString("en-IN")}
          </Text>
          <Text style={{ fontSize: 8, color: "#92400e", marginTop: 2, lineHeight: 1.3 }}>
            Charged by TPNODL for installation of the Generation / Net Bi-directional meter enabling export measurement. SP Surya assists and coordinates the liaisoning process with DISCOM.
          </Text>
        </View>
      </View>

      <View style={styles.quoteBox}>
        <Text>
          "These milestones are designed to keep you informed and in control throughout your solar journey. We are committed to timely execution, clear communication, and complete support at each stage."
        </Text>
      </View>

      <Text style={styles.sectionHeading}>Key Terms & Warranties ({brand.toUpperCase()}):</Text>

      <View style={{ marginBottom: 6, padding: 6, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 }}>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>
          1. Quotation Validity
        </Text>
        <View style={{ paddingLeft: 6, marginTop: 2 }}>
          <Text style={styles.bulletDesc}>
            - The quoted price is end-to-end, inclusive of supply, installation, testing, and commissioning.
          </Text>
          <Text style={styles.bulletDesc}>
            - This quotation is valid for {validityDays} days from the date of issue.
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 6 }}>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#0f2e5c", marginBottom: 3 }}>
          2. Warranty Coverage Details
        </Text>
        <View style={{ ...styles.tableContainer, width: "90%" }}>
          <View style={styles.tableHeader}>
            <Text style={{ width: "35%" }}>Component</Text>
            <Text style={{ width: "65%" }}>Warranty Terms</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={{ width: "35%", fontFamily: "Helvetica-Bold" }}>Solar Inverter ({brand})</Text>
            <Text style={{ width: "65%" }}>{inverterWarranty}</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={{ width: "35%", fontFamily: "Helvetica-Bold" }}>Solar PV Modules ({brand})</Text>
            <Text style={{ width: "65%" }}>{moduleProductWarranty} & {modulePowerWarranty}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 6, padding: 6, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 }}>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>
          3. Annual Maintenance Contract (AMC):
        </Text>
        <View style={{ paddingLeft: 6, marginTop: 2 }}>
          <Text style={styles.bulletDesc}>
            - {amcDuration} is included for the installed solar system.
          </Text>
          <Text style={styles.bulletDesc}>
            - {amcScopeText}
          </Text>
        </View>
      </View>

      <Text style={styles.pageNumberBox}>Page 5</Text>
    </Page>
  );
};
