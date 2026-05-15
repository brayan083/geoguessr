import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/ThemeProvider";

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
    <html lang="es" className="dark">
      <body className="bg-slate-900 text-white antialiased dark:bg-slate-900 dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
