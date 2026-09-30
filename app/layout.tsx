
import "./globals.css";

import { Providers } from "@/app/admin/providers";
import localFont from "next/font/local";
import { NavigationSection } from "./types/types";
import { CartProvider } from "@/app/store/cart-context";
import SiteFooter from "@/components/site-footer";


const navigationData: NavigationSection[] = [
  
  {
    title: "خرید اقساطی ",
    href: "/application/#",
  },
  {
    title: "فروشگاه",
    href: "/application/products",
  },
  {
    title: " سبد خرید ",
    href: "#",
  },
];

const persianFont = localFont({
  src: [

    {
      path: "../public/fonts/BKOODB.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-persian",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" >
      <body className={persianFont.variable}>
      
        <CartProvider>
          <Providers>
            {children}
            <SiteFooter />
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
