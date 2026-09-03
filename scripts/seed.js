const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding SQLite Database...");

  // 1. Users
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      {
        email: "admin@spsurya.com",
        name: "SP Surya Admin",
        password: "admin",
        role: "ADMIN",
        phone: "+91 98532 89304"
      },
      {
        email: "sales@spsurya.com",
        name: "Priyabrata Jena (Sales Manager)",
        password: "sales",
        role: "SALES_MANAGER",
        phone: "+91 94371 00223"
      },
      {
        email: "engineer@spsurya.com",
        name: "Biswajit Sahoo (Field Engineer)",
        password: "engineer",
        role: "FIELD_ENGINEER",
        phone: "+91 98612 34567"
      }
    ]
  });

  // 2. Leads
  await prisma.lead.deleteMany();
  await prisma.lead.createMany({
    data: [
      {
        customerName: "ADITYA KUMAR BARIK",
        contactNumber: "9437102938",
        email: "aditya.barik@gmail.com",
        consumerNumber: "TPNODL-BLS-88349",
        location: "Bartana, Somanathpur, Khantapada",
        district: "Balasore",
        pin: "756019",
        category: "RESIDENTIAL",
        capacityKw: 3.0,
        phase: "SINGLE_PHASE",
        brandPreference: "WAAREE",
        source: "PM Surya Ghar Portal",
        status: "QUOTATION_CREATED",
        notes: "Site surveyed. 3 kW system feasible on RCC south roof."
      },
      {
        customerName: "Ramesh Chandra Mahapatra",
        contactNumber: "9861234567",
        email: "ramesh.mahapatra@yahoo.com",
        consumerNumber: "TPNODL-BLS-99120",
        location: "Remuna Golei, Balasore",
        district: "Balasore",
        pin: "756019",
        category: "RESIDENTIAL",
        capacityKw: 3.0,
        phase: "SINGLE_PHASE",
        brandPreference: "TATA Solar",
        source: "Direct Walk-in",
        status: "SURVEY_SCHEDULED",
        notes: "Customer interested in Tata Solar panels with Net Metering."
      },
      {
        customerName: "Balasore Cold Storage & Logistics",
        contactNumber: "9778019283",
        email: "info@balasorecoldstorage.com",
        consumerNumber: "TPNODL-HT-44910",
        location: "Kuruda Industrial Area",
        district: "Balasore",
        pin: "756003",
        category: "COMMERCIAL",
        capacityKw: 25.0,
        phase: "THREE_PHASE",
        brandPreference: "Adani Solar",
        source: "Field Campaign",
        status: "CONTACTED",
        notes: "Commercial rooftop 25 kW. Accelerated depreciation analysis requested."
      },
      {
        customerName: "Dr. Debasis Mohanty",
        contactNumber: "9439912384",
        email: "dr.debasis@gmail.com",
        location: "Near Hospital Road, Soro",
        district: "Balasore",
        pin: "756045",
        category: "RESIDENTIAL",
        capacityKw: 5.0,
        phase: "SINGLE_PHASE",
        brandPreference: "Eastman",
        source: "Referral",
        status: "NEW",
        notes: "High electricity bill (Rs. 6000/mo). Wants 5 kW rooftop."
      },
      {
        customerName: "Nilagiri Eco Resort & Hotel",
        contactNumber: "9937012849",
        email: "stay@nilagiriresort.in",
        consumerNumber: "TPNODL-NLG-10294",
        location: "Bypass Road, Nilagiri",
        district: "Balasore",
        pin: "756040",
        category: "COMMERCIAL",
        capacityKw: 15.0,
        phase: "THREE_PHASE",
        brandPreference: "UTL Solar",
        source: "PM Surya Ghar Portal",
        status: "WON",
        notes: "15 kW Three Phase Commercial system approved."
      }
    ]
  });

  // 3. Installations
  await prisma.installation.deleteMany();
  await prisma.installation.createMany({
    data: [
      {
        customerName: "ADITYA KUMAR BARIK",
        contactNumber: "9437102938",
        email: "aditya.barik@gmail.com",
        consumerNumber: "TPNODL-BLS-88349",
        location: "Bartana, Somanathpur, Khantapada",
        district: "Balasore",
        category: "RESIDENTIAL",
        projectSizeKw: 3.0,
        brand: "WAAREE",
        phase: "Single Phase",
        projectCost: 200000,
        gnMeterInclusion: "Including cost",
        paymentType: "Loan SBI",
        demandNoteCharges: 3747,
        bankQuotation: 200000,
        invoiceCost: 200000,
        subsidyStatus: "Both Subsidy Came",
        installationDate: new Date("2026-05-10"),
        meterConnectionDate: new Date("2026-05-25"),
        nextMaintenanceDate: new Date("2026-08-23"),
        remarks: "580Wp Waaree TOPCon Bifacial. TPNODL net meter energized."
      },
      {
        customerName: "Nilagiri Eco Resort & Hotel",
        contactNumber: "9937012849",
        email: "stay@nilagiriresort.in",
        consumerNumber: "TPNODL-NLG-10294",
        location: "Bypass Road, Nilagiri",
        district: "Balasore",
        category: "COMMERCIAL",
        projectSizeKw: 15.0,
        brand: "UTL Solar",
        phase: "Three Phase",
        projectCost: 750000,
        gnMeterInclusion: "Including cost",
        paymentType: "Direct Transfer",
        demandNoteCharges: 4334,
        bankQuotation: 750000,
        invoiceCost: 750000,
        subsidyStatus: "Not Applicable",
        installationDate: new Date("2026-07-15"),
        meterConnectionDate: new Date("2026-08-01"),
        nextMaintenanceDate: new Date("2026-10-30"),
        remarks: "15 kW C&I solar plant online."
      }
    ]
  });

  console.log("Database successfully seeded!");
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
