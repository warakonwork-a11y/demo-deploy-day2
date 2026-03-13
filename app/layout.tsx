import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Office Equipment Borrowing System",
  description:
    "ระบบบริหารจัดการการยืม-คืนอุปกรณ์สำนักงานแบบครบวงจรสำหรับพนักงานและผู้ดูแลระบบ"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="th">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="lazyOnload" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
