import AdminShell from "@/components/admin/AdminShell";
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
  return <AdminShell navigationData={navigationData}>{children}</AdminShell>;
}
