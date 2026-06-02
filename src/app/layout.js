import {
  Montserrat,
  Inter,
  Arima,
  Archivo,
  Be_Vietnam_Pro,
  Aref_Ruqaa,
} from "next/font/google";
import localFont from "next/font/local";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import "./globals.css";

// --- GOOGLE FONTS ---
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const arima = Arima({
  variable: "--font-arima",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  weight: ["400", "700"],
  subsets: ["latin", "arabic"],
  display: "swap",
});

// --- LOCAL FONTS ---
const amplify = localFont({
  src: "../../public/fonts/uvf_amplify/UVF-Amplify.otf",
  variable: "--font-amplify",
  display: "swap",
});

const circular = localFont({
  src: "../../public/fonts/circularStd_book/CircularStd-Book.woff2",
  variable: "--font-circular",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Gốm Sứ Vũ Gia",
    template: "%s | Gốm Sứ Vũ Gia",
  },
  description:
    "Gốm Sứ Vũ Gia - gốm sứ Bát Tràng chính hãng cho gia đình, doanh nghiệp và không gian thờ cúng.",
  metadataBase: new URL("https://gomvugia.vn"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        className={`
          ${montserrat.variable} 
          ${inter.variable} 
          ${arima.variable} 
          ${archivo.variable} 
          ${beVietnam.variable} 
          ${arefRuqaa.variable} 
          ${amplify.variable} 
          ${circular.variable}
          font-montserrat antialiased text-text-main
        `}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
