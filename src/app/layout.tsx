import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "P. Manassé YAMEOGO — Portfolio",
  description: "Informaticien en formation en Licence de Développement Web à l'ISCOM, passionné par le développement logiciel et la conception de solutions numériques.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${geist.className} bg-[#0f0f0f] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
