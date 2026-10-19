import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata = {
  title: "FOIF — Fortress of Industrial Fasteners | Precision B2B Commerce Platform",
  description: "Enterprise industrial fastener procurement platform. ISO 9001:2015 certified material traceability, EN 10204 3.1 MTR verified bolts, screws, anchors, abrasives, and custom CNC manufacturing.",
  keywords: "industrial fasteners, structural bolts, DIN 933, ISO 4017, self-drilling screws, anchor fasteners, specialty alloys, OEM manufacturing, Chennai, Tirunelveli",
};

export const viewport = {
  themeColor: "#0F1E36",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth overflow-x-clip">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The icon font is a Google variable font, loaded globally from the root layout. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface antialiased overflow-x-clip selection:bg-[#D6B46A]/25 selection:text-[#0F1E36]">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
