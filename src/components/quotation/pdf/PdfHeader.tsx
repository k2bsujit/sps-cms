import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { SolarBrand, PdfAssets } from "@/types";

interface Props {
  brand?: SolarBrand;
  assets?: PdfAssets;
}

export const PdfHeader: React.FC<Props> = ({ brand = "WAAREE", assets }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        {/* Left Circular Logo (sp-surya-logo.jpeg - Larger & Prominent) */}
        <View style={styles.logoContainer}>
          {assets?.logoDataUri ? (
            <Image
              src={assets.logoDataUri}
              style={styles.logoImage}
            />
          ) : (
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>SP SURYA</Text>
              <Text style={{ fontSize: 4.8, color: "#e07a14", textAlign: "center", marginTop: 1 }}>* * *</Text>
              <Text style={{ fontSize: 5, color: "#475569", textAlign: "center", marginTop: 1 }}>
                SOLAR SOLUTIONS
              </Text>
            </View>
          )}
        </View>

        {/* Center Company Details */}
        <View style={styles.headerCenter}>
          <Text style={styles.companyName}>SP SURYA</Text>
          <Text style={styles.companyTagline}>Deals with Solar products and Installation Services</Text>
          <Text style={styles.companyAddress}>
            Regd. Office: Nilgiri Womens' College road, Bypass Road, Nilagiri, Odisha 756040
          </Text>
          <Text style={styles.companyContact}>
            Email ID: spsurya025@gmail.com | Ph: +91 98532 89304 | GSTIN: 21HBYPS5035P1ZO
          </Text>
          <Text style={styles.pmSuryagharBadge}>" PM SURYAGHAR YOJANA REGISTERED VENDOR "</Text>
        </View>

        {/* Right Chosen PV Module Brand Badge */}
        <View style={styles.brandBadgeBox}>
          <View style={styles.brandBadgeInner}>
            <Text
              style={{
                fontSize: 5.5,
                fontFamily: "Helvetica-Bold",
                color: "#64748b",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}
            >
              PV MODULE BRAND
            </Text>
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
                color: "#0f2e5c",
                marginTop: 2,
                textAlign: "center",
              }}
            >
              {brand ? brand.toUpperCase() : "WAAREE"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
