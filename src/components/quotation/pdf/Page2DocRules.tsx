import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { QuotationData } from "@/types";

interface Props {
  data: QuotationData;
}

export const Page2DocRules: React.FC<Props> = ({ data }) => {
  const { financials, brand, assets } = data;

  return (
    <Page size="A4" style={styles.page}>
      <PdfHeader brand={brand} assets={assets} />

      {/* Financial Payback & Subsidies */}
      <View style={{ marginBottom: 10, padding: 8, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 4 }}>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletTitle}>- Payback Period:</Text>
          <Text style={styles.bulletDesc}>
            Recover your entire initial investment in approximately 3 to 5 years through direct monthly electricity bill savings and solar unit exports.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <Text style={styles.bulletTitle}>- Government Subsidy (Direct Benefit Transfer - DBT):</Text>
          {financials.category === "RESIDENTIAL" ? (
            <View style={{ paddingLeft: 8, marginTop: 3 }}>
              <Text style={styles.bulletDesc}>
                o <Text style={{ fontFamily: "Helvetica-Bold" }}>Central Government Subsidy (MNRE):</Text> Direct DBT subsidy of Rs. {financials.centralSubsidy.toLocaleString("en-IN")} credited directly to your bank account for {financials.capacityKw} kW systems.
              </Text>
              <Text style={styles.bulletDesc}>
                o <Text style={{ fontFamily: "Helvetica-Bold" }}>State Government Subsidy (Odisha):</Text> Additional state financial assistance of up to Rs. {financials.stateSubsidy.toLocaleString("en-IN")} credited post commissioning.
              </Text>
            </View>
          ) : (
            <View style={{ paddingLeft: 8, marginTop: 3 }}>
              <Text style={styles.bulletDesc}>
                o <Text style={{ fontFamily: "Helvetica-Bold" }}>Commercial Tax Benefits:</Text> Accelerated Depreciation (AD) benefits up to 40% under Section 32 of Income Tax Act + 100% GST Input Tax Credit (ITC).
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Guidelines Heading */}
      <Text style={styles.sectionHeading}>
        Important Documentation Guidelines for Rooftop Solar (PM Surya Ghar):
      </Text>

      <Text style={{ fontSize: 8.2, color: "#334155", marginBottom: 6 }}>
        To complete your rooftop solar registration and claim the DBT government subsidy, the following 4 documents are mandatory:
      </Text>

      {/* 4 Document Cards */}
      <View style={{ marginBottom: 10, padding: 8, backgroundColor: "#eff6ff", borderWidth: 1, borderColor: "#bfdbfe", borderRadius: 4 }}>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#1e3a8a", marginBottom: 3 }}>
          1. Aadhaar Card (Applicant's Primary Identity & Address Proof)
        </Text>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#1e3a8a", marginBottom: 3 }}>
          2. PAN Card (Applicant's Income Tax / Identity Card)
        </Text>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#1e3a8a", marginBottom: 3 }}>
          3. Electricity Bill (Latest Consumer Bill issued by DISCOM / TPNODL)
        </Text>
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#1e3a8a" }}>
          4. Bank Passbook / Cancelled Cheque (For Direct DBT Subsidy Disbursement)
        </Text>
      </View>

      <Text style={{ fontSize: 8.8, fontFamily: "Helvetica-Bold", color: "#b45309", marginBottom: 4 }}>
        Important Compliance Rules (Please Note Carefully):
      </Text>

      {/* 4 Numbered Compliance Rules */}
      <View style={styles.guidelineNumBox}>
        <Text style={styles.numBadge}>1</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.numBadgeText}>Name Consistency Across All Documents:</Text>
          <Text style={{ fontSize: 8, color: "#334155", marginTop: 2, lineHeight: 1.35 }}>
            All 4 documents must bear the exact same name as the applicant. Even minor spelling variations (e.g., "Kumar" vs "Kumaar") will delay or block subsidy approval on the PM Surya Ghar National Portal.
          </Text>
        </View>
      </View>

      <View style={styles.guidelineNumBox}>
        <Text style={styles.numBadge}>2</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.numBadgeText}>Physical Presence Required for Agreement Signing:</Text>
          <Text style={{ fontSize: 8, color: "#334155", marginTop: 2, lineHeight: 1.35 }}>
            The applicant must be physically present at our office to sign two official vendor and DISCOM agreements during booking.
          </Text>
        </View>
      </View>

      <View style={styles.guidelineNumBox}>
        <Text style={styles.numBadge}>3</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.numBadgeText}>Verify Document Details Before Submission:</Text>
          <Text style={{ fontSize: 8, color: "#334155", marginTop: 2, lineHeight: 1.35 }}>
            Please check that the consumer name on the Electricity Bill matches the Aadhaar Card and Bank Account character-by-character.
          </Text>
        </View>
      </View>

      <View style={styles.guidelineNumBox}>
        <Text style={styles.numBadge}>4</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.numBadgeText}>Get Errors Corrected Before Registration:</Text>
          <Text style={{ fontSize: 8, color: "#334155", marginTop: 2, lineHeight: 1.35 }}>
            If there is any spelling mismatch or address discrepancy, please get it rectified with your local bank or DISCOM office before initiating the solar portal registration.
          </Text>
        </View>
      </View>

      {/* Assistance Helpline Box */}
      <View style={{ marginTop: 8, padding: 8, borderWidth: 1, borderColor: "#cbd5e1", backgroundColor: "#f8fafc", borderRadius: 4, alignItems: "center" }}>
        <Text style={{ fontSize: 8, color: "#475569", textAlign: "center" }}>
          Need assistance with documentation? Our SP Surya documentation team is available at: +91 98532 89304
        </Text>
      </View>

      <Text style={styles.pageNumberBox}>Page 2</Text>
    </Page>
  );
};
