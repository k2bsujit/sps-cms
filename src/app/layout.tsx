import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CrmShell } from "@/components/layout/CrmShell";

export const metadata: Metadata = {
  title: "SP Surya - Solar CRM & Corporate Quotation Engine (Odisha)",
  description: "Enterprise Solar CRM, Lead Pipeline, Dynamic 6-Page Quotation Generator & Customer Management for PM Surya Ghar in Odisha.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100/90 text-slate-900 antialiased selection:bg-amber-500 selection:text-slate-950">
        <AuthProvider>
          <CrmShell>{children}</CrmShell>
        </AuthProvider>
      </body>
    </html>
  );
}
