import { Providers } from "@/app/admin/providers";
import type { NavigationSection } from "../types/types";
import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";

const navigationData: NavigationSection[] = [
  { title: "خرید اقساطی", href: "/application/#" },
  { title: "فروشگاه", href: "/application/products" },
  { title: "سبد خرید", href: "/application/cart" },
];

export default function ApplicationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="fa" dir="rtl" className="min-h-screen bg-background">
      <Navbar navigationData={navigationData} />
      <Providers>{children}</Providers>
    </div>
  );
}
