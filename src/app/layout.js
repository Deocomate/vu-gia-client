import {
  Montserrat,
  Inter,
  Arima,
  Archivo,
  Be_Vietnam_Pro,
  Aref_Ruqaa,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import JsonLd from "@/shared/components/seo/json-ld";
import { buildOrganizationSchema } from "@/shared/lib/seo/schemas";
import { SITE_URL } from "@/shared/lib/seo/site-config";
import ViewportScaler from "@/shared/components/viewport-scale/viewport-scaler";
import { getViewportScaleInlineScript } from "@/shared/lib/viewport-scale/viewport-scale-inline-script";

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
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        suppressHydrationWarning
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
        <script
          dangerouslySetInnerHTML={{ __html: getViewportScaleInlineScript() }}
        />
        <ViewportScaler />
        <JsonLd data={buildOrganizationSchema()} />
        {children}
      </body>
    </html>
  );
}
