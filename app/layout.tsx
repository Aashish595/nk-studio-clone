import CursorDot from "@/components/CursorDot";
import "./globals.css";

export const metadata = {
  title: "Scroll 3D (GSAP + R3F)",
  description: "Pinned scroll-driven 3D website starter",
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