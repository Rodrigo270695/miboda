import type { Metadata } from "next";
import { Fredoka, Nunito, Pacifico } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Nahia Dariela — Mi 1er añito",
  description:
    "Invitacion digital del primer añito de Nahia Dariela, con tematica de Oki Doki.",
  openGraph: {
    title: "Nahia Dariela — Mi 1er añito",
    description:
      "Celebra con nosotros el primer añito de Nahia Dariela Granja Bello.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${nunito.variable} ${fredoka.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
