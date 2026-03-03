import CursorDot from "@/components/CursorDot";
import "./globals.css";

export const metadata = {
  title: "FinSocial Digital Systems — Technology Meets Finance",
  description:
    "FinSocial Digital Systems: AI-powered fintech innovation — from intelligent automation to digital payments, blockchain, and beyond.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CursorDot />
      </body>
    </html>
  );
}