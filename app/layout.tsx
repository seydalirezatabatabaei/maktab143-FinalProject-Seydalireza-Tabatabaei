import "./globals.css";
import { Vazirmatn } from "next/font/google";
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className} p-x-6>
        <p className="w-full bg-amber-200 h-12">RootLayout</p>
        {children}
      </body>
    </html>
  );
}