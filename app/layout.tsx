import "./globals.css";

import { Providers } from "@/app/admin/providers";
import { CartProvider } from "@/app/store/cart-context";
import SiteFooter from "@/components/site-footer";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
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
