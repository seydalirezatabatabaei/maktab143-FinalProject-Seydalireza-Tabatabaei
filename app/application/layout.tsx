import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";
import { NavigationSection } from "../types/types";

const navigationData: NavigationSection[] = [
  {
    title: "درباره ما",
    href: "#",
  },
  {
    title: "خدمات",
    href: "#",
  },
  {
    title: "محصولات پر تخفیف",
    href: "#",
  },
  {
    title: "فروشگاه",
    href: "#",
  },
  {
    title: "خرید گروهی",
    href: "#",
  },
  {
    title: "جایزه‌های این ماه",
    href: "#",
  },
];

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar navigationData={navigationData} />

      <main className="w-full bg-amber-100 p-3">
        {children}
      </main>
    </div>
  );
}