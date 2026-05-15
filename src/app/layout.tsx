import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GeoGuessr Clone",
  description: "Adivina la ubicación a partir de Street View. Juega solo o con amigos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-white antialiased">{children}</body>
    </html>
  );
}
