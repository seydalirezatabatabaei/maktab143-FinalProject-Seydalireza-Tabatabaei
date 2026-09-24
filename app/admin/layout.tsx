import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";
import { NavigationSection } from "../types/types";

// -----------------------------
//   this data just for admin page
// -----------------------------

const navigationData: NavigationSection[] = [
  {
    title: "کالاها",
    href: "/admin",
  },
  {
    title: "موجودی و قیمت ها",
    href: "/admin/priceandstock",
  },
  {
    title: "سفارشات",
    href: "/admin/Orders",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-gray-200 font-sans"
      lang="fa"
      dir="rtl"
    >
      <Navbar navigationData={navigationData} />
      {children}
    </div>
  );
}