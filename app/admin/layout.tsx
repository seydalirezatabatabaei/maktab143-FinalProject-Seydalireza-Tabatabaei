import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";
import type { NavigationSection } from "../types/types";

const navigationData: NavigationSection[] = [
  { title: "کالاها", href: "/admin" },
  { title: "موجودی و قیمت‌ها", href: "/admin/priceandstock" },
  { title: "سفارشات", href: "/admin/Orders" },
  { title: "دیدگاه‌ها", href: "/admin/comments" },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="fa" dir="rtl" className="min-h-screen bg-background">
      <Navbar navigationData={navigationData} />
      <div className="admin-content">{children}</div>
    </div>
  );
}
