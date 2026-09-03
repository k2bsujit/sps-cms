import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { QuotationData } from "@/types";

interface Props {
  data: QuotationData;
}

export const Page4PaymentTerms: React.FC<Props> = ({ data }) => {
  const { bankDetails, brand, assets, terms } = data;

  const tokenAmount = terms?.bookingTokenAmount ?? 10000;
  const dispatchPercent = terms?.dispatchAdvancePercent ?? 75;
  const balancePercent = terms?.installationBalancePercent ?? 25;

  return (
    <Page size="A4" style={styles.page}>
      <PdfHeader brand={brand} assets={assets} />

      <Text style={styles.sectionHeading}>3. Bank Details:</Text>
      
      <View style={{ marginBottom: 10 }}>
        <View style={styles.bankRow}>
          <Text style={{ width: "12%", fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>Bank:</Text>
          <Text style={{ width: "28%" }}>{bankDetails.bankName}</Text>
          <Text style={{ width: "14%", fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>A/C NO:</Text>
          <Text style={{ width: "24%", fontFamily: "Helvetica-Bold" }}>{bankDetails.accountNumber}</Text>
          <Text style={{ width: "12%", fontFamily: "Helvetica-Bold", color: "#0f2e5c" }}>IFSC:</Text>
          <Text style={{ width: "10%", fontFamily: "Helvetica-Bold" }}>{bankDetails.ifscCode}</Text>
        </View>
      </View>

      <Text style={{ ...styles.sectionHeading, fontSize: 9.5 }}>
        Payment Terms & Milestone Process Overview:
      </Text>
      <Text style={{ fontSize: 8.2, color: "#334155", marginBottom: 8 }}>
        To ensure a smooth and transparent execution of your solar project, please find below the detailed payment terms and milestone-based process flow:
      </Text>

      {/* Milestone 1 */}
      <View style={{ marginBottom: 8, padding: 7, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 }}>
        <Text style={{ fontSize: 8.8, fontFamily: "Helvetica-Bold", color: "#0f2e5c", marginBottom: 3 }}>
          1. Vendor Confirmation & Agreement Signing (Token Booking):
        </Text>
        <View style={{ paddingLeft: 6 }}>
          <Text style={styles.bulletDesc}>
            - Once you choose SP Surya as your solar partner, a token booking payment of Rs. {tokenAmount.toLocaleString("en-IN")} is required to confirm our appointment as your official empaneled vendor.
          </Text>
          <Text style={styles.bulletDesc}>
            - This payment is made on the day of agreement signing at our Nilagiri/Balasore office.
          </Text>
          <Text style={styles.bulletDesc}>- During your visit, you will:</Text>
          <View style={{ paddingLeft: 12, marginTop: 2 }}>
            <Text style={{ fontSize: 7.8, color: "#475569" }}>o Review and sign the Customer Agreement</Text>
            <Text style={{ fontSize: 7.8, color: "#475569" }}>
              o Submit all 4 necessary documents (Aadhaar Card, PAN Card, Electricity Bill, Bank Passbook)
            </Text>
            <Text style={{ fontSize: 7.8, color: "#475569" }}>
              o Receive an official money receipt for the Rs. {tokenAmount.toLocaleString("en-IN")} token paid
            </Text>
          </View>
        </View>
      </View>

      {/* Milestone 2 */}
      <View style={{ marginBottom: 8, padding: 7, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 }}>
        <Text style={{ fontSize: 8.8, fontFamily: "Helvetica-Bold", color: "#0f2e5c", marginBottom: 3 }}>
          2. Installation Planning & Advance Payment (Material Dispatch):
        </Text>
        <View style={{ paddingLeft: 6 }}>
          <Text style={styles.bulletDesc}>
            - After paperwork is completed and the agreement is signed, our technical team will coordinate with you to finalize an installation schedule.
          </Text>
          <Text style={styles.bulletDesc}>
            - Before dispatch of materials and deployment of technicians, you are required to make an advance payment of {dispatchPercent}% of the total project cost (adjusting the Rs. {tokenAmount.toLocaleString("en-IN")} token already paid).
          </Text>
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#166534", marginTop: 2 }}>
            Note: Material dispatch and technician deployment will be initiated immediately upon receipt of this advance payment.
          </Text>
        </View>
      </View>

      {/* Milestone 3 */}
      <View style={{ marginBottom: 8, padding: 7, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 }}>
        <Text style={{ fontSize: 8.8, fontFamily: "Helvetica-Bold", color: "#0f2e5c", marginBottom: 3 }}>
          3. Final Payment on Installation Day:
        </Text>
        <View style={{ paddingLeft: 6 }}>
          <Text style={styles.bulletDesc}>- On the day of installation, our team will:</Text>
          <View style={{ paddingLeft: 12, marginVertical: 2 }}>
            <Text style={{ fontSize: 7.8, color: "#475569" }}>o Complete the rooftop solar plant installation at your premises</Text>
            <Text style={{ fontSize: 7.8, color: "#475569" }}>o Provide a walkthrough and complete briefing of the installed system</Text>
          </View>
          <Text style={styles.bulletDesc}>
            - Once installation is completed and verified, the remaining {balancePercent}% balance payment must be made to our installation team or directly to our official company bank account.
          </Text>
        </View>
      </View>

      {/* Banking & Security Note */}
      <View style={{ marginTop: 4, padding: 6, borderWidth: 1, borderColor: "#cbd5e1", backgroundColor: "#f8fafc", borderRadius: 4, alignItems: "center" }}>
        <Text style={{ fontSize: 7.8, color: "#475569", textAlign: "center" }}>
          All payments should be made via Cheque, RTGS/NEFT, or UPI to official "SP SURYA" accounts only. Official receipts are issued for all transactions.
        </Text>
      </View>

      <Text style={styles.pageNumberBox}>Page 4</Text>
    </Page>
  );
};
