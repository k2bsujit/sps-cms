import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import QuotationDocument from "@/components/quotation/pdf/QuotationDocument";
import { QuotationData } from "@/types";
import { getPdfAssets } from "@/lib/pdf-images";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quotationData: QuotationData = body.quotationData;

    if (!quotationData) {
      return NextResponse.json({ error: "Quotation data is required" }, { status: 400 });
    }

    // Attach base64 data URIs for images in public/images
    const assets = getPdfAssets();
    quotationData.assets = assets;

    // Render the React-PDF document to buffer
    const element = React.createElement(QuotationDocument, { data: quotationData });
    const buffer = await renderToBuffer(element as any);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SP_Surya_Quotation_${quotationData.quotationNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF generation server error:", error);
    return NextResponse.json(
      { error: "Failed to render PDF quotation", details: error.message },
      { status: 500 }
    );
  }
}
