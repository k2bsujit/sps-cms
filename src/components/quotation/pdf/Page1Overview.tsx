import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { QuotationData } from "@/types";

interface Props {
  data: QuotationData;
}

export const Page1Overview: React.FC<Props> = ({ data }) => {
  const { customer, financials, date, brand, assets } = data;
  const phaseLabel = customer.phase === "SINGLE_PHASE" ? "Single Phase" : "Three Phase";

  return (
    <Page size="A4" style={styles.page}>
      <PdfHeader brand={brand} assets={assets} />

      {/* Main Proposal Title */}
      <View style={styles.docTitleBox}>
        <Text style={styles.docTitleMain}>
          {data.proposalTitle || `Quotation for Installation & Commissioning Of ${financials.capacityKw} KW Solar On-Grid Power Plant`}
        </Text>
        {!data.proposalTitle?.toLowerCase().includes("phase") && (
          <Text style={styles.docTitlePhase}>[{phaseLabel}]</Text>
        )}
      </View>

      {/* Meta & Customer Details */}
      <View style={styles.metaBox}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
          <Text style={styles.metaText}>
            <Text style={styles.metaBold}>Customer Name: </Text>
            {customer.name.toUpperCase()}
          </Text>
          <Text style={styles.metaText}>
            <Text style={styles.metaBold}>Date: </Text>
            {date}
          </Text>
        </View>

        <Text style={styles.metaText}>
          <Text style={styles.metaBold}>Address: </Text>
          {customer.village}, {customer.district}, PIN: {customer.pin}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 1 }}>
          <Text style={styles.metaText}>
            <Text style={styles.metaBold}>Consumer No: </Text>
            {customer.consumerNumber || "N/A"}
          </Text>
          <Text style={styles.metaText}>
            <Text style={styles.metaBold}>Contact: </Text>
            {customer.mobile}
          </Text>
        </View>
      </View>

      {/* Full Width Banner Image */}
      {assets?.rooftopImageDataUri ? (
        <View style={{ width: "100%", marginVertical: 4 }}>
          <Image
            src={assets.rooftopImageDataUri}
            style={styles.bannerImageFull}
          />
        </View>
      ) : (
        <View style={styles.imagePlaceholderLarge}>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>
            Clean Energy - Solar Rooftop PV System
          </Text>
          <Text style={{ fontSize: 8, color: "#64748b", marginTop: 4, textAlign: "center" }}>
            Empaneled Vendor under PM Surya Ghar Muft Bijli Yojana (Odisha)
          </Text>
        </View>
      )}

      {/* Green Banner */}
      <Text style={styles.greenBanner}>GO GREEN WITH AFFORDABLE ROOFTOP SOLAR SYSTEMS</Text>

      {/* Highlights for Domestic Consumers */}
      <View style={{ marginTop: 6, padding: 8, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 }}>
        <Text style={styles.sectionHeading}>Rooftop Solar System Highlights for Domestic Consumers:</Text>

        <View style={styles.bulletItem}>
          <Text style={styles.bulletTitle}>- Who Can Apply?</Text>
          <Text style={styles.bulletDesc}>
            Residential / homeowners with a valid domestic electricity connection in Odisha.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <Text style={styles.bulletTitle}>- Eligible Capacity:</Text>
          <Text style={styles.bulletDesc}>
            You can install solar panels up to the sanctioned load mentioned in your DISCOM (TPNODL) electricity bill.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <Text style={styles.bulletTitle}>- Monthly Savings:</Text>
          <Text style={styles.bulletDesc}>
            Generate up to {financials.estimatedUnitsPerMonth} units per {financials.capacityKw} KW every month - significantly cutting down your monthly electricity bills.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <Text style={styles.bulletTitle}>- Grid Connectivity:</Text>
          <Text style={styles.bulletDesc}>
            Seamless integration with your existing power supply through Net Metering, allowing you to export surplus solar energy back to the DISCOM grid.
          </Text>
        </View>
      </View>

      <Text style={styles.pageNumberBox}>Page 1</Text>
    </Page>
  );
};
