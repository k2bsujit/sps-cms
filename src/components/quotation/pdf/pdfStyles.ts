import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingBottom: 28,
    paddingHorizontal: 28,
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
    lineHeight: 1.35,
  },
  // Top Header Banner
  headerContainer: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#0f2e5c",
    paddingBottom: 6,
    marginBottom: 8,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 76,
    height: 76,
    objectFit: "contain",
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "#e07a14",
    backgroundColor: "#fff7ed",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  logoBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#b45309",
    textAlign: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 6,
  },
  companyName: {
    fontSize: 21,
    fontFamily: "Helvetica-Bold",
    color: "#ea580c",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  companyTagline: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f2e5c",
    marginTop: 1.5,
    textAlign: "center",
  },
  companyAddress: {
    fontSize: 7.5,
    color: "#334155",
    textAlign: "center",
    marginTop: 2,
  },
  companyContact: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    textAlign: "center",
    marginTop: 1.5,
  },
  pmSuryagharBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0f2e5c",
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  brandBadgeBox: {
    width: 78,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  brandBadgeInner: {
    borderWidth: 1.5,
    borderColor: "#ea580c",
    backgroundColor: "#fffaf5",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: "center",
    width: "100%",
  },
  pageNumberBox: {
    position: "absolute",
    right: 28,
    bottom: 12,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
  },
  
  // Titles & Headings
  docTitleBox: {
    textAlign: "center",
    marginBottom: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  docTitleMain: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textAlign: "center",
  },
  docTitlePhase: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#ea580c",
    textAlign: "center",
    marginTop: 1.5,
  },
  
  metaBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 7,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  metaText: {
    fontSize: 8.2,
    color: "#1e293b",
    marginBottom: 2,
  },
  metaBold: {
    fontFamily: "Helvetica-Bold",
    color: "#0f2e5c",
  },

  // Full Width Banner Image
  imagePlaceholderLarge: {
    height: 180,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    padding: 10,
  },
  bannerImageFull: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 4,
    marginVertical: 6,
  },

  greenBanner: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    textAlign: "center",
    marginVertical: 6,
    letterSpacing: 0.3,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingVertical: 4.5,
    borderRadius: 4,
  },
  
  sectionHeading: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f2e5c",
    marginBottom: 5,
    marginTop: 6,
  },
  
  bulletItem: {
    marginBottom: 5,
    paddingLeft: 4,
  },
  bulletTitle: {
    fontSize: 8.8,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  bulletDesc: {
    fontSize: 8.2,
    color: "#334155",
    marginTop: 1,
    lineHeight: 1.35,
  },

  // Guideline Number Boxes
  guidelineNumBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
    marginBottom: 5,
    padding: 6,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3.5,
    borderLeftColor: "#0284c7",
    borderRadius: 3,
  },
  numBadge: {
    backgroundColor: "#0284c7",
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 2,
    marginRight: 6,
  },
  numBadgeText: {
    fontSize: 8.8,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },

  // Tables
  tableContainer: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f2e5c",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    paddingVertical: 4.5,
    paddingHorizontal: 5,
  },
  tableSectionHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 3.5,
    paddingHorizontal: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#0f2e5c",
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 3.5,
    paddingHorizontal: 5,
    fontSize: 7.8,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  
  // Bank Table
  bankRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    fontSize: 8,
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    backgroundColor: "#f8fafc",
  },

  // Quote Box
  quoteBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 7,
    marginVertical: 7,
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 8,
    color: "#334155",
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },

  // Scope Matrix
  matrixRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 3.2,
    paddingHorizontal: 5,
    fontSize: 7.8,
    alignItems: "center",
  },
  badgeYes: {
    color: "#16a34a",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textAlign: "center",
  },
  badgeNo: {
    color: "#94a3b8",
    fontFamily: "Helvetica",
    fontSize: 8,
    textAlign: "center",
  },

  // Decorative Callout Card
  bottomCard: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#fed7aa",
    backgroundColor: "#fffaf5",
    borderRadius: 4,
    alignItems: "center",
  },
});
